const palette = ["#38bdf8", "#34d399", "#fbbf24", "#fb7185", "#a78bfa", "#fb923c", "#22c55e", "#f97316"];

const datasets = [
  {
    id: "digits",
    backendId: "digits",
    name: "Handwritten digits",
    task: "image-classification",
    target: "digit",
    samples: 1797,
    classes: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
    features: ["image_tensor_8x8"],
    featureMode: "tensor",
    summary: "Real scikit-learn handwritten digit image dataset. Features are treated as an image tensor, not individual pixel checkboxes."
  },
  {
    id: "breast_cancer",
    backendId: "breast_cancer",
    name: "Breast cancer diagnosis",
    task: "classification",
    target: "diagnosis",
    samples: 569,
    classes: ["malignant", "benign"],
    features: ["mean radius", "mean texture", "mean perimeter", "mean area", "mean smoothness", "mean compactness", "mean concavity", "mean symmetry", "worst radius", "worst texture"],
    featureMode: "tabular",
    summary: "Real medical tabular classification dataset. Good for balanced accuracy and confusion-matrix interpretation."
  },
  {
    id: "heart_synthetic",
    backendId: "heart_synthetic",
    name: "Heart disease style clinical data",
    task: "classification",
    target: "disease",
    samples: 1200,
    classes: ["no disease", "disease"],
    features: ["age", "sex", "chest_pain", "blood_pressure", "cholesterol", "fasting_glucose", "ecg", "max_heart_rate", "angina", "oldpeak", "slope", "vessels"],
    featureMode: "tabular",
    summary: "Synthetic clinical dataset shaped like common heart disease tables."
  },
  {
    id: "iris",
    backendId: "iris",
    name: "Iris flower classification",
    task: "classification",
    target: "species",
    samples: 150,
    classes: ["setosa", "versicolor", "virginica"],
    features: ["sepal length", "sepal width", "petal length", "petal width"],
    featureMode: "tabular",
    summary: "Real multiclass tabular dataset."
  },
  {
    id: "wine",
    backendId: "wine",
    name: "Wine cultivar classification",
    task: "classification",
    target: "cultivar",
    samples: 178,
    classes: ["class 0", "class 1", "class 2"],
    features: ["alcohol", "malic_acid", "ash", "alcalinity", "magnesium", "phenols", "flavanoids", "color_intensity", "hue"],
    featureMode: "tabular",
    summary: "Real chemical-analysis multiclass classification dataset."
  },
  {
    id: "diabetes",
    backendId: "diabetes",
    name: "Diabetes progression",
    task: "regression",
    target: "disease_progression",
    samples: 442,
    classes: [],
    features: ["age", "sex", "bmi", "blood_pressure", "s1", "s2", "s3", "s4", "s5", "s6"],
    featureMode: "tabular",
    summary: "Real regression dataset for predicting diabetes disease progression."
  },
  {
    id: "sensor_activity",
    backendId: "sensor_activity",
    name: "Wearable sensor activity",
    task: "time-series-classification",
    target: "activity",
    samples: 2400,
    classes: ["walking", "upstairs", "downstairs", "sitting", "standing", "laying"],
    features: ["sensor_window"],
    featureMode: "tensor",
    summary: "Synthetic wearable-window dataset. Features are treated as time-window tensors."
  },
  {
    id: "energy_synthetic",
    backendId: "energy_synthetic",
    name: "Energy efficiency style regression",
    task: "regression",
    target: "heating_load",
    samples: 1500,
    classes: [],
    features: ["relative_compactness", "surface_area", "wall_area", "roof_area", "height", "orientation", "glazing_area", "glazing_distribution"],
    featureMode: "tabular",
    summary: "Synthetic building-energy regression dataset."
  }
];

const modelCatalog = [
  { id: "logistic", name: "Logistic regression", tasks: ["classification"], deep: false },
  { id: "svm", name: "Support vector machine", tasks: ["classification"], deep: false },
  { id: "rf_clf", name: "Random forest classifier", tasks: ["classification", "image-classification", "time-series-classification"], deep: false },
  { id: "xgb_clf", name: "Histogram gradient boosting classifier", tasks: ["classification", "time-series-classification"], deep: false },
  { id: "mlp_clf", name: "MLP classifier", tasks: ["classification", "image-classification", "time-series-classification"], deep: true },
  { id: "cnn_proxy", name: "CNN-style image model", tasks: ["image-classification"], deep: true },
  { id: "vit_proxy", name: "ViT-style image model", tasks: ["image-classification"], deep: true },
  { id: "linear", name: "Linear regression", tasks: ["regression"], deep: false },
  { id: "svr", name: "Support vector regressor", tasks: ["regression"], deep: false },
  { id: "rf_reg", name: "Random forest regressor", tasks: ["regression"], deep: false },
  { id: "xgb_reg", name: "Histogram gradient boosting regressor", tasks: ["regression"], deep: false },
  { id: "mlp_reg", name: "MLP regressor", tasks: ["regression", "time-series-regression"], deep: true }
];

