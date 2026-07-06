from __future__ import annotations

from dataclasses import dataclass
from typing import Any

import numpy as np
from sklearn.base import clone
from sklearn.datasets import (
    load_breast_cancer,
    load_diabetes,
    load_digits,
    load_iris,
    load_wine,
    make_classification,
    make_regression,
)
from sklearn.ensemble import (
    HistGradientBoostingClassifier,
    HistGradientBoostingRegressor,
    RandomForestClassifier,
    RandomForestRegressor,
)
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LinearRegression, LogisticRegression
from sklearn.metrics import (
    balanced_accuracy_score,
    confusion_matrix,
    log_loss,
    mean_squared_error,
    r2_score,
)
from sklearn.model_selection import train_test_split
from sklearn.neural_network import MLPClassifier, MLPRegressor
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.svm import SVC, SVR


RANDOM_SEED = 42


@dataclass(frozen=True)
class DatasetBundle:
    dataset_id: str
    name: str
    task: str
    X: np.ndarray
    y: np.ndarray
    feature_names: list[str]
    target: str
    class_names: list[str]
    summary: str


def dataset_catalog() -> list[dict[str, Any]]:
    return [
        _metadata(load_dataset("digits")),
        _metadata(load_dataset("breast_cancer")),
        _metadata(load_dataset("heart_synthetic")),
        _metadata(load_dataset("diabetes")),
        _metadata(load_dataset("iris")),
        _metadata(load_dataset("wine")),
        _metadata(load_dataset("sensor_activity")),
        _metadata(load_dataset("energy_synthetic")),
    ]


def model_catalog(task: str) -> list[dict[str, str]]:
    if "regression" in task:
        return [
            {"id": "linear", "name": "Linear regression"},
            {"id": "svr", "name": "Support vector regressor"},
            {"id": "rf_reg", "name": "Random forest regressor"},
            {"id": "xgb_reg", "name": "Histogram gradient boosting regressor"},
            {"id": "mlp_reg", "name": "MLP regressor"},
        ]
    models = [
        {"id": "logistic", "name": "Logistic regression"},
        {"id": "svm", "name": "Support vector machine"},
        {"id": "rf_clf", "name": "Random forest classifier"},
        {"id": "xgb_clf", "name": "Histogram gradient boosting classifier"},
        {"id": "mlp_clf", "name": "MLP classifier"},
    ]
    if "image" in task:
        models.extend(
            [
                {"id": "cnn_proxy", "name": "CNN-style MLP image classifier"},
                {"id": "vit_proxy", "name": "ViT-style patch MLP classifier"},
            ]
        )
    return models


