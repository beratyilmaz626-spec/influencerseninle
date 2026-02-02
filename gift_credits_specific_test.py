#!/usr/bin/env python3
"""
Specific test for Gift Credits Video Creation feature
Tests the exact scenarios mentioned in the review request
"""

import asyncio
import httpx
import json
from typing import Dict, Any, Optional

# Configuration
BACKEND_URL = "https://legendary-ui.preview.emergentagent.com"

# Test users mentioned in review request
TEST_USERS = [
    {"email": "beratyilmaz626@gmail.com", "password": "berat881612", "expected_credits": 1},
    {"email": "arzcbk1303@gmail.com", "password": "test_password", "expected_credits": 3}  # Password unknown
]

class GiftCreditsSpecificTester:
    def __init__(self):
        self.backend_url = BACKEND_URL
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
    
    async def authenticate_user(self, email: str, password: str) -> Optional[str]:
        """Authenticate with Supabase and get JWT token"""
        print(f"🔐 Authenticating user: {email}...")
        
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
                    "email": email,
                    "password": password
                }
            )
            
            if response.status_code == 200:
                data = response.json()
                auth_token = data.get("access_token")
                if auth_token:
                    self.log_test(f"Authentication - {email}", True, f"Successfully authenticated")
                    return auth_token
                else:
                    self.log_test(f"Authentication - {email}", False, "No access token in response", data)
                    return None
            else:
                self.log_test(f"Authentication - {email}", False, f"HTTP {response.status_code}", response.json())
                return None
                
        except Exception as e:
            self.log_test(f"Authentication - {email}", False, f"Exception: {str(e)}")
            return None
    
    async def test_user_gift_credits_status(self, email: str, auth_token: str, expected_credits: int):
        """Test user's gift credits status via admin endpoint"""
        print(f"🎁 Testing gift credits status for {email}...")
        
        try:
            # Use admin endpoint to check user credits
            response = await self.client.get(
                f"{self.backend_url}/api/subscription/admin/users",
                headers={"Authorization": f"Bearer {auth_token}"}
            )
            
            if response.status_code == 200:
                users = response.json()
                user_found = False
                actual_credits = 0
                
                for user in users:
                    if user.get("email") == email:
                        user_found = True
                        actual_credits = user.get("credits", 0)
                        break
                
                if user_found:
                    if actual_credits == expected_credits:
                        self.log_test(f"Gift Credits Status - {email}", True, 
                                    f"User has {actual_credits} credits (matches expected {expected_credits})")
                        return True
                    else:
                        self.log_test(f"Gift Credits Status - {email}", False, 
                                    f"Expected {expected_credits} credits, found {actual_credits}")
                        return False
                else:
                    self.log_test(f"Gift Credits Status - {email}", False, "User not found in admin list")
                    return False
            else:
                self.log_test(f"Gift Credits Status - {email}", False, 
                            f"Admin endpoint failed: HTTP {response.status_code}")
                return False
                
        except Exception as e:
            self.log_test(f"Gift Credits Status - {email}", False, f"Exception: {str(e)}")
            return False
    
    async def test_video_creation_with_gift_credits(self, email: str, auth_token: str):
        """Test video creation with gift credits"""
        print(f"🎥 Testing video creation with gift credits for {email}...")
        
        try:
            response = await self.client.post(
                f"{self.backend_url}/api/subscription/can-create-video",
                headers={"Authorization": f"Bearer {auth_token}"},
                json={"has_photo": True, "video_count": 1}
            )
            
            if response.status_code == 200:
                data = response.json()
                if data.get("allowed") == True:
                    remaining = data.get("remaining_videos", 0)
                    plan_limit = data.get("plan_limit", 0)
                    current_plan = data.get("current_plan", "")
                    
                    # Check if it's using gift credits
                    if "Hediye" in current_plan:
                        self.log_test(f"Video Creation - {email}", True, 
                                    f"✅ Video creation allowed with gift credits! Plan: {current_plan}, Remaining: {remaining}, Limit: {plan_limit}")
                        return True
                    else:
                        self.log_test(f"Video Creation - {email}", False, 
                                    f"Video allowed but not using gift credits. Plan: {current_plan}")
                        return False
                else:
                    self.log_test(f"Video Creation - {email}", False, 
                                f"Video creation not allowed: {data}")
                    return False
            else:
                self.log_test(f"Video Creation - {email}", False, 
                            f"HTTP {response.status_code}: {response.json()}")
                return False
                
        except Exception as e:
            self.log_test(f"Video Creation - {email}", False, f"Exception: {str(e)}")
            return False
    
    async def run_specific_tests(self):
        """Run specific gift credits tests"""
        print("🚀 Starting Gift Credits Video Creation Specific Tests")
        print(f"Backend URL: {self.backend_url}")
        print("=" * 70)
        print("🎯 TESTING SPECIFIC SCENARIOS:")
        print("  1. beratyilmaz626@gmail.com should have 1 credit")
        print("  2. arzcbk1303@gmail.com should have 3 credits")
        print("  3. Both should be able to create videos with gift credits")
        print("=" * 70)
        
        # Test with beratyilmaz626@gmail.com (we know the password)
        user1 = TEST_USERS[0]
        auth_token1 = await self.authenticate_user(user1["email"], user1["password"])
        
        if auth_token1:
            await self.test_user_gift_credits_status(user1["email"], auth_token1, user1["expected_credits"])
            await self.test_video_creation_with_gift_credits(user1["email"], auth_token1)
        
        # For arzcbk1303@gmail.com, we can only check via admin endpoint using the first user's admin token
        if auth_token1:
            print(f"🔍 Checking {TEST_USERS[1]['email']} credits via admin endpoint...")
            await self.test_user_gift_credits_status(TEST_USERS[1]["email"], auth_token1, TEST_USERS[1]["expected_credits"])
        
        # Summary
        print("=" * 70)
        print("📊 SPECIFIC TEST SUMMARY")
        print("=" * 70)
        
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
    async with GiftCreditsSpecificTester() as tester:
        success = await tester.run_specific_tests()
        return success


if __name__ == "__main__":
    success = asyncio.run(main())
    exit(0 if success else 1)