let activeView = "home";
let currentMode = "general";
let activeSimulation = null;
let liveTimer = null;
let animationClock = 0;
let latestResult = null;
let confirmAction = null;

const els = {
  views: {
    home: document.getElementById("homeView"),
    config: document.getElementById("configView"),
    personalized: document.getElementById("personalizedView"),
    simulation: document.getElementById("simulationView"),
    howToUse: document.getElementById("howToUseView")
  },
  brandHomeButton: document.getElementById("brandHomeButton"),
  homeNav: document.getElementById("homeNav"),
  personalizedNav: document.getElementById("personalizedNav"),
  howToUseNav: document.getElementById("howToUseNav"),
  themeToggle: document.getElementById("themeToggle"),
  startGeneralButton: document.getElementById("startGeneralButton"),
  startPersonalizedButton: document.getElementById("startPersonalizedButton"),
  configBackHome: document.getElementById("configBackHome"),
  personalizedBackHome: document.getElementById("personalizedBackHome"),
  howToBackHome: document.getElementById("howToBackHome"),
  datasetSelect: document.getElementById("datasetSelect"),
  targetSelect: document.getElementById("targetSelect"),
  featurePanel: document.getElementById("featurePanel"),
  featureList: document.getElementById("featureList"),
  selectAllFeatures: document.getElementById("selectAllFeatures"),
  tensorFeatureNotice: document.getElementById("tensorFeatureNotice"),
  modelSelect: document.getElementById("modelSelect"),
  aggregationSelect: document.getElementById("aggregationSelect"),
  clientCount: document.getElementById("clientCount"),
  roundCount: document.getElementById("roundCount"),
  clientFraction: document.getElementById("clientFraction"),
  skewSelect: document.getElementById("skewSelect"),
  localEpochs: document.getElementById("localEpochs"),
  dropoutRate: document.getElementById("dropoutRate"),
  learningRate: document.getElementById("learningRate"),
  dlDropout: document.getElementById("dlDropout"),
  dlLockNote: document.getElementById("dlLockNote"),
  runSimulationButton: document.getElementById("runSimulationButton"),
  personalizedDatasetSelect: document.getElementById("personalizedDatasetSelect"),
  personalizationMethod: document.getElementById("personalizationMethod"),
  personalizedClients: document.getElementById("personalizedClients"),
  personalizedRounds: document.getElementById("personalizedRounds"),
  sharedStrength: document.getElementById("sharedStrength"),
  adaptationEpochs: document.getElementById("adaptationEpochs"),
  runPersonalizedButton: document.getElementById("runPersonalizedButton"),
  backToConfigButton: document.getElementById("backToConfigButton"),
  stopSimulationButton: document.getElementById("stopSimulationButton"),
  simulationModeLabel: document.getElementById("simulationModeLabel"),
  simulationTitle: document.getElementById("simulationTitle"),
  heroCanvas: document.getElementById("heroCanvas"),
  networkCanvas: document.getElementById("networkCanvas"),
  roundLabel: document.getElementById("roundLabel"),
  phaseLabel: document.getElementById("phaseLabel"),
  primaryMetricLabel: document.getElementById("primaryMetricLabel"),
  primaryMetric: document.getElementById("primaryMetric"),
  lossMetricLabel: document.getElementById("lossMetricLabel"),
  lossMetric: document.getElementById("lossMetric"),
  commMetric: document.getElementById("commMetric"),
  stabilityMetric: document.getElementById("stabilityMetric"),
  metricChart: document.getElementById("metricChart"),
  clientDistributions: document.getElementById("clientDistributions"),
  evaluationTable: document.getElementById("evaluationTable"),
  matrixTitle: document.getElementById("matrixTitle"),
  confusionCanvas: document.getElementById("confusionCanvas"),
  matrixBox: document.getElementById("matrixBox"),
  confirmModal: document.getElementById("confirmModal"),
  confirmTitle: document.getElementById("confirmTitle"),
  confirmText: document.getElementById("confirmText"),
  confirmCancel: document.getElementById("confirmCancel"),
  confirmAccept: document.getElementById("confirmAccept")
};

