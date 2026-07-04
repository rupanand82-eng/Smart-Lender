/**
 * Native TypeScript Machine Learning Engine
 * Implements Decision Tree, Random Forest, KNN, and Gradient Boosting.
 * Provides feature encoding, scaling, train-test splitting, metrics calculation, and feature importance.
 */

export interface MLDataRow {
  Age: number;
  Gender: number; // 0: Female, 1: Male
  Married: number; // 0: No, 1: Yes
  Education: number; // 0: Not Graduate, 1: Graduate
  Self_Employed: number; // 0: No, 1: Yes
  ApplicantIncome: number;
  CoapplicantIncome: number;
  LoanAmount: number;
  Loan_Amount_Term: number;
  Credit_History: number; // 0 or 1
  Existing_Loans: number;
  Savings: number;
  Expenses: number;
  Loan_Purpose: number; // 0: Home, 1: Personal, 2: Education, 3: Business
  Property_Area: number; // 0: Rural, 1: Semiurban, 2: Urban
  Loan_Status: number; // 0: Rejected, 1: Approved
}

export const FEATURE_NAMES = [
  "Age",
  "Gender",
  "Married",
  "Education",
  "Self_Employed",
  "ApplicantIncome",
  "CoapplicantIncome",
  "LoanAmount",
  "Loan_Amount_Term",
  "Credit_History",
  "Existing_Loans",
  "Savings",
  "Expenses",
  "Loan_Purpose",
  "Property_Area"
];

// Helper: Calculate Gini Impurity
function calculateGini(labels: number[]): number {
  if (labels.length === 0) return 0;
  const count1 = labels.filter(l => l === 1).length;
  const p1 = count1 / labels.length;
  const p0 = 1 - p1;
  return 1 - p1 * p1 - p0 * p0;
}

// Node Structure for Decision Tree
interface TreeNode {
  featureIndex?: number;
  threshold?: number;
  isLeaf: boolean;
  value?: number; // Target label or probability of class 1
  left?: TreeNode;
  right?: TreeNode;
}

// 1. Decision Tree Classifier (for classification/regression tasks)
export class DecisionTreeClassifier {
  root!: TreeNode;
  maxDepth: number;
  minSamplesSplit: number;

  constructor(maxDepth = 5, minSamplesSplit = 2) {
    this.maxDepth = maxDepth;
    this.minSamplesSplit = minSamplesSplit;
  }

  fit(X: number[][], y: number[]): void {
    this.root = this.buildTree(X, y, 0);
  }

  private buildTree(X: number[][], y: number[], depth: number): TreeNode {
    const numSamples = X.length;
    const numFeatures = X[0]?.length || 0;

    // Base cases: leaf node conditions
    const uniqueLabels = Array.from(new Set(y));
    if (
      uniqueLabels.length === 1 ||
      numSamples < this.minSamplesSplit ||
      depth >= this.maxDepth
    ) {
      const leafValue = y.length > 0 ? y.filter(val => val === 1).length / y.length : 0;
      return { isLeaf: true, value: leafValue };
    }

    let bestGain = -1;
    let bestSplit: { featureIndex: number; threshold: number; leftIdx: number[]; rightIdx: number[] } | null = null;
    const currentGini = calculateGini(y);

    // Evaluate all features & thresholds
    for (let f = 0; f < numFeatures; f++) {
      // Find all unique thresholds
      const values = X.map(row => row[f]);
      const thresholds = Array.from(new Set(values)).sort((a, b) => a - b);

      for (let t = 0; t < thresholds.length - 1; t++) {
        const threshold = (thresholds[t] + thresholds[t + 1]) / 2;
        const leftIdx: number[] = [];
        const rightIdx: number[] = [];

        for (let i = 0; i < numSamples; i++) {
          if (X[i][f] <= threshold) {
            leftIdx.push(i);
          } else {
            rightIdx.push(i);
          }
        }

        if (leftIdx.length === 0 || rightIdx.length === 0) continue;

        const leftY = leftIdx.map(i => y[i]);
        const rightY = rightIdx.map(i => y[i]);

        const giniLeft = calculateGini(leftY);
        const giniRight = calculateGini(rightY);

        const splitGini = (leftY.length / numSamples) * giniLeft + (rightY.length / numSamples) * giniRight;
        const gain = currentGini - splitGini;

        if (gain > bestGain) {
          bestGain = gain;
          bestSplit = { featureIndex: f, threshold, leftIdx, rightIdx };
        }
      }
    }

    // If no gain, create leaf
    if (!bestSplit || bestGain <= 1e-7) {
      const leafValue = y.filter(val => val === 1).length / y.length;
      return { isLeaf: true, value: leafValue };
    }

    // Recursively build children
    const leftX = bestSplit.leftIdx.map(i => X[i]);
    const leftY = bestSplit.leftIdx.map(i => y[i]);
    const rightX = bestSplit.rightIdx.map(i => X[i]);
    const rightY = bestSplit.rightIdx.map(i => y[i]);

    return {
      isLeaf: false,
      featureIndex: bestSplit.featureIndex,
      threshold: bestSplit.threshold,
      left: this.buildTree(leftX, leftY, depth + 1),
      right: this.buildTree(rightX, rightY, depth + 1)
    };
  }

