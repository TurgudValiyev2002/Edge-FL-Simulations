# FL Simulator

An interactive Federated Learning simulator with a browser frontend and a Python backend for real dataset/model experiments.

## What It Shows

- Home page with animated FL scene and a guided start flow.
- Central server and edge clients with animated FL communication rounds.
- Separate configuration and live simulation pages.
- Separate Personalized FL configuration and live simulation flow.
- Dataset selection for image-like, tabular, time-series-style, classification, and regression tasks.
- Target-variable and feature selection.
- Task-aware model choices.
- FL scenarios:
  - Basic workflow
  - Number of clients
  - IID vs non-IID data
  - Aggregation methods
  - Communication cost
  - Client dropout
  - Personalized FL
  - Privacy and security
  - Edge FL challenge mode
- Metrics:
  - Classification: balanced accuracy, cross entropy, confusion matrix.
  - Regression: RMSE, MSE loss, R2, residual view.
- Dark and light theme support.

## Python Backend

The backend uses real scikit-learn datasets and models. It partitions the training split into FL clients, trains local client models, aggregates client predictions, and evaluates on a held-out test split.

Included datasets:

- Handwritten digits from scikit-learn
- Breast cancer diagnosis
- Diabetes progression
- Iris classification
- Wine classification
- Heart-disease-style synthetic clinical data
- Wearable-sensor-style synthetic activity data
- Energy-efficiency-style synthetic regression data

Included models:

- Logistic regression
- Support vector machine/regressor
- Random forest classifier/regressor
- Histogram gradient boosting classifier/regressor
- MLP classifier/regressor
- CNN-style and ViT-style MLP proxy models for image-like datasets

## Run Locally

Install dependencies:

```bash
pip install -r requirements.txt
```

Start the backend:

```bash
python run_backend.py
```

On Windows you can also double-click:

```text
run_app.bat
```

Open:

```text
http://127.0.0.1:5000
```

The frontend can also be opened directly as `index.html`. In that mode it uses the static educational simulator. When served by the Python backend, the frontend calls `/api/simulate` and displays real backend metrics.

## API

Health:

```text
GET /api/health
```

List datasets:

```text
GET /api/datasets
```

Run an FL experiment:

```text
POST /api/simulate
```

Example body:

```json
{
  "dataset_id": "digits",
  "model_id": "rf_clf",
  "clients": 5,
  "rounds": 10,
  "client_fraction": 0.8,
  "skew": "Mild non-IID",
  "aggregation": "Weighted FedAvg"
}
```

## Research Honesty

The backend trains real scikit-learn models on real built-in datasets where possible. For CNN, ViT, and sequence Transformers, this version uses lightweight MLP proxy models so the app remains easy to run on a normal laptop. A publication-grade extension should add optional PyTorch training loops for CNN/ViT/RNN/Transformer models, plus true parameter aggregation for neural networks.