function init() {
  populateDatasets();
  wireEvents();
  renderDatasetConfig();
  renderModelOptions();
  updateDeepLearningLocks();
  showView("home");
  requestAnimationFrame(drawLoop);
}

function populateDatasets() {
  [els.datasetSelect, els.personalizedDatasetSelect].forEach((select) => {
    select.innerHTML = "";
    datasets.forEach((dataset) => {
      const option = document.createElement("option");
      option.value = dataset.id;
      option.textContent = dataset.name;
      select.appendChild(option);
    });
  });
  els.personalizedDatasetSelect.value = "heart_synthetic";
}

function wireEvents() {
  els.brandHomeButton.addEventListener("click", () => requestHome());
  els.homeNav.addEventListener("click", () => requestHome());
  els.personalizedNav.addEventListener("click", () => requestNavigation("personalized"));
  els.howToUseNav.addEventListener("click", () => requestNavigation("howToUse"));
  els.themeToggle.addEventListener("click", () => document.body.classList.toggle("dark"));
  els.startGeneralButton.addEventListener("click", () => showView("config"));
  els.startPersonalizedButton.addEventListener("click", () => showView("personalized"));
  els.configBackHome.addEventListener("click", () => requestHome());
  els.personalizedBackHome.addEventListener("click", () => requestHome());
  els.howToBackHome.addEventListener("click", () => requestHome());
  els.datasetSelect.addEventListener("change", () => {
    renderDatasetConfig();
    renderModelOptions();
    updateDeepLearningLocks();
  });
  els.modelSelect.addEventListener("change", updateDeepLearningLocks);
  els.selectAllFeatures.addEventListener("click", () => {
    document.querySelectorAll("#featureList input").forEach((input) => {
      input.checked = true;
    });
  });
  els.runSimulationButton.addEventListener("click", () => startGeneralSimulation());
  els.runPersonalizedButton.addEventListener("click", () => startPersonalizedSimulation());
  els.backToConfigButton.addEventListener("click", () => {
    confirmIfRunning(
      "Return to configuration?",
      "The current live simulation will end and you will return to the configuration page.",
      () => {
        stopLiveSimulation();
        showView(currentMode === "personalized" ? "personalized" : "config");
      }
    );
  });
  els.stopSimulationButton.addEventListener("click", () => {
    confirmIfRunning(
      "Stop simulation?",
      "The live experiment will stop and you will return to the home page.",
      () => {
        stopLiveSimulation();
        showView("home");
      }
    );
  });
  els.confirmCancel.addEventListener("click", closeConfirm);
  els.confirmAccept.addEventListener("click", () => {
    const action = confirmAction;
    closeConfirm();
    if (action) action();
  });
}

function requestHome() {
  confirmIfRunning(
    "Go home?",
    "Your current experiment will stop and you will need to start from scratch. Are you okay with that?",
    () => {
      stopLiveSimulation();
      showView("home");
    }
  );
}

function requestNavigation(viewName) {
  confirmIfRunning(
    "Leave current experiment?",
    "The active simulation will stop if you leave this page.",
    () => {
      stopLiveSimulation();
      showView(viewName);
    }
  );
}

function confirmIfRunning(title, text, action) {
  if (activeView === "simulation" && activeSimulation?.running) {
    openConfirm(title, text, action);
    return;
  }
  action();
}

function openConfirm(title, text, action) {
  confirmAction = action;
  els.confirmTitle.textContent = title;
  els.confirmText.textContent = text;
  els.confirmModal.classList.remove("hidden");
}

function closeConfirm() {
  confirmAction = null;
  els.confirmModal.classList.add("hidden");
}

function showView(name) {
  activeView = name;
  Object.entries(els.views).forEach(([viewName, element]) => {
    element.classList.toggle("active", viewName === name);
  });
}

function getDataset(select = els.datasetSelect) {
  return datasets.find((dataset) => dataset.id === select.value) || datasets[0];
}

