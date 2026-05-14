import bcrypt
import jwt
import os
from dotenv import load_dotenv
from datetime import datetime, timedelta

load_dotenv()

JWT_SECRET = os.getenv("JWT_SECRET")

if not JWT_SECRET:
    raise Exception("JWT_SECRET not found in environment variables")


# =========================================
# PASSWORD HASHING
# =========================================

def hash_password(password):
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(
        password.encode("utf-8"),
        salt
    )
    return hashed.decode("utf-8")


# =========================================
# PASSWORD VERIFICATION
# =========================================

def verify_password(password, hashed_password):
    return bcrypt.checkpw(
        password.encode("utf-8"),
        hashed_password.encode("utf-8")
    )


# =========================================
# GENERATE JWT TOKEN
# =========================================

def generate_token(user):
    payload = {
        "user_id": str(user["_id"]),
        "email": user["email"],
        "userType": user["userType"],
        "role": user.get("role", "user"),
        "exp": datetime.utcnow() + timedelta(days=1)
    }
    token = jwt.encode(
        payload,
        JWT_SECRET,
        algorithm="HS256"
    )

    return token


# =========================================
# VERIFY / DECODE TOKEN
# =========================================

def verify_token(token):
    try:
        decoded = jwt.decode(
            token,
            JWT_SECRET,
            algorithms=["HS256"]
        )
        return decoded

    except jwt.ExpiredSignatureError:
        return None

    except jwt.InvalidTokenError:
        return None

    except Exception:
        return None


# backward compatibility
def decode_token(token):
    return verify_token(token)