def load_dataset(dataset_id: str) -> DatasetBundle:
    if dataset_id == "digits":
        data = load_digits()
        return DatasetBundle(
            dataset_id="digits",
            name="Scikit-learn handwritten digits",
            task="image-classification",
            X=data.data.astype(float),
            y=data.target,
            feature_names=[f"pixel_{i}" for i in range(data.data.shape[1])],
            target="digit",
            class_names=[str(label) for label in data.target_names],
            summary="Real handwritten digit image dataset from scikit-learn. It is MNIST-like but smaller and offline-friendly.",
        )
    if dataset_id == "breast_cancer":
        data = load_breast_cancer()
        return DatasetBundle(
            dataset_id="breast_cancer",
            name="Breast cancer diagnosis",
            task="classification",
            X=data.data.astype(float),
            y=data.target,
            feature_names=[str(name) for name in data.feature_names],
            target="diagnosis",
            class_names=[str(name) for name in data.target_names],
            summary="Real medical tabular binary classification dataset.",
        )
    if dataset_id == "diabetes":
        data = load_diabetes()
        return DatasetBundle(
            dataset_id="diabetes",
            name="Diabetes progression",
            task="regression",
            X=data.data.astype(float),
            y=data.target.astype(float),
            feature_names=[str(name) for name in data.feature_names],
            target="disease_progression",
            class_names=[],
            summary="Real regression dataset for predicting diabetes disease progression.",
        )
    if dataset_id == "iris":
        data = load_iris()
        return DatasetBundle(
            dataset_id="iris",
            name="Iris flower classification",
            task="classification",
            X=data.data.astype(float),
            y=data.target,
            feature_names=[str(name) for name in data.feature_names],
            target="species",
            class_names=[str(name) for name in data.target_names],
            summary="Real multiclass classification dataset.",
        )
    if dataset_id == "wine":
        data = load_wine()
        return DatasetBundle(
            dataset_id="wine",
            name="Wine cultivar classification",
            task="classification",
            X=data.data.astype(float),
            y=data.target,
            feature_names=[str(name) for name in data.feature_names],
            target="cultivar",
            class_names=[str(name) for name in data.target_names],
            summary="Real chemical-analysis multiclass classification dataset.",
        )
    if dataset_id == "heart_synthetic":
        X, y = make_classification(
            n_samples=1200,
            n_features=12,
            n_informative=7,
            n_redundant=2,
            weights=[0.58, 0.42],
            class_sep=1.1,
            random_state=RANDOM_SEED,
        )
        return DatasetBundle(
            dataset_id="heart_synthetic",
            name="Heart disease style clinical data",
            task="classification",
            X=X,
            y=y,
            feature_names=[
                "age",
                "sex",
                "chest_pain",
                "blood_pressure",
                "cholesterol",
                "fasting_glucose",
                "ecg",
                "max_heart_rate",
                "angina",
                "oldpeak",
                "slope",
                "vessels",
            ],
            target="disease",
            class_names=["no disease", "disease"],
            summary="Synthetic clinical dataset shaped like common heart disease tables. It is included because the real UCI heart dataset is not bundled offline.",
        )
    if dataset_id == "sensor_activity":
        X, y = make_classification(
            n_samples=2400,
            n_features=18,
            n_informative=12,
            n_classes=6,
            n_clusters_per_class=1,
            class_sep=1.4,
            random_state=RANDOM_SEED + 3,
        )
        return DatasetBundle(
            dataset_id="sensor_activity",
            name="Wearable sensor activity",
            task="time-series-classification",
            X=X,
            y=y,
            feature_names=[f"sensor_window_{i}" for i in range(X.shape[1])],
            target="activity",
            class_names=["walking", "upstairs", "downstairs", "sitting", "standing", "laying"],
            summary="Synthetic wearable-window dataset for time-series FL experiments.",
        )
    if dataset_id == "energy_synthetic":
        X, y = make_regression(
            n_samples=1500,
            n_features=8,
            n_informative=6,
            noise=18.0,
            random_state=RANDOM_SEED + 7,
        )
        return DatasetBundle(
            dataset_id="energy_synthetic",
            name="Energy efficiency style regression",
            task="regression",
            X=X,
            y=y,
            feature_names=[
                "relative_compactness",
                "surface_area",
                "wall_area",
                "roof_area",
                "height",
                "orientation",
                "glazing_area",
                "glazing_distribution",
            ],
            target="heating_load",
            class_names=[],
            summary="Synthetic building-energy regression dataset for offline experiments.",
        )
    raise ValueError(f"Unknown dataset: {dataset_id}")


def dataset_from_csv(rows: list[dict[str, Any]], target: str, task: str) -> DatasetBundle:
    if not rows:
        raise ValueError("CSV is empty.")
    columns = list(rows[0].keys())
    if target not in columns:
        raise ValueError(f"Target column '{target}' was not found.")

    feature_names = [column for column in columns if column != target]
    X_raw = [[row.get(column) for column in feature_names] for row in rows]
    y_raw = [row.get(target) for row in rows]
    X = _coerce_matrix(X_raw)

    if "regression" in task:
        y = np.asarray([float(value) for value in y_raw], dtype=float)
        class_names: list[str] = []
    else:
        labels = sorted({str(value) for value in y_raw})
        label_to_index = {label: index for index, label in enumerate(labels)}
        y = np.asarray([label_to_index[str(value)] for value in y_raw], dtype=int)
        class_names = labels

    return DatasetBundle(
        dataset_id="custom_csv",
        name="Uploaded CSV dataset",
        task=task,
        X=X,
        y=y,
        feature_names=feature_names,
        target=target,
        class_names=class_names,
        summary="User-uploaded CSV dataset.",
    )