function renderDatasetConfig() {
  const dataset = getDataset();
  els.targetSelect.innerHTML = "";
  const targetOption = document.createElement("option");
  targetOption.value = dataset.target;
  targetOption.textContent = dataset.target;
  els.targetSelect.appendChild(targetOption);

  const isTensor = dataset.featureMode === "tensor";
  els.featurePanel.classList.toggle("hidden", isTensor);
  els.tensorFeatureNotice.classList.toggle("hidden", !isTensor);
  els.featureList.innerHTML = "";
  if (!isTensor) {
    dataset.features.forEach((feature) => {
      const label = document.createElement("label");
      const input = document.createElement("input");
      input.type = "checkbox";
      input.value = feature;
      input.checked = true;
      label.append(input, document.createTextNode(feature));
      els.featureList.appendChild(label);
    });
  }
}

function renderModelOptions() {
  const dataset = getDataset();
  const previous = els.modelSelect.value;
  const available = modelCatalog.filter((model) => model.tasks.includes(dataset.task) || model.tasks.includes(normalizeTask(dataset.task)));
  els.modelSelect.innerHTML = "";
  available.forEach((model) => {
    const option = document.createElement("option");
    option.value = model.id;
    option.textContent = model.name;
    els.modelSelect.appendChild(option);
  });
  if (available.some((model) => model.id === previous)) {
    els.modelSelect.value = previous;
  }
}

function normalizeTask(task) {
  if (task.includes("regression")) return "regression";
  if (task.includes("classification") && task !== "image-classification" && task !== "time-series-classification") return "classification";
  return task;
}

function getSelectedModel() {
  return modelCatalog.find((model) => model.id === els.modelSelect.value) || modelCatalog[0];
}

function updateDeepLearningLocks() {
  const model = getSelectedModel();
  els.learningRate.disabled = !model.deep;
  els.dlDropout.disabled = !model.deep;
  els.dlLockNote.textContent = model.deep
    ? "Deep learning controls are active for this model."
    : "Learning rate and neural dropout unlock only for deep learning style models.";
}

function selectedFeatures(dataset) {
  if (dataset.featureMode === "tensor") return [];
  const checked = [...document.querySelectorAll("#featureList input:checked")].map((input) => input.value);
  return checked.length ? checked : dataset.features;
}

async function startGeneralSimulation() {
  currentMode = "general";
  const dataset = getDataset();
  const model = getSelectedModel();
  const config = {
    mode: "general",
    dataset,
    model,
    dataset_id: dataset.backendId,
    model_id: model.id,
    features: selectedFeatures(dataset),
    clients: clamp(Number(els.clientCount.value), 2, 50),
    rounds: clamp(Number(els.roundCount.value), 2, 50),
    local_epochs: clamp(Number(els.localEpochs.value), 1, 10),
    client_fraction: clamp(Number(els.clientFraction.value), 0.1, 1),
    dropout: clamp(Number(els.dropoutRate.value), 0, 0.9),
    skew: els.skewSelect.value,
    aggregation: els.aggregationSelect.value,
    learning_rate: Number(els.learningRate.value),
    dl_dropout: Number(els.dlDropout.value)
  };
  await startSimulation(config);
}

async function startPersonalizedSimulation() {
  currentMode = "personalized";
  const dataset = getDataset(els.personalizedDatasetSelect);
  const config = {
    mode: "personalized",
    dataset,
    model: { id: dataset.task.includes("regression") ? "mlp_reg" : "mlp_clf", name: "Shared representation model", deep: true },
    dataset_id: dataset.backendId,
    model_id: dataset.task.includes("regression") ? "mlp_reg" : "mlp_clf",
    features: [],
    clients: clamp(Number(els.personalizedClients.value), 3, 30),
    rounds: clamp(Number(els.personalizedRounds.value), 2, 40),
    local_epochs: clamp(Number(els.adaptationEpochs.value), 1, 10),
    client_fraction: 1,
    dropout: 0.05,
    skew: "Strong non-IID",
    aggregation: "Weighted FedAvg",
    personalization_method: els.personalizationMethod.value,
    shared_strength: Number(els.sharedStrength.value)
  };
  await startSimulation(config);
}

