const palette = ["#38bdf8", "#34d399", "#fbbf24", "#fb7185", "#a78bfa", "#fb923c"];

const datasets = [
  {
    id: "mnist",
    name: "MNIST handwritten digits",
    task: "image-classification",
    target: "digit",
    samples: 70000,
    classes: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
    features: ["pixel_0_0", "pixel_0_1", "pixel_0_2", "pixel_0_3", "pixel_0_4", "pixel_0_5", "pixel_0_6", "pixel_0_7"],
    summary: "Classic image classification benchmark. CNN and ViT become available because the input is image-like."
  },
  {
    id: "fashion",
    name: "Fashion-MNIST apparel",
    task: "image-classification",
    target: "class",
    samples: 70000,
    classes: ["T-shirt", "Trouser", "Pullover", "Dress", "Coat", "Sandal", "Shirt", "Sneaker", "Bag", "Boot"],
    features: ["pixel_0_0", "pixel_0_1", "pixel_0_2", "pixel_0_3", "pixel_0_4", "pixel_0_5", "pixel_0_6", "pixel_0_7"],
    summary: "Image classification with harder visual similarity than MNIST. Useful for non-IID label skew demonstrations."
  },
  {
    id: "cifar",
    name: "CIFAR-10 objects",
    task: "image-classification",
    target: "object",
    samples: 60000,
    classes: ["airplane", "car", "bird", "cat", "deer", "dog", "frog", "horse", "ship", "truck"],
    features: ["red_channel", "green_channel", "blue_channel", "edge_texture", "color_histogram", "shape_descriptor"],
    summary: "Small natural-image dataset. It is harder than MNIST, so robust aggregation and model choice matter more."
  },
  {
    id: "heart",
    name: "Heart disease tabular",
    task: "classification",
    target: "disease",
    samples: 303,
    classes: ["no disease", "disease"],
    features: ["age", "sex", "chest_pain", "blood_pressure", "cholesterol", "fasting_glucose", "ecg", "max_heart_rate", "angina"],
    summary: "Binary medical classification. A good example for hospitals collaborating without sharing patient records."
  },
  {
    id: "breast",
    name: "Breast cancer diagnosis",
    task: "classification",
    target: "diagnosis",
    samples: 569,
    classes: ["benign", "malignant"],
    features: ["radius", "texture", "perimeter", "area", "smoothness", "compactness", "concavity", "symmetry"],
    summary: "Medical tabular classification where balanced accuracy and confusion matrix are more meaningful than accuracy alone."
  },
  {
    id: "adult",
    name: "Adult income",
    task: "classification",
    target: "income",
    samples: 48842,
    classes: ["<=50K", ">50K"],
    features: ["age", "workclass", "education", "occupation", "hours_per_week", "capital_gain", "capital_loss", "country"],
    summary: "Socio-economic tabular classification with fairness concerns and strong client-distribution effects."
  },
  {
    id: "housing",
    name: "California housing",
    task: "regression",
    target: "median_house_value",
    samples: 20640,
    classes: [],
    features: ["income", "house_age", "rooms", "bedrooms", "population", "occupancy", "latitude", "longitude"],
    summary: "Regression problem. The simulator reports RMSE and loss rather than balanced accuracy."
  },
  {
    id: "energy",
    name: "Energy efficiency",
    task: "regression",
    target: "heating_load",
    samples: 768,
    classes: [],
    features: ["relative_compactness", "surface_area", "wall_area", "roof_area", "height", "orientation", "glazing_area"],
    summary: "Small regression dataset. It shows how too many clients can hurt stability when each client owns little data."
  },
  {
    id: "airquality",
    name: "Air quality sensor series",
    task: "time-series-regression",
    target: "next_pm25",
    samples: 9358,
    classes: [],
    features: ["pm25", "pm10", "temperature", "humidity", "pressure", "wind_speed", "hour", "day"],
    summary: "Edge sensor forecasting dataset. RNN and Transformer models become available because sequence structure matters."
  },
  {
    id: "har",
    name: "Human activity recognition",
    task: "time-series-classification",
    target: "activity",
    samples: 10299,
    classes: ["walking", "upstairs", "downstairs", "sitting", "standing", "laying"],
    features: ["acc_x", "acc_y", "acc_z", "gyro_x", "gyro_y", "gyro_z", "body_acc_mag", "angle"],
    summary: "Wearable sensor classification. Useful for edge FL with phones or watches as clients."
  },
  {
    id: "custom",
    name: "Custom dataset",
    task: "classification",
    target: "target",
    samples: 1000,
    classes: ["class A", "class B"],
    features: ["feature_1", "feature_2", "feature_3", "feature_4"],
    summary: "Define columns, choose target, and control which independent variables are used."
  }
];