def run_federated_experiment(config: dict[str, Any], custom_dataset: DatasetBundle | None = None) -> dict[str, Any]:
    dataset = custom_dataset or load_dataset(str(config.get("dataset_id", "digits")))
    selected_features = config.get("features") or dataset.feature_names
    feature_indices = [dataset.feature_names.index(name) for name in selected_features if name in dataset.feature_names]
    if not feature_indices:
        feature_indices = list(range(dataset.X.shape[1]))

    X = dataset.X[:, feature_indices]
    y = dataset.y
    is_regression = "regression" in dataset.task
    stratify = None if is_regression or len(np.unique(y)) < 2 else y
    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.25,
        random_state=RANDOM_SEED,
        stratify=stratify,
    )

    clients = int(np.clip(int(config.get("clients", 5)), 2, 50))
    rounds = int(np.clip(int(config.get("rounds", 10)), 2, 50))
    client_fraction = float(np.clip(float(config.get("client_fraction", 0.8)), 0.1, 1.0))
    dropout = float(np.clip(float(config.get("dropout", 0.0)), 0.0, 0.9))
    skew = str(config.get("skew", "IID"))
    aggregation = str(config.get("aggregation", "Weighted FedAvg"))
    model_id = str(config.get("model_id", "rf_clf"))
    local_epochs = int(np.clip(int(config.get("local_epochs", 1)), 1, 10))

    client_indices = partition_clients(y_train, clients, skew, is_regression)
    classes = np.unique(y_train) if not is_regression else None
    metric_curve: list[float] = []
    loss_curve: list[float] = []
    last_predictions: np.ndarray | None = None
    last_probabilities: np.ndarray | None = None

    rng = np.random.default_rng(RANDOM_SEED)
    for round_index in range(rounds):
        participant_count = max(1, int(round(clients * client_fraction * (1.0 - dropout))))
        participant_ids = rng.choice(np.arange(clients), size=participant_count, replace=False)
        predictions = []
        probabilities = []
        weights = []

        for client_id in participant_ids:
            idx = client_indices[int(client_id)]
            if len(idx) < 2:
                continue
            model = make_model(model_id, is_regression, local_epochs, round_index)
            try:
                model.fit(X_train[idx], y_train[idx])
                predictions.append(model.predict(X_test))
                weights.append(float(len(idx)))
                if not is_regression:
                    probabilities.append(_predict_proba_aligned(model, X_test, classes))
            except Exception:
                continue

        if not predictions:
            raise RuntimeError("No client could train successfully. Try fewer clients or another dataset.")

        if is_regression:
            y_pred = aggregate_regression(predictions, weights, aggregation)
            loss = float(mean_squared_error(y_test, y_pred))
            rmse = float(np.sqrt(loss))
            metric_curve.append(rmse)
            loss_curve.append(loss)
            last_predictions = y_pred
        else:
            probs = aggregate_probabilities(probabilities, weights, aggregation)
            y_pred = classes[np.argmax(probs, axis=1)]
            metric = float(balanced_accuracy_score(y_test, y_pred))
            loss = float(log_loss(y_test, probs, labels=classes))
            metric_curve.append(metric)
            loss_curve.append(loss)
            last_predictions = y_pred
            last_probabilities = probs

    communication = estimate_communication(model_id, clients, rounds, client_fraction, dropout)
    distributions = client_distribution_rows(client_indices, y_train, dataset.class_names, is_regression)
    stability = float(max(0.05, min(0.99, 1.0 - np.std(metric_curve[-min(8, len(metric_curve)) :]) * 2.0)))

    response: dict[str, Any] = {
        "backend": True,
        "method": "real client training with prediction aggregation",
        "dataset": _metadata(dataset),
        "classification": not is_regression,
        "curve": metric_curve,
        "loss": loss_curve,
        "communication": communication,
        "stability": stability,
        "distributions": distributions,
        "finalMetric": metric_curve[-1],
        "finalLoss": loss_curve[-1],
    }
    if is_regression:
        response["residualRows"] = residual_rows(y_test, np.asarray(last_predictions))
        response["evaluationRows"] = [
            ["RMSE", f"{metric_curve[-1]:.4f}", "Real root mean squared error on the held-out test split."],
            ["MSE loss", f"{loss_curve[-1]:.4f}", "Real mean squared error on the held-out test split."],
            ["R2", f"{r2_score(y_test, last_predictions):.4f}", "Held-out explained variance score."],
        ]
    else:
        cm = confusion_matrix(y_test, last_predictions, labels=classes)
        response["confusionMatrix"] = cm.tolist()
        response["classNames"] = [dataset.class_names[int(label)] if dataset.class_names else str(label) for label in classes]
        response["evaluationRows"] = [
            ["Balanced accuracy", f"{metric_curve[-1]:.4f}", "Real mean recall across classes on the held-out test split."],
            ["Cross entropy", f"{loss_curve[-1]:.4f}", "Real multiclass log loss from aggregated client probabilities."],
            ["Classes", str(len(classes)), "Number of target classes evaluated."],
        ]
    return response