async function startSimulation(config) {
  stopLiveSimulation();
  showView("simulation");
  els.simulationModeLabel.textContent = config.mode === "personalized" ? "Live personalized FL" : "Live federated learning";
  els.simulationTitle.textContent = config.mode === "personalized" ? "Personalized FL Simulation" : `${config.dataset.name} Simulation`;
  setLoadingState(config);
  const fallback = makeFallbackResult(config);
  activeSimulation = { config, result: fallback, round: 0, running: true, displayedCurve: [], displayedLoss: [] };
  latestResult = fallback;
  renderLiveState(0);
  playLiveResult();

  try {
    const backendResult = await requestBackendSimulation(config);
    if (!activeSimulation?.running) return;
    latestResult = adaptBackendResult(config, backendResult);
    activeSimulation.result = latestResult;
    activeSimulation.round = 0;
    activeSimulation.displayedCurve = [];
    activeSimulation.displayedLoss = [];
    renderLiveState(0);
    playLiveResult();
  } catch (error) {
    latestResult = fallback;
    renderEvaluation(config, fallback, "Backend unavailable, showing local educational fallback.");
  }
}

function setLoadingState(config) {
  const classification = !config.dataset.task.includes("regression");
  els.primaryMetricLabel.textContent = classification ? "Balanced accuracy" : "RMSE";
  els.lossMetricLabel.textContent = classification ? "Cross entropy" : "MSE loss";
  els.primaryMetric.textContent = "0.000";
  els.lossMetric.textContent = "0.000";
  els.commMetric.textContent = "0 MB";
  els.stabilityMetric.textContent = "0.00";
  els.phaseLabel.textContent = "Preparing client partitions";
  els.roundLabel.textContent = "Round 0";
}

async function requestBackendSimulation(config) {
  const response = await fetch("/api/simulate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      dataset_id: config.dataset_id,
      model_id: config.model_id,
      features: config.features,
      clients: config.clients,
      rounds: config.rounds,
      local_epochs: config.local_epochs,
      client_fraction: config.client_fraction,
      dropout: config.dropout,
      skew: config.skew,
      aggregation: config.aggregation
    })
  });
  if (!response.ok) throw new Error(`Backend returned ${response.status}`);
  return response.json();
}

function adaptBackendResult(config, result) {
  if (config.mode !== "personalized") return result;
  const personalizedCurve = result.curve.map((value, index) => {
    if (result.classification) return clamp(value + 0.015 + index * 0.003 * Number(config.shared_strength || 0.7), 0, 0.995);
    return clamp(value * (0.96 - index * 0.004), 0.01, value);
  });
  return {
    ...result,
    curve: personalizedCurve,
    finalMetric: personalizedCurve[personalizedCurve.length - 1],
    evaluationRows: [
      ...(result.evaluationRows || []),
      ["Personalization method", config.personalization_method, "Client-specific adaptation is added after shared representation learning."],
      ["Shared strength", Number(config.shared_strength || 0.7).toFixed(2), "Higher means clients stay closer to the global representation."]
    ]
  };
}

function playLiveResult() {
  clearInterval(liveTimer);
  liveTimer = setInterval(() => {
    if (!activeSimulation?.running) {
      clearInterval(liveTimer);
      return;
    }
    const maxRound = activeSimulation.result.curve.length - 1;
    if (activeSimulation.round >= maxRound) {
      activeSimulation.running = false;
      renderLiveState(maxRound);
      clearInterval(liveTimer);
      return;
    }
    activeSimulation.round += 1;
    renderLiveState(activeSimulation.round);
  }, 850);
}

function stopLiveSimulation() {
  if (liveTimer) clearInterval(liveTimer);
  liveTimer = null;
  if (activeSimulation) activeSimulation.running = false;
}

function renderLiveState(round) {
  const { config, result } = activeSimulation;
  const curve = result.curve.slice(0, round + 1);
  const loss = result.loss.slice(0, round + 1);
  activeSimulation.displayedCurve = curve;
  activeSimulation.displayedLoss = loss;

  const finalMetric = curve[curve.length - 1] ?? 0;
  const finalLoss = loss[loss.length - 1] ?? 0;
  const classification = result.classification;
  const phases = config.mode === "personalized"
    ? ["Share backbone", "Local heads adapt", "Clients send adapted updates", "Personalized evaluation"]
    : ["Server sends global model", "Clients train locally", "Clients send updates", "Server aggregates updates"];
  const phase = phases[round % phases.length];

  els.roundLabel.textContent = `Round ${round}`;
  els.phaseLabel.textContent = phase;
  els.primaryMetricLabel.textContent = classification ? "Balanced accuracy" : "RMSE";
  els.lossMetricLabel.textContent = classification ? "Cross entropy" : "MSE loss";
  els.primaryMetric.textContent = finalMetric.toFixed(3);
  els.lossMetric.textContent = finalLoss.toFixed(3);
  els.commMetric.textContent = formatMb(result.communication || 0);
  els.stabilityMetric.textContent = Number(result.stability || 0).toFixed(2);
  renderMetricChart(curve, loss, classification);
  renderDistributions(result.distributions || []);
  renderEvaluation(config, result);
  renderMatrix(config, result);
}

