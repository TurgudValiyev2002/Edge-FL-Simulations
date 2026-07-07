from __future__ import annotations

import csv
import io
from pathlib import Path

from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS

from .fl_core import dataset_catalog, dataset_from_csv, load_dataset, model_catalog, run_federated_experiment


ROOT = Path(__file__).resolve().parents[1]

app = Flask(__name__, static_folder=str(ROOT), static_url_path="")
CORS(app)

UPLOADED_DATASET = None


@app.get("/")
def index():
    return send_from_directory(ROOT, "index.html")


@app.get("/<path:path>")
def static_files(path: str):
    return send_from_directory(ROOT, path)


@app.get("/api/health")
def health():
    return jsonify({"ok": True, "service": "Edge FL backend"})


@app.get("/api/datasets")
def datasets():
    return jsonify({"datasets": dataset_catalog()})


@app.get("/api/models")
def models():
    task = request.args.get("task", "classification")
    return jsonify({"models": model_catalog(task)})


@app.post("/api/simulate")
def simulate():
    payload = request.get_json(force=True)
    custom_dataset = UPLOADED_DATASET if payload.get("dataset_id") == "custom_csv" else None
    result = run_federated_experiment(payload, custom_dataset=custom_dataset)
    return jsonify(result)


@app.post("/api/upload")
def upload():
    global UPLOADED_DATASET
    uploaded = request.files.get("file")
    target = request.form.get("target", "")
    task = request.form.get("task", "classification")
    if uploaded is None:
        return jsonify({"error": "No CSV file was uploaded."}), 400
    text = uploaded.read().decode("utf-8-sig")
    rows = list(csv.DictReader(io.StringIO(text)))
    dataset = dataset_from_csv(rows, target=target, task=task)
    UPLOADED_DATASET = dataset
    return jsonify(
        {
            "dataset": {
                "id": dataset.dataset_id,
                "name": dataset.name,
                "task": dataset.task,
                "target": dataset.target,
                "samples": int(dataset.X.shape[0]),
                "features": dataset.feature_names,
                "classes": dataset.class_names,
                "summary": dataset.summary,
            }
        }
    )


@app.get("/api/dataset/<dataset_id>")
def dataset_detail(dataset_id: str):
    dataset = load_dataset(dataset_id)
    return jsonify(
        {
            "dataset": {
                "id": dataset.dataset_id,
                "name": dataset.name,
                "task": dataset.task,
                "target": dataset.target,
                "samples": int(dataset.X.shape[0]),
                "features": dataset.feature_names,
                "classes": dataset.class_names,
                "summary": dataset.summary,
            }
        }
    )


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=False, use_reloader=False, threaded=True)
