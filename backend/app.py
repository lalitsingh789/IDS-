import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
import numpy as np
import pickle
import base64
import io
from database.routes.auth_routes import auth_bp
from database.routes.admin_routes import admin_bp
from database.routes.contact_routes import contact_bp
from database.routes.code_routes import code_bp
from database.config.db import connect_db
from database.models.code_model import (
    create_code_file,
    file_exists,
    clear_all_code_files
)

from datetime import datetime

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

from sklearn.preprocessing import LabelEncoder, label_binarize
from sklearn.metrics import (
    roc_curve,
    auc,
    precision_recall_curve,
    confusion_matrix,
    classification_report,
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
)

# =========================================
# APP CONFIG
# =========================================

app = Flask(__name__)
CORS(app)

connect_db()


app.register_blueprint(auth_bp, url_prefix="/api/auth")
app.register_blueprint(admin_bp, url_prefix="/api/admin")
app.register_blueprint(contact_bp, url_prefix="/api/contact")
app.register_blueprint(code_bp, url_prefix="/api/code")

# =========================================
# GLOBAL VARIABLES
# =========================================

svm_model = None
xg_model = None
rf_model = None
adaboost_model = None
lightgbm_model = None
mlp_model = None

scaler = None
df = None
X = None
y = None
label_encoder = LabelEncoder()
feature_columns = []

DATASET_PATHS = {
    "iot23_combined.csv": "datasets/iot23_combined.csv",
    "UNR-IDD.csv": "datasets/UNR-IDD.csv",
    "UNSW_NB15.csv": "datasets/UNSW_NB15.csv",
}

# =========================================
# CODE VIEWER MONGO UPLOAD
# =========================================

ALLOWED_CODE_EXTENSIONS = {
    ".py",
    ".ipynb"
}

IGNORE_CODE_FOLDERS = {
    "__pycache__",
    "node_modules",
    ".git",
    "venv",
    "env",
    ".idea",
    "dist",
    "build",
    ".next",
    "frontend"
}


def get_code_category(path):
    path = path.lower()

    if "xgboost" in path:
        return "XGBOOST"

    elif "svm" in path:
        return "SVM"

    elif "random_forest" in path or "random forest" in path:
        return "RANDOM FOREST"

    elif "adaboost" in path:
        return "ADABOOST"

    elif "lightgbm" in path:
        return "LIGHTGBM"

    elif "mlp" in path or "neural" in path:
        return "MLP"

    elif path.startswith("database/"):
        return "BACKEND"

    elif path == "app.py":
        return "CORE APP"

    return "ML SUPPORT"


def extract_notebook_code_by_model(notebook_path):
    import json

    with open(notebook_path, "r", encoding="utf-8") as f:
        notebook = json.load(f)

    categorized_code = {
        "SVM": [],
        "XGBOOST": [],
        "RANDOM FOREST": [],
        "ADABOOST": [],
        "LIGHTGBM": [],
        "MLP": [],
        "GENERAL": []
    }

    for cell in notebook.get("cells", []):
        if cell.get("cell_type") != "code":
            continue

        source = "".join(cell.get("source", []))
        lower = source.lower()

        if "svm" in lower:
            categorized_code["SVM"].append(source)

        elif "xgboost" in lower:
            categorized_code["XGBOOST"].append(source)

        elif "random_forest" in lower or "random forest" in lower:
            categorized_code["RANDOM FOREST"].append(source)

        elif "adaboost" in lower:
            categorized_code["ADABOOST"].append(source)

        elif "lightgbm" in lower:
            categorized_code["LIGHTGBM"].append(source)

        elif "mlp" in lower or "neural" in lower:
            categorized_code["MLP"].append(source)

        else:
            categorized_code["GENERAL"].append(source)

    return categorized_code


