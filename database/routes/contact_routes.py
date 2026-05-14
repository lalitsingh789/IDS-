from flask import Blueprint, request, jsonify
from database.models.contact import create_contact

contact_bp = Blueprint("contact", __name__)


@contact_bp.route("/send", methods=["POST"])
def send_contact():
    try:
        data = request.get_json()

        contact_data = {
            "name": data.get("name"),
            "email": data.get("email"),
            "topic": data.get("topic"),
            "priority": data.get("priority"),
            "subject": data.get("subject"),
            "message": data.get("message"),
        }

        create_contact(contact_data)

        return jsonify({
            "success": True,
            "message": "Message sent successfully"
        })

    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500