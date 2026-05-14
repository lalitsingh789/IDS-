from database.config.db import get_db
from datetime import datetime

db = get_db()
contacts_collection = db["contacts"]


def create_contact(contact_data):
    contact_data["created_at"] = datetime.utcnow()
    contact_data["status"] = "new"
    return contacts_collection.insert_one(contact_data)


def get_all_contacts():
    return list(
        contacts_collection.find().sort("created_at", -1)
    )