def upload_project_code_to_mongo():
    project_root = os.path.abspath(
        os.path.dirname(__file__)
    )

    clear_all_code_files()

    print("Uploading categorized code files to Mongo...")

    for root, dirs, files in os.walk(project_root):
        dirs[:] = [
            d for d in dirs
            if d not in IGNORE_CODE_FOLDERS
        ]

        for file in files:
            ext = os.path.splitext(file)[1]

            if ext not in ALLOWED_CODE_EXTENSIONS:
                continue

            full_path = os.path.join(root, file)

            relative_path = os.path.relpath(
                full_path,
                project_root
            ).replace("\\", "/")

            if not (
                relative_path.startswith("database/")
                or file == "app.py"
                or ext == ".ipynb"
            ):
                continue

            try:
                # NOTEBOOK HANDLING
                if ext == ".ipynb":
                    notebook_sections = extract_notebook_code_by_model(full_path)

                    for category, blocks in notebook_sections.items():
                        if not blocks:
                            continue

                        create_code_file({
                            "name": f"{category}.py",
                            "path": f"notebook/{category}.py",
                            "category": category,
                            "lang": "py",
                            "content": "\n\n".join(blocks),
                            "created_at": datetime.utcnow(),
                            "updated_at": datetime.utcnow()
                        })

                        print("Uploaded notebook section:", category)

                    continue

                # NORMAL PY FILES
                with open(
                    full_path,
                    "r",
                    encoding="utf-8",
                    errors="ignore"
                ) as f:
                    content = f.read()

                create_code_file({
                    "name": file,
                    "path": relative_path,
                    "category": get_code_category(relative_path),
                    "lang": "py",
                    "content": content,
                    "created_at": datetime.utcnow(),
                    "updated_at": datetime.utcnow()
                })

                print("Uploaded:", relative_path)

            except Exception as e:
                print("Upload failed:", e)

# =========================================
# LOAD MODELS
# =========================================

try:
    svm_model = pickle.load(open("models/svm.pkl", "rb"))
    print("svm loaded")

    xg_model = pickle.load(open("models/xgboost.pkl", "rb"))
    print("xgboost loaded")

    rf_model = pickle.load(open("models/Random_Forest.pkl", "rb"))
    print("random forest loaded")

    adaboost_model = pickle.load(open("models/AdaBoost.pkl", "rb"))
    print("adaboost loaded")

    lightgbm_model = pickle.load(open("models/LightGBM.pkl", "rb"))
    print("lightgbm loaded")

    mlp_model = pickle.load(open("models/MLP_Neural_Net.pkl", "rb"))
    print("mlp loaded")

except Exception as e:
    print("Model loading error:", str(e))

# =========================================
# HELPER FUNCTIONS
# =========================================

def plot_to_base64(fig):
    buffer = io.BytesIO()

    fig.savefig(
        buffer,
        format="png",
        dpi=120,
        bbox_inches="tight"
    )

    plt.close(fig)
    buffer.seek(0)

    return base64.b64encode(buffer.read()).decode("utf-8")


def get_selected_model(model_name):
    if model_name == "svm":
        return svm_model

    elif model_name == "xgboost":
        return xg_model

    elif model_name == "random_forest":
        return rf_model

    elif model_name == "adaboost":
        return adaboost_model

    elif model_name == "lightgbm":
        return lightgbm_model

    elif model_name == "mlp":
        return mlp_model

    return None


def get_expected_features(model, fallback):
    if hasattr(model, "n_features_in_"):
        return model.n_features_in_

    elif hasattr(model, "feature_names_in_"):
        return len(model.feature_names_in_)

    return fallback


def load_dataset(dataset_name):
    if dataset_name not in DATASET_PATHS:
        raise Exception(f"Dataset '{dataset_name}' not found")

    dataset_df = pd.read_csv(DATASET_PATHS[dataset_name])

    if "label" in dataset_df.columns:
        feature_df = dataset_df.drop("label", axis=1)
        y_raw = dataset_df["label"]
    else:
        feature_df = dataset_df.iloc[:, :-1]
        y_raw = dataset_df.iloc[:, -1]

    feature_df = feature_df.select_dtypes(include=[np.number])

    temp_encoder = LabelEncoder()
    y_encoded = temp_encoder.fit_transform(y_raw)

    return dataset_df, feature_df, y_encoded, temp_encoder


