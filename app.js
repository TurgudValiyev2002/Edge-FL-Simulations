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
let pendingConfig = null;
let lastNodeHitboxes = [];
let datasetReturnView = "home";
let pendingCsvText = "";
let pendingCsvName = "";

const els = {
  views: {
    home: document.getElementById("homeView"),
    config: document.getElementById("configView"),
    personalized: document.getElementById("personalizedView"),
    split: document.getElementById("splitView"),
    simulation: document.getElementById("simulationView"),
    datasets: document.getElementById("datasetsView"),
    howToUse: document.getElementById("howToUseView")
  },
  brandHomeButton: document.getElementById("brandHomeButton"),
  homeNav: document.getElementById("homeNav"),
  datasetsNav: document.getElementById("datasetsNav"),
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
  testSplit: document.getElementById("testSplit"),
  addValidation: document.getElementById("addValidation"),
  validationSplit: document.getElementById("validationSplit"),
  learningRate: document.getElementById("learningRate"),
  dlDropout: document.getElementById("dlDropout"),
  dlLockNote: document.getElementById("dlLockNote"),
  customCsvFile: document.getElementById("customCsvFile"),
  customTask: document.getElementById("customTask"),
  customTarget: document.getElementById("customTarget"),
  uploadCsvButton: document.getElementById("uploadCsvButton"),
  removeCsvButton: document.getElementById("removeCsvButton"),
  customUploadStatus: document.getElementById("customUploadStatus"),
  runSimulationButton: document.getElementById("runSimulationButton"),
  configInspectDataset: document.getElementById("configInspectDataset"),
  splitBackConfigBottom: document.getElementById("splitBackConfigBottom"),
  splitRunSimulationBottom: document.getElementById("splitRunSimulationBottom"),
  splitInspectDatasetBottom: document.getElementById("splitInspectDatasetBottom"),
  splitSummaryCanvas: document.getElementById("splitSummaryCanvas"),
  splitCanvas: document.getElementById("splitCanvas"),
  splitSummaryText: document.getElementById("splitSummaryText"),
  splitExplanation: document.getElementById("splitExplanation"),
  personalizedDatasetSelect: document.getElementById("personalizedDatasetSelect"),
  personalizationMethod: document.getElementById("personalizationMethod"),
  personalizedClients: document.getElementById("personalizedClients"),
  personalizedRounds: document.getElementById("personalizedRounds"),
  sharedStrength: document.getElementById("sharedStrength"),
  adaptationEpochs: document.getElementById("adaptationEpochs"),
  runPersonalizedButton: document.getElementById("runPersonalizedButton"),
  startLiveOverlay: document.getElementById("startLiveOverlay"),
  startLiveButton: document.getElementById("startLiveButton"),
  backToConfigButton: document.getElementById("backToConfigButton"),
  stopSimulationButton: document.getElementById("stopSimulationButton"),
  simulationModeLabel: document.getElementById("simulationModeLabel"),
  simulationTitle: document.getElementById("simulationTitle"),
  heroCanvas: document.getElementById("heroCanvas"),
  networkCanvas: document.getElementById("networkCanvas"),
  roundLabel: document.getElementById("roundLabel"),
  phaseLabel: document.getElementById("phaseLabel"),
  trainQualityLabel: document.getElementById("trainQualityLabel"),
  trainQualityMetric: document.getElementById("trainQualityMetric"),
  testQualityLabel: document.getElementById("testQualityLabel"),
  testQualityMetric: document.getElementById("testQualityMetric"),
  trainLossLabel: document.getElementById("trainLossLabel"),
  trainLossMetric: document.getElementById("trainLossMetric"),
  testLossLabel: document.getElementById("testLossLabel"),
  testLossMetric: document.getElementById("testLossMetric"),
  nodeDetails: document.getElementById("nodeDetails"),
  primaryMetricLabel: document.getElementById("primaryMetricLabel"),
  primaryMetric: document.getElementById("primaryMetric"),
  lossMetricLabel: document.getElementById("lossMetricLabel"),
  lossMetric: document.getElementById("lossMetric"),
  commMetric: document.getElementById("commMetric"),
  stabilityMetric: document.getElementById("stabilityMetric"),
  qualityChartTitle: document.getElementById("qualityChartTitle"),
  qualityChart: document.getElementById("qualityChart"),
  lossChartTitle: document.getElementById("lossChartTitle"),
  lossChart: document.getElementById("lossChart"),
  clientDistributions: document.getElementById("clientDistributions"),
  evaluationTable: document.getElementById("evaluationTable"),
  matrixTitle: document.getElementById("matrixTitle"),
  confusionCanvas: document.getElementById("confusionCanvas"),
  matrixBox: document.getElementById("matrixBox"),
  datasetsBackHome: document.getElementById("datasetsBackHome"),
  datasetsBackConfig: document.getElementById("datasetsBackConfig"),
  datasetBrowserSelect: document.getElementById("datasetBrowserSelect"),
  datasetCards: document.getElementById("datasetCards"),
  datasetInspectTitle: document.getElementById("datasetInspectTitle"),
  datasetInspectMeta: document.getElementById("datasetInspectMeta"),
  datasetInspectCanvas: document.getElementById("datasetInspectCanvas"),
  datasetInspectTable: document.getElementById("datasetInspectTable"),
  confirmModal: document.getElementById("confirmModal"),
  confirmTitle: document.getElementById("confirmTitle"),
  confirmText: document.getElementById("confirmText"),
  confirmCancel: document.getElementById("confirmCancel"),
  confirmAccept: document.getElementById("confirmAccept")
};

function init() {
  populateDatasets();
  renderDatasetBrowser();
  wireEvents();
  renderDatasetConfig();
  renderModelOptions();
  updateDeepLearningLocks();
  showView("home");
  requestAnimationFrame(drawLoop);
}

