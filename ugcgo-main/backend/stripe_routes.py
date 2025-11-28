from fastapi import APIRouter, HTTPException, Request, Header
from pydantic import BaseModel, Field
from typing import Optional, Dict
from emergentintegrations.payments.stripe.checkout import (
    StripeCheckout,
    CheckoutSessionResponse,
    CheckoutStatusResponse,
    CheckoutSessionRequest
)
from motor.motor_asyncio import AsyncIOMotorClient
import os
from datetime import datetime
import uuid

# Router setup
stripe_router = APIRouter(prefix="/api/payments", tags=["payments"])

# Database (will be set from main app)
db = None

def set_database(database):
    global db
    db = database

# Payment packages - NEVER ACCEPT AMOUNTS FROM FRONTEND
# These must match the Stripe products in frontend stripe-config.ts
PAYMENT_PACKAGES = {
    "price_1SI8r5IXoILZ7benDrZEtPLb": {
        "amount": 9.90, 
        "currency": "usd", 
        "credits": 20, 
        "name": "Başlangıç Paketi"
    },
    "price_1SI93eIXoILZ7benaTtahoH7": {
        "amount": 19.90, 
        "currency": "usd", 
        "credits": 45, 
        "name": "Profesyonel Paketi"
    },
    "price_1SI995IXoILZ7benbXtYoVJb": {
        "amount": 39.90, 
        "currency": "usd", 
        "credits": 100, 
        "name": "Kurumsal Paketi"
    },
}

# Request/Response Models
class CreateCheckoutRequest(BaseModel):
    price_id: str = Field(..., description="Stripe Price ID")
    origin_url: str = Field(..., description="Frontend origin URL")
    user_email: Optional[str] = Field(None, description="User email if authenticated")
    mode: str = Field(default="payment", description="Checkout mode: payment or subscription")
    metadata: Optional[Dict[str, str]] = Field(default_factory=dict, description="Additional metadata")

class CheckoutResponse(BaseModel):
    url: str = Field(..., description="Stripe checkout URL")
    session_id: str = Field(..., description="Checkout session ID")

class PaymentStatusResponse(BaseModel):
    payment_status: str
    status: str
    amount_total: float
    currency: str
    credits: Optional[int] = None
    package_name: Optional[str] = None

# Initialize Stripe Checkout
def get_stripe_checkout(request: Request):
    api_key = os.environ.get("STRIPE_API_KEY", "sk_test_emergent")
    host_url = str(request.base_url).rstrip("/")
    webhook_url = f"{host_url}/api/webhook/stripe"
    return StripeCheckout(api_key=api_key, webhook_url=webhook_url)

@stripe_router.post("/checkout/session", response_model=CheckoutResponse)
async def create_checkout_session(
    checkout_request: CreateCheckoutRequest,
    request: Request
):
    """
    Create a Stripe checkout session for a predefined package.
    Frontend must provide price_id and origin_url only.
    """
    try:
        # Validate price_id
        if checkout_request.price_id not in PAYMENT_PACKAGES:
            raise HTTPException(400, f"Invalid price_id. Available: {list(PAYMENT_PACKAGES.keys())}")
        
        package = PAYMENT_PACKAGES[checkout_request.price_id]
        
        # Build success and cancel URLs from frontend origin
        success_url = f"{checkout_request.origin_url}/success?session_id={{CHECKOUT_SESSION_ID}}"
        cancel_url = f"{checkout_request.origin_url}/pricing"
        
        # Prepare metadata
        metadata = {
            "price_id": checkout_request.price_id,
            "credits": str(package["credits"]),
            "package_name": package["name"],
            **checkout_request.metadata
        }
        
        if checkout_request.user_email:
            metadata["user_email"] = checkout_request.user_email
        
        # Initialize Stripe Checkout
        stripe_checkout = get_stripe_checkout(request)
        
        # Create checkout session request using Stripe Price ID
        session_request = CheckoutSessionRequest(
            stripe_price_id=checkout_request.price_id,
            quantity=1,
            success_url=success_url,
            cancel_url=cancel_url,
            metadata=metadata
        )
        
        # Create session with Stripe
        session: CheckoutSessionResponse = await stripe_checkout.create_checkout_session(session_request)
        
        # MANDATORY: Create transaction record in database BEFORE redirect
        transaction_id = str(uuid.uuid4())
        transaction_doc = {
            "transaction_id": transaction_id,
            "session_id": session.session_id,
            "price_id": checkout_request.price_id,
            "amount": package["amount"],
            "currency": package["currency"],
            "credits": package["credits"],
            "user_email": checkout_request.user_email,
            "payment_status": "pending",
            "status": "initiated",
            "metadata": metadata,
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat()
        }
        
        await db.payment_transactions.insert_one(transaction_doc)
        
        return CheckoutResponse(url=session.url, session_id=session.session_id)
    except HTTPException:
        raise
    except Exception as e:
        import traceback
        print(f"Checkout error: {str(e)}")
        print(traceback.format_exc())
        raise HTTPException(500, f"Checkout error: {str(e)}")