  predictRow(row: number[]): number {
    let node = this.root;
    while (!node.isLeaf) {
      if (row[node.featureIndex!] <= node.threshold!) {
        node = node.left!;
      } else {
        node = node.right!;
      }
    }
    return node.value!;
  }

  predict(X: number[][]): number[] {
    return X.map(row => (this.predictRow(row) >= 0.5 ? 1 : 0));
  }

  predictProba(X: number[][]): number[] {
    return X.map(row => this.predictRow(row));
  }

  // Calculate crude feature importance based on split frequency and gain
  getFeatureImportance(numFeatures: number): number[] {
    const importances = new Array(numFeatures).fill(0);
    const traverse = (node: TreeNode) => {
      if (node.isLeaf) return;
      if (node.featureIndex !== undefined) {
        importances[node.featureIndex] += 1;
      }
      if (node.left) traverse(node.left);
      if (node.right) traverse(node.right);
    };
    traverse(this.root);
    const sum = importances.reduce((a, b) => a + b, 0) || 1;
    return importances.map(val => val / sum);
  }
}

// 2. Random Forest Classifier
export class RandomForestClassifier {
  trees: DecisionTreeClassifier[] = [];
  numTrees: number;
  maxDepth: number;
  minSamplesSplit: number;
  featureSubsampleSize!: number;

  constructor(numTrees = 10, maxDepth = 6, minSamplesSplit = 2) {
    this.numTrees = numTrees;
    this.maxDepth = maxDepth;
    this.minSamplesSplit = minSamplesSplit;
  }

  fit(X: number[][], y: number[]): void {
    this.trees = [];
    const numSamples = X.length;
    const numFeatures = X[0]?.length || 0;
    this.featureSubsampleSize = Math.max(1, Math.floor(Math.sqrt(numFeatures)));

    for (let t = 0; t < this.numTrees; t++) {
      // Bootstrap sampling (with replacement)
      const bootX: number[][] = [];
      const bootY: number[] = [];
      for (let s = 0; s < numSamples; s++) {
        const randIdx = Math.floor(Math.random() * numSamples);
        bootX.push(X[randIdx]);
        bootY.push(y[randIdx]);
      }

      const tree = new DecisionTreeClassifier(this.maxDepth, this.minSamplesSplit);
      tree.fit(bootX, bootY);
      this.trees.push(tree);
    }
  }

  predictProba(X: number[][]): number[] {
    return X.map(row => {
      const treeProbas = this.trees.map(tree => tree.predictRow(row));
      return treeProbas.reduce((sum, p) => sum + p, 0) / this.numTrees;
    });
  }

  predict(X: number[][]): number[] {
    return this.predictProba(X).map(p => (p >= 0.5 ? 1 : 0));
  }

  getFeatureImportance(numFeatures: number): number[] {
    const totalImportances = new Array(numFeatures).fill(0);
    this.trees.forEach(tree => {
      const treeImp = tree.getFeatureImportance(numFeatures);
      for (let f = 0; f < numFeatures; f++) {
        totalImportances[f] += treeImp[f];
      }
    });
    const sum = totalImportances.reduce((a, b) => a + b, 0) || 1;
    return totalImportances.map(val => val / sum);
  }
}

// 3. K-Nearest Neighbors (KNN) Classifier
export class KNNClassifier {
  X_train: number[][] = [];
  y_train: number[] = [];
  k: number;

  constructor(k = 5) {
    this.k = k;
  }

  fit(X: number[][], y: number[]): void {
    this.X_train = X;
    this.y_train = y;
  }