def adapt_features(feature_df, expected_features):
    current_features = feature_df.shape[1]

    if current_features > expected_features:
        feature_df = feature_df.iloc[:, :expected_features]

    elif current_features < expected_features:
        missing = expected_features - current_features

        for i in range(missing):
            feature_df[f"dummy_{i}"] = 0

    return feature_df.values


# =========================================
# HEALTH CHECK API
# =========================================

@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "online",
        "message": "Backend running successfully"
    })

# =========================================
# RUN MODEL API
# =========================================

@app.route("/run-model", methods=["POST"])
def run_model():
    try:
        data = request.get_json()

        dataset_name = data.get("dataset", "iot23_combined.csv")
        model_name = data.get("model", "svm")
        curve_type = data.get("curve")
        report_type = data.get("report")
        sample_size = data.get("sample_size", "10000")

        print("Request received:", data)

        model = get_selected_model(model_name)

        if model is None:
            return jsonify({
                "error": f"Model '{model_name}' not loaded properly"
            }), 500

        dataset_df, feature_df, y_all, temp_encoder = load_dataset(dataset_name)

        expected_features = get_expected_features(
            model,
            feature_df.shape[1]
        )

        X_all = adapt_features(
            feature_df,
            expected_features
        )

        # =================================
        # SAMPLE SIZE LOGIC
        # =================================

        if sample_size == "all":
            X_sample = X_all
            y_sample = y_all

        else:
            sample_size = int(sample_size)
            sample_size = min(sample_size, len(X_all))

            indices = np.random.choice(
                len(X_all),
                sample_size,
                replace=False
            )

            X_sample = X_all[indices]
            y_sample = y_all[indices]

        print(f"Using sample size: {len(X_sample)}")
        print(f"Using model: {model_name}")
        print(f"Using dataset: {dataset_name}")

        # =================================
        # MODEL PREDICTION
        # =================================

        print("Starting prediction...")

        y_pred = model.predict(X_sample)

        print("Prediction completed successfully")

        if hasattr(model, "predict_proba"):
            y_score = model.predict_proba(X_sample)

        elif hasattr(model, "decision_function"):
            y_score = model.decision_function(X_sample)

            if len(np.array(y_score).shape) == 1:
                y_score = y_score.reshape(-1, 1)

        else:
            y_score = np.array(y_pred).reshape(-1, 1)

        # =================================
        # METRICS
        # =================================

        metrics = {
            "accuracy": float(
                accuracy_score(y_sample, y_pred)
            ),
            "precision": float(
                precision_score(
                    y_sample,
                    y_pred,
                    average="weighted",
                    zero_division=0
                )
            ),
            "recall": float(
                recall_score(
                    y_sample,
                    y_pred,
                    average="weighted",
                    zero_division=0
                )
            ),
            "f1": float(
                f1_score(
                    y_sample,
                    y_pred,
                    average="weighted",
                    zero_division=0
                )
            )
        }

        graph = None

        # =================================
        # CURVE GENERATION
        # =================================

        if curve_type in ["roc", "pr"]:

            classes = np.unique(y_sample)
            n_classes = len(classes)

            fig, ax = plt.subplots(figsize=(7, 5))

            if n_classes == 2:

                if len(np.array(y_score).shape) > 1 and y_score.shape[1] > 1:
                    score_values = y_score[:, 1]
                else:
                    score_values = y_score[:, 0]

                if curve_type == "roc":
                    fpr, tpr, _ = roc_curve(
                        y_sample,
                        score_values
                    )

                    roc_auc = auc(fpr, tpr)

                    ax.plot(
                        fpr,
                        tpr,
                        label=f"AUC = {roc_auc:.3f}"
                    )

                    ax.plot(
                        [0, 1],
                        [0, 1],
                        linestyle="--"
                    )

                    ax.set_title("ROC Curve")
                    ax.set_xlabel("False Positive Rate")
                    ax.set_ylabel("True Positive Rate")

                elif curve_type == "pr":
                    precision_vals, recall_vals, _ = precision_recall_curve(
                        y_sample,
                        score_values
                    )

                    ax.plot(
                        recall_vals,
                        precision_vals,
                        label="PR Curve"
                    )

                    ax.set_title("Precision Recall Curve")
                    ax.set_xlabel("Recall")
                    ax.set_ylabel("Precision")

                ax.legend()
                graph = plot_to_base64(fig)

            else:
                y_bin = label_binarize(
                    y_sample,
                    classes=classes
                )

                if len(np.array(y_score).shape) == 1:
                    y_score = np.tile(
                        y_score.reshape(-1, 1),
                        (1, n_classes)
                    )

                if y_score.shape[1] < n_classes:
                    y_score = np.tile(
                        y_score[:, 0].reshape(-1, 1),
                        (1, n_classes)
                    )

                for i in range(n_classes):

                    if curve_type == "roc":
                        fpr, tpr, _ = roc_curve(
                            y_bin[:, i],
                            y_score[:, i]
                        )

                        roc_auc = auc(fpr, tpr)

                        ax.plot(
                            fpr,
                            tpr,
                            label=f"Class {i} AUC={roc_auc:.2f}"
                        )

                    elif curve_type == "pr":
                        precision_vals, recall_vals, _ = precision_recall_curve(
                            y_bin[:, i],
                            y_score[:, i]
                        )

                        ax.plot(
                            recall_vals,
                            precision_vals,
                            label=f"Class {i}"
                        )

                ax.legend(fontsize=8)
                graph = plot_to_base64(fig)

            # =================================
            # BINARY CLASSIFICATION
            # =================================

            if n_classes == 2:

                if len(np.array(y_score).shape) > 1 and y_score.shape[1] > 1:
                    score_values = y_score[:, 1]
                else:
                    score_values = y_score[:, 0]

                if curve_type == "roc":
                    fpr, tpr, _ = roc_curve(
                        y_sample,
                        score_values
                    )

                    roc_auc = auc(fpr, tpr)

                    ax.plot(
                        fpr,
                        tpr,
                        label=f"AUC = {roc_auc:.3f}"
                    )

                    ax.plot(
                        [0, 1],
                        [0, 1],
                        linestyle="--"
                    )

                    ax.set_title("ROC Curve")
                    ax.set_xlabel("False Positive Rate")
                    ax.set_ylabel("True Positive Rate")

                elif curve_type == "pr":
                    precision_vals, recall_vals, _ = precision_recall_curve(
                        y_sample,
                        score_values
                    )

                    ax.plot(
                        recall_vals,
                        precision_vals,
                        label="PR Curve"
                    )

                    ax.set_title("Precision Recall Curve")
                    ax.set_xlabel("Recall")
                    ax.set_ylabel("Precision")

                ax.legend()
                graph = plot_to_base64(fig)

            # =================================
            # MULTICLASS CLASSIFICATION
            # =================================

            else:
                y_bin = label_binarize(
                    y_sample,
                    classes=classes
                )

                if len(np.array(y_score).shape) == 1:
                    y_score = np.tile(
                        y_score.reshape(-1, 1),
                        (1, n_classes)
                    )

                if y_score.shape[1] < n_classes:
                    y_score = np.tile(
                        y_score[:, 0].reshape(-1, 1),
                        (1, n_classes)
                    )

                for i in range(n_classes):

                    if curve_type == "roc":
                        fpr, tpr, _ = roc_curve(
                            y_bin[:, i],
                            y_score[:, i]
                        )

                        roc_auc = auc(fpr, tpr)

                        ax.plot(
                            fpr,
                            tpr,
                            label=f"Class {i} AUC={roc_auc:.2f}"
                        )

                        ax.set_title("Multiclass ROC Curve")
                        ax.set_xlabel("False Positive Rate")
                        ax.set_ylabel("True Positive Rate")

                    elif curve_type == "pr":
                        precision_vals, recall_vals, _ = precision_recall_curve(
                            y_bin[:, i],
                            y_score[:, i]
                        )

                        ax.plot(
                            recall_vals,
                            precision_vals,
                            label=f"Class {i}"
                        )

                        ax.set_title("Multiclass Precision Recall Curve")
                        ax.set_xlabel("Recall")
                        ax.set_ylabel("Precision")

                ax.legend(fontsize=8)
                graph = plot_to_base64(fig)

        # =================================
        # REPORT GRAPH
        # =================================

        if report_type == "graph":
            cm = confusion_matrix(y_sample, y_pred)

            fig, ax = plt.subplots(figsize=(6, 5))
            ax.imshow(cm, cmap="Blues")

            ax.set_title("Confusion Matrix")
            ax.set_xlabel("Predicted")
            ax.set_ylabel("Actual")

            for i in range(cm.shape[0]):
                for j in range(cm.shape[1]):
                    ax.text(
                        j,
                        i,
                        str(cm[i, j]),
                        ha="center",
                        va="center"
                    )

            graph = plot_to_base64(fig)

        # =================================
        # REPORT TABLE
        # =================================

        elif report_type == "table":

            report = classification_report(
                y_sample,
                y_pred,
                output_dict=True
            )

            headers = [
                "precision",
                "recall",
                "f1-score",
                "support"
            ]

            table = []

            for key, value in report.items():
                if isinstance(value, dict):
                    row = [
                        str(key),
                        f"{value.get('precision', 0):.3f}",
                        f"{value.get('recall', 0):.3f}",
                        f"{value.get('f1-score', 0):.3f}",
                        f"{value.get('support', 0):.0f}"
                    ]
                    table.append(row)

            return jsonify({
                "graph": None,
                "table": table,
                "headers": headers,
                "metrics": metrics
            })

        return jsonify({
            "graph": graph,
            "table": None,
            "headers": None,
            "metrics": metrics
        })

    except Exception as e:
        print("Run model error:", str(e))

        return jsonify({
            "error": str(e)
        }), 500


