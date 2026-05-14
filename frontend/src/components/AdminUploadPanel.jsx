import { useState } from "react";

export default function AdminUploadPanel() {
  const [datasetFile, setDatasetFile] = useState(null);
  const [modelFile, setModelFile] = useState(null);
  const [codeFile, setCodeFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");

  const uploadFile = async (endpoint, file, label) => {
    if (!file) {
      setUploadStatus(`NO ${label.toUpperCase()} FILE SELECTED`);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);

      setUploadStatus(`UPLOADING ${label.toUpperCase()}...`);

      const res = await fetch(
        `http://localhost:5000/api/admin/${endpoint}`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      if (data.success) {
        setUploadStatus(`${label.toUpperCase()} DEPLOYED SUCCESSFULLY`);
      } else {
        setUploadStatus(data.message || "UPLOAD FAILED");
      }
    } catch (err) {
      console.error(err);
      setUploadStatus("SERVER CONNECTION FAILED");
    }
  };

  return (
    <div className="panel-card fade-in">
      <div className="panel-card-label">
        DEPLOYMENT CENTER
      </div>

      <div style={{ padding: "18px" }}>
        {/* DATASET */}
        <div className="config-card" style={{ marginBottom: "14px" }}>
          <div className="mini-title">
            DATASET UPLOAD
          </div>

          <input
            type="file"
            accept=".csv,.xlsx,.json"
            onChange={(e) =>
              setDatasetFile(e.target.files[0])
            }
            style={{ marginBottom: "12px", color: "#e2e8f0" }}
          />

          <button
            className="run-btn"
            onClick={() =>
              uploadFile(
                "upload-dataset",
                datasetFile,
                "dataset"
              )
            }
          >
            Upload Dataset
          </button>
        </div>

        {/* MODEL */}
        <div className="config-card" style={{ marginBottom: "14px" }}>
          <div className="mini-title">
            MODEL DEPLOYMENT
          </div>

          <input
            type="file"
            accept=".pkl,.joblib"
            onChange={(e) =>
              setModelFile(e.target.files[0])
            }
            style={{ marginBottom: "12px", color: "#e2e8f0" }}
          />

          <button
            className="run-btn run-btn--purple"
            onClick={() =>
              uploadFile(
                "upload-model",
                modelFile,
                "model"
              )
            }
          >
            Deploy Model
          </button>
        </div>

        {/* CODE */}
        <div className="config-card">
          <div className="mini-title">
            PYTHON CODE PUSH
          </div>

          <input
            type="file"
            accept=".py"
            onChange={(e) =>
              setCodeFile(e.target.files[0])
            }
            style={{ marginBottom: "12px", color: "#e2e8f0" }}
          />

          <button
            className="run-btn"
            onClick={() =>
              uploadFile(
                "upload-code",
                codeFile,
                "python code"
              )
            }
          >
            Deploy Python Code
          </button>
        </div>

        {/* STATUS */}
        {uploadStatus && (
          <div
            className="terminal"
            style={{ marginTop: "16px", maxHeight: "90px" }}
          >
            <div className="log-line">
              <span className="log-ts">
                [ADMIN]
              </span>

              <span className="log-msg log-info">
                {uploadStatus}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}