@stripe_router.get("/checkout/status/{session_id}", response_model=PaymentStatusResponse)
async def get_checkout_status(session_id: str, request: Request):
    """
    Get the status of a checkout session.
    Called by frontend after redirect from Stripe.
    """
    # Initialize Stripe Checkout
    stripe_checkout = get_stripe_checkout(request)
    
    # Get status from Stripe
    checkout_status: CheckoutStatusResponse = await stripe_checkout.get_checkout_status(session_id)
    
    # Find transaction in database
    transaction = await db.payment_transactions.find_one({"session_id": session_id})
    
    if not transaction:
        raise HTTPException(404, "Transaction not found")
    
    # Update transaction status if payment is completed and not already processed
    if checkout_status.payment_status == "paid" and transaction["payment_status"] != "paid":
        # Update transaction
        await db.payment_transactions.update_one(
            {"session_id": session_id, "payment_status": {"$ne": "paid"}},  # Prevent duplicate processing
            {
                "$set": {
                    "payment_status": "paid",
                    "status": "completed",
                    "stripe_amount": checkout_status.amount_total,
                    "updated_at": datetime.utcnow().isoformat()
                }
            }
        )
        
        # TODO: Add credits to user account here
        # if transaction.get("user_email"):
        #     await add_credits_to_user(transaction["user_email"], transaction["credits"])
    
    # Prepare response
    amount_in_dollars = checkout_status.amount_total / 100  # Convert cents to dollars
    
    return PaymentStatusResponse(
        payment_status=checkout_status.payment_status,
        status=checkout_status.status,
        amount_total=amount_in_dollars,
        currency=checkout_status.currency,
        credits=transaction.get("credits"),
        package_name=transaction.get("metadata", {}).get("package_name")
    )

@stripe_router.post("/webhook/stripe")
async def stripe_webhook(request: Request):
    """
    Handle Stripe webhooks for payment events.
    Stripe will call this endpoint when payment events occur.
    """
    # Get request body and signature
    body = await request.body()
    signature = request.headers.get("Stripe-Signature")
    
    if not signature:
        raise HTTPException(400, "Missing Stripe-Signature header")
    
    # Initialize Stripe Checkout
    stripe_checkout = get_stripe_checkout(request)
    
    try:
        # Handle webhook
        webhook_response = await stripe_checkout.handle_webhook(body, signature)
        
        # Process based on event type
        if webhook_response.event_type == "checkout.session.completed":
            session_id = webhook_response.session_id
            
            # Update transaction in database
            await db.payment_transactions.update_one(
                {"session_id": session_id, "payment_status": {"$ne": "paid"}},
                {
                    "$set": {
                        "payment_status": webhook_response.payment_status,
                        "status": "completed",
                        "webhook_event_id": webhook_response.event_id,
                        "updated_at": datetime.utcnow().isoformat()
                    }
                }
            )
            
            # TODO: Process post-payment actions (add credits, send email, etc.)
        
        return {"status": "success", "event_type": webhook_response.event_type}
    
    except Exception as e:
        raise HTTPException(400, f"Webhook error: {str(e)}")
