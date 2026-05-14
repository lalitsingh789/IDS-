from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = os.getenv("DB_NAME")

client = None
db = None


def connect_db():
    global client, db

    try:
        client = MongoClient(MONGO_URI)
        db = client[DB_NAME]

        client.admin.command("ping")

        print(f"MongoDB connected successfully to database: {DB_NAME}")

        return db

    except Exception as e:
        print(f"Database connection error: {e}")
        raise Exception("MongoDB connection failed")


def get_db():
    global db

    if db is None:
        connect_db()

    return db