# =========================================
# FEATURES API
# =========================================

@app.route("/features", methods=["GET"])
def get_features():
    try:
        dataset_name = request.args.get(
            "dataset",
            "iot23_combined.csv"
        )

        dataset_df, feature_df, _, _ = load_dataset(dataset_name)

        cols = list(feature_df.columns)

        stats = {}

        for col in cols:
            col_data = feature_df[col].dropna()

            stats[col] = {
                "min": round(float(col_data.min()), 4),
                "max": round(float(col_data.max()), 4),
                "mean": round(float(col_data.mean()), 4),
                "example": round(float(col_data.median()), 4),
            }

        return jsonify({
            "features": cols,
            "stats": stats,
            "n_features": len(cols),
            "dataset": dataset_name
        })

    except Exception as e:
        print("features error:", str(e))

        return jsonify({
            "error": str(e)
        }), 500


# =========================================
# PREDICT ATTACK
# =========================================

@app.route("/predict-attack", methods=["POST"])
def predict_attack():
    try:
        data = request.get_json()

        model_name = data.get("model", "svm")
        dataset_name = data.get(
            "dataset",
            "iot23_combined.csv"
        )

        model = get_selected_model(model_name)

        if model is None:
            return jsonify({
                "error": "Model not loaded"
            }), 500

        dataset_df, feature_df, _, temp_encoder = load_dataset(
            dataset_name
        )

        cols = list(feature_df.columns)

        vector = []

        for col in cols:
            try:
                vector.append(
                    float(data.get(col, 0) or 0)
                )
            except:
                vector.append(0.0)

        features_np = np.array(vector).reshape(1, -1)

        expected = get_expected_features(
            model,
            features_np.shape[1]
        )

        current = features_np.shape[1]

        if current > expected:
            features_input = features_np[:, :expected]

        elif current < expected:
            missing = expected - current
            padding = np.zeros((1, missing))
            features_input = np.hstack([
                features_np,
                padding
            ])

        else:
            features_input = features_np

        prediction_encoded = model.predict(
            features_input
        )[0]

        try:
            prediction_label = temp_encoder.inverse_transform(
                [int(prediction_encoded)]
            )[0]
        except:
            prediction_label = str(prediction_encoded)

        confidence = None

        try:
            if hasattr(model, "predict_proba"):
                proba = model.predict_proba(
                    features_input
                )[0]

                confidence = float(max(proba))

            elif hasattr(model, "decision_function"):
                score = model.decision_function(
                    features_input
                )

                if hasattr(score[0], "__len__"):
                    scores = np.array(score[0])
                    exp_s = np.exp(scores - scores.max())

                    confidence = float(
                        (exp_s / exp_s.sum()).max()
                    )

                else:
                    confidence = float(
                        1 / (1 + np.exp(-float(score[0])))
                    )

        except Exception as ce:
            print("confidence error:", ce)

        return jsonify({
            "prediction": prediction_label,
            "confidence": confidence,
            "dataset": dataset_name,
            "model": model_name
        })

    except Exception as e:
        print("predict-attack error:", str(e))

        return jsonify({
            "error": str(e)
        }), 500       