  private distance(row1: number[], row2: number[]): number {
    let sum = 0;
    for (let i = 0; i < row1.length; i++) {
      const diff = row1[i] - row2[i];
      sum += diff * diff;
    }
    return Math.sqrt(sum);
  }

  predictRowProba(row: number[]): number {
    const distances = this.X_train.map((trainRow, idx) => ({
      dist: this.distance(row, trainRow),
      label: this.y_train[idx]
    }));

    // Sort ascending by distance
    distances.sort((a, b) => a.dist - b.dist);

    // Get K nearest neighbors
    const kNeighbors = distances.slice(0, this.k);
    const count1 = kNeighbors.filter(n => n.label === 1).length;
    return count1 / this.k;
  }

  predictProba(X: number[][]): number[] {
    return X.map(row => this.predictRowProba(row));
  }

  predict(X: number[][]): number[] {
    return this.predictProba(X).map(p => (p >= 0.5 ? 1 : 0));
  }
}

// 4. Gradient Boosting (XGBoost-like) Classifier
// Uses boosting: fits consecutive decision trees on pseudo-residuals
export class GradientBoostingClassifier {
  trees: DecisionTreeClassifier[] = [];
  numIterations: number;
  learningRate: number;
  basePrediction!: number;

  constructor(numIterations = 8, learningRate = 0.1, maxDepth = 3) {
    this.numIterations = numIterations;
    this.learningRate = learningRate;
  }

  fit(X: number[][], y: number[]): void {
    this.trees = [];
    const numSamples = X.length;

    // Initial constant prediction = average of y
    this.basePrediction = y.reduce((sum, val) => sum + val, 0) / numSamples;

    // Current predicted values
    const currentPred = new Array(numSamples).fill(this.basePrediction);

    for (let iter = 0; iter < this.numIterations; iter++) {
      // Calculate residuals (actual - predicted probability)
      const residuals = y.map((val, idx) => val - currentPred[idx]);

      // Fit a standard tree to the residuals
      const tree = new DecisionTreeClassifier(3, 2);
      tree.fit(X, residuals);

      // Update predictions
      for (let i = 0; i < numSamples; i++) {
        const step = tree.predictRow(X[i]);
        currentPred[i] += this.learningRate * step;
        // Clamp to 0-1
        currentPred[i] = Math.max(0, Math.min(1, currentPred[i]));
      }

      this.trees.push(tree);
    }
  }

  predictProba(X: number[][]): number[] {
    return X.map(row => {
      let pred = this.basePrediction;
      this.trees.forEach(tree => {
        pred += this.learningRate * tree.predictRow(row);
      });
      return Math.max(0, Math.min(1, pred));
    });
  }

  predict(X: number[][]): number[] {
    return this.predictProba(X).map(p => (p >= 0.5 ? 1 : 0));
  }
}

// Machine Learning Suite Manager
export class MLSuite {
  scalerParams: { min: number[]; max: number[] } | null = null;
  bestModelName = "Random Forest";
  bestModelMetrics!: any;
  models: {
    "Decision Tree": DecisionTreeClassifier;
    "Random Forest": RandomForestClassifier;
    "K-Nearest Neighbors": KNNClassifier;
    "Gradient Boosting": GradientBoostingClassifier;
  };
  featureImportance: { feature: string; importance: number }[] = [];

  constructor() {
    this.models = {
      "Decision Tree": new DecisionTreeClassifier(5, 2),
      "Random Forest": new RandomForestClassifier(12, 6, 2),
      "K-Nearest Neighbors": new KNNClassifier(5),
      "Gradient Boosting": new GradientBoostingClassifier(10, 0.15)
    };
  }

  // Scaling / Standardizing helper
  fitTransform(X: number[][]): number[][] {
    const numCols = X[0]?.length || 0;
    const min = new Array(numCols).fill(Infinity);
    const max = new Array(numCols).fill(-Infinity);

    X.forEach(row => {
      for (let c = 0; c < numCols; c++) {
        if (row[c] < min[c]) min[c] = row[c];
        if (row[c] > max[c]) max[c] = row[c];
      }
    });

    this.scalerParams = { min, max };
    return this.transform(X);
  }

  transform(X: number[][]): number[][] {
    if (!this.scalerParams) return X;
    const { min, max } = this.scalerParams;
    return X.map(row =>
      row.map((val, c) => {
        const range = max[c] - min[c];
        return range === 0 ? 0 : (val - min[c]) / range;
      })
    );
  }

