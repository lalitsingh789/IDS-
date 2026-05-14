from flask import Blueprint, jsonify, request
from database.models.code_model import (
    get_all_code_files,
    get_code_file_by_id,
    get_code_file_by_path,
    update_code_file,
    delete_code_file
)

code_bp = Blueprint("code", __name__)


# ==========================================
# GET ALL PROJECT FILES FROM MONGODB
# ==========================================
@code_bp.route("/files", methods=["GET"])
def get_project_files():
    try:
        files = get_all_code_files()

        if not files:
            return jsonify({
                "success": True,
                "message": "No code files found",
                "files": []
            }), 200

        return jsonify({
            "success": True,
            "count": len(files),
            "files": files
        }), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Failed to fetch files: {str(e)}"
        }), 500


# ==========================================
# GET SINGLE FILE CONTENT
# ==========================================
@code_bp.route("/file/<file_id>", methods=["GET"])
def get_file_content(file_id):
    try:
        file = get_code_file_by_id(file_id)

        if not file:
            return jsonify({
                "success": False,
                "message": "File not found"
            }), 404

        return jsonify({
            "success": True,
            "file": {
                "_id": file["_id"],
                "name": file["name"],
                "path": file["path"],
                "category": file["category"],
                "lang": file["lang"],
                "content": file["content"]
            }
        }), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Failed to fetch file: {str(e)}"
        }), 500


# ==========================================
# GET FILE BY PATH
# ==========================================
@code_bp.route("/file/path", methods=["GET"])
def get_file_by_path():
    try:
        path = request.args.get("path")

        if not path:
            return jsonify({
                "success": False,
                "message": "Path parameter required"
            }), 400

        file = get_code_file_by_path(path)

        if not file:
            return jsonify({
                "success": False,
                "message": "File not found"
            }), 404

        return jsonify({
            "success": True,
            "file": file
        }), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500


# ==========================================
# UPDATE FILE
# ==========================================
@code_bp.route("/update", methods=["PUT"])
def update_code():
    try:
        data = request.get_json()

        path = data.get("path")
        content = data.get("content")

        if not path or content is None:
            return jsonify({
                "success": False,
                "message": "Path and content required"
            }), 400

        result = update_code_file(path, content)

        if result.modified_count == 0:
            return jsonify({
                "success": False,
                "message": "No file updated"
            }), 404

        return jsonify({
            "success": True,
            "message": "File updated successfully"
        }), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500


# ==========================================
# DELETE FILE
# ==========================================
@code_bp.route("/delete/<file_id>", methods=["DELETE"])
def delete_code(file_id):
    try:
        file = get_code_file_by_id(file_id)

        if not file:
            return jsonify({
                "success": False,
                "message": "File not found"
            }), 404

        result = delete_code_file(file["path"])

        if result.deleted_count == 0:
            return jsonify({
                "success": False,
                "message": "Delete failed"
            }), 400

        return jsonify({
            "success": True,
            "message": "File deleted successfully"
        }), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500