const models = [
  { id: "logistic", name: "Logistic regression", tasks: ["classification"], complexity: 0.35, base: 0.72 },
  { id: "svm", name: "Support vector machine", tasks: ["classification"], complexity: 0.45, base: 0.76 },
  { id: "rf_clf", name: "Random forest classifier", tasks: ["classification", "image-classification", "time-series-classification"], complexity: 0.55, base: 0.81 },
  { id: "xgb_clf", name: "XGBoost classifier", tasks: ["classification", "time-series-classification"], complexity: 0.62, base: 0.84 },
  { id: "mlp_clf", name: "MLP classifier", tasks: ["classification", "image-classification", "time-series-classification"], complexity: 0.7, base: 0.82 },
  { id: "cnn", name: "CNN", tasks: ["image-classification"], complexity: 0.9, base: 0.9 },
  { id: "vit", name: "Vision Transformer", tasks: ["image-classification"], complexity: 1.1, base: 0.91 },
  { id: "rnn_clf", name: "RNN classifier", tasks: ["time-series-classification"], complexity: 0.82, base: 0.85 },
  { id: "ts_transformer_clf", name: "Time-series Transformer", tasks: ["time-series-classification"], complexity: 1.05, base: 0.88 },
  { id: "linear", name: "Linear regression", tasks: ["regression", "time-series-regression"], complexity: 0.32, base: 0.68 },
  { id: "rf_reg", name: "Random forest regressor", tasks: ["regression", "time-series-regression"], complexity: 0.55, base: 0.8 },
  { id: "xgb_reg", name: "XGBoost regressor", tasks: ["regression", "time-series-regression"], complexity: 0.64, base: 0.84 },
  { id: "mlp_reg", name: "MLP regressor", tasks: ["regression", "time-series-regression"], complexity: 0.74, base: 0.82 },
  { id: "rnn_reg", name: "RNN regressor", tasks: ["time-series-regression"], complexity: 0.85, base: 0.85 },
  { id: "ts_transformer_reg", name: "Time-series Transformer regressor", tasks: ["time-series-regression"], complexity: 1.05, base: 0.88 }
];

const scenarios = [
  {
    id: "workflow",
    name: "Basic FL workflow",
    text: "Server sends a global model, clients train locally, updates return to the server, and aggregation creates a new global model. Raw data never leaves clients.",
    controls: []
  },
  {
    id: "clients",
    name: "Number of clients",
    text: "More clients can improve diversity, but it also increases communication and may slow rounds when devices are unreliable.",
    controls: [{ id: "clientPreset", label: "Client preset", type: "select", options: ["2", "5", "10", "20", "50"], value: "5" }]
  },
  {
    id: "noniid",
    name: "IID vs non-IID data",
    text: "IID clients have similar distributions. Non-IID clients have label skew, quantity skew, or both, often causing unstable updates.",
    controls: [{ id: "skewLevel", label: "Data distribution", type: "select", options: ["IID", "Mild non-IID", "Strong non-IID", "Label-skew non-IID", "Quantity-skew non-IID"], value: "Mild non-IID" }]
  },
  {
    id: "aggregation",
    name: "Aggregation methods",
    text: "FedAvg is simple. FedProx helps with heterogeneity. Median and trimmed mean reduce abnormal or malicious update influence.",
    controls: [{ id: "aggregation", label: "Aggregation", type: "select", options: ["FedAvg", "Weighted FedAvg", "FedProx", "FedMedian", "FedTrimmedMean"], value: "FedAvg" }]
  },
  {
    id: "communication",
    name: "Communication cost",
    text: "Communication grows with model size, clients, rounds, and bidirectional transfer. Compression reduces bytes but may slightly hurt quality.",
    controls: [
      { id: "modelSize", label: "Model size MB", type: "number", min: 1, max: 250, step: 1, value: 18 },
      { id: "compression", label: "Compression", type: "select", options: ["off", "on"], value: "off" },
      { id: "bandwidth", label: "Bandwidth Mbps", type: "number", min: 1, max: 1000, step: 1, value: 25 }
    ]
  },
  {
    id: "dropout",
    name: "Client dropout",
    text: "Real edge devices can be offline, slow, or low battery. Dropout makes aggregation less representative.",
    controls: [
      { id: "dropoutRate", label: "Dropout rate", type: "select", options: ["0", "10", "30", "50"], value: "10" },
      { id: "slowClients", label: "Slow clients", type: "select", options: ["no", "yes"], value: "no" }
    ]
  },
  {
    id: "personalized",
    name: "Personalized FL",
    text: "A single global model may not fit all clients. Personalization can share a backbone while adapting client-specific heads.",
    controls: [{ id: "personalization", label: "Mode", type: "select", options: ["Global FL", "Shared backbone + local heads", "Local fine-tuning"], value: "Global FL" }]
  },
  {
    id: "privacy",
    name: "Privacy and security",
    text: "Federated learning keeps raw data local, but updates may still leak information. Secure aggregation and differential privacy reduce risk.",
    controls: [
      { id: "secureAggregation", label: "Secure aggregation", type: "select", options: ["off", "on"], value: "off" },
      { id: "dpNoise", label: "DP noise", type: "select", options: ["none", "low", "medium", "high"], value: "none" },
      { id: "maliciousClient", label: "Malicious client", type: "select", options: ["no", "yes"], value: "no" }
    ]
  },
  {
    id: "challenge",
    name: "Edge FL challenge",
    text: "Tune the system to reach strong quality while keeping communication, energy, fairness, and stability under control.",
    controls: [
      { id: "challengeGoal", label: "Goal metric", type: "number", min: 0.5, max: 0.98, step: 0.01, value: 0.85 },
      { id: "batteryBudget", label: "Battery budget", type: "number", min: 10, max: 100, step: 5, value: 65 }
    ]
  }
];