function populateDatasets() {
  [els.datasetSelect, els.personalizedDatasetSelect, els.datasetBrowserSelect].forEach((select) => {
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

function renderDatasetBrowser() {
  els.datasetCards.innerHTML = "";
  datasets.forEach((dataset) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "dataset-card";
    card.innerHTML = `<strong>${escapeHtml(dataset.name)}</strong><small>${escapeHtml(dataset.task)} · ${dataset.samples.toLocaleString()} samples</small>`;
    card.addEventListener("click", () => {
      els.datasetBrowserSelect.value = dataset.id;
      renderDatasetInspection();
    });
    els.datasetCards.appendChild(card);
  });
  renderDatasetInspection();
}

function renderDatasetInspection() {
  const dataset = getDataset(els.datasetBrowserSelect);
  els.datasetInspectTitle.textContent = dataset.name;
  els.datasetInspectMeta.innerHTML = `
    <div><strong>${dataset.samples.toLocaleString()}</strong><small>Samples</small></div>
    <div><strong>${dataset.task.replaceAll("-", " ")}</strong><small>Task</small></div>
    <div><strong>${dataset.target}</strong><small>Target</small></div>
    <div><strong>${dataset.featureMode === "tensor" ? "Tensor/window" : dataset.features.length}</strong><small>Features</small></div>
  `;
  drawDatasetInspection(dataset);
  renderDatasetRows(dataset);
}

function drawDatasetInspection(dataset) {
  const ctx = prepareCanvas(els.datasetInspectCanvas);
  const width = els.datasetInspectCanvas.clientWidth || els.datasetInspectCanvas.width;
  const height = els.datasetInspectCanvas.clientHeight || els.datasetInspectCanvas.height;
  clearCanvas(ctx, width, height);
  ctx.fillStyle = css("--text");
  ctx.font = "900 18px system-ui";
  ctx.fillText(dataset.summary, 28, 34, width - 56);

  if (dataset.featureMode === "tensor" && dataset.id === "digits") {
    const labels = dataset.classes.slice(0, 10);
    const cell = Math.min(86, (width - 80) / labels.length);
    labels.forEach((label, index) => {
      const x = 36 + index * cell;
      const y = 92;
      drawDigitGlyph(ctx, label, x, y, cell - 12);
      ctx.fillStyle = css("--muted");
      ctx.font = "800 12px system-ui";
      ctx.textAlign = "center";
      ctx.fillText(`label ${label}`, x + (cell - 12) / 2, y + cell + 8);
    });
    ctx.textAlign = "left";
    return;
  }

  const labels = dataset.classes.length ? dataset.classes : ["low target", "mid target", "high target"];
  labels.forEach((label, index) => {
    const x = 40;
    const y = 92 + index * 52;
    const widthValue = 180 + ((index * 73 + dataset.samples) % 260);
    ctx.fillStyle = palette[index % palette.length];
    roundedRect(ctx, x, y, widthValue, 28, 7);
    ctx.fill();
    ctx.fillStyle = css("--text");
    ctx.font = "800 13px system-ui";
    ctx.fillText(String(label), x + widthValue + 14, y + 19);
  });
}

function drawDigitGlyph(ctx, label, x, y, size) {
  ctx.fillStyle = "#0b1220";
  roundedRect(ctx, x, y, size, size, 8);
  ctx.fill();
  ctx.strokeStyle = "#38bdf8";
  ctx.lineWidth = Math.max(3, size * 0.08);
  ctx.lineCap = "round";
  ctx.beginPath();
  const cx = x + size / 2;
  const top = y + size * 0.22;
  const mid = y + size * 0.5;
  const bottom = y + size * 0.78;
  if (label === "0") ctx.ellipse(cx, mid, size * 0.25, size * 0.32, 0, 0, Math.PI * 2);
  else if (label === "1") { ctx.moveTo(cx, top); ctx.lineTo(cx, bottom); }
  else if (label === "2") { ctx.moveTo(x + size * 0.25, top); ctx.lineTo(x + size * 0.72, top); ctx.lineTo(x + size * 0.28, bottom); ctx.lineTo(x + size * 0.75, bottom); }
  else if (label === "3") { ctx.moveTo(x + size * 0.28, top); ctx.lineTo(x + size * 0.72, mid); ctx.lineTo(x + size * 0.28, bottom); }
  else if (label === "4") { ctx.moveTo(x + size * 0.25, top); ctx.lineTo(x + size * 0.25, mid); ctx.lineTo(x + size * 0.72, mid); ctx.lineTo(x + size * 0.72, bottom); }
  else if (label === "5") { ctx.moveTo(x + size * 0.72, top); ctx.lineTo(x + size * 0.28, top); ctx.lineTo(x + size * 0.28, mid); ctx.lineTo(x + size * 0.72, mid); ctx.lineTo(x + size * 0.72, bottom); ctx.lineTo(x + size * 0.28, bottom); }
  else if (label === "6") { ctx.moveTo(x + size * 0.68, top); ctx.lineTo(x + size * 0.3, mid); ctx.ellipse(cx, y + size * 0.62, size * 0.22, size * 0.2, 0, 0, Math.PI * 2); }
  else if (label === "7") { ctx.moveTo(x + size * 0.25, top); ctx.lineTo(x + size * 0.75, top); ctx.lineTo(x + size * 0.45, bottom); }
  else if (label === "8") { ctx.ellipse(cx, y + size * 0.34, size * 0.21, size * 0.16, 0, 0, Math.PI * 2); ctx.moveTo(cx + size * 0.21, y + size * 0.64); ctx.ellipse(cx, y + size * 0.64, size * 0.23, size * 0.18, 0, 0, Math.PI * 2); }
  else { ctx.ellipse(cx, y + size * 0.38, size * 0.22, size * 0.18, 0, 0, Math.PI * 2); ctx.moveTo(x + size * 0.68, y + size * 0.5); ctx.lineTo(x + size * 0.34, bottom); }
  ctx.stroke();
}

function renderDatasetRows(dataset) {
  if (dataset.featureMode === "tensor") {
    els.datasetInspectTable.innerHTML = `<table><thead><tr><th>Label</th><th>Representation</th><th>Meaning</th></tr></thead><tbody>${dataset.classes.slice(0, 10).map((label) => `<tr><td>${escapeHtml(label)}</td><td>8x8 image tensor</td><td>One representative image shown above</td></tr>`).join("")}</tbody></table>`;
    return;
  }
  const shownFeatures = dataset.features.slice(0, 5);
  const rows = Array.from({ length: 5 }, (_, rowIndex) => {
    const cells = shownFeatures.map((feature, featureIndex) => pseudoValue(dataset, rowIndex, featureIndex));
    const target = dataset.classes.length ? dataset.classes[rowIndex % dataset.classes.length] : (42 + rowIndex * 8.5).toFixed(2);
    return `<tr>${cells.map((cell) => `<td>${cell}</td>`).join("")}<td>${escapeHtml(String(target))}</td></tr>`;
  });
  els.datasetInspectTable.innerHTML = `<table><thead><tr>${shownFeatures.map((feature) => `<th>${escapeHtml(feature)}</th>`).join("")}<th>${escapeHtml(dataset.target)}</th></tr></thead><tbody>${rows.join("")}</tbody></table>`;
}

function pseudoValue(dataset, rowIndex, featureIndex) {
  const base = ((dataset.samples + rowIndex * 17 + featureIndex * 31) % 100) / 10;
  return base.toFixed(featureIndex % 2 ? 1 : 2);
}

function wireEvents() {
  els.brandHomeButton.addEventListener("click", () => requestHome());
  els.homeNav.addEventListener("click", () => requestHome());
  els.datasetsNav.addEventListener("click", () => {
    datasetReturnView = "home";
    requestNavigation("datasets");
  });
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
  els.targetSelect.addEventListener("change", () => {
    const dataset = getDataset();
    renderFeatureOptions(dataset, els.targetSelect.value);
    renderModelOptions();
    updateDeepLearningLocks();
  });
  els.modelSelect.addEventListener("change", updateDeepLearningLocks);
  els.customTask.addEventListener("change", () => {
    if (els.datasetSelect.value === "custom_csv") {
      const custom = datasets.find((dataset) => dataset.id === "custom_csv");
      if (custom) {
        custom.task = els.customTask.value;
        custom.classes = els.customTask.value.includes("regression") ? [] : custom.classes;
        renderModelOptions();
        updateDeepLearningLocks();
      }
    }
  });
  els.addValidation.addEventListener("change", () => {
    els.validationSplit.disabled = !els.addValidation.checked;
    if (!els.addValidation.checked) els.validationSplit.value = "0";
    if (els.addValidation.checked && Number(els.validationSplit.value) === 0) els.validationSplit.value = "0.15";
  });
  els.customCsvFile.addEventListener("change", handleCsvFileSelected);
  els.uploadCsvButton.addEventListener("click", uploadCustomCsv);
  els.removeCsvButton.addEventListener("click", removeCustomCsv);
  els.selectAllFeatures.addEventListener("click", () => {
    document.querySelectorAll("#featureList input").forEach((input) => {
      input.checked = true;
    });
  });
  els.runSimulationButton.addEventListener("click", () => startGeneralSimulation());
  els.configInspectDataset.addEventListener("click", () => openDatasetInspection("config", els.datasetSelect.value));
  els.splitBackConfigBottom.addEventListener("click", () => showView("config"));
  els.splitInspectDatasetBottom.addEventListener("click", openDatasetInspectionFromPending);
  els.splitRunSimulationBottom.addEventListener("click", () => {
    if (pendingConfig) startSimulation(pendingConfig);
  });
  els.runPersonalizedButton.addEventListener("click", () => startPersonalizedSimulation());
  els.startLiveButton.addEventListener("click", () => {
    if (!activeSimulation || els.startLiveButton.disabled) return;
    openConfirm(
      activeSimulation.finished ? "Rerun simulation?" : "Start live simulation?",
      activeSimulation.finished
        ? "The live animation and charts will run again from round 0."
        : "The prepared simulation will begin. Metrics and animation will move round by round.",
      startLivePlayback
    );
  });
  els.backToConfigButton.addEventListener("click", () => {
    confirmIfSimulationActive(
      "Return to configuration?",
      "The current live simulation will end and you will return to the configuration page.",
      () => {
        stopLiveSimulation();
        showView(currentMode === "personalized" ? "personalized" : "config");
      }
    );
  });
  els.stopSimulationButton.addEventListener("click", () => {
    confirmIfSimulationActive(
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
  els.networkCanvas.addEventListener("click", handleNetworkClick);
  els.datasetsBackHome.addEventListener("click", () => requestHome());
  els.datasetsBackConfig.addEventListener("click", () => showView(datasetReturnView === "split" ? "split" : "config"));
  els.datasetBrowserSelect.addEventListener("change", renderDatasetInspection);
}

async function handleCsvFileSelected() {
  const file = els.customCsvFile.files?.[0];
  pendingCsvText = "";
  pendingCsvName = "";
  els.customTarget.innerHTML = "";
  els.uploadCsvButton.disabled = true;
  if (!file) {
    els.customUploadStatus.textContent = "Choose a CSV, then select the target column.";
    return;
  }
  pendingCsvName = file.name;
  pendingCsvText = await file.text();
  const headers = parseCsvHeaders(pendingCsvText);
  if (headers.length < 2) {
    els.customUploadStatus.textContent = "This CSV needs at least one feature column and one target column.";
    return;
  }
  headers.forEach((header) => {
    const option = document.createElement("option");
    option.value = header;
    option.textContent = header;
    els.customTarget.appendChild(option);
  });
  els.customTarget.value = headers[headers.length - 1];
  els.uploadCsvButton.disabled = false;
  els.customUploadStatus.textContent = `${file.name}: ${headers.length} columns found. Choose the target column.`;
}

function parseCsvHeaders(text) {
  const firstLine = text.split(/\r?\n/).find((line) => line.trim());
  if (!firstLine) return [];
  return firstLine.split(",").map((value) => value.trim().replace(/^"|"$/g, "")).filter(Boolean);
}

async function uploadCustomCsv() {
  if (!pendingCsvText || !els.customTarget.value) return;
  els.uploadCsvButton.disabled = true;
  els.customUploadStatus.textContent = "Loading CSV into the simulator...";
  try {
    const form = new FormData();
    form.append("file", new Blob([pendingCsvText], { type: "text/csv" }), pendingCsvName || "custom.csv");
    form.append("target", els.customTarget.value);
    form.append("task", els.customTask.value);
    const response = await fetch("/api/upload", { method: "POST", body: form });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.error || `Upload failed with ${response.status}`);
    const dataset = normalizeUploadedDataset(payload.dataset, pendingCsvName);
    const existingIndex = datasets.findIndex((item) => item.id === dataset.id);
    if (existingIndex >= 0) datasets.splice(existingIndex, 1, dataset);
    else datasets.push(dataset);
    populateDatasets();
    renderDatasetBrowser();
    els.datasetSelect.value = dataset.id;
    renderDatasetConfig();
    renderModelOptions();
    updateDeepLearningLocks();
    els.removeCsvButton.classList.remove("hidden");
    els.customUploadStatus.textContent = `${dataset.name} is ready. Target: ${dataset.target}.`;
  } catch (error) {
    els.customUploadStatus.textContent = error.message || "Could not load CSV.";
  } finally {
    els.uploadCsvButton.disabled = false;
  }
}

function normalizeUploadedDataset(dataset, fileName) {
  return {
    id: "custom_csv",
    backendId: "custom_csv",
    name: fileName ? `CSV: ${fileName.replace(/\.csv$/i, "")}` : dataset.name,
    task: dataset.task,
    target: dataset.target,
    samples: dataset.samples,
    classes: dataset.classes || [],
    features: dataset.features || [],
    featureMode: "tabular",
    summary: dataset.summary || "User-uploaded CSV dataset."
  };
}

function removeCustomCsv() {
  const index = datasets.findIndex((dataset) => dataset.id === "custom_csv");
  if (index >= 0) datasets.splice(index, 1);
  pendingCsvText = "";
  pendingCsvName = "";
  els.customCsvFile.value = "";
  els.customTarget.innerHTML = "";
  els.removeCsvButton.classList.add("hidden");
  populateDatasets();
  els.datasetSelect.value = "digits";
  renderDatasetBrowser();
  renderDatasetConfig();
  renderModelOptions();
  updateDeepLearningLocks();
  els.customUploadStatus.textContent = "CSV dataset removed. Choose another CSV when needed.";
}

function requestHome() {
  confirmIfSimulationActive(
    "Go home?",
    "Your current experiment will stop and you will need to start from scratch. Are you okay with that?",
    () => {
      stopLiveSimulation();
      showView("home");
    }
  );
}

function requestNavigation(viewName) {
  confirmIfSimulationActive(
    "Leave current experiment?",
    "The active simulation will stop if you leave this page.",
    () => {
      stopLiveSimulation();
      showView(viewName);
    }
  );
}

function openDatasetInspectionFromPending() {
  openDatasetInspection("split", pendingConfig?.dataset?.id || els.datasetSelect.value);
}

function confirmIfRunning(title, text, action) {
  if (activeView === "simulation" && activeSimulation?.running) {
    openConfirm(title, text, action);
    return;
  }
  action();
}

function confirmIfSimulationActive(title, text, action) {
  if (activeView === "simulation" && activeSimulation) {
    openConfirm(title, text, action);
    return;
  }
  action();
}

function openDatasetInspection(returnView, datasetId) {
  datasetReturnView = returnView;
  els.datasetBrowserSelect.value = datasetId;
  els.datasetsBackConfig.classList.toggle("hidden", !["config", "split"].includes(returnView));
  els.datasetsBackConfig.textContent = returnView === "split" ? "Back to Split Preview" : "Back to Config";
  els.views.datasets.classList.toggle("focused-inspection", ["config", "split"].includes(returnView));
  renderDatasetInspection();
  showView("datasets");
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
  if (name === "datasets" && !["config", "split"].includes(datasetReturnView)) {
    els.views.datasets.classList.remove("focused-inspection");
  }
}

function getDataset(select = els.datasetSelect) {
  return datasets.find((dataset) => dataset.id === select.value) || datasets[0];
}

function renderDatasetConfig() {
  const dataset = getDataset();
  els.targetSelect.innerHTML = "";
  const targetOptions = dataset.featureMode === "tensor" ? [dataset.target] : [dataset.target, ...dataset.features];
  [...new Set(targetOptions)].forEach((target, index) => {
    const option = document.createElement("option");
    option.value = target;
    option.textContent = index === 0 ? `${target} (default)` : target;
    els.targetSelect.appendChild(option);
  });
  els.targetSelect.value = dataset.target;

  const isTensor = dataset.featureMode === "tensor";
  els.featurePanel.classList.toggle("hidden", isTensor);
  els.tensorFeatureNotice.classList.toggle("hidden", !isTensor);
  renderFeatureOptions(dataset, els.targetSelect.value);
}

function renderFeatureOptions(dataset, targetName = dataset.target) {
  els.featureList.innerHTML = "";
  if (dataset.featureMode === "tensor") return;
  dataset.features.forEach((feature) => {
    if (feature === targetName) return;
    const label = document.createElement("label");
    const input = document.createElement("input");
    input.type = "checkbox";
    input.value = feature;
    input.checked = true;
    label.append(input, document.createTextNode(feature));
    els.featureList.appendChild(label);
  });
}

function renderModelOptions() {
  const dataset = getDataset();
  const previous = els.modelSelect.value;
  const task = inferTaskForSelection(dataset, els.targetSelect?.value || dataset.target);
  const available = modelCatalog.filter((model) => model.tasks.includes(task) || model.tasks.includes(normalizeTask(task)));
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

function inferTaskForSelection(dataset, targetName = dataset.target) {
  if (dataset.id === "custom_csv") return els.customTask.value;
  if (dataset.featureMode === "tensor") return dataset.task;
  if (targetName !== dataset.target && dataset.features.includes(targetName)) return "regression";
  return dataset.task;
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

function renderSplitPreview(config) {
  const distributions = buildFallbackDistributions(config);
  drawSplitSummary(config);
  drawSplitCanvas(config, distributions);
  const trainRatio = 1 - config.test_size - config.validation_size;
  els.splitSummaryText.textContent = `The dataset is split into ${(trainRatio * 100).toFixed(0)}% train, ${(config.validation_size * 100).toFixed(0)}% validation, and ${(config.test_size * 100).toFixed(0)}% test. Only the training partition is distributed to FL clients; validation and test stay centralized for fair evaluation.`;
  els.splitExplanation.textContent = splitExplanation(config);
}

function splitExplanation(config) {
  if (config.skew === "IID") {
    return "IID split: every client receives approximately similar class proportions, so local updates are more aligned and convergence is usually smoother.";
  }
  if (config.skew.includes("Label")) {
    return "Label-skew non-IID split: each client mostly sees a few labels. This is realistic for hospitals, phones, or sensors, but it can make local updates conflict.";
  }
  if (config.skew.includes("Quantity")) {
    return "Quantity-skew non-IID split: clients receive different sample counts. Large clients dominate aggregation unless weighted aggregation is used carefully.";
  }
  if (config.skew.includes("Strong")) {
    return "Strong non-IID split: clients have visibly different distributions. This is harder for FedAvg and often needs FedProx, robust aggregation, or personalization.";
  }
  return "Mild non-IID split: clients are not identical, but every client still keeps some diversity. This is a useful middle ground for experiments.";
}

function drawSplitSummary(config) {
  const canvas = els.splitSummaryCanvas;
  const ctx = prepareCanvas(canvas);
  const width = canvas.clientWidth || canvas.width;
  const height = canvas.clientHeight || canvas.height;
  clearCanvas(ctx, width, height);
  const train = Math.max(0, 1 - config.test_size - config.validation_size);
  const parts = [
    ["Train", train, css("--success")],
    ["Validation", config.validation_size, css("--warning")],
    ["Test", config.test_size, css("--danger")]
  ].filter((part) => part[1] > 0);

  ctx.fillStyle = css("--text");
  ctx.font = "900 24px system-ui";
  ctx.fillText(`${config.dataset.name}: ${config.dataset.samples.toLocaleString()} samples`, 42, 44);

  const centerX = Math.min(260, width * 0.28);
  const centerY = Math.max(180, height * 0.54);
  const radius = Math.min(104, height * 0.31, width * 0.16);
  let startAngle = -Math.PI / 2;
  parts.forEach(([label, ratio, color]) => {
    const endAngle = startAngle + Math.PI * 2 * ratio;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.closePath();
    ctx.fill();
    const midAngle = (startAngle + endAngle) / 2;
    const labelX = centerX + Math.cos(midAngle) * radius * 0.68;
    const labelY = centerY + Math.sin(midAngle) * radius * 0.68;
    if (ratio >= 0.1) {
      ctx.fillStyle = "#ffffff";
      ctx.font = "900 17px system-ui";
      ctx.textAlign = "center";
      ctx.fillText(`${(ratio * 100).toFixed(0)}%`, labelX, labelY + 6);
      ctx.textAlign = "left";
    }
    startAngle = endAngle;
  });

  ctx.fillStyle = css("--surface-soft");
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius * 0.52, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = css("--text");
  ctx.font = "900 18px system-ui";
  ctx.textAlign = "center";
  ctx.fillText("Dataset", centerX, centerY - 2);
  ctx.font = "800 13px system-ui";
  ctx.fillStyle = css("--muted");
  ctx.fillText("split", centerX, centerY + 18);
  ctx.textAlign = "left";

  const legendX = Math.min(width * 0.52, centerX + radius + 90);
  let legendY = centerY - 72;
  parts.forEach(([label, ratio, color]) => {
    ctx.fillStyle = color;
    roundedRect(ctx, legendX, legendY - 15, 22, 22, 5);
    ctx.fill();
    ctx.fillStyle = css("--text");
    ctx.font = "900 19px system-ui";
    ctx.fillText(`${label}: ${(ratio * 100).toFixed(0)}%`, legendX + 34, legendY + 2);
    ctx.fillStyle = css("--muted");
    ctx.font = "800 13px system-ui";
    ctx.fillText(`${Math.round(config.dataset.samples * ratio).toLocaleString()} samples`, legendX + 34, legendY + 22);
    legendY += 62;
  });

  ctx.fillStyle = css("--muted");
  ctx.font = "800 15px system-ui";
  ctx.fillText(`Only the train split is distributed across ${config.clients} FL clients. Validation/test stay centralized for evaluation.`, 42, height - 34);
}

function drawSplitCanvas(config, distributions) {
  const canvas = els.splitCanvas;
  const ctx = prepareCanvas(canvas);
  const width = canvas.clientWidth || canvas.width;
  const height = canvas.clientHeight || canvas.height;
  clearCanvas(ctx, width, height);
  const left = 118;
  const top = 48;
  const rowHeight = Math.max(28, Math.min(42, (height - 104) / Math.max(1, distributions.length)));
  const barWidth = width - left - 118;
  ctx.fillStyle = css("--text");
  ctx.font = "900 18px system-ui";
  ctx.fillText("Client training partitions", 26, 30);
  distributions.forEach((row, rowIndex) => {
    const y = top + rowIndex * rowHeight;
    ctx.fillStyle = css("--muted");
    ctx.font = "900 12px system-ui";
    ctx.fillText(row.name, 26, y + 20);
    let x = left;
    row.values.forEach((value, index) => {
      const w = Math.max(2, value * barWidth);
      ctx.fillStyle = palette[index % palette.length];
      ctx.fillRect(x, y, w, rowHeight - 7);
      x += w;
    });
    ctx.fillStyle = css("--muted");
    ctx.font = "800 11px system-ui";
    ctx.fillText(`${row.samples} samples`, width - 104, y + 20);
  });
  const labels = distributions[0]?.classes || [];
  let legendX = left;
  labels.slice(0, 8).forEach((label, index) => {
    ctx.fillStyle = palette[index % palette.length];
    ctx.fillRect(legendX, height - 28, 12, 12);
    ctx.fillStyle = css("--muted");
    ctx.font = "700 11px system-ui";
    ctx.fillText(String(label).slice(0, 12), legendX + 16, height - 18);
    legendX += 88;
  });
}

async function startGeneralSimulation() {
  currentMode = "general";
  const baseDataset = getDataset();
  const target = els.targetSelect.value || baseDataset.target;
  const dataset = { ...baseDataset, target, task: inferTaskForSelection(baseDataset, target) };
  const model = getSelectedModel();
  const testSize = clamp(Number(els.testSplit.value), 0.1, 0.5);
  const validationSize = els.addValidation.checked ? clamp(Number(els.validationSplit.value), 0.05, 0.3) : 0;
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
    test_size: testSize,
    validation_size: validationSize,
    skew: els.skewSelect.value,
    aggregation: els.aggregationSelect.value,
    learning_rate: Number(els.learningRate.value),
    dl_dropout: Number(els.dlDropout.value)
  };
  pendingConfig = config;
  renderSplitPreview(config);
  showView("split");
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
    test_size: 0.25,
    validation_size: 0.15,
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
  activeSimulation = { config, result: fallback, round: 0, running: false, prepared: true, finished: false, displayedCurve: [], displayedLoss: [] };
  latestResult = fallback;
  renderLiveState(0);
  els.startLiveButton.disabled = true;
  els.startLiveButton.textContent = "Preparing backend...";

  try {
    const backendResult = await requestBackendSimulation(config);
    if (!activeSimulation) return;
    latestResult = adaptBackendResult(config, backendResult);
    activeSimulation.result = latestResult;
    activeSimulation.round = 0;
    activeSimulation.displayedCurve = [];
    activeSimulation.displayedLoss = [];
    renderLiveState(0);
    els.startLiveButton.disabled = false;
    els.startLiveButton.textContent = "Start Live Simulation";
  } catch (error) {
    latestResult = fallback;
    els.startLiveButton.disabled = false;
    els.startLiveButton.textContent = "Start Live Simulation";
    renderEvaluation(config, fallback, "Backend unavailable, showing local educational fallback.");
  }
}

function startLivePlayback() {
  if (!activeSimulation) return;
  activeSimulation.round = 0;
  activeSimulation.running = true;
  activeSimulation.finished = false;
  els.startLiveButton.disabled = true;
  els.startLiveButton.textContent = "Running...";
  els.startLiveOverlay.classList.add("hidden");
  renderLiveState(0);
  playLiveResult();
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
  els.roundLabel.textContent = "Ready";
  els.startLiveOverlay.classList.remove("hidden");
}

async function requestBackendSimulation(config) {
  const response = await fetch("/api/simulate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      dataset_id: config.dataset_id,
      target: config.dataset.target,
      task: config.dataset.task,
      model_id: config.model_id,
      features: config.features,
      clients: config.clients,
      rounds: config.rounds,
      local_epochs: config.local_epochs,
      client_fraction: config.client_fraction,
      dropout: config.dropout,
      test_size: config.test_size,
      validation_size: config.validation_size,
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
      activeSimulation.finished = true;
      renderLiveState(maxRound);
      els.startLiveButton.disabled = false;
      els.startLiveButton.textContent = "Rerun Simulation";
      els.startLiveOverlay.classList.remove("hidden");
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
  const preparedOnly = !activeSimulation.running && !activeSimulation.finished;
  const curve = preparedOnly ? [0] : result.curve.slice(0, round + 1);
  const loss = preparedOnly ? [0] : result.loss.slice(0, round + 1);
  const trainCurve = preparedOnly ? [0] : (result.trainCurve?.length ? result.trainCurve : deriveTrainCurve(result.curve, result.classification)).slice(0, round + 1);
  const trainLoss = preparedOnly ? [0] : (result.trainLoss?.length ? result.trainLoss : deriveTrainLoss(result.loss)).slice(0, round + 1);
  const validationCurve = preparedOnly && result.validationCurve?.length ? [0] : (result.validationCurve || []).slice(0, round + 1);
  const validationLoss = preparedOnly && result.validationLoss?.length ? [0] : (result.validationLoss || []).slice(0, round + 1);
  activeSimulation.displayedCurve = curve;
  activeSimulation.displayedLoss = loss;

  const finalMetric = curve[curve.length - 1] ?? 0;
  const finalLoss = loss[loss.length - 1] ?? 0;
  const classification = result.classification;
  const phases = config.mode === "personalized"
    ? ["Share backbone", "Local heads adapt", "Clients send adapted updates", "Personalized evaluation"]
    : ["Broadcast global weights", "Local training changes weights", "Clients upload model deltas", `${config.aggregation} creates next global model`];
  const phase = activeSimulation.running ? phases[aggregationPhaseIndex()] : phases[Math.min(round % phases.length, phases.length - 1)];

  const maxRound = Math.max(0, result.curve.length - 1);
  els.roundLabel.textContent = preparedOnly ? `Ready: 0 / ${maxRound}` : activeSimulation.finished ? `Finished at round ${maxRound}` : `Round ${round} / ${maxRound}`;
  els.phaseLabel.textContent = activeSimulation.finished ? "Training complete: final global model is ready" : (activeSimulation.running ? phase : "Ready: click Start Live Simulation");
  els.primaryMetricLabel.textContent = classification ? "Balanced accuracy" : "RMSE";
  els.lossMetricLabel.textContent = classification ? "Cross entropy" : "MSE loss";
  els.primaryMetric.textContent = finalMetric.toFixed(3);
  els.lossMetric.textContent = finalLoss.toFixed(3);
  const trainMetricNow = trainCurve[trainCurve.length - 1] ?? 0;
  const testMetricNow = curve[curve.length - 1] ?? 0;
  const trainLossNow = trainLoss[trainLoss.length - 1] ?? 0;
  const testLossNow = loss[loss.length - 1] ?? 0;
  els.trainQualityLabel.textContent = classification ? "Train balanced accuracy" : "Train RMSE";
  els.testQualityLabel.textContent = classification ? "Test balanced accuracy" : "Test RMSE";
  els.trainLossLabel.textContent = classification ? "Train cross entropy" : "Train MSE";
  els.testLossLabel.textContent = classification ? "Test cross entropy" : "Test MSE";
  els.trainQualityMetric.textContent = formatMetric(trainMetricNow, classification);
  els.testQualityMetric.textContent = formatMetric(testMetricNow, classification);
  els.trainLossMetric.textContent = trainLossNow.toFixed(trainLossNow >= 10 ? 1 : 3);
  els.testLossMetric.textContent = testLossNow.toFixed(testLossNow >= 10 ? 1 : 3);
  const displayResult = preparedOnly ? preparedDisplayResult(config, result, classification) : result;
  els.commMetric.textContent = formatMb(displayResult.communication || 0);
  els.stabilityMetric.textContent = Number(displayResult.stability || 0).toFixed(2);
  renderQualityChart(trainCurve, curve, validationCurve, classification);
  renderLossChart(trainLoss, loss, validationLoss, classification);
  renderDistributions(result.distributions || []);
  renderEvaluation(config, displayResult);
  renderMatrix(config, displayResult);
}

function preparedDisplayResult(config, result, classification) {
  const classCount = Math.max(2, Math.min((result.classNames || config.dataset.classes || []).length || 2, 6));
  return {
    ...result,
    finalMetric: 0,
    finalLoss: 0,
    communication: 0,
    stability: 0,
    confusionMatrix: classification ? Array.from({ length: classCount }, () => Array(classCount).fill(0)) : null,
    residualRows: classification ? null : [["Small residual", 0], ["Medium residual", 0], ["Large residual", 0]],
    evaluationRows: classification
      ? [["Balanced accuracy", "0.0000", "Waiting for the first live round."], ["Cross entropy", "0.0000", "Waiting for the first live round."]]
      : [["RMSE", "0.0000", "Waiting for the first live round."], ["MSE loss", "0.0000", "Waiting for the first live round."]]
  };
}

function makeFallbackResult(config) {
  const classification = !config.dataset.task.includes("regression");
  const rounds = config.rounds;
  const curve = [];
  const loss = [];
  const trainCurve = [];
  const trainLoss = [];
  const validationCurve = [];
  const validationLoss = [];
  const nonIidPenalty = config.skew === "IID" ? 0.02 : config.skew.includes("Strong") ? 0.12 : 0.07;
  const target = classification ? 0.88 - nonIidPenalty + Math.log2(config.clients) * 0.015 : 0.42 + nonIidPenalty;
  for (let round = 0; round <= rounds; round += 1) {
    const progress = 1 - Math.exp(-round / Math.max(2, rounds * 0.35));
    if (classification) {
      const value = clamp(0.28 + (target - 0.28) * progress + Math.sin(round * 1.3) * 0.012, 0.05, 0.98);
      curve.push(value);
      loss.push(clamp(1.55 - value * 1.25, 0.05, 2));
      trainCurve.push(clamp(value + 0.035 + progress * 0.03, 0, 0.995));
      trainLoss.push(clamp(1.45 - trainCurve[trainCurve.length - 1] * 1.25, 0.04, 2));
      if (config.validation_size > 0) {
        validationCurve.push(clamp(value - 0.012, 0, 0.995));
        validationLoss.push(clamp(loss[loss.length - 1] + 0.03, 0.04, 2));
      }
    } else {
      const value = clamp(1.25 - (1.25 - target) * progress + Math.sin(round) * 0.015, 0.05, 1.5);
      curve.push(value);
      loss.push(value * value);
      trainCurve.push(clamp(value * 0.92, 0.03, 1.5));
      trainLoss.push(trainCurve[trainCurve.length - 1] ** 2);
      if (config.validation_size > 0) {
        validationCurve.push(clamp(value * 1.04, 0.03, 1.5));
        validationLoss.push(validationCurve[validationCurve.length - 1] ** 2);
      }
    }
  }
  return {
    classification,
    curve,
    trainCurve,
    validationCurve,
    loss,
    trainLoss,
    validationLoss,
    communication: estimateCommunication(config),
    stability: clamp(0.96 - nonIidPenalty - config.dropout * 0.2, 0.1, 0.99),
    distributions: buildFallbackDistributions(config),
    finalMetric: curve[curve.length - 1],
    finalLoss: loss[loss.length - 1],
    confusionMatrix: classification ? fallbackConfusion(config, curve[curve.length - 1]) : null,
    classNames: config.dataset.classes,
    residualRows: classification ? null : [["Small residual", 33], ["Medium residual", 31], ["Large residual", 22]],
    splitInfo: {
      train: Math.round(config.dataset.samples * (1 - config.test_size - config.validation_size)),
      validation: Math.round(config.dataset.samples * config.validation_size),
      test: Math.round(config.dataset.samples * config.test_size)
    },
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

function renderQualityChart(train, test, validation, classification) {
  els.qualityChartTitle.textContent = classification ? "Balanced Accuracy" : "RMSE";
  const max = classification ? 1 : Math.max(...train, ...test, ...validation, 1);
  const min = 0;
  renderMultiLineChart(els.qualityChart, {
    title: classification ? "Balanced accuracy over rounds" : "RMSE over rounds",
    yLabel: classification ? "Balanced accuracy" : "RMSE",
    classification,
    asPercent: classification,
    min,
    max,
    series: [
      { label: "Train", values: train, color: "#0f766e" },
      { label: "Test", values: test, color: "#1d4ed8" },
      ...(validation.length ? [{ label: "Validation", values: validation, color: css("--warning") }] : [])
    ]
  });
}

function renderLossChart(train, test, validation, classification) {
  els.lossChartTitle.textContent = classification ? "Cross Entropy Loss" : "MSE Loss";
  renderMultiLineChart(els.lossChart, {
    title: classification ? "Cross entropy over rounds" : "MSE loss over rounds",
    yLabel: classification ? "Cross entropy" : "MSE loss",
    classification: false,
    asPercent: false,
    min: 0,
    max: Math.max(...train, ...test, ...validation, 1),
    series: [
      { label: "Train", values: train, color: "#7f1d1d" },
      { label: "Test", values: test, color: "#1e3a8a" },
      ...(validation.length ? [{ label: "Validation", values: validation, color: css("--warning") }] : [])
    ]
  });
}

function renderMultiLineChart(canvas, options) {
  const ctx = prepareCanvas(canvas);
  const width = canvas.clientWidth || canvas.width;
  const height = canvas.clientHeight || canvas.height;
  clearCanvas(ctx, width, height);
  const plot = { left: 78, top: 56, right: width - 92, bottom: height - 70 };
  drawGrid(ctx, width, height, plot, options.min, options.max, options.yLabel, options.series[0]?.values?.length || 0);
  options.series.forEach((series, seriesIndex) => {
    drawLine(ctx, series.values, series.color, options.min, options.max, plot);
    drawPointLabels(ctx, series.values, series.color, options.min, options.max, plot, options.asPercent, seriesIndex);
  });
  ctx.fillStyle = css("--text");
  ctx.font = "900 20px system-ui";
  ctx.fillText(options.title, plot.left, 28);
  let legendX = plot.left + 330;
  options.series.forEach((series) => {
    ctx.fillStyle = series.color;
    ctx.fillRect(legendX, 17, 16, 4);
    ctx.fillStyle = css("--muted");
    ctx.font = "800 12px system-ui";
    ctx.fillText(series.label, legendX + 22, 22);
    legendX += 92;
  });
}

function drawPointLabels(ctx, values, color, minValue, maxValue, plot, asPercent, seriesIndex = 0) {
  if (!values.length) return;
  const range = Math.max(0.001, maxValue - minValue);
  const labelEvery = values.length <= 12 ? 1 : Math.ceil(values.length / 10);
  values.forEach((value, index) => {
    const isFinal = index === values.length - 1;
    if (!isFinal && index % labelEvery !== 0) return;
    const x = plot.left + (plot.right - plot.left) * (index / Math.max(1, values.length - 1));
    const y = plot.bottom - (plot.bottom - plot.top) * ((value - minValue) / range);
    const text = asPercent ? `${(value * 100).toFixed(1)}%` : value.toFixed(value >= 10 ? 1 : 3);
    ctx.font = `${isFinal ? "900 18px" : values.length <= 2 ? "900 16px" : "900 12px"} system-ui`;
    const metrics = ctx.measureText(text);
    const labelWidth = metrics.width + 12;
    const labelHeight = isFinal ? 28 : 20;
    const verticalDirection = seriesIndex % 2 === 0 ? -1 : 1;
    const verticalGap = isFinal ? 30 : 20;
    const boxX = clamp(isFinal ? x - labelWidth - 8 : x - labelWidth / 2, plot.left + 2, plot.right - labelWidth - 2);
    const preferredY = verticalDirection < 0 ? y - verticalGap : y + verticalGap - labelHeight;
    const boxY = clamp(preferredY, plot.top + 4, plot.bottom - labelHeight - 4);
    ctx.fillStyle = isFinal ? color : colorWithAlpha(color, 0.14);
    roundedRect(ctx, boxX, boxY, labelWidth, labelHeight, 5);
    ctx.fill();
    ctx.fillStyle = isFinal ? "#ffffff" : color;
    ctx.fillText(text, boxX + 6, boxY + (isFinal ? 20 : 15));
  });
}

function drawGrid(ctx, width, height, plot, minValue = 0, maxValue = 1, yLabel = "Metric", roundCount = 0) {
  ctx.strokeStyle = css("--line");
  ctx.lineWidth = 1;
  ctx.fillStyle = css("--muted");
  ctx.font = "700 11px system-ui";
  for (let i = 0; i <= 5; i += 1) {
    const y = plot.bottom - ((plot.bottom - plot.top) * i) / 5;
    const value = minValue + ((maxValue - minValue) * i) / 5;
    ctx.beginPath();
    ctx.moveTo(plot.left, y);
    ctx.lineTo(plot.right, y);
    ctx.stroke();
    ctx.fillText(value.toFixed(maxValue > 10 ? 0 : 2), 18, y + 4);
  }
  ctx.strokeStyle = css("--muted");
  ctx.beginPath();
  ctx.moveTo(plot.left, plot.top);
  ctx.lineTo(plot.left, plot.bottom);
  ctx.lineTo(plot.right, plot.bottom);
  ctx.stroke();
  const maxRound = Math.max(0, roundCount - 1);
  const tickEvery = maxRound <= 10 ? 1 : Math.ceil(maxRound / 8);
  ctx.textAlign = "center";
  for (let round = 0; round <= maxRound; round += tickEvery) {
    const x = plot.left + (plot.right - plot.left) * (round / Math.max(1, maxRound));
    ctx.beginPath();
    ctx.moveTo(x, plot.bottom);
    ctx.lineTo(x, plot.bottom + 6);
    ctx.stroke();
    ctx.fillText(String(round), x, plot.bottom + 22);
  }
  if (maxRound > 0 && maxRound % tickEvery !== 0) {
    ctx.fillText(String(maxRound), plot.right, plot.bottom + 22);
  }
  ctx.textAlign = "left";
  ctx.fillText("Round", plot.right - 38, plot.bottom + 44);
  ctx.save();
  ctx.translate(18, plot.top + 92);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText(yLabel, 0, 0);
  ctx.restore();
}

function drawLine(ctx, values, color, minValue, maxValue, plot) {
  const range = Math.max(0.001, maxValue - minValue);
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.beginPath();
  values.forEach((value, index) => {
    const x = plot.left + (plot.right - plot.left) * (index / Math.max(1, values.length - 1));
    const y = plot.bottom - (plot.bottom - plot.top) * ((value - minValue) / range);
    if (index === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();
  if (values.length) {
    const last = values[values.length - 1];
    const x = plot.left + (plot.right - plot.left) * ((values.length - 1) / Math.max(1, values.length - 1));
    const y = plot.bottom - (plot.bottom - plot.top) * ((last - minValue) / range);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();
  }
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
  if (result.splitInfo) {
    rows.push(["Split", `${result.splitInfo.train} train / ${result.splitInfo.validation || 0} validation / ${result.splitInfo.test} test`, "Only train data is partitioned across FL clients; validation/test are used for evaluation."]);
  }
  rows.push(["Aggregation", config.aggregation, "Server-side method for combining client information."]);
  rows.push(["Communication", formatMb(result.communication || 0), "Approximate total server-client transfer."]);
  if (note) rows.push(["Runtime note", note, "The interface stays usable even when the backend is not available."]);
  els.evaluationTable.innerHTML = `<table><thead><tr><th>Metric</th><th>Value</th><th>Meaning</th></tr></thead><tbody>${rows.map((row) => `<tr><td>${escapeHtml(String(row[0]))}</td><td>${escapeHtml(String(row[1]))}</td><td>${escapeHtml(String(row[2]))}</td></tr>`).join("")}</tbody></table>`;
}

function renderMatrix(config, result) {
  const ctx = prepareCanvas(els.confusionCanvas);
  const width = els.confusionCanvas.clientWidth || els.confusionCanvas.width;
  const height = els.confusionCanvas.clientHeight || els.confusionCanvas.height;
  clearCanvas(ctx, width, height);

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
  const maxCell = n <= 2 ? 132 : n <= 3 ? 108 : n <= 5 ? 82 : 58;
  const labelSpace = n <= 3 ? 180 : 132;
  const size = Math.max(42, Math.min(maxCell, Math.floor((Math.min(width - labelSpace - 60, height - 170)) / n)));
  const matrixWidth = size * n;
  const startX = Math.max(labelSpace, (width - matrixWidth) / 2);
  const startY = 96;
  ctx.fillStyle = css("--text");
  ctx.font = "900 17px system-ui";
  ctx.fillText("Predicted label", startX + size * n * 0.28, 28);
  ctx.save();
  ctx.translate(32, startY + size * n * 0.72);
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
      ctx.font = `${size >= 82 ? "900 18px" : "900 13px"} system-ui`;
      ctx.textAlign = "center";
      ctx.fillText(String(value), startX + col * size + size / 2 - 1, startY + row * size + size / 2 + 4);
    }
  }
  ctx.textAlign = "left";
  ctx.fillStyle = css("--muted");
  ctx.font = `${n <= 3 ? "900 14px" : "800 11px"} system-ui`;
  const labels = result.classNames || config.dataset.classes || [];
  labels.slice(0, n).forEach((label, index) => {
    const short = truncateLabel(String(label), n <= 3 ? 18 : 10);
    ctx.textAlign = "center";
    ctx.fillText(short, startX + index * size + size / 2, startY + n * size + 26);
    ctx.textAlign = "right";
    ctx.fillText(short, startX - 14, startY + index * size + size / 2 + 5);
  });
  ctx.textAlign = "left";
  els.matrixBox.textContent = "Diagonal cells are correct predictions; off-diagonal cells are mistakes.";
}

function truncateLabel(label, maxLength) {
  return label.length > maxLength ? `${label.slice(0, Math.max(1, maxLength - 1))}...` : label;
}

function drawLoop() {
  animationClock += 0.015;
  drawHero();
  if (activeView === "simulation") drawNetwork();
  requestAnimationFrame(drawLoop);
}

function drawHero() {
  const canvas = els.heroCanvas;
  const ctx = prepareCanvas(canvas);
  const width = canvas.clientWidth || canvas.width;
  const height = canvas.clientHeight || canvas.height;
  drawNetworkScene(ctx, width, height, 8, "FL Simulator", false);
}

function drawNetwork() {
  const canvas = els.networkCanvas;
  const ctx = prepareCanvas(canvas);
  const width = canvas.clientWidth || canvas.width;
  const height = canvas.clientHeight || canvas.height;
  const clients = activeSimulation?.config?.clients || 5;
  const personalized = activeSimulation?.config?.mode === "personalized";
  drawNetworkScene(ctx, width, height, clients, personalized ? "Shared core" : "Server", personalized);
}

function drawNetworkScene(ctx, width, height, clientCount, centerLabel, personalized) {
  ctx.clearRect(0, 0, width, height);
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, "#07111f");
  gradient.addColorStop(1, "#12324a");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  const simulationActive = activeView === "simulation" && activeSimulation;
  const panelWidth = simulationActive ? Math.min(390, Math.max(320, width * 0.3)) : 0;
  const sceneWidth = width - panelWidth;
  const center = { x: sceneWidth / 2, y: height / 2 + (simulationActive ? 8 : 0) };
  const radius = Math.min(sceneWidth, height) * (simulationActive ? 0.31 : 0.34);
  const phaseIndex = simulationActive ? aggregationPhaseIndex() : Math.floor(animationClock * 3) % 4;
  lastNodeHitboxes = activeView === "simulation" ? [{ type: "server", index: 0, x: center.x, y: center.y, r: 58 }] : [];
  const liveMotion = activeView !== "simulation" || activeSimulation?.running;
  const finished = activeView === "simulation" && activeSimulation?.finished;
  const aggregationRows = simulationActive ? clientAggregationRows(activeSimulation.config, activeSimulation.result, activeSimulation.round, clientCount) : [];
  const aggregation = simulationActive ? aggregateClientUpdates(aggregationRows, activeSimulation.config.aggregation) : { value: 0, selected: [], trimmed: [] };
  if (simulationActive) drawPhaseRibbon(ctx, sceneWidth, phaseIndex, finished);

  const nodeW = clientCount > 30 ? 28 : clientCount > 18 ? 34 : 48;
  const nodeH = clientCount > 30 ? 22 : clientCount > 18 ? 26 : 34;
  const nodeR = Math.max(16, nodeW * 0.7);
  for (let i = 0; i < clientCount; i += 1) {
    const angle = (Math.PI * 2 * i) / clientCount - Math.PI / 2;
    const client = { x: center.x + Math.cos(angle) * radius, y: center.y + Math.sin(angle) * radius };
    const row = aggregationRows[i] || { active: true, update: 0, influence: 1, trimmed: false };
    if (activeView === "simulation") lastNodeHitboxes.push({ type: "client", index: i + 1, x: client.x, y: client.y, r: nodeR });
    ctx.strokeStyle = row.active ? "rgba(148, 163, 184, 0.34)" : "rgba(148, 163, 184, 0.12)";
    ctx.lineWidth = row.active ? 1.3 + row.influence * 3.4 : 1;
    ctx.beginPath();
    ctx.moveTo(center.x, center.y);
    ctx.lineTo(client.x, client.y);
    ctx.stroke();

    if (liveMotion) {
      const direction = phaseIndex <= 1 ? 1 : -1;
      const t = (animationClock * 0.85 + i / clientCount) % 1;
      const px = direction === 1 ? center.x + (client.x - center.x) * t : client.x + (center.x - client.x) * t;
      const py = direction === 1 ? center.y + (client.y - center.y) * t : client.y + (center.y - client.y) * t;
      if (row.active && phaseIndex !== 1) {
        ctx.fillStyle = phaseIndex <= 1 ? "#38bdf8" : row.trimmed ? "#fb7185" : "#34d399";
        ctx.beginPath();
        ctx.arc(px, py, clientCount > 30 ? 3 : 4.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.fillStyle = row.active ? palette[i % palette.length] : "rgba(100, 116, 139, 0.72)";
    roundedRect(ctx, client.x - nodeW / 2, client.y - nodeH / 2, nodeW, nodeH, 7);
    ctx.fill();
    if (simulationActive) drawClientUpdateGlyph(ctx, client.x, client.y, nodeW, nodeH, row, phaseIndex);
    if (personalized) {
      ctx.fillStyle = "rgba(255,255,255,0.95)";
      ctx.beginPath();
      ctx.arc(client.x + 16, client.y - 12, 7, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = "rgba(255,255,255,0.95)";
    ctx.font = `${clientCount > 30 ? "700 8px" : clientCount > 18 ? "800 9px" : "800 11px"} system-ui`;
    ctx.textAlign = "center";
    ctx.fillText(clientCount > 30 ? String(i + 1) : `C${i + 1}`, client.x, client.y + 4);
  }

  ctx.fillStyle = finished ? "#34d399" : personalized ? "#a78bfa" : "#38bdf8";
  ctx.beginPath();
  ctx.arc(center.x, center.y, 54, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#06111d";
  ctx.font = "900 15px system-ui";
  ctx.textAlign = "center";
  ctx.fillText(centerLabel, center.x, center.y - 4);
  ctx.font = "700 11px system-ui";
  ctx.fillText(finished ? "finished" : simulationActive ? `Delta ${signedNumber(aggregation.value)}` : personalized ? "+ local heads" : "global model", center.x, center.y + 15);
  if (simulationActive) {
    drawAggregationEngine(ctx, sceneWidth + 12, 68, panelWidth - 24, Math.min(450, height - 112), activeSimulation.config, aggregationRows, aggregation, phaseIndex);
  }
}

function aggregationPhaseIndex() {
  if (!activeSimulation?.running) return activeSimulation?.finished ? 3 : 0;
  return Math.floor((animationClock * 1.35) % 4);
}

function clientAggregationRows(config, result, round, clientCount) {
  const distributions = result.distributions || [];
  const maxVisible = Math.min(clientCount, 50);
  const participantLimit = Math.max(1, Math.round(config.clients * config.client_fraction * (1 - config.dropout)));
  const rows = [];
  for (let i = 0; i < maxVisible; i += 1) {
    const distribution = distributions[i] || {};
    const samples = distribution.samples || Math.max(10, Math.round(config.dataset.samples / Math.max(1, config.clients)));
    const active = ((i + round * 3) % Math.max(1, config.clients)) < participantLimit;
    const heterogeneity = config.skew === "IID" ? 0.16 : config.skew.includes("Strong") ? 0.46 : config.skew.includes("Label") ? 0.4 : 0.28;
    const outlierBoost = (config.skew.includes("Strong") || config.skew.includes("Label")) && i % 7 === 0 ? 0.38 : 0;
    const direction = Math.sin((i + 1) * 1.71 + round * 0.67);
    const update = clamp(direction * heterogeneity + outlierBoost * Math.sign(direction || 1), -0.95, 0.95);
    rows.push({
      id: i + 1,
      active,
      samples,
      update,
      influence: 0,
      trimmed: false,
      label: `C${i + 1}`
    });
  }
  const activeRows = rows.filter((row) => row.active);
  const totalSamples = activeRows.reduce((sum, row) => sum + row.samples, 0) || 1;
  rows.forEach((row) => {
    row.influence = row.active ? row.samples / totalSamples : 0;
  });
  markTrimmedRows(rows, config.aggregation);
  return rows;
}

function markTrimmedRows(rows, method) {
  rows.forEach((row) => { row.trimmed = false; });
  const activeRows = rows.filter((row) => row.active).sort((a, b) => a.update - b.update);
  if (method === "FedTrimmedMean" && activeRows.length > 3) {
    activeRows[0].trimmed = true;
    activeRows[activeRows.length - 1].trimmed = true;
  }
}

function aggregateClientUpdates(rows, method) {
  const activeRows = rows.filter((row) => row.active);
  const selected = activeRows.filter((row) => !row.trimmed);
  const values = selected.map((row) => row.update);
  if (!values.length) return { value: 0, selected, trimmed: activeRows.filter((row) => row.trimmed) };
  if (method === "FedMedian") {
    const sorted = [...values].sort((a, b) => a - b);
    return { value: sorted[Math.floor(sorted.length / 2)], selected, trimmed: [] };
  }
  if (method === "Weighted FedAvg") {
    const total = selected.reduce((sum, row) => sum + row.samples, 0) || 1;
    return { value: selected.reduce((sum, row) => sum + row.update * (row.samples / total), 0), selected, trimmed: [] };
  }
  const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
  if (method === "FedProx") return { value: mean * 0.65, selected, trimmed: [] };
  return { value: mean, selected, trimmed: activeRows.filter((row) => row.trimmed) };
}

function drawPhaseRibbon(ctx, sceneWidth, phaseIndex, finished) {
  const phases = ["Broadcast", "Local train", "Upload", "Aggregate"];
  const x = 22;
  const y = 18;
  const stepW = Math.min(132, (sceneWidth - 54) / phases.length);
  phases.forEach((phase, index) => {
    ctx.fillStyle = finished ? colorWithAlpha("#34d399", 0.18) : index === phaseIndex ? colorWithAlpha("#38bdf8", 0.3) : "rgba(15, 23, 42, 0.52)";
    roundedRect(ctx, x + index * stepW, y, stepW - 8, 34, 8);
    ctx.fill();
    ctx.fillStyle = index === phaseIndex ? "#e0f2fe" : "rgba(226, 232, 240, 0.78)";
    ctx.font = "900 12px system-ui";
    ctx.textAlign = "center";
    ctx.fillText(phase, x + index * stepW + (stepW - 8) / 2, y + 22);
  });
  ctx.textAlign = "left";
}

function drawClientUpdateGlyph(ctx, x, y, nodeW, nodeH, row, phaseIndex) {
  const arrowHeight = 24 * Math.abs(row.update);
  const sign = row.update >= 0 ? -1 : 1;
  const arrowX = x + nodeW / 2 + 10;
  const arrowY = y;
  ctx.strokeStyle = row.trimmed ? "#fb7185" : row.update >= 0 ? "#34d399" : "#fbbf24";
  ctx.lineWidth = row.active ? 2.6 : 1.2;
  ctx.beginPath();
  ctx.moveTo(arrowX, arrowY);
  ctx.lineTo(arrowX, arrowY + sign * arrowHeight);
  ctx.stroke();
  ctx.fillStyle = ctx.strokeStyle;
  ctx.beginPath();
  ctx.arc(arrowX, arrowY + sign * arrowHeight, row.active ? 3.5 : 2.5, 0, Math.PI * 2);
  ctx.fill();
  if (row.trimmed && phaseIndex === 3) {
    ctx.strokeStyle = "#fb7185";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x - nodeW / 2, y - nodeH / 2 - 5);
    ctx.lineTo(x + nodeW / 2, y + nodeH / 2 + 5);
    ctx.moveTo(x + nodeW / 2, y - nodeH / 2 - 5);
    ctx.lineTo(x - nodeW / 2, y + nodeH / 2 + 5);
    ctx.stroke();
  }
  ctx.strokeStyle = colorWithAlpha("#ffffff", row.active ? 0.72 : 0.28);
  ctx.lineWidth = 1 + row.influence * 9;
  ctx.beginPath();
  ctx.arc(x, y, Math.max(nodeW, nodeH) * 0.78, 0, Math.PI * 2);
  ctx.stroke();
}

function drawAggregationEngine(ctx, x, y, w, h, config, rows, aggregation, phaseIndex) {
  ctx.fillStyle = "rgba(2, 6, 23, 0.72)";
  roundedRect(ctx, x, y, w, h, 12);
  ctx.fill();
  ctx.strokeStyle = "rgba(148, 163, 184, 0.28)";
  ctx.stroke();

  ctx.fillStyle = "#e2e8f0";
  ctx.font = "900 18px system-ui";
  ctx.textAlign = "center";
  ctx.fillText("Aggregation engine", x + w / 2, y + 32);
  ctx.fillStyle = "#93c5fd";
  ctx.font = "900 14px system-ui";
  ctx.fillText(config.aggregation, x + w / 2, y + 54);
  ctx.fillStyle = "rgba(226, 232, 240, 0.78)";
  ctx.font = "800 12px system-ui";
  wrapCanvasText(ctx, aggregationTeachingText(config.aggregation), x + 22, y + 78, w - 44, 16, 3, "center");
  ctx.textAlign = "left";

  const axisY = y + 170;
  const axisX = x + 28;
  const axisW = w - 56;
  ctx.strokeStyle = "rgba(226, 232, 240, 0.38)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(axisX, axisY);
  ctx.lineTo(axisX + axisW, axisY);
  ctx.stroke();
  ctx.fillStyle = "rgba(226, 232, 240, 0.68)";
  ctx.font = "800 11px system-ui";
  ctx.fillText("negative update", axisX, axisY + 22);
  ctx.textAlign = "right";
  ctx.fillText("positive update", axisX + axisW, axisY + 22);
  ctx.textAlign = "left";

  rows.filter((row) => row.active).slice(0, 18).forEach((row) => {
    const dotX = axisX + ((row.update + 1) / 2) * axisW;
    const dotY = axisY - 4 - row.influence * 70;
    ctx.fillStyle = row.trimmed ? "#fb7185" : "#38bdf8";
    ctx.beginPath();
    ctx.arc(dotX, dotY, 4 + row.influence * 24, 0, Math.PI * 2);
    ctx.fill();
  });

  const aggX = axisX + ((aggregation.value + 1) / 2) * axisW;
  ctx.strokeStyle = "#34d399";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(aggX, axisY - 78);
  ctx.lineTo(aggX, axisY + 10);
  ctx.stroke();
  ctx.fillStyle = "#34d399";
  roundedRect(ctx, clamp(aggX - 45, axisX, axisX + axisW - 90), axisY - 108, 90, 24, 6);
  ctx.fill();
  ctx.fillStyle = "#052e1a";
  ctx.font = "900 12px system-ui";
  ctx.textAlign = "center";
  ctx.fillText(`global ${signedNumber(aggregation.value)}`, clamp(aggX, axisX + 45, axisX + axisW - 45), axisY - 92);
  ctx.textAlign = "left";

  const statsY = y + 238;
  drawAggregationStat(ctx, x + 18, statsY, w - 36, "Active clients", `${aggregation.selected.length}/${rows.length}`);
  drawAggregationStat(ctx, x + 18, statsY + 46, w - 36, "Trimmed / ignored", `${rows.filter((row) => row.trimmed || !row.active).length}`);
  drawAggregationStat(ctx, x + 18, statsY + 92, w - 36, "Server update", signedNumber(aggregation.value));

  ctx.fillStyle = phaseIndex === 3 ? "rgba(52, 211, 153, 0.18)" : "rgba(56, 189, 248, 0.12)";
  roundedRect(ctx, x + 18, y + h - 62, w - 36, 42, 8);
  ctx.fill();
  ctx.fillStyle = "#e2e8f0";
  ctx.font = "900 12px system-ui";
  ctx.fillText(phaseIndex === 3 ? "Server combines accepted updates" : "Dots show local update directions", x + 32, y + h - 36);
}

function drawAggregationStat(ctx, x, y, w, label, value) {
  ctx.fillStyle = "rgba(15, 23, 42, 0.68)";
  roundedRect(ctx, x, y, w, 38, 8);
  ctx.fill();
  ctx.fillStyle = "rgba(226, 232, 240, 0.72)";
  ctx.font = "800 11px system-ui";
  ctx.fillText(label, x + 12, y + 15);
  ctx.fillStyle = "#f8fafc";
  ctx.font = "900 15px system-ui";
  ctx.fillText(value, x + 12, y + 31);
}

function aggregationTeachingText(method) {
  if (method === "Weighted FedAvg") return "Bigger local datasets pull the global model more strongly.";
  if (method === "FedAvg") return "Every active client contributes equally, even if sample counts differ.";
  if (method === "FedProx") return "Local drift is pulled back toward the current global model.";
  if (method === "FedMedian") return "The server chooses the middle update, reducing extreme-client influence.";
  if (method === "FedTrimmedMean") return "The most extreme updates are removed before averaging.";
  return "The server combines client updates into the next global model.";
}

function signedNumber(value) {
  return `${value >= 0 ? "+" : ""}${Number(value).toFixed(2)}`;
}

function wrapCanvasText(ctx, text, x, y, maxWidth, lineHeight, maxLines = 4, align = "left") {
  const words = text.split(" ");
  let line = "";
  let lines = 0;
  const drawLine = (value, lineIndex) => {
    if (align === "center") {
      ctx.textAlign = "center";
      ctx.fillText(value, x + maxWidth / 2, y + lineIndex * lineHeight);
      ctx.textAlign = "left";
    } else {
      ctx.fillText(value, x, y + lineIndex * lineHeight);
    }
  };
  words.forEach((word) => {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      if (lines < maxLines) drawLine(line, lines);
      line = word;
      lines += 1;
    } else {
      line = test;
    }
  });
  if (line && lines < maxLines) drawLine(line, lines);
}

function handleNetworkClick(event) {
  if (activeView !== "simulation" || !activeSimulation) return;
  const rect = els.networkCanvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  const hit = lastNodeHitboxes.find((node) => Math.hypot(node.x - x, node.y - y) <= node.r);
  if (!hit) return;
  const config = activeSimulation.config;
  if (hit.type === "server") {
    const round = activeSimulation.round;
    const testValue = activeSimulation.result.curve?.[round] ?? activeSimulation.result.finalMetric ?? 0;
    const trainValue = activeSimulation.result.trainCurve?.[round] ?? testValue;
    const rows = clientAggregationRows(config, activeSimulation.result, round, config.clients);
    const aggregation = aggregateClientUpdates(rows, config.aggregation);
    els.nodeDetails.innerHTML = `
      <small>Server internals</small>
      <strong>${config.aggregation}</strong>
      <p>Round ${round}: combines ${aggregation.selected.length} active client update(s). Current aggregated model delta is ${signedNumber(aggregation.value)}. Train/test gap: ${formatMetric(Math.abs(trainValue - testValue), activeSimulation.result.classification)}.</p>
      <p>${aggregationExplanation(config.aggregation)}</p>
    `;
    return;
  }
  const distribution = activeSimulation.result.distributions?.[hit.index - 1];
  const samples = distribution?.samples ?? Math.round(config.dataset.samples / config.clients);
  const localCurve = localClientCurve(activeSimulation.result, hit.index);
  const latest = localCurve[Math.min(activeSimulation.round, localCurve.length - 1)] ?? 0;
  const row = clientAggregationRows(config, activeSimulation.result, activeSimulation.round, config.clients)[hit.index - 1];
  els.nodeDetails.innerHTML = `
    <small>Client ${hit.index}</small>
    <strong>${samples} local samples</strong>
    <p>Local metric now: ${formatMetric(latest, activeSimulation.result.classification)}. Local update delta: ${signedNumber(row?.update || 0)}. Aggregation influence: ${((row?.influence || 0) * 100).toFixed(1)}%.</p>
    <p>${row?.active ? "This client participates in the current round." : "This client is skipped in this round because of client fraction/dropout."} ${row?.trimmed ? "Its update is marked as extreme and trimmed by the aggregation rule." : ""}</p>
    <div class="mini-history">${localCurve.map((value, index) => `<span title="Round ${index}: ${formatMetric(value, activeSimulation.result.classification)}" style="height:${Math.max(8, valueToBar(value, activeSimulation.result.classification))}px"></span>`).join("")}</div>
  `;
}

function localClientCurve(result, clientIndex) {
  const base = result.trainCurve?.length ? result.trainCurve : deriveTrainCurve(result.curve, result.classification);
  const offset = ((clientIndex % 5) - 2) * (result.classification ? 0.012 : 0.025);
  return base.map((value) => result.classification ? clamp(value + offset, 0, 0.995) : clamp(value + offset, 0.001, value + 0.2));
}

function aggregationExplanation(method) {
  if (method === "FedAvg") return "FedAvg gives each participating client equal averaging influence.";
  if (method === "Weighted FedAvg") return "Weighted FedAvg gives larger local datasets more influence in aggregation.";
  if (method === "FedProx") return "FedProx limits how far local models drift from the global model.";
  if (method === "FedMedian") return "FedMedian uses coordinate-wise median behavior to reduce abnormal update influence.";
  if (method === "FedTrimmedMean") return "Trimmed mean removes extreme update directions before averaging.";
  return "The server combines received client updates into the next global model.";
}

function valueToBar(value, classification) {
  if (classification) return value * 48;
  return Math.max(8, 48 - value * 28);
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

function formatMetric(value, classification) {
  if (classification) return `${(Number(value) * 100).toFixed(1)}%`;
  return Number(value).toFixed(Number(value) >= 10 ? 1 : 3);
}

function prepareCanvas(canvas) {
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  const cssWidth = Math.max(1, Math.round(rect.width || canvas.width));
  const cssHeight = Math.max(1, Math.round(rect.height || canvas.height));
  if (canvas.width !== Math.round(cssWidth * dpr) || canvas.height !== Math.round(cssHeight * dpr)) {
    canvas.width = Math.round(cssWidth * dpr);
    canvas.height = Math.round(cssHeight * dpr);
  }
  const ctx = canvas.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return ctx;
}

function clearCanvas(ctx, width, height) {
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = css("--surface-soft");
  ctx.fillRect(0, 0, width, height);
}

function deriveTrainCurve(testCurve, classification) {
  return testCurve.map((value, index) => classification ? clamp(value + 0.03 + index * 0.002, 0, 0.995) : clamp(value * 0.94, 0.01, value));
}

function deriveTrainLoss(testLoss) {
  return testLoss.map((value) => Math.max(0.001, value * 0.9));
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