# =========================================
# LABEL COUNTS API
# =========================================

RISK_MAP = {
    "benign": "safe",
    "-": "safe",
    "c&c": "critical",
    "ddos": "critical",
    "mirai": "critical",
    "torii": "critical",
    "portscan": "high",
    "okiru": "high",
    "attack": "high",
    "filedownload": "medium",
    "heartbeat": "medium",
}


def infer_risk(label: str):
    l = label.lower().strip()

    for key, risk in RISK_MAP.items():
        if key in l:
            return risk

    return "medium"


@app.route("/label-counts", methods=["GET"])
def label_counts():
    try:
        dataset_name = request.args.get(
            "dataset",
            "iot23_combined.csv"
        )

        dataset_df, _, _, _ = load_dataset(dataset_name)

        if "label" in dataset_df.columns:
            label_series = dataset_df["label"]
        else:
            label_series = dataset_df.iloc[:, -1]

        counts = label_series.value_counts()

        labels = [
            {
                "label": str(lbl),
                "count": int(cnt),
                "risk": infer_risk(str(lbl)),
            }
            for lbl, cnt in counts.items()
        ]

        return jsonify({
            "labels": labels,
            "total": int(label_series.shape[0]),
            "num_classes": len(labels),
            "dataset": dataset_name
        })

    except Exception as e:
        print("label-counts error:", str(e))

        return jsonify({
            "error": str(e)
        }), 500


