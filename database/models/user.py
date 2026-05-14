from database.config.db import get_db
from bson.objectid import ObjectId

db = get_db()
users_collection = db["users"]


# =========================================
# CREATE USER
# =========================================

def create_user(user_data):
    return users_collection.insert_one(user_data)


# =========================================
# FIND USER BY EMAIL
# =========================================

def find_user_by_email(email):
    return users_collection.find_one({"email": email})


# =========================================
# FIND USER BY ID
# =========================================

def find_user_by_id(user_id):
    return users_collection.find_one({
        "_id": ObjectId(user_id)
    })


# =========================================
# GET ALL USERS
# =========================================

def get_all_users():
    return list(
        users_collection.find({}, {"password": 0})
    )


# =========================================
# UPDATE USER ROLE
# =========================================

def update_user_role(email, role):
    return users_collection.update_one(
        {"email": email},
        {"$set": {"role": role}}
    )


# =========================================
# ADMIN DASHBOARD HELPERS
# =========================================

def get_users_count():
    return users_collection.count_documents({})


def get_admin_count():
    return users_collection.count_documents({
        "role": "admin"
    })


def get_user_type_count(user_type):
    return users_collection.count_documents({
        "userType": user_type
    })