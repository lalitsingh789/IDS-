from flask import Blueprint, request, jsonify
from database.models.user import create_user, find_user_by_email
from database.utils.security import (
    hash_password,
    verify_password,
    generate_token,
    verify_token
)
import os

auth_bp = Blueprint("auth", __name__)

ADMIN_SECRET = os.getenv("ADMIN_SECRET", "IDS_ADMIN_2025_SECURE")


# =========================================
# REGISTER
# =========================================

@auth_bp.route("/register", methods=["POST"])
def register():
    try:
        data = request.get_json()

        name = data.get("name")
        email = data.get("email")
        organization_id = data.get("organizationId")
        user_type = data.get("userType")
        research_area = data.get("researchArea")
        password = data.get("password")
        role = data.get("role", "user")
        admin_secret = data.get("adminSecret")

        if not all([
            name,
            email,
            organization_id,
            user_type,
            research_area,
            password
        ]):
            return jsonify({
                "success": False,
                "message": "All fields are required"
            }), 400

        if role == "admin" and not admin_secret:
            return jsonify({
                "success": False,
                "message": "Admin secret key required"
            }), 400

        existing_user = find_user_by_email(email)

        if existing_user:
            return jsonify({
                "success": False,
                "message": "User already exists"
            }), 409

        hashed_password = hash_password(password)

        user_data = {
            "name": name,
            "email": email,
            "organizationId": organization_id,
            "userType": user_type,
            "researchArea": research_area,
            "password": hashed_password,
            "role": role
        }

        if role == "admin":
            user_data["adminSecret"] = hash_password(admin_secret)

        create_user(user_data)

        return jsonify({
            "success": True,
            "message": f"{role.capitalize()} registration successful"
        }), 201

    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500

# =========================================
# USER LOGIN
# =========================================

@auth_bp.route("/login", methods=["POST"])
def login():
    try:
        data = request.get_json()

        email = data.get("email")
        password = data.get("password")

        if not email or not password:
            return jsonify({
                "success": False,
                "message": "Email and password are required"
            }), 400

        user = find_user_by_email(email)

        if not user:
            return jsonify({
                "success": False,
                "message": "Invalid credentials"
            }), 401

        if user.get("role", "user") != "user":
            return jsonify({
                "success": False,
                "message": "Use admin login"
            }), 403

        if not verify_password(password, user["password"]):
            return jsonify({
                "success": False,
                "message": "Invalid credentials"
            }), 401

        token = generate_token(user)

        return jsonify({
            "success": True,
            "message": "User login successful",
            "token": token,
            "user": {
                "id": str(user["_id"]),
                "name": user["name"],
                "email": user["email"],
                "organizationId": user["organizationId"],
                "userType": user["userType"],
                "researchArea": user["researchArea"],
                "role": user["role"]
            }
        }), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500


# =========================================
# ADMIN LOGIN
# =========================================

@auth_bp.route("/admin-login", methods=["POST"])
def admin_login():
    try:
        data = request.get_json()

        email = data.get("email")
        password = data.get("password")

        if not email or not password:
            return jsonify({
                "success": False,
                "message": "Email and password are required"
            }), 400

        user = find_user_by_email(email)

        if not user:
            return jsonify({
                "success": False,
                "message": "Admin not found"
            }), 401

        if user.get("role") != "admin":
            return jsonify({
                "success": False,
                "message": "Unauthorized admin access"
            }), 403

        if not verify_password(password, user["password"]):
            return jsonify({
                "success": False,
                "message": "Invalid credentials"
            }), 401

        token = generate_token(user)

        return jsonify({
            "success": True,
            "message": "Admin login successful",
            "token": token,
            "user": {
                "id": str(user["_id"]),
                "name": user["name"],
                "email": user["email"],
                "organizationId": user["organizationId"],
                "userType": user["userType"],
                "researchArea": user["researchArea"],
                "role": user["role"]
            }
        }), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500


# =========================================
# VERIFY SESSION
# =========================================

@auth_bp.route("/verify", methods=["GET"])
def verify_session():
    try:
        auth_header = request.headers.get("Authorization")

        if not auth_header:
            return jsonify({
                "success": False,
                "message": "Token missing"
            }), 401

        token = auth_header.replace("Bearer ", "")
        decoded = verify_token(token)

        if not decoded:
            return jsonify({
                "success": False,
                "message": "Invalid or expired token"
            }), 401

        return jsonify({
            "success": True,
            "message": "Session valid",
            "user": decoded
        }), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500


# =========================================
# LOGOUT
# =========================================

@auth_bp.route("/logout", methods=["POST"])
def logout():
    try:
        return jsonify({
            "success": True,
            "message": "Logout successful"
        }), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500