let activeScenario = "workflow";
let scenarioState = {};
let simulation = null;
let animationTick = 0;
let backendRequestId = 0;

const backendDatasetMap = {
  mnist: "digits",
  fashion: "digits",
  cifar: "digits",
  heart: "heart_synthetic",
  breast: "breast_cancer",
  adult: "breast_cancer",
  housing: "diabetes",
  energy: "energy_synthetic",
  airquality: "energy_synthetic",
  har: "sensor_activity"
};

const backendModelMap = {
  cnn: "cnn_proxy",
  vit: "vit_proxy",
  xgb_clf: "xgb_clf",
  xgb_reg: "xgb_reg",
  rnn_clf: "mlp_clf",
  ts_transformer_clf: "mlp_clf",
  rnn_reg: "mlp_reg",
  ts_transformer_reg: "mlp_reg"
};

const els = {
  datasetSelect: document.getElementById("datasetSelect"),
  customDatasetPanel: document.getElementById("customDatasetPanel"),
  customName: document.getElementById("customName"),
  customTask: document.getElementById("customTask"),
  customColumns: document.getElementById("customColumns"),
  targetSelect: document.getElementById("targetSelect"),
  featureList: document.getElementById("featureList"),
  selectAllFeatures: document.getElementById("selectAllFeatures"),
  modelSelect: document.getElementById("modelSelect"),
  clientCount: document.getElementById("clientCount"),
  roundCount: document.getElementById("roundCount"),
  localEpochs: document.getElementById("localEpochs"),
  clientFraction: document.getElementById("clientFraction"),
  runButton: document.getElementById("runButton"),
  themeToggle: document.getElementById("themeToggle"),
  datasetTitle: document.getElementById("datasetTitle"),
  datasetSummary: document.getElementById("datasetSummary"),
  taskBadge: document.getElementById("taskBadge"),
  privacyBadge: document.getElementById("privacyBadge"),
  roundLabel: document.getElementById("roundLabel"),
  phaseLabel: document.getElementById("phaseLabel"),
  primaryMetricLabel: document.getElementById("primaryMetricLabel"),
  primaryMetric: document.getElementById("primaryMetric"),
  lossMetricLabel: document.getElementById("lossMetricLabel"),
  lossMetric: document.getElementById("lossMetric"),
  commMetric: document.getElementById("commMetric"),
  stabilityMetric: document.getElementById("stabilityMetric"),
  scenarioTabs: document.getElementById("scenarioTabs"),
  scenarioTitle: document.getElementById("scenarioTitle"),
  scenarioText: document.getElementById("scenarioText"),
  scenarioControls: document.getElementById("scenarioControls"),
  metricChart: document.getElementById("metricChart"),
  networkCanvas: document.getElementById("networkCanvas"),
  clientDistributions: document.getElementById("clientDistributions"),
  evaluationTable: document.getElementById("evaluationTable"),
  matrixTitle: document.getElementById("matrixTitle"),
  matrixBox: document.getElementById("matrixBox")
};

function init() {
  datasets.forEach((dataset) => {
    const option = document.createElement("option");
    option.value = dataset.id;
    option.textContent = dataset.name;
    els.datasetSelect.appendChild(option);
  });

  scenarios.forEach((scenario) => {
    const button = document.createElement("button");
    button.className = "tab-button";
    button.type = "button";
    button.textContent = scenario.name;
    button.addEventListener("click", () => {
      activeScenario = scenario.id;
      renderScenario();
      runSimulation();
    });
    els.scenarioTabs.appendChild(button);
  });

  els.datasetSelect.addEventListener("change", handleDatasetChange);
  els.customName.addEventListener("input", handleDatasetChange);
  els.customTask.addEventListener("change", handleDatasetChange);
  els.customColumns.addEventListener("input", handleDatasetChange);
  els.targetSelect.addEventListener("change", () => {
    renderFeatures();
    renderModels();
    runSimulation();
  });
  els.selectAllFeatures.addEventListener("click", () => {
    document.querySelectorAll("#featureList input").forEach((box) => {
      box.checked = true;
    });
    runSimulation();
  });
  [els.modelSelect, els.clientCount, els.roundCount, els.localEpochs, els.clientFraction].forEach((el) => {
    el.addEventListener("change", runSimulation);
  });
  els.runButton.addEventListener("click", runSimulation);
  els.themeToggle.addEventListener("click", () => document.body.classList.toggle("dark"));

  handleDatasetChange();
  renderScenario();
  runSimulation();
  requestAnimationFrame(animate);
}

