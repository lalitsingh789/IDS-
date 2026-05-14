from flask import Blueprint, jsonify, request
from database.config.db import get_db
from database.models.user import (
    get_users_count,
    get_admin_count,
    get_user_type_count
)
from datetime import datetime
import os

admin_bp = Blueprint("admin", __name__)

db = get_db()


# =========================================
# SYSTEM STATUS
# =========================================
@admin_bp.route("/system-status", methods=["GET"])
def system_status():
    try:
        db.command("ping")

        return jsonify({
            "backend": "online",
            "mongodb": "connected",
            "dataset": "loaded",
            "models": "active"
        })

    except Exception as e:
        return jsonify({
            "backend": "online",
            "mongodb": "disconnected",
            "error": str(e)
        }), 500


# =========================================
# USER STATS
# =========================================
@admin_bp.route("/user-stats", methods=["GET"])
def user_stats():
    try:
        return jsonify({
            "totalUsers": get_users_count(),
            "admins": get_admin_count(),
            "students": get_user_type_count("Student"),
            "researchers": get_user_type_count("Researcher"),
            "faculty": get_user_type_count("Faculty")
        })

    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500


# =========================================
# GET CONTACT MESSAGES
# =========================================
@admin_bp.route("/messages", methods=["GET"])
def get_messages():
    try:
        messages = list(
            db["contact_messages"].find().sort("createdAt", -1)
        )

        formatted_messages = []

        for msg in messages:
            formatted_messages.append({
                "id": str(msg["_id"]),
                "name": msg.get("name", ""),
                "email": msg.get("email", ""),
                "subject": msg.get("subject", ""),
                "message": msg.get("message", ""),
                "status": msg.get("status", "new"),
                "createdAt": msg.get("createdAt", "")
            })

        return jsonify(formatted_messages)

    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500


# =========================================
# SAVE CONTACT MESSAGE
# =========================================
@admin_bp.route("/messages", methods=["POST"])
def save_message():
    try:
        data = request.get_json()

        name = data.get("name")
        email = data.get("email")
        subject = data.get("subject")
        message_text = data.get("message")

        if not all([name, email, subject, message_text]):
            return jsonify({
                "success": False,
                "message": "All fields are required"
            }), 400

        message = {
            "name": name,
            "email": email,
            "subject": subject,
            "message": message_text,
            "status": "new",
            "createdAt": datetime.now().isoformat()
        }

        db["contact_messages"].insert_one(message)

        db["audit_logs"].insert_one({
            "action": "New user message received",
            "file": subject,
            "time": datetime.now().isoformat()
        })

        return jsonify({
            "success": True,
            "message": "Message saved successfully"
        }), 201

    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500


# =========================================
# AUDIT LOGS
# =========================================
@admin_bp.route("/audit-logs", methods=["GET"])
def audit_logs():
    try:
        logs = list(
            db["audit_logs"].find().sort("time", -1)
        )

        formatted_logs = []

        for log in logs:
            formatted_logs.append({
                "id": str(log["_id"]),
                "action": log.get("action", ""),
                "file": log.get("file", ""),
                "time": log.get("time", "")
            })

        return jsonify(formatted_logs)

    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500


# =========================================
# DATASET UPLOAD
# =========================================
@admin_bp.route("/upload-dataset", methods=["POST"])
def upload_dataset():
    try:
        file = request.files.get("file")

        if not file:
            return jsonify({
                "success": False,
                "message": "No dataset file selected"
            }), 400

        os.makedirs("datasets", exist_ok=True)

        save_path = os.path.join("datasets", file.filename)
        file.save(save_path)

        db["audit_logs"].insert_one({
            "action": "Dataset uploaded",
            "file": file.filename,
            "time": datetime.now().isoformat()
        })

        return jsonify({
            "success": True,
            "message": "Dataset uploaded successfully"
        })

    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500


# =========================================
# MODEL UPLOAD
# =========================================
@admin_bp.route("/upload-model", methods=["POST"])
def upload_model():
    try:
        file = request.files.get("file")

        if not file:
            return jsonify({
                "success": False,
                "message": "No model file selected"
            }), 400

        os.makedirs("models", exist_ok=True)

        save_path = os.path.join("models", file.filename)
        file.save(save_path)

        db["audit_logs"].insert_one({
            "action": "Model uploaded",
            "file": file.filename,
            "time": datetime.now().isoformat()
        })

        return jsonify({
            "success": True,
            "message": "Model uploaded successfully"
        })

    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500


# =========================================
# PYTHON CODE UPLOAD
# =========================================
@admin_bp.route("/upload-code", methods=["POST"])
def upload_code():
    try:
        file = request.files.get("file")

        if not file:
            return jsonify({
                "success": False,
                "message": "No code file selected"
            }), 400

        os.makedirs("backend", exist_ok=True)

        save_path = os.path.join("backend", file.filename)
        file.save(save_path)

        db["audit_logs"].insert_one({
            "action": "Python code deployed",
            "file": file.filename,
            "time": datetime.now().isoformat()
        })

        return jsonify({
            "success": True,
            "message": "Python code deployed successfully"
        })

    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500