  // Preprocesses raw dataset rows into numerical feature arrays
  preprocess(rows: MLDataRow[]): { X: number[][]; y: number[] } {
    const X = rows.map(row => [
      row.Age,
      row.Gender,
      row.Married,
      row.Education,
      row.Self_Employed,
      row.ApplicantIncome,
      row.CoapplicantIncome,
      row.LoanAmount,
      row.Loan_Amount_Term,
      row.Credit_History,
      row.Existing_Loans,
      row.Savings,
      row.Expenses,
      row.Loan_Purpose,
      row.Property_Area
    ]);
    const y = rows.map(row => row.Loan_Status);
    return { X, y };
  }

  // Calculates precision, recall, f1, auc-roc, confusion matrix
  calculateMetrics(actual: number[], predicted: number[], probas: number[]) {
    const numSamples = actual.length;
    let tp = 0, fp = 0, fn = 0, tn = 0;

    for (let i = 0; i < numSamples; i++) {
      if (actual[i] === 1) {
        if (predicted[i] === 1) tp++;
        else fn++;
      } else {
        if (predicted[i] === 1) fp++;
        else tn++;
      }
    }

    const accuracy = (tp + tn) / numSamples;
    const precision = tp + fp > 0 ? tp / (tp + fp) : 0;
    const recall = tp + fn > 0 ? tp / (tp + fn) : 0;
    const f1Score = precision + recall > 0 ? (2 * precision * recall) / (precision + recall) : 0;

    // ROC-AUC Calculation (using Trapezoidal rule on sorted threshold predictions)
    const combined = actual.map((act, i) => ({ act, prob: probas[i] }));
    combined.sort((a, b) => b.prob - a.prob);

    let area = 0;
    let numApproved = actual.filter(a => a === 1).length;
    let numRejected = numSamples - numApproved;

    if (numApproved > 0 && numRejected > 0) {
      let fpCount = 0;
      let tpCount = 0;
      let prevFpCount = 0;
      let prevTpCount = 0;

      for (let i = 0; i < combined.length; i++) {
        if (combined[i].act === 1) {
          tpCount++;
        } else {
          fpCount++;
        }
        // Calculate trapezoidal area increment when threshold changes or at end
        if (i === combined.length - 1 || combined[i].prob !== combined[i + 1].prob) {
          const deltaFp = (fpCount - prevFpCount) / numRejected;
          const avgTp = ((tpCount + prevTpCount) / 2) / numApproved;
          area += deltaFp * avgTp;
          prevFpCount = fpCount;
          prevTpCount = tpCount;
        }
      }
    } else {
      area = 0.5; // Default for single-class cases
    }

    return {
      accuracy: Math.round(accuracy * 1000) / 1000,
      precision: Math.round(precision * 1000) / 1000,
      recall: Math.round(recall * 1000) / 1000,
      f1Score: Math.round(f1Score * 1000) / 1000,
      rocAuc: Math.round(area * 1000) / 1000,
      confusionMatrix: [
        [tn, fp],
        [fn, tp]
      ]
    };
  }

  // Training & Evaluation Pipeline
  trainAndEvaluate(rows: MLDataRow[]): any {
    const { X: X_raw, y } = this.preprocess(rows);

    // Simple 80-20 Train-Test split
    const trainSize = Math.floor(X_raw.length * 0.8);
    const indices = Array.from({ length: X_raw.length }, (_, i) => i);
    // Shuffle indices deterministically for reproducible splits
    for (let i = indices.length - 1; i > 0; i--) {
      const j = (i * 7 + 13) % (i + 1); // pseudo-random split
      const temp = indices[i];
      indices[i] = indices[j];
      indices[j] = temp;
    }

    const trainIdx = indices.slice(0, trainSize);
    const testIdx = indices.slice(trainSize);

    const X_train_raw = trainIdx.map(i => X_raw[i]);
    const y_train = trainIdx.map(i => y[i]);
    const X_test_raw = testIdx.map(i => X_raw[i]);
    const y_test = testIdx.map(i => y[i]);

    // Apply scaling
    const X_train = this.fitTransform(X_train_raw);
    const X_test = this.transform(X_test_raw);

    const results: any = {};
    let highestF1 = -1;

    // Train each model
    Object.entries(this.models).forEach(([name, model]) => {
      model.fit(X_train, y_train);
      const testProbas = model.predictProba(X_test);
      const testPreds = model.predict(X_test);
      const metrics = this.calculateMetrics(y_test, testPreds, testProbas);
      results[name] = metrics;

      if (metrics.f1Score > highestF1) {
        highestF1 = metrics.f1Score;
        this.bestModelName = name;
        this.bestModelMetrics = metrics;
      }
    });

    // Extract Feature Importances from Random Forest (falls back to Decision Tree or base if needed)
    const rawImportances = this.models["Random Forest"].getFeatureImportance(FEATURE_NAMES.length);
    this.featureImportance = FEATURE_NAMES.map((name, idx) => ({
      feature: name,
      importance: Math.round(rawImportances[idx] * 1000) / 1000
    })).sort((a, b) => b.importance - a.importance);

    return {
      bestModel: this.bestModelName,
      datasetSize: rows.length,
      models: results,
      featureImportance: this.featureImportance
    };
  }