function getDataset() {
  const selected = datasets.find((dataset) => dataset.id === els.datasetSelect.value) || datasets[0];
  if (selected.id !== "custom") return selected;

  const columns = els.customColumns.value.split(",").map((column) => column.trim()).filter(Boolean);
  const target = columns[columns.length - 1] || "target";
  const features = columns.filter((column) => column !== target);
  const task = els.customTask.value;
  return {
    ...selected,
    name: els.customName.value || "Custom dataset",
    task,
    target,
    features: features.length ? features : ["feature_1", "feature_2"],
    classes: task.includes("regression") ? [] : ["class A", "class B", "class C"],
    summary: "Custom dataset profile. Upload parsing is represented by manual schema selection in this static prototype."
  };
}

function handleDatasetChange() {
  els.customDatasetPanel.classList.toggle("hidden", els.datasetSelect.value !== "custom");
  const dataset = getDataset();
  const candidates = [...dataset.features, dataset.target];
  els.targetSelect.innerHTML = "";
  candidates.forEach((column) => {
    const option = document.createElement("option");
    option.value = column;
    option.textContent = column;
    option.selected = column === dataset.target;
    els.targetSelect.appendChild(option);
  });
  renderFeatures();
  renderModels();
  runSimulation();
}

function renderFeatures() {
  const dataset = getDataset();
  const target = els.targetSelect.value || dataset.target;
  const features = [...dataset.features, dataset.target].filter((feature) => feature !== target);
  els.featureList.innerHTML = "";
  features.forEach((feature) => {
    const label = document.createElement("label");
    const input = document.createElement("input");
    input.type = "checkbox";
    input.value = feature;
    input.checked = true;
    input.addEventListener("change", runSimulation);
    label.append(input, document.createTextNode(feature));
    els.featureList.appendChild(label);
  });
}

function renderModels() {
  const dataset = getDataset();
  const task = normalizeTask(dataset.task);
  const available = models.filter((model) => model.tasks.includes(task) || model.tasks.includes(dataset.task));
  const previous = els.modelSelect.value;
  els.modelSelect.innerHTML = "";
  available.forEach((model) => {
    const option = document.createElement("option");
    option.value = model.id;
    option.textContent = model.name;
    els.modelSelect.appendChild(option);
  });
  if (available.some((model) => model.id === previous)) els.modelSelect.value = previous;
}

function normalizeTask(task) {
  if (task === "time-series-regression") return "time-series-regression";
  if (task === "time-series-classification") return "time-series-classification";
  if (task === "image-classification") return "image-classification";
  return task;
}

function renderScenario() {
  const scenario = scenarios.find((item) => item.id === activeScenario);
  document.querySelectorAll(".tab-button").forEach((button, index) => {
    button.classList.toggle("active", scenarios[index].id === activeScenario);
  });
  els.scenarioTitle.textContent = scenario.name;
  els.scenarioText.textContent = scenario.text;
  els.scenarioControls.innerHTML = "";

  scenario.controls.forEach((control) => {
    if (scenarioState[control.id] === undefined) scenarioState[control.id] = control.value;
    const label = document.createElement("label");
    label.textContent = control.label;
    const input = document.createElement(control.type === "select" ? "select" : "input");
    if (control.type === "select") {
      control.options.forEach((value) => {
        const option = document.createElement("option");
        option.value = value;
        option.textContent = value;
        input.appendChild(option);
      });
    } else {
      input.type = control.type;
      input.min = control.min;
      input.max = control.max;
      input.step = control.step;
    }
    input.value = scenarioState[control.id];
    input.addEventListener("change", () => {
      scenarioState[control.id] = input.value;
      applyScenarioShortcuts(control.id, input.value);
      runSimulation();
    });
    label.appendChild(input);
    els.scenarioControls.appendChild(label);
  });
}

function applyScenarioShortcuts(id, value) {
  if (id === "clientPreset") els.clientCount.value = value;
}

function getSelectedFeatures() {
  return [...document.querySelectorAll("#featureList input:checked")].map((box) => box.value);
}

function runSimulation() {
  const dataset = getDataset();
  const model = models.find((item) => item.id === els.modelSelect.value) || models[0];
  const features = getSelectedFeatures();
  const settings = collectSettings(dataset, model, features);
  simulation = simulate(settings);
  renderSimulation(settings, simulation);
  fetchBackendSimulation(settings, ++backendRequestId);
}