# =========================================
# DATASETS API
# =========================================

@app.route("/datasets", methods=["GET"])
def get_datasets():
    return jsonify({
        "datasets": [
            {
                "value": "iot23_combined.csv",
                "label": "IoT-23 Network Traffic"
            },
            {
                "value": "UNR-IDD.csv",
                "label": "UNR-IDD Dataset"
            },
            {
                "value": "UNSW_NB15.csv",
                "label": "UNSW-NB15 Dataset"
            }
        ]
    })


# =========================================
# MODELS API
# =========================================

@app.route("/models", methods=["GET"])
def get_models():
    return jsonify({
        "models": [
            {
                "value": "svm",
                "label": "Support Vector Machine"
            },
            {
                "value": "xgboost",
                "label": "XGBoost"
            },
            {
                "value": "random_forest",
                "label": "Random Forest"
            },
            {
                "value": "adaboost",
                "label": "AdaBoost"
            },
            {
                "value": "lightgbm",
                "label": "LightGBM"
            },
            {
                "value": "mlp",
                "label": "MLP Neural Network"
            }
        ]
    })


# =========================================
# RUN SERVER
# =========================================

upload_project_code_to_mongo()

if __name__ == "__main__":
    app.run(
        debug=True,
        host="127.0.0.1",
        port=5000
    )