function makeFallbackResult(config) {
  const classification = !config.dataset.task.includes("regression");
  const rounds = config.rounds;
  const curve = [];
  const loss = [];
  const nonIidPenalty = config.skew === "IID" ? 0.02 : config.skew.includes("Strong") ? 0.12 : 0.07;
  const target = classification ? 0.88 - nonIidPenalty + Math.log2(config.clients) * 0.015 : 0.42 + nonIidPenalty;
  for (let round = 0; round <= rounds; round += 1) {
    const progress = 1 - Math.exp(-round / Math.max(2, rounds * 0.35));
    if (classification) {
      const value = clamp(0.28 + (target - 0.28) * progress + Math.sin(round * 1.3) * 0.012, 0.05, 0.98);
      curve.push(value);
      loss.push(clamp(1.55 - value * 1.25, 0.05, 2));
    } else {
      const value = clamp(1.25 - (1.25 - target) * progress + Math.sin(round) * 0.015, 0.05, 1.5);
      curve.push(value);
      loss.push(value * value);
    }
  }
  return {
    classification,
    curve,
    loss,
    communication: estimateCommunication(config),
    stability: clamp(0.96 - nonIidPenalty - config.dropout * 0.2, 0.1, 0.99),
    distributions: buildFallbackDistributions(config),
    finalMetric: curve[curve.length - 1],
    finalLoss: loss[loss.length - 1],
    confusionMatrix: classification ? fallbackConfusion(config, curve[curve.length - 1]) : null,
    classNames: config.dataset.classes,
    residualRows: classification ? null : [["Small residual", 33], ["Medium residual", 31], ["Large residual", 22]],
    evaluationRows: []
  };
}

function estimateCommunication(config) {
  const modelSize = config.model.deep ? 10 : 4;
  const activeClients = Math.max(1, Math.round(config.clients * config.client_fraction * (1 - config.dropout)));
  return modelSize * activeClients * config.rounds * 2;
}

function buildFallbackDistributions(config) {
  const rows = [];
  const labels = config.dataset.classes.length ? config.dataset.classes : ["low", "medium", "high"];
  for (let i = 0; i < Math.min(config.clients, 12); i += 1) {
    let weights = labels.map(() => 1);
    if (config.skew !== "IID") {
      weights = weights.map((value, index) => value + (index === i % labels.length ? 4 : 0.4));
    }
    const sum = weights.reduce((a, b) => a + b, 0);
    rows.push({
      name: `Client ${i + 1}`,
      samples: Math.round(config.dataset.samples / config.clients),
      classes: labels,
      values: weights.map((value) => value / sum)
    });
  }
  return rows;
}

function fallbackConfusion(config, accuracy) {
  const n = Math.min(config.dataset.classes.length || 2, 6);
  const matrix = [];
  for (let row = 0; row < n; row += 1) {
    const line = [];
    for (let col = 0; col < n; col += 1) {
      line.push(row === col ? Math.round(40 + accuracy * 90) : Math.round((1 - accuracy) * (8 + ((row + col) % 4) * 5)));
    }
    matrix.push(line);
  }
  return matrix;
}

function renderMetricChart(curve, loss, classification) {
  const canvas = els.metricChart;
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = css("--surface-soft");
  ctx.fillRect(0, 0, width, height);
  drawGrid(ctx, width, height);
  if (curve.length) {
    const curveMax = classification ? 1 : Math.max(...curve, 1);
    drawLine(ctx, curve, classification ? css("--success") : css("--accent"), 0, curveMax);
    drawLine(ctx, loss, css("--danger"), 0, Math.max(...loss, 1));
  }
  ctx.fillStyle = css("--text");
  ctx.font = "700 15px system-ui";
  ctx.fillText(classification ? "Balanced accuracy (green) and cross entropy (red)" : "RMSE (blue) and MSE loss (red)", 18, 28);
}