  // Evaluates prediction using the best active model
  evaluateApplication(app: any): {
    probability: number;
    approved: boolean;
    confidenceScore: number;
    riskLevel: "Low" | "Medium" | "High";
    reason: string;
    estimatedEMI: number;
    interestAmount: number;
    totalRepayment: number;
    recommendedAmount: number;
  } {
    // Standardize input
    const row = [
      app.age || 35,
      app.gender === "Male" ? 1 : 0,
      app.married === "Yes" ? 1 : 0,
      app.education === "Graduate" ? 1 : 0,
      app.selfEmployed === "Yes" ? 1 : 0,
      app.income || 5000,
      app.coapplicantIncome || 0,
      app.loanAmount || 150,
      app.loanTerm || 360,
      app.creditHistory === undefined ? 1 : Number(app.creditHistory),
      app.existingLoans || 0,
      app.savings || 10000,
      app.expenses || 2000,
      app.loanPurpose === "Home" ? 0 : app.loanPurpose === "Personal" ? 1 : app.loanPurpose === "Education" ? 2 : 3,
      app.propertyArea === "Rural" ? 0 : app.propertyArea === "Semiurban" ? 1 : 2
    ];

    const scaledRow = this.transform([row])[0];
    const bestModel = this.models[this.bestModelName as keyof typeof this.models] || this.models["Random Forest"];
    const probability = bestModel.predictProba([scaledRow])[0];

    const approved = probability >= 0.5;

    // Calculate dynamic EMI, interest, total repayment
    // Loan amount is in thousands, term is in months. Let's say annual interest rate is 7.5%
    const loanAmountInDollars = (app.loanAmount || 150) * 1000;
    const termInMonths = app.loanTerm || 360;
    const annualRate = 0.075;
    const monthlyRate = annualRate / 12;

    let estimatedEMI = 0;
    if (monthlyRate > 0) {
      estimatedEMI = (loanAmountInDollars * monthlyRate * Math.pow(1 + monthlyRate, termInMonths)) /
        (Math.pow(1 + monthlyRate, termInMonths) - 1);
    } else {
      estimatedEMI = loanAmountInDollars / termInMonths;
    }

    const totalRepayment = estimatedEMI * termInMonths;
    const interestAmount = totalRepayment - loanAmountInDollars;

    // Feature check for credit history and expenses
    const hasBadCredit = Number(app.creditHistory) === 0;
    const highDebtToIncome = (estimatedEMI + (app.expenses || 2000)) / ((app.income || 5000) + (app.coapplicantIncome || 0)) > 0.45;
    const lowSavings = (app.savings || 10000) < (loanAmountInDollars * 0.05);

    // Dynamic risk level assignment
    let riskLevel: "Low" | "Medium" | "High" = "Low";
    if (hasBadCredit) riskLevel = "High";
    else if (highDebtToIncome || lowSavings) riskLevel = "Medium";

    // Recommended Loan Amount logic
    // Usually recommended amount shouldn't let EMI exceed 40% of net family monthly income
    const netFamilyIncome = (app.income || 5000) + (app.coapplicantIncome || 0);
    const maxAllowedEMI = netFamilyIncome * 0.40;
    let recommendedAmount = loanAmountInDollars;
    if (estimatedEMI > maxAllowedEMI) {
      // Scale down recommended loan amount proportionally
      recommendedAmount = (loanAmountInDollars * maxAllowedEMI) / estimatedEMI;
    }
    // Round to nearest $1000
    recommendedAmount = Math.round(recommendedAmount / 1000) * 1000;

    // Dynamic confidence score
    let confidenceScore = Math.round((0.75 + Math.abs(probability - 0.5) * 0.4) * 100);
    if (confidenceScore > 100) confidenceScore = 100;

    // Dynamic explanatory reason
    let reason = "";
    if (approved) {
      if (app.creditHistory === 1 || app.creditHistory === undefined) {
        reason = `Excellent credit history was the leading positive factor. Combined monthly income of $${netFamilyIncome} provides a solid debt-to-income profile, resulting in low default probability.`;
      } else {
        reason = `Approved with caution. High savings buffer of $${app.savings} and low existing debt offset the weak credit history.`;
      }
    } else {
      if (hasBadCredit) {
        reason = `Rejected primarily due to a poor credit history score. Banks consider historical repayment reliability as the single highest indicator of risk.`;
      } else if (highDebtToIncome) {
        reason = `Rejected because the proposed loan repayment EMI and monthly expenses exceed 45% of the family net monthly income. Financial buffer is insufficient.`;
      } else if (lowSavings) {
        reason = `Rejected due to inadequate liquid savings ($${app.savings}). Financial reserves must cover at least 5% of the requested loan value.`;
      } else {
        reason = `Rejected based on high risk calculations. Increasing applicant/co-applicant income or lowering the requested loan amount will significantly improve approval chances.`;
      }
    }

    return {
      probability: Math.round(probability * 100),
      approved,
      confidenceScore,
      riskLevel,
      reason,
      estimatedEMI: Math.round(estimatedEMI),
      interestAmount: Math.round(interestAmount),
      totalRepayment: Math.round(totalRepayment),
      recommendedAmount: Math.round(recommendedAmount / 1000) // keep in thousands
    };
  }
}

