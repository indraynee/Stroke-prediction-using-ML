import requests
import json

BASE_URL = "http://localhost:5000/api"

def test_auth_flow():
    test_user = "verify_user_final"
    test_pass = "Password123!"
    test_email = "verify@example.com"

    print("--- Starting Full Auth Flow Verification ---")

    # 1. Register
    print(f"\n1. Attempting Register: {test_user}")
    reg_response = requests.post(f"{BASE_URL}/register", json={
        "username": test_user,
        "password": test_pass,
        "email": test_email
    })
    
    if reg_response.status_code == 201:
        print("✅ Register Success")
        reg_data = reg_response.json()
        print(f"   Received: user_id={reg_data.get('user_id')}, username={reg_data.get('username')}")
    elif reg_response.status_code == 400 and "already exists" in reg_response.text:
        print("ℹ️ User already exists, proceeding to login test.")
    else:
        print(f"❌ Register Failed: {reg_response.status_code}")
        print(reg_response.text)
        return

    # 2. Login
    print(f"\n2. Attempting Login: {test_user}")
    login_response = requests.post(f"{BASE_URL}/login", json={
        "username": test_user,
        "password": test_pass
    })

    if login_response.status_code == 200:
        print("✅ Login Success")
        login_data = login_response.json()
        token = login_data.get("access_token")
        print(f"   Received: username={login_data.get('username')}, user_id={login_data.get('user_id')}")
        print(f"   Token length: {len(token)}")
    else:
        print(f"❌ Login Failed: {login_response.status_code}")
        print(login_response.text)
        return

    # 3. Verify 'Me' endpoint
    print("\n3. Verifying '/me' endpoint with token")
    me_response = requests.get(f"{BASE_URL}/me", headers={
        "Authorization": f"Bearer {token}"
    })

    if me_response.status_code == 200:
        print("✅ Auth Persistence Success")
        me_data = me_response.json()
        print(f"   Authenticated as: {me_data.get('username')}")
    else:
        print(f"❌ Auth Persistence Failed: {me_response.status_code}")
        print(me_response.text)

    print("\n--- Verification Complete ---")

if __name__ == "__main__":
    try:
        test_auth_flow()
    except Exception as e:
        print(f"An error occurred: {e}")
