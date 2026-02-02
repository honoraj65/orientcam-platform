"""
Test script for API endpoints
Run with: python test_api.py
"""
import requests
import json

BASE_URL = "http://localhost:8000"


def test_health():
    """Test health endpoint"""
    print("\n=== Testing Health Endpoint ===")
    response = requests.get(f"{BASE_URL}/health")
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    assert response.status_code == 200
    print("✓ Health check passed")


def test_root():
    """Test root endpoint"""
    print("\n=== Testing Root Endpoint ===")
    response = requests.get(f"{BASE_URL}/")
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    assert response.status_code == 200
    print("✓ Root endpoint passed")


def test_register():
    """Test user registration"""
    print("\n=== Testing Registration ===")

    data = {
        "email": "test@example.com",
        "password": "Test@1234",
        "first_name": "Jean",
        "last_name": "Dupont"
    }

    response = requests.post(f"{BASE_URL}/api/v1/auth/register", json=data)
    print(f"Status: {response.status_code}")

    if response.status_code == 201:
        result = response.json()
        print(f"✓ Registration successful")
        print(f"  User ID: {result['user']['id']}")
        print(f"  Email: {result['user']['email']}")
        print(f"  Access Token: {result['access_token'][:50]}...")
        return result
    else:
        print(f"✗ Registration failed")
        print(f"Response: {response.text}")
        return None


def test_login(email="test@example.com", password="Test@1234"):
    """Test user login"""
    print("\n=== Testing Login ===")

    data = {
        "email": email,
        "password": password
    }

    response = requests.post(f"{BASE_URL}/api/v1/auth/login", json=data)
    print(f"Status: {response.status_code}")

    if response.status_code == 200:
        result = response.json()
        print(f"✓ Login successful")
        print(f"  User: {result['user']['first_name']} {result['user']['last_name']}")
        print(f"  Access Token: {result['access_token'][:50]}...")
        return result
    else:
        print(f"✗ Login failed")
        print(f"Response: {response.text}")
        return None


def test_get_me(access_token):
    """Test getting current user info"""
    print("\n=== Testing /auth/me Endpoint ===")

    headers = {
        "Authorization": f"Bearer {access_token}"
    }

    response = requests.get(f"{BASE_URL}/api/v1/auth/me", headers=headers)
    print(f"Status: {response.status_code}")

    if response.status_code == 200:
        result = response.json()
        print(f"✓ Get user info successful")
        print(f"  ID: {result['id']}")
        print(f"  Email: {result['email']}")
        print(f"  Name: {result['first_name']} {result['last_name']}")
        print(f"  Role: {result['role']}")
        return result
    else:
        print(f"✗ Get user info failed")
        print(f"Response: {response.text}")
        return None


def test_refresh_token(refresh_token):
    """Test token refresh"""
    print("\n=== Testing Token Refresh ===")

    data = {
        "refresh_token": refresh_token
    }

    response = requests.post(f"{BASE_URL}/api/v1/auth/refresh", json=data)
    print(f"Status: {response.status_code}")

    if response.status_code == 200:
        result = response.json()
        print(f"✓ Token refresh successful")
        print(f"  New Access Token: {result['access_token'][:50]}...")
        return result
    else:
        print(f"✗ Token refresh failed")
        print(f"Response: {response.text}")
        return None


def test_logout(access_token):
    """Test logout"""
    print("\n=== Testing Logout ===")

    headers = {
        "Authorization": f"Bearer {access_token}"
    }

    response = requests.post(f"{BASE_URL}/api/v1/auth/logout", headers=headers)
    print(f"Status: {response.status_code}")

    if response.status_code == 200:
        result = response.json()
        print(f"✓ Logout successful")
        print(f"  Message: {result['message']}")
        return result
    else:
        print(f"✗ Logout failed")
        print(f"Response: {response.text}")
        return None


def main():
    """Run all tests"""
    print("=" * 60)
    print("OrientUniv API - Authentication Tests")
    print("=" * 60)

    try:
        # Test basic endpoints
        test_health()
        test_root()

        # Test authentication flow
        register_result = test_register()

        if register_result:
            access_token = register_result['access_token']
            refresh_token = register_result['refresh_token']

            # Test authenticated endpoints
            test_get_me(access_token)
            test_refresh_token(refresh_token)
            test_logout(access_token)

            # Test login with registered user
            login_result = test_login()
            if login_result:
                test_get_me(login_result['access_token'])

        print("\n" + "=" * 60)
        print("✓ All tests passed!")
        print("=" * 60)

    except Exception as e:
        print(f"\n✗ Tests failed with error: {e}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    main()