async function fetchBackendSimulation(settings, requestId) {
  if (settings.dataset.id === "custom") return;
  const payload = {
    dataset_id: backendDatasetMap[settings.dataset.id] || settings.dataset.id,
    model_id: backendModelMap[settings.model.id] || settings.model.id,
    features: settings.features,
    clients: settings.clients,
    rounds: Math.min(settings.rounds, 25),
    local_epochs: settings.localEpochs,
    client_fraction: settings.clientFraction,
    skew: settings.skew,
    dropout: settings.dropout,
    aggregation: settings.aggregation
  };
  try {
    els.runButton.textContent = "Training real backend...";
    const response = await fetch("/api/simulate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!response.ok) throw new Error(`Backend returned ${response.status}`);
    const backendResult = await response.json();
    if (requestId !== backendRequestId) return;
    const backendDataset = backendResult.dataset || settings.dataset;
    const backendSettings = {
      ...settings,
      dataset: {
        ...settings.dataset,
        name: backendDataset.name || settings.dataset.name,
        task: backendDataset.task || settings.dataset.task,
        target: backendDataset.target || settings.dataset.target,
        samples: backendDataset.samples || settings.dataset.samples,
        features: backendDataset.features || settings.dataset.features,
        classes: backendDataset.classes || settings.dataset.classes,
        summary: backendDataset.summary || settings.dataset.summary
      }
    };
    simulation = backendResult;
    renderSimulation(backendSettings, backendResult);
    els.privacyBadge.textContent = "Real backend metrics";
  } catch (error) {
    if (requestId === backendRequestId) {
      els.privacyBadge.textContent = "Static fallback";
    }
  } finally {
    if (requestId === backendRequestId) els.runButton.textContent = "Run simulation";
  }
}

function collectSettings(dataset, model, features) {
  const clients = clamp(Number(els.clientCount.value), 2, 50);
  const rounds = clamp(Number(els.roundCount.value), 3, 100);
  const localEpochs = clamp(Number(els.localEpochs.value), 1, 10);
  const clientFraction = clamp(Number(els.clientFraction.value), 0.1, 1);
  const skew = scenarioState.skewLevel || (activeScenario === "noniid" ? "Mild non-IID" : "IID");
  const dropout = Number(scenarioState.dropoutRate || 0) / 100;
  const aggregation = scenarioState.aggregation || "FedAvg";
  const compression = scenarioState.compression || "off";
  const modelSize = Number(scenarioState.modelSize || estimateModelSize(model, dataset));
  const dpNoise = scenarioState.dpNoise || "none";
  const malicious = scenarioState.maliciousClient === "yes";
  const personalized = scenarioState.personalization || "Global FL";
  return { dataset, model, features, clients, rounds, localEpochs, clientFraction, skew, dropout, aggregation, compression, modelSize, dpNoise, malicious, personalized };
}

function simulate(settings) {
  const classification = !settings.dataset.task.includes("regression");
  const featureRatio = settings.features.length / Math.max(1, settings.dataset.features.length);
  const skewPenalty = getSkewPenalty(settings.skew);
  const dropoutPenalty = settings.dropout * 0.18;
  const aggregationBoost = getAggregationBoost(settings);
  const privacyPenalty = getPrivacyPenalty(settings.dpNoise);
  const clientEffect = Math.min(0.08, Math.log2(settings.clients) * 0.018) - Math.max(0, settings.clients - 20) * 0.003;
  const epochEffect = Math.min(0.07, settings.localEpochs * 0.018) - Math.max(0, settings.localEpochs - 5) * 0.012;
  const dataSizeEffect = Math.min(0.07, Math.log10(settings.dataset.samples) * 0.018);
  const modelBase = settings.model.base + dataSizeEffect;
  const personalizationBoost = settings.personalized === "Global FL" ? 0 : 0.045;
  const compressionPenalty = settings.compression === "on" ? 0.025 : 0;
  const maliciousPenalty = settings.malicious && !["FedMedian", "FedTrimmedMean"].includes(settings.aggregation) ? 0.1 : settings.malicious ? 0.025 : 0;
  const targetQuality = clamp(modelBase + clientEffect + epochEffect + aggregationBoost + personalizationBoost - skewPenalty - dropoutPenalty - privacyPenalty - compressionPenalty - maliciousPenalty, 0.45, 0.97);
  const start = classification ? 0.24 + Math.min(0.12, settings.dataset.classes.length * 0.01) : 1.35;
  const curve = [];
  const loss = [];
  const instability = skewPenalty + settings.dropout * 0.22 + (settings.malicious ? 0.08 : 0);

  for (let round = 0; round <= settings.rounds; round += 1) {
    const progress = 1 - Math.exp(-round / (settings.rounds * 0.34));
    const wave = Math.sin(round * 1.7 + settings.clients) * instability * 0.08;
    if (classification) {
      const value = clamp(start + (targetQuality - start) * progress + wave, 0.05, 0.99);
      curve.push(value);
      loss.push(clamp(1.65 - value * 1.38 + (1 - progress) * 0.28 + instability * 0.3, 0.04, 2.2));
    } else {
      const finalRmse = clamp(1.4 - targetQuality, 0.18, 0.95);
      const value = clamp(start - (start - finalRmse) * progress + Math.abs(wave), 0.12, 1.8);
      curve.push(value);
      loss.push(clamp(value * value + instability * 0.08, 0.02, 3));
    }
  }

  const communication = estimateCommunication(settings);
  const stability = clamp(1 - instability - settings.clients * 0.002 + aggregationBoost, 0.1, 0.98);
  const distributions = buildDistributions(settings);
  return { classification, curve, loss, communication, stability, distributions, finalMetric: curve[curve.length - 1], finalLoss: loss[loss.length - 1] };
}

function getSkewPenalty(skew) {
  return {
    "IID": 0.01,
    "Mild non-IID": 0.06,
    "Strong non-IID": 0.14,
    "Label-skew non-IID": 0.12,
    "Quantity-skew non-IID": 0.09
  }[skew] || 0.02;
}

function getAggregationBoost(settings) {
  const nonIid = getSkewPenalty(settings.skew);
  const table = {
    "FedAvg": 0,
    "Weighted FedAvg": 0.025,
    "FedProx": nonIid > 0.05 ? 0.055 : 0.012,
    "FedMedian": settings.malicious ? 0.07 : 0.018,
    "FedTrimmedMean": settings.malicious ? 0.08 : 0.02
  };
  return table[settings.aggregation] || 0;
}

function getPrivacyPenalty(level) {
  return { none: 0, low: 0.012, medium: 0.04, high: 0.085 }[level] || 0;
}

function estimateModelSize(model, dataset) {
  if (model.id.includes("vit")) return 85;
  if (model.id.includes("transformer")) return 62;
  if (model.id.includes("cnn")) return 18;
  if (model.id.includes("mlp")) return 9;
  if (dataset.task.includes("image")) return 12;
  return 4;
}

function estimateCommunication(settings) {
  const activeClients = Math.max(1, Math.round(settings.clients * settings.clientFraction * (1 - settings.dropout)));
  const compression = settings.compression === "on" ? 0.35 : 1;
  return settings.modelSize * activeClients * settings.rounds * 2 * compression;
}

function buildDistributions(settings) {
  const count = Math.min(settings.clients, 12);
  const classes = settings.dataset.classes.length ? settings.dataset.classes : ["low", "medium", "high"];
  const rows = [];
  for (let i = 0; i < count; i += 1) {
    let weights = classes.map(() => 1);
    if (settings.skew.includes("Label") || settings.skew.includes("Strong")) {
      weights = weights.map((_, index) => index === i % classes.length ? 7 : 0.8);
    } else if (settings.skew.includes("Mild")) {
      weights = weights.map((_, index) => index === i % classes.length ? 3 : 1.2);
    }
    if (settings.skew.includes("Quantity")) {
      weights = weights.map((value) => value * (0.45 + ((i % 5) + 1) / 5));
    }
    const sum = weights.reduce((a, b) => a + b, 0);
    rows.push({ name: `Client ${i + 1}`, samples: Math.round(settings.dataset.samples / settings.clients * (0.55 + (i % 4) * 0.22)), values: weights.map((value) => value / sum), classes });
  }
  return rows;
}

function renderSimulation(settings, result) {
  els.datasetTitle.textContent = settings.dataset.name;
  els.datasetSummary.textContent = settings.dataset.summary;
  els.taskBadge.textContent = settings.dataset.task.replaceAll("-", " ");
  els.primaryMetricLabel.textContent = result.classification ? "Balanced accuracy" : "RMSE";
  els.lossMetricLabel.textContent = result.classification ? "Cross entropy" : "MSE loss";
  els.primaryMetric.textContent = result.classification ? result.finalMetric.toFixed(3) : result.finalMetric.toFixed(3);
  els.lossMetric.textContent = result.finalLoss.toFixed(3);
  els.commMetric.textContent = formatMb(result.communication);
  els.stabilityMetric.textContent = result.stability.toFixed(2);
  renderChart(result);
  renderDistributions(result.distributions);
  renderEvaluation(settings, result);
  renderMatrix(settings, result);
}

function renderChart(result) {
  const canvas = els.metricChart;
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = getCss("--surface-2");
  ctx.fillRect(0, 0, width, height);
  drawGrid(ctx, width, height);
  drawLine(ctx, result.curve, result.classification ? "#0e9f6e" : "#38bdf8", result.classification ? 0 : Math.max(...result.curve), result.classification ? 1 : 0);
  drawLine(ctx, result.loss, "#fb7185", 0, Math.max(...result.loss, 1));
  ctx.fillStyle = getCss("--text");
  ctx.font = "700 15px system-ui";
  ctx.fillText(result.classification ? "Balanced accuracy (green) and cross entropy (red)" : "RMSE (blue) and MSE loss (red)", 18, 26);
}

function drawGrid(ctx, width, height) {
  ctx.strokeStyle = getCss("--line");
  ctx.lineWidth = 1;
  for (let i = 1; i < 5; i += 1) {
    const y = (height / 5) * i;
    ctx.beginPath();
    ctx.moveTo(42, y);
    ctx.lineTo(width - 18, y);
    ctx.stroke();
  }
}

function drawLine(ctx, values, color, minValue, maxValue) {
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;
  const left = 42;
  const right = width - 18;
  const top = 42;
  const bottom = height - 24;
  const range = Math.max(0.001, maxValue - minValue);
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.beginPath();
  values.forEach((value, index) => {
    const x = left + (right - left) * (index / Math.max(1, values.length - 1));
    const y = bottom - (bottom - top) * ((value - minValue) / range);
    if (index === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();
}

function renderDistributions(distributions) {
  els.clientDistributions.innerHTML = "";
  distributions.forEach((row) => {
    const box = document.createElement("div");
    box.className = "dist-row";
    const top = document.createElement("div");
    top.className = "dist-top";
    top.innerHTML = `<span>${row.name}</span><span>${row.samples} samples</span>`;
    const bars = document.createElement("div");
    bars.className = "bars";
    row.values.forEach((value, index) => {
      const bar = document.createElement("span");
      bar.style.width = `${value * 100}%`;
      bar.style.background = palette[index % palette.length];
      bar.title = `${row.classes[index]} ${(value * 100).toFixed(1)}%`;
      bars.appendChild(bar);
    });
    box.append(top, bars);
    els.clientDistributions.appendChild(box);
  });
}

function renderEvaluation(settings, result) {
  if (result.evaluationRows) {
    const rows = [
      ...result.evaluationRows,
      ["Communication", formatMb(result.communication), "Approximate communication volume for selected clients and rounds."],
      ["Aggregation", settings.aggregation, result.method || "Server-side rule for combining client updates."],
      ["Privacy note", "Raw data local", "Clients train on local partitions; the server receives model outputs/updates, not raw rows."]
    ];
    els.evaluationTable.innerHTML = `<table><thead><tr><th>Metric</th><th>Value</th><th>Meaning</th></tr></thead><tbody>${rows.map((row) => `<tr><td>${row[0]}</td><td>${row[1]}</td><td>${row[2]}</td></tr>`).join("")}</tbody></table>`;
    return;
  }
  const rows = [];
  if (result.classification) {
    rows.push(["Balanced accuracy", result.finalMetric.toFixed(3), "Mean recall across classes; better than plain accuracy for imbalanced clients."]);
    rows.push(["Cross entropy", result.finalLoss.toFixed(3), "Lower is better; penalizes confident wrong predictions."]);
    rows.push(["Macro F1", clamp(result.finalMetric - 0.025, 0, 1).toFixed(3), "Balances precision and recall per class."]);
  } else {
    rows.push(["RMSE", result.finalMetric.toFixed(3), "Prediction error in target units; lower is better."]);
    rows.push(["MSE loss", result.finalLoss.toFixed(3), "Squared training loss; lower is better."]);
    rows.push(["R2 estimate", clamp(1 - result.finalMetric / 1.45, 0, 1).toFixed(3), "Explained variance proxy for this simulator."]);
  }
  rows.push(["Communication", formatMb(result.communication), "Approx. model size x participating clients x rounds x 2."]);
  rows.push(["Aggregation", settings.aggregation, "Server-side rule for combining client updates."]);
  rows.push(["Privacy note", "Raw data local", "Updates can still leak information without privacy defenses."]);

  els.evaluationTable.innerHTML = `<table><thead><tr><th>Metric</th><th>Value</th><th>Meaning</th></tr></thead><tbody>${rows.map((row) => `<tr><td>${row[0]}</td><td>${row[1]}</td><td>${row[2]}</td></tr>`).join("")}</tbody></table>`;
}

function renderMatrix(settings, result) {
  if (result.confusionMatrix) {
    els.matrixTitle.textContent = "Confusion matrix";
    const matrix = result.confusionMatrix;
    const n = matrix.length;
    const maxValue = Math.max(...matrix.flat(), 1);
    const grid = document.createElement("div");
    grid.className = "matrix-grid";
    grid.style.gridTemplateColumns = `repeat(${n}, minmax(44px, 1fr))`;
    for (let row = 0; row < n; row += 1) {
      for (let col = 0; col < n; col += 1) {
        const value = matrix[row][col];
        const cell = document.createElement("div");
        cell.className = "matrix-cell";
        cell.style.background = row === col ? "#0e9f6e" : "#c2410c";
        cell.style.opacity = String(clamp(value / maxValue, 0.32, 1));
        cell.textContent = value;
        cell.title = `${result.classNames?.[row] || row} predicted as ${result.classNames?.[col] || col}`;
        grid.appendChild(cell);
      }
    }
    els.matrixBox.innerHTML = "";
    els.matrixBox.appendChild(grid);
    return;
  }
  if (result.residualRows) {
    els.matrixTitle.textContent = "Residual view";
    els.matrixBox.innerHTML = `<table><tbody>${result.residualRows.map((row) => `<tr><td>${row[0]}</td><td>${row[1]}</td></tr>`).join("")}</tbody></table>`;
    return;
  }
  if (!result.classification) {
    els.matrixTitle.textContent = "Residual view";
    const low = Math.round((1 - result.finalMetric) * 120);
    const med = Math.round(result.finalMetric * 70);
    const high = Math.round(result.finalMetric * 25);
    els.matrixBox.innerHTML = `<table><tbody><tr><td>Small residual</td><td>${low}</td></tr><tr><td>Medium residual</td><td>${med}</td></tr><tr><td>Large residual</td><td>${high}</td></tr></tbody></table>`;
    return;
  }
  els.matrixTitle.textContent = "Confusion matrix";
  const classes = settings.dataset.classes.slice(0, Math.min(4, settings.dataset.classes.length));
  const n = classes.length || 2;
  const accuracy = result.finalMetric;
  const grid = document.createElement("div");
  grid.className = "matrix-grid";
  grid.style.gridTemplateColumns = `repeat(${n}, minmax(44px, 1fr))`;
  for (let row = 0; row < n; row += 1) {
    for (let col = 0; col < n; col += 1) {
      const value = row === col ? Math.round(55 + accuracy * 120) : Math.round((1 - accuracy) * (18 + ((row + col) % 3) * 7));
      const cell = document.createElement("div");
      cell.className = "matrix-cell";
      cell.style.background = row === col ? "#0e9f6e" : "#c2410c";
      cell.style.opacity = String(clamp(value / 150, 0.35, 1));
      cell.textContent = value;
      cell.title = `${classes[row] || row} predicted as ${classes[col] || col}`;
      grid.appendChild(cell);
    }
  }
  els.matrixBox.innerHTML = "";
  els.matrixBox.appendChild(grid);
}

function animate() {
  animationTick += 0.012;
  drawNetwork();
  requestAnimationFrame(animate);
}

function drawNetwork() {
  const canvas = els.networkCanvas;
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  ctx.clearRect(0, 0, width, height);
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, "#0b1220");
  gradient.addColorStop(1, "#12324a");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  const settings = simulation ? collectSettings(getDataset(), models.find((item) => item.id === els.modelSelect.value) || models[0], getSelectedFeatures()) : null;
  const clients = settings ? Math.min(settings.clients, 18) : 5;
  const center = { x: width / 2, y: height / 2 };
  const radius = Math.min(width, height) * 0.34;
  const phaseIndex = Math.floor(animationTick * 3) % 4;
  const phases = ["Server broadcasts global model", "Clients train on private local data", "Clients send model updates", "Server aggregates updates"];
  els.roundLabel.textContent = `Round ${Math.floor(animationTick) % Math.max(1, Number(els.roundCount.value))}`;
  els.phaseLabel.textContent = phases[phaseIndex];

  for (let i = 0; i < clients; i += 1) {
    const angle = (Math.PI * 2 * i) / clients - Math.PI / 2;
    const client = { x: center.x + Math.cos(angle) * radius, y: center.y + Math.sin(angle) * radius };
    ctx.strokeStyle = "rgba(148, 163, 184, 0.32)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(center.x, center.y);
    ctx.lineTo(client.x, client.y);
    ctx.stroke();

    const direction = phaseIndex < 2 ? 1 : -1;
    const t = (animationTick * 0.9 + i / clients) % 1;
    const px = direction === 1 ? center.x + (client.x - center.x) * t : client.x + (center.x - client.x) * t;
    const py = direction === 1 ? center.y + (client.y - center.y) * t : client.y + (center.y - client.y) * t;
    ctx.fillStyle = phaseIndex < 2 ? "#38bdf8" : "#34d399";
    ctx.beginPath();
    ctx.arc(px, py, 4.5, 0, Math.PI * 2);
    ctx.fill();

    const offline = settings && settings.dropout > 0 && (i % Math.max(2, Math.round(1 / settings.dropout)) === 0);
    ctx.fillStyle = offline ? "#64748b" : palette[i % palette.length];
    roundedRect(ctx, client.x - 23, client.y - 17, 46, 34, 7);
    ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.92)";
    ctx.font = "700 11px system-ui";
    ctx.textAlign = "center";
    ctx.fillText(`C${i + 1}`, client.x, client.y + 4);
  }

  ctx.fillStyle = "#38bdf8";
  ctx.beginPath();
  ctx.arc(center.x, center.y, 48, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#06111d";
  ctx.font = "900 15px system-ui";
  ctx.textAlign = "center";
  ctx.fillText("Server", center.x, center.y - 3);
  ctx.font = "700 11px system-ui";
  ctx.fillText("global model", center.x, center.y + 15);
}

function roundedRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function formatMb(value) {
  if (value >= 1024) return `${(value / 1024).toFixed(2)} GB`;
  return `${value.toFixed(0)} MB`;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function getCss(name) {
  return getComputedStyle(document.body).getPropertyValue(name).trim();
}

init();
