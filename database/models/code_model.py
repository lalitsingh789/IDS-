from database.config.db import get_db
from bson.objectid import ObjectId
from datetime import datetime

db = get_db()

code_collection = db["code_files"]


def create_code_file(file_data):
    """
    Insert a new code file document
    """
    return code_collection.insert_one(file_data)


def get_all_code_files():
    """
    Return file list without full content
    """
    files = list(
        code_collection.find(
            {},
            {
                "content": 0
            }
        )
    )

    for file in files:
        file["_id"] = str(file["_id"])

    return files


def get_code_file_by_id(file_id):
    """
    Fetch file by Mongo ObjectId
    """
    file = code_collection.find_one({
        "_id": ObjectId(file_id)
    })

    if file:
        file["_id"] = str(file["_id"])

    return file


def get_code_file_by_path(path):
    """
    Fetch file using project path
    """
    file = code_collection.find_one({
        "path": path
    })

    if file:
        file["_id"] = str(file["_id"])

    return file


def update_code_file(path, content):
    """
    Update existing file content
    """
    return code_collection.update_one(
        {
            "path": path
        },
        {
            "$set": {
                "content": content,
                "updated_at": datetime.utcnow()
            }
        }
    )


def delete_code_file(path):
    """
    Delete a file
    """
    return code_collection.delete_one({
        "path": path
    })


def file_exists(path):
    """
    Check if file already exists
    """
    return code_collection.find_one({
        "path": path
    }) is not None


def clear_all_code_files():
    """
    Remove all stored files
    """
    return code_collection.delete_many({})