def make_model(model_id: str, is_regression: bool, local_epochs: int, round_index: int):
    seed = RANDOM_SEED + round_index
    max_iter = max(80, 55 * local_epochs + round_index * 8)
    if is_regression:
        if model_id == "linear":
            return make_pipeline(SimpleImputer(), StandardScaler(), LinearRegression())
        if model_id == "svr":
            return make_pipeline(SimpleImputer(), StandardScaler(), SVR(C=2.0))
        if model_id == "rf_reg":
            return RandomForestRegressor(n_estimators=80, random_state=seed, n_jobs=-1)
        if model_id == "xgb_reg":
            return HistGradientBoostingRegressor(max_iter=max_iter, random_state=seed)
        return make_pipeline(SimpleImputer(), StandardScaler(), MLPRegressor(hidden_layer_sizes=(64, 32), max_iter=max_iter, random_state=seed))

    if model_id == "logistic":
        return make_pipeline(SimpleImputer(), StandardScaler(), LogisticRegression(max_iter=max_iter, solver="lbfgs"))
    if model_id == "svm":
        return make_pipeline(SimpleImputer(), StandardScaler(), SVC(C=2.0, probability=True, random_state=seed))
    if model_id == "rf_clf":
        return RandomForestClassifier(n_estimators=90, random_state=seed, n_jobs=-1)
    if model_id == "xgb_clf":
        return HistGradientBoostingClassifier(max_iter=max_iter, random_state=seed)
    if model_id in {"cnn_proxy", "vit_proxy"}:
        return make_pipeline(SimpleImputer(), StandardScaler(), MLPClassifier(hidden_layer_sizes=(128, 64), max_iter=max_iter, random_state=seed))
    return make_pipeline(SimpleImputer(), StandardScaler(), MLPClassifier(hidden_layer_sizes=(80, 40), max_iter=max_iter, random_state=seed))


def partition_clients(y: np.ndarray, clients: int, skew: str, is_regression: bool) -> list[np.ndarray]:
    rng = np.random.default_rng(RANDOM_SEED)
    indices = np.arange(len(y))
    if is_regression or skew == "IID":
        rng.shuffle(indices)
        return [part.astype(int) for part in np.array_split(indices, clients)]

    labels = np.unique(y)
    client_parts = [[] for _ in range(clients)]
    if "Quantity" in skew:
        rng.shuffle(indices)
        proportions = rng.dirichlet(np.ones(clients) * 0.45)
        sizes = np.maximum(2, (proportions * len(indices)).astype(int))
        sizes[-1] = max(2, len(indices) - int(np.sum(sizes[:-1])))
        cursor = 0
        for client_id, size in enumerate(sizes):
            client_parts[client_id].extend(indices[cursor : cursor + size].tolist())
            cursor += size
        return [np.asarray(part, dtype=int) for part in client_parts]

    concentration = 10.0 if "Mild" in skew else 0.25
    if "Label-skew" in skew:
        concentration = 0.08

    for label in labels:
        label_indices = indices[y == label]
        rng.shuffle(label_indices)
        proportions = rng.dirichlet(np.ones(clients) * concentration)
        sizes = (proportions * len(label_indices)).astype(int)
        sizes[-1] += len(label_indices) - int(np.sum(sizes))
        cursor = 0
        for client_id, size in enumerate(sizes):
            client_parts[client_id].extend(label_indices[cursor : cursor + size].tolist())
            cursor += size

    return [np.asarray(part if part else rng.choice(indices, size=2, replace=False), dtype=int) for part in client_parts]


def aggregate_probabilities(probabilities: list[np.ndarray], weights: list[float], method: str) -> np.ndarray:
    stack = np.stack(probabilities, axis=0)
    if method == "FedMedian":
        return np.median(stack, axis=0)
    if method == "FedTrimmedMean" and len(probabilities) > 2:
        sorted_stack = np.sort(stack, axis=0)
        return np.mean(sorted_stack[1:-1], axis=0)
    if method == "FedAvg":
        return np.mean(stack, axis=0)
    weight_array = np.asarray(weights, dtype=float)
    weight_array = weight_array / np.sum(weight_array)
    return np.tensordot(weight_array, stack, axes=(0, 0))