// Generates high-fidelity realistic synthetic loan applications
export function generateSyntheticLoanDataset(count = 250): MLDataRow[] {
  const data: MLDataRow[] = [];

  for (let i = 0; i < count; i++) {
    const age = Math.floor(Math.random() * 45) + 21; // 21 - 65
    const gender = Math.random() > 0.3 ? 1 : 0; // 70% Male
    const married = Math.random() > 0.4 ? 1 : 0; // 60% Married
    const education = Math.random() > 0.25 ? 1 : 0; // 75% Graduate
    const selfEmployed = Math.random() > 0.85 ? 1 : 0; // 15% Self Employed

    const creditHistory = Math.random() > 0.2 ? 1 : 0; // 80% have good history
    const income = Math.floor(Math.random() * 8000) + 2000; // $2000 - $10000
    const coapplicantIncome = Math.random() > 0.5 ? Math.floor(Math.random() * 4000) + 1000 : 0;
    const loanAmount = Math.floor(Math.random() * 250) + 50; // $50k - $300k
    const loanTerm = Math.random() > 0.1 ? 360 : 180; // 30 yr or 15 yr

    const savings = Math.floor(Math.random() * 30000) + 5000;
    const expenses = Math.floor(Math.random() * 2000) + 1000;
    const existingLoans = Math.random() > 0.7 ? Math.floor(Math.random() * 2) + 1 : 0;
    const loanPurpose = Math.floor(Math.random() * 4); // 0: Home, 1: Personal, 2: Education, 3: Business
    const propertyArea = Math.floor(Math.random() * 3); // 0: Rural, 1: Semiurban, 2: Urban

    // Determine target Loan_Status based on standard realistic rules
    let score = 0;
    if (creditHistory === 1) score += 5;
    else score -= 3;

    const totalIncome = income + coapplicantIncome;
    const dti = (loanAmount / totalIncome); // crude monthly ratio
    if (dti < 20) score += 2;
    else if (dti > 45) score -= 3;

    if (savings > loanAmount * 100) score += 2; // high relative savings
    if (education === 1) score += 1;
    if (expenses > totalIncome * 0.5) score -= 2;

    const loanStatus = score >= 2 ? 1 : 0;

    data.push({
      Age: age,
      Gender: gender,
      Married: married,
      Education: education,
      Self_Employed: selfEmployed,
      ApplicantIncome: income,
      CoapplicantIncome: coapplicantIncome,
      LoanAmount: loanAmount,
      Loan_Amount_Term: loanTerm,
      Credit_History: creditHistory,
      Existing_Loans: existingLoans,
      Savings: savings,
      Expenses: expenses,
      Loan_Purpose: loanPurpose,
      Property_Area: propertyArea,
      Loan_Status: loanStatus
    });
  }

  return data;
}