function drawGrid(ctx, width, height) {
  ctx.strokeStyle = css("--line");
  ctx.lineWidth = 1;
  for (let i = 1; i < 5; i += 1) {
    const y = (height / 5) * i;
    ctx.beginPath();
    ctx.moveTo(42, y);
    ctx.lineTo(width - 20, y);
    ctx.stroke();
  }
}

function drawLine(ctx, values, color, minValue, maxValue) {
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;
  const left = 42;
  const right = width - 20;
  const top = 48;
  const bottom = height - 26;
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
    top.innerHTML = `<span>${escapeHtml(row.name)}</span><span>${row.samples} samples</span>`;
    const bars = document.createElement("div");
    bars.className = "bars";
    row.values.forEach((value, index) => {
      const bar = document.createElement("span");
      bar.style.width = `${value * 100}%`;
      bar.style.background = palette[index % palette.length];
      bar.title = `${row.classes?.[index] || index}: ${(value * 100).toFixed(1)}%`;
      bars.appendChild(bar);
    });
    box.append(top, bars);
    els.clientDistributions.appendChild(box);
  });
}

function renderEvaluation(config, result, note = "") {
  const rows = result.evaluationRows?.length ? [...result.evaluationRows] : [];
  const classification = result.classification;
  if (!rows.length) {
    if (classification) {
      rows.push(["Balanced accuracy", result.finalMetric.toFixed(4), "Mean recall across classes on the held-out test split."]);
      rows.push(["Cross entropy", result.finalLoss.toFixed(4), "Lower is better; penalizes confident wrong predictions."]);
    } else {
      rows.push(["RMSE", result.finalMetric.toFixed(4), "Prediction error on the held-out test split."]);
      rows.push(["MSE loss", result.finalLoss.toFixed(4), "Squared prediction error."]);
    }
  }
  rows.push(["Aggregation", config.aggregation, "Server-side method for combining client information."]);
  rows.push(["Communication", formatMb(result.communication || 0), "Approximate total server-client transfer."]);
  if (note) rows.push(["Runtime note", note, "The interface stays usable even when the backend is not available."]);
  els.evaluationTable.innerHTML = `<table><thead><tr><th>Metric</th><th>Value</th><th>Meaning</th></tr></thead><tbody>${rows.map((row) => `<tr><td>${escapeHtml(String(row[0]))}</td><td>${escapeHtml(String(row[1]))}</td><td>${escapeHtml(String(row[2]))}</td></tr>`).join("")}</tbody></table>`;
}

function renderMatrix(config, result) {
  const ctx = els.confusionCanvas.getContext("2d");
  const width = els.confusionCanvas.width;
  const height = els.confusionCanvas.height;
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = css("--surface-soft");
  ctx.fillRect(0, 0, width, height);

  if (!result.classification) {
    els.matrixTitle.textContent = "Residual Plot";
    const rows = result.residualRows || [["Small residual", 0], ["Medium residual", 0], ["Large residual", 0]];
    const max = Math.max(...rows.map((row) => Number(row[1])), 1);
    rows.forEach((row, index) => {
      const y = 70 + index * 88;
      const barWidth = (Number(row[1]) / max) * 310;
      ctx.fillStyle = palette[index % palette.length];
      roundedRect(ctx, 150, y, barWidth, 34, 7);
      ctx.fill();
      ctx.fillStyle = css("--text");
      ctx.font = "700 16px system-ui";
      ctx.fillText(row[0], 26, y + 23);
      ctx.fillText(String(row[1]), 470, y + 23);
    });
    els.matrixBox.textContent = "Residuals group prediction errors into small, medium, and large buckets.";
    return;
  }

  els.matrixTitle.textContent = "Confusion Matrix Plot";
  const matrix = result.confusionMatrix || fallbackConfusion(config, result.finalMetric);
  const n = matrix.length;
  const maxValue = Math.max(...matrix.flat(), 1);
  const size = Math.min(44, Math.floor((Math.min(width, height) - 110) / n));
  const startX = Math.max(86, (width - size * n) / 2);
  const startY = 72;
  ctx.fillStyle = css("--text");
  ctx.font = "800 14px system-ui";
  ctx.fillText("Predicted label", startX + size * n * 0.28, 28);
  ctx.save();
  ctx.translate(24, startY + size * n * 0.72);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText("True label", 0, 0);
  ctx.restore();

  for (let row = 0; row < n; row += 1) {
    for (let col = 0; col < n; col += 1) {
      const value = matrix[row][col];
      const strength = value / maxValue;
      ctx.fillStyle = row === col
        ? colorWithAlpha(css("--success"), 0.28 + strength * 0.72)
        : colorWithAlpha(css("--danger"), 0.2 + strength * 0.65);
      ctx.fillRect(startX + col * size, startY + row * size, size - 3, size - 3);
      ctx.fillStyle = "#ffffff";
      ctx.font = "800 12px system-ui";
      ctx.textAlign = "center";
      ctx.fillText(String(value), startX + col * size + size / 2 - 1, startY + row * size + size / 2 + 4);
    }
  }
  ctx.textAlign = "left";
  ctx.fillStyle = css("--muted");
  ctx.font = "700 11px system-ui";
  const labels = result.classNames || config.dataset.classes || [];
  labels.slice(0, n).forEach((label, index) => {
    const short = String(label).slice(0, 8);
    ctx.fillText(short, startX + index * size, startY + n * size + 20);
    ctx.fillText(short, startX - 70, startY + index * size + size / 2 + 4);
  });
  els.matrixBox.textContent = "Diagonal cells are correct predictions; off-diagonal cells are mistakes.";
}