def aggregate_regression(predictions: list[np.ndarray], weights: list[float], method: str) -> np.ndarray:
    stack = np.stack(predictions, axis=0)
    if method == "FedMedian":
        return np.median(stack, axis=0)
    if method == "FedTrimmedMean" and len(predictions) > 2:
        sorted_stack = np.sort(stack, axis=0)
        return np.mean(sorted_stack[1:-1], axis=0)
    if method == "FedAvg":
        return np.mean(stack, axis=0)
    weight_array = np.asarray(weights, dtype=float)
    weight_array = weight_array / np.sum(weight_array)
    return np.tensordot(weight_array, stack, axes=(0, 0))


def _predict_proba_aligned(model, X_test: np.ndarray, classes: np.ndarray) -> np.ndarray:
    if hasattr(model, "predict_proba"):
        raw = model.predict_proba(X_test)
        model_classes = getattr(model, "classes_", None)
        if model_classes is None and hasattr(model, "named_steps"):
            final_step = list(model.named_steps.values())[-1]
            model_classes = getattr(final_step, "classes_", None)
        aligned = np.full((len(X_test), len(classes)), 1e-9, dtype=float)
        for raw_index, label in enumerate(model_classes):
            target_index = int(np.where(classes == label)[0][0])
            aligned[:, target_index] = raw[:, raw_index]
        return aligned / aligned.sum(axis=1, keepdims=True)

    preds = model.predict(X_test)
    aligned = np.full((len(X_test), len(classes)), 1e-9, dtype=float)
    for row_index, label in enumerate(preds):
        target_index = int(np.where(classes == label)[0][0])
        aligned[row_index, target_index] = 1.0
    return aligned


def client_distribution_rows(client_indices: list[np.ndarray], y_train: np.ndarray, class_names: list[str], is_regression: bool) -> list[dict[str, Any]]:
    rows = []
    visible_clients = client_indices[:12]
    if is_regression:
        bins = np.quantile(y_train, [0.33, 0.66])
        labels = ["low", "medium", "high"]
        bucketed = np.digitize(y_train, bins)
    else:
        labels = class_names or [str(label) for label in sorted(np.unique(y_train))]
        bucketed = y_train.astype(int)
    for client_id, indices in enumerate(visible_clients):
        counts = np.bincount(bucketed[indices], minlength=len(labels)).astype(float)
        values = counts / max(1.0, counts.sum())
        rows.append(
            {
                "name": f"Client {client_id + 1}",
                "samples": int(len(indices)),
                "classes": labels,
                "values": values.tolist(),
            }
        )
    return rows


def residual_rows(y_true: np.ndarray, y_pred: np.ndarray) -> list[list[Any]]:
    residuals = np.abs(y_true - y_pred)
    q1, q2 = np.quantile(residuals, [0.33, 0.66])
    return [
        ["Small residual", int(np.sum(residuals <= q1))],
        ["Medium residual", int(np.sum((residuals > q1) & (residuals <= q2)))],
        ["Large residual", int(np.sum(residuals > q2))],
    ]


def estimate_communication(model_id: str, clients: int, rounds: int, fraction: float, dropout: float) -> float:
    sizes = {
        "linear": 0.2,
        "logistic": 0.5,
        "svm": 1.2,
        "svr": 1.2,
        "rf_clf": 8.0,
        "rf_reg": 8.0,
        "xgb_clf": 5.5,
        "xgb_reg": 5.5,
        "mlp_clf": 3.0,
        "mlp_reg": 3.0,
        "cnn_proxy": 7.0,
        "vit_proxy": 12.0,
    }
    active_clients = max(1, int(round(clients * fraction * (1.0 - dropout))))
    return float(sizes.get(model_id, 3.0) * active_clients * rounds * 2.0)


def _metadata(dataset: DatasetBundle) -> dict[str, Any]:
    return {
        "id": dataset.dataset_id,
        "name": dataset.name,
        "task": dataset.task,
        "target": dataset.target,
        "samples": int(dataset.X.shape[0]),
        "features": dataset.feature_names,
        "classes": dataset.class_names,
        "summary": dataset.summary,
    }


def _coerce_matrix(values: list[list[Any]]) -> np.ndarray:
    columns = list(zip(*values))
    encoded_columns = []
    for column in columns:
        numeric_values = []
        is_numeric = True
        for value in column:
            try:
                numeric_values.append(float(value))
            except (TypeError, ValueError):
                is_numeric = False
                break
        if is_numeric:
            encoded_columns.append(numeric_values)
        else:
            labels = {label: index for index, label in enumerate(sorted({str(value) for value in column}))}
            encoded_columns.append([float(labels[str(value)]) for value in column])
    return np.asarray(encoded_columns, dtype=float).T
