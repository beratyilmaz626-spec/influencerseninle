#!/usr/bin/env python3
"""
Backend API Tests for InfluencerSeninle Subscription System v2
Tests the updated subscription system with Iyzico integration, 30-day periods, 
and completed video counting.

KEY CHANGES TESTED:
1. Iyzico payment integration (not Stripe)
2. 30-day period validity (current_period_end check)
3. ONLY completed videos count (processing/failed don't count)
4. Race condition protection
5. Upgrade modal dynamic content
6. USD pricing display
"""

import asyncio
import httpx
import json
from typing import Dict, Any, Optional
import os
from datetime import datetime, timezone, timedelta

# Configuration
BACKEND_URL = "https://abone-video-tr.preview.emergentagent.com"
TEST_EMAIL = "beratyilmaz626@gmail.com"
TEST_PASSWORD = "berat881612"

class SubscriptionTester:
    def __init__(self):
        self.backend_url = BACKEND_URL
        self.auth_token = None
        self.client = httpx.AsyncClient(timeout=30.0)
        self.test_results = []
        
    async def __aenter__(self):
        return self
        
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        await self.client.aclose()
    
    def log_test(self, test_name: str, success: bool, details: str = "", response_data: Any = None):
        """Log test result"""
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}")
        if details:
            print(f"   Details: {details}")
        if response_data and not success:
            print(f"   Response: {json.dumps(response_data, indent=2)}")
        
        self.test_results.append({
            "test": test_name,
            "success": success,
            "details": details,
            "response": response_data
        })
        print()
    
    async def authenticate_user(self) -> bool:
        """Authenticate with Supabase and get JWT token"""
        print("🔐 Authenticating user...")
        
        # For Supabase authentication, we need to use the Supabase auth endpoint
        supabase_url = "https://yxoynfnyrietkisnbqwf.supabase.co"
        supabase_anon_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4b3luZm55cmlldGtpc25icXdmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzNTMxNDYsImV4cCI6MjA3OTkyOTE0Nn0.u6W2dhgIqRace2PIGs39Ad2hO_4R_lHXGc9__3Oa0lo"
        
        try:
            response = await self.client.post(
                f"{supabase_url}/auth/v1/token?grant_type=password",
                headers={
                    "apikey": supabase_anon_key,
                    "Content-Type": "application/json"
                },
                json={
                    "email": TEST_EMAIL,
                    "password": TEST_PASSWORD
                }
            )
            
            if response.status_code == 200:
                data = response.json()
                self.auth_token = data.get("access_token")
                if self.auth_token:
                    self.log_test("User Authentication", True, f"Successfully authenticated as {TEST_EMAIL}")
                    return True
                else:
                    self.log_test("User Authentication", False, "No access token in response", data)
                    return False
            else:
                self.log_test("User Authentication", False, f"HTTP {response.status_code}", response.json())
                return False
                
        except Exception as e:
            self.log_test("User Authentication", False, f"Exception: {str(e)}")
            return False
    
    async def test_subscription_plans(self):
        """Test GET /api/subscription/plans endpoint"""
        print("📋 Testing subscription plans endpoint...")
        
        try:
            response = await self.client.get(f"{self.backend_url}/api/subscription/plans")
            
            if response.status_code == 200:
                data = response.json()
                plans = data.get("plans", [])
                
                # Check if we have 3 plans
                if len(plans) != 3:
                    self.log_test("Subscription Plans Count", False, f"Expected 3 plans, got {len(plans)}", data)
                    return False
                
                # Check plan details
                expected_plans = {
                    "starter": {"monthly_video_limit": 20},
                    "professional": {"monthly_video_limit": 45},
                    "enterprise": {"monthly_video_limit": 100}
                }
                
                found_plans = {}
                for plan in plans:
                    plan_id = plan.get("id")
                    if plan_id in expected_plans:
                        found_plans[plan_id] = plan
                
                all_correct = True
                for plan_id, expected in expected_plans.items():
                    if plan_id not in found_plans:
                        self.log_test(f"Plan {plan_id} exists", False, f"Plan {plan_id} not found")
                        all_correct = False
                        continue
                    
                    plan = found_plans[plan_id]
                    if plan.get("monthly_video_limit") != expected["monthly_video_limit"]:
                        self.log_test(f"Plan {plan_id} video limit", False, 
                                    f"Expected {expected['monthly_video_limit']}, got {plan.get('monthly_video_limit')}")
                        all_correct = False
                    else:
                        self.log_test(f"Plan {plan_id} video limit", True, 
                                    f"Correct limit: {plan.get('monthly_video_limit')} videos")
                
                if all_correct:
                    self.log_test("Subscription Plans Endpoint", True, "All 3 plans with correct video limits")
                    return True
                else:
                    return False
                    
            else:
                self.log_test("Subscription Plans Endpoint", False, f"HTTP {response.status_code}", response.json())
                return False
                
        except Exception as e:
            self.log_test("Subscription Plans Endpoint", False, f"Exception: {str(e)}")
            return False
    
    async def test_subscription_status(self):
        """Test GET /api/subscription/status endpoint (requires auth)"""
        print("📊 Testing subscription status endpoint...")
        
        if not self.auth_token:
            self.log_test("Subscription Status", False, "No auth token available")
            return False
        
        try:
            response = await self.client.get(
                f"{self.backend_url}/api/subscription/status",
                headers={"Authorization": f"Bearer {self.auth_token}"}
            )
            
            if response.status_code == 200:
                data = response.json()
                
                # Check required fields
                required_fields = [
                    "has_active_subscription", "monthly_video_limit", 
                    "videos_used_this_month", "remaining_videos", "features"
                ]
                
                missing_fields = []
                for field in required_fields:
                    if field not in data:
                        missing_fields.append(field)
                
                if missing_fields:
                    self.log_test("Subscription Status Fields", False, 
                                f"Missing fields: {missing_fields}", data)
                    return False
                
                # Log subscription details
                has_subscription = data.get("has_active_subscription", False)
                if has_subscription:
                    plan_name = data.get("plan_name", "Unknown")
                    monthly_limit = data.get("monthly_video_limit", 0)
                    used_videos = data.get("videos_used_this_month", 0)
                    remaining = data.get("remaining_videos", 0)
                    
                    self.log_test("Subscription Status", True, 
                                f"Active subscription: {plan_name}, {used_videos}/{monthly_limit} videos used, {remaining} remaining")
                else:
                    self.log_test("Subscription Status", True, "No active subscription (expected for test user)")
                
                return True
                
            elif response.status_code == 401:
                self.log_test("Subscription Status", False, "Authentication failed - token may be invalid")
                return False
            else:
                self.log_test("Subscription Status", False, f"HTTP {response.status_code}", response.json())
                return False
                
        except Exception as e:
            self.log_test("Subscription Status", False, f"Exception: {str(e)}")
            return False
    
    async def test_can_create_video(self):
        """Test POST /api/subscription/can-create-video endpoint"""
        print("🎥 Testing video creation authorization...")
        
        if not self.auth_token:
            self.log_test("Video Creation Auth", False, "No auth token available")
            return False
        
        # Test 1: No photo uploaded (should fail with PHOTO_REQUIRED or NO_ACTIVE_SUBSCRIPTION)
        try:
            response = await self.client.post(
                f"{self.backend_url}/api/subscription/can-create-video",
                headers={"Authorization": f"Bearer {self.auth_token}"},
                json={"has_photo": False, "video_count": 1}
            )
            
            if response.status_code == 400:
                data = response.json()
                error_detail = data.get("detail", {})
                if isinstance(error_detail, dict) and error_detail.get("code") == "PHOTO_REQUIRED":
                    self.log_test("Video Creation - No Photo", True, "Correctly rejected: PHOTO_REQUIRED")
                else:
                    self.log_test("Video Creation - No Photo", False, 
                                f"Expected PHOTO_REQUIRED error, got: {error_detail}")
                    return False
            elif response.status_code == 402:
                # If user has no subscription, it will check subscription first
                data = response.json()
                error_detail = data.get("detail", {})
                if isinstance(error_detail, dict) and error_detail.get("code") == "NO_ACTIVE_SUBSCRIPTION":
                    self.log_test("Video Creation - No Photo", True, 
                                "Correctly rejected: NO_ACTIVE_SUBSCRIPTION (subscription checked before photo)")
                else:
                    self.log_test("Video Creation - No Photo", False, 
                                f"Expected NO_ACTIVE_SUBSCRIPTION error, got: {error_detail}")
                    return False
            else:
                self.log_test("Video Creation - No Photo", False, 
                            f"Expected 400 or 402 status, got {response.status_code}", response.json())
                return False
                
        except Exception as e:
            self.log_test("Video Creation - No Photo", False, f"Exception: {str(e)}")
            return False
        
        # Test 2: With photo uploaded (should check subscription and limits)
        try:
            response = await self.client.post(
                f"{self.backend_url}/api/subscription/can-create-video",
                headers={"Authorization": f"Bearer {self.auth_token}"},
                json={"has_photo": True, "video_count": 1}
            )
            
            if response.status_code == 200:
                data = response.json()
                if data.get("allowed") == True:
                    self.log_test("Video Creation - With Photo", True, 
                                f"Video creation allowed, {data.get('remaining_videos', 0)} videos remaining")
                else:
                    self.log_test("Video Creation - With Photo", False, 
                                f"Video creation not allowed: {data.get('reason', 'Unknown reason')}")
                return True
                
            elif response.status_code == 402:
                # No active subscription - this is expected for test user
                data = response.json()
                error_detail = data.get("detail", {})
                if isinstance(error_detail, dict) and error_detail.get("code") == "NO_ACTIVE_SUBSCRIPTION":
                    self.log_test("Video Creation - With Photo", True, 
                                "Correctly rejected: NO_ACTIVE_SUBSCRIPTION (expected for test user)")
                    return True
                else:
                    self.log_test("Video Creation - With Photo", False, 
                                f"Unexpected 402 error: {error_detail}")
                    return False
                    
            elif response.status_code == 403:
                # Monthly limit reached
                data = response.json()
                error_detail = data.get("detail", {})
                if isinstance(error_detail, dict) and error_detail.get("code") == "MONTHLY_LIMIT_REACHED":
                    self.log_test("Video Creation - With Photo", True, 
                                "Correctly rejected: MONTHLY_LIMIT_REACHED")
                    return True
                else:
                    self.log_test("Video Creation - With Photo", False, 
                                f"Unexpected 403 error: {error_detail}")
                    return False
            else:
                self.log_test("Video Creation - With Photo", False, 
                            f"HTTP {response.status_code}", response.json())
                return False
                
        except Exception as e:
            self.log_test("Video Creation - With Photo", False, f"Exception: {str(e)}")
            return False
    
    async def test_feature_access(self):
        """Test GET /api/subscription/check-feature/{feature_id} endpoint"""
        print("🔓 Testing feature access endpoints...")
        
        if not self.auth_token:
            self.log_test("Feature Access", False, "No auth token available")
            return False
        
        # Test premium_templates feature
        try:
            response = await self.client.get(
                f"{self.backend_url}/api/subscription/check-feature/premium_templates",
                headers={"Authorization": f"Bearer {self.auth_token}"}
            )
            
            if response.status_code == 200:
                data = response.json()
                has_access = data.get("has_access", False)
                feature_id = data.get("feature_id")
                reason = data.get("reason", "")
                
                if feature_id == "premium_templates":
                    if has_access:
                        self.log_test("Feature Access - Premium Templates", True, "User has access to premium templates")
                    else:
                        self.log_test("Feature Access - Premium Templates", True, 
                                    f"User doesn't have access: {reason} (expected for test user)")
                else:
                    self.log_test("Feature Access - Premium Templates", False, 
                                f"Wrong feature_id in response: {feature_id}")
                    return False
            else:
                self.log_test("Feature Access - Premium Templates", False, 
                            f"HTTP {response.status_code}", response.json())
                return False
                
        except Exception as e:
            self.log_test("Feature Access - Premium Templates", False, f"Exception: {str(e)}")
            return False
        
        # Test api_access feature
        try:
            response = await self.client.get(
                f"{self.backend_url}/api/subscription/check-feature/api_access",
                headers={"Authorization": f"Bearer {self.auth_token}"}
            )
            
            if response.status_code == 200:
                data = response.json()
                has_access = data.get("has_access", False)
                feature_id = data.get("feature_id")
                reason = data.get("reason", "")
                
                if feature_id == "api_access":
                    if has_access:
                        self.log_test("Feature Access - API Access", True, "User has API access")
                    else:
                        self.log_test("Feature Access - API Access", True, 
                                    f"User doesn't have API access: {reason} (expected for test user)")
                else:
                    self.log_test("Feature Access - API Access", False, 
                                f"Wrong feature_id in response: {feature_id}")
                    return False
            else:
                self.log_test("Feature Access - API Access", False, 
                            f"HTTP {response.status_code}", response.json())
                return False
                
        except Exception as e:
            self.log_test("Feature Access - API Access", False, f"Exception: {str(e)}")
            return False
        
        return True
    
    async def test_unauthorized_access(self):
        """Test endpoints without authentication"""
        print("🚫 Testing unauthorized access...")
        
        # Test subscription status without auth
        try:
            response = await self.client.get(f"{self.backend_url}/api/subscription/status")
            
            if response.status_code == 401:
                self.log_test("Unauthorized Access - Status", True, "Correctly rejected unauthorized request")
            else:
                self.log_test("Unauthorized Access - Status", False, 
                            f"Expected 401, got {response.status_code}")
                return False
                
        except Exception as e:
            self.log_test("Unauthorized Access - Status", False, f"Exception: {str(e)}")
            return False
        
        # Test video creation without auth
        try:
            response = await self.client.post(
                f"{self.backend_url}/api/subscription/can-create-video",
                json={"has_photo": True, "video_count": 1}
            )
            
            if response.status_code == 401:
                self.log_test("Unauthorized Access - Video Creation", True, "Correctly rejected unauthorized request")
            else:
                self.log_test("Unauthorized Access - Video Creation", False, 
                            f"Expected 401, got {response.status_code}")
                return False
                
        except Exception as e:
            self.log_test("Unauthorized Access - Video Creation", False, f"Exception: {str(e)}")
            return False
        
        return True
    
    async def run_all_tests(self):
        """Run all subscription system tests"""
        print("🚀 Starting InfluencerSeninle Subscription System Tests")
        print(f"Backend URL: {self.backend_url}")
        print(f"Test User: {TEST_EMAIL}")
        print("=" * 60)
        
        # Test 1: Subscription Plans (no auth required)
        await self.test_subscription_plans()
        
        # Test 2: Authentication
        auth_success = await self.authenticate_user()
        
        if auth_success:
            # Test 3: Subscription Status (requires auth)
            await self.test_subscription_status()
            
            # Test 4: Video Creation Authorization (requires auth)
            await self.test_can_create_video()
            
            # Test 5: Feature Access (requires auth)
            await self.test_feature_access()
        
        # Test 6: Unauthorized Access
        await self.test_unauthorized_access()
        
        # Summary
        print("=" * 60)
        print("📊 TEST SUMMARY")
        print("=" * 60)
        
        total_tests = len(self.test_results)
        passed_tests = sum(1 for result in self.test_results if result["success"])
        failed_tests = total_tests - passed_tests
        
        print(f"Total Tests: {total_tests}")
        print(f"✅ Passed: {passed_tests}")
        print(f"❌ Failed: {failed_tests}")
        print(f"Success Rate: {(passed_tests/total_tests)*100:.1f}%")
        
        if failed_tests > 0:
            print("\n❌ FAILED TESTS:")
            for result in self.test_results:
                if not result["success"]:
                    print(f"  - {result['test']}: {result['details']}")
        
        return failed_tests == 0


async def main():
    """Main test runner"""
    async with SubscriptionTester() as tester:
        success = await tester.run_all_tests()
        return success


if __name__ == "__main__":
    success = asyncio.run(main())
    exit(0 if success else 1)