function drawLoop() {
  animationClock += 0.015;
  drawHero();
  if (activeView === "simulation") drawNetwork();
  requestAnimationFrame(drawLoop);
}

function drawHero() {
  const canvas = els.heroCanvas;
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  drawNetworkScene(ctx, width, height, 8, "FL Simulator", false);
}

function drawNetwork() {
  const canvas = els.networkCanvas;
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  const clients = activeSimulation?.config?.clients || 5;
  const personalized = activeSimulation?.config?.mode === "personalized";
  drawNetworkScene(ctx, width, height, Math.min(clients, 18), personalized ? "Shared core" : "Server", personalized);
}

function drawNetworkScene(ctx, width, height, clientCount, centerLabel, personalized) {
  ctx.clearRect(0, 0, width, height);
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, "#07111f");
  gradient.addColorStop(1, "#12324a");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  const center = { x: width / 2, y: height / 2 };
  const radius = Math.min(width, height) * 0.34;
  const phaseIndex = Math.floor(animationClock * 3) % 4;
  for (let i = 0; i < clientCount; i += 1) {
    const angle = (Math.PI * 2 * i) / clientCount - Math.PI / 2;
    const client = { x: center.x + Math.cos(angle) * radius, y: center.y + Math.sin(angle) * radius };
    ctx.strokeStyle = "rgba(148, 163, 184, 0.28)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(center.x, center.y);
    ctx.lineTo(client.x, client.y);
    ctx.stroke();

    const direction = phaseIndex < 2 ? 1 : -1;
    const t = (animationClock * 0.85 + i / clientCount) % 1;
    const px = direction === 1 ? center.x + (client.x - center.x) * t : client.x + (center.x - client.x) * t;
    const py = direction === 1 ? center.y + (client.y - center.y) * t : client.y + (center.y - client.y) * t;
    ctx.fillStyle = phaseIndex < 2 ? "#38bdf8" : "#34d399";
    ctx.beginPath();
    ctx.arc(px, py, 4.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = palette[i % palette.length];
    roundedRect(ctx, client.x - 24, client.y - 17, 48, 34, 7);
    ctx.fill();
    if (personalized) {
      ctx.fillStyle = "rgba(255,255,255,0.95)";
      ctx.beginPath();
      ctx.arc(client.x + 16, client.y - 12, 7, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = "rgba(255,255,255,0.95)";
    ctx.font = "800 11px system-ui";
    ctx.textAlign = "center";
    ctx.fillText(`C${i + 1}`, client.x, client.y + 4);
  }

  ctx.fillStyle = personalized ? "#a78bfa" : "#38bdf8";
  ctx.beginPath();
  ctx.arc(center.x, center.y, 54, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#06111d";
  ctx.font = "900 15px system-ui";
  ctx.textAlign = "center";
  ctx.fillText(centerLabel, center.x, center.y - 4);
  ctx.font = "700 11px system-ui";
  ctx.fillText(personalized ? "+ local heads" : "global model", center.x, center.y + 15);
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
  return `${Number(value).toFixed(0)} MB`;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function css(name) {
  return getComputedStyle(document.body).getPropertyValue(name).trim();
}

function colorWithAlpha(color, alpha) {
  if (color.startsWith("#")) {
    const hex = color.replace("#", "");
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  return color;
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

init();
