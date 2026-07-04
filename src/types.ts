export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: 'admin' | 'user';
  createdAt: string;
  phoneNumber?: string;
  jobTitle?: string;
}

export interface LoanApplication {
  id?: string;
  userId: string;
  applicantName: string;
  age: number;
  gender: 'Male' | 'Female';
  married: 'Yes' | 'No';
  education: 'Graduate' | 'Not Graduate';
  selfEmployed: 'Yes' | 'No';
  income: number; // Monthly
  coapplicantIncome: number;
  loanAmount: number; // in thousands
  loanTerm: number; // in months
  creditHistory: 1 | 0;
  existingLoans: number;
  savings: number;
  expenses: number;
  loanPurpose: 'Home' | 'Personal' | 'Education' | 'Business';
  propertyArea: 'Urban' | 'Semiurban' | 'Rural';
  status: 'Approved' | 'Rejected' | 'Pending';
  probability: number;
  confidenceScore: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  estimatedEMI: number;
  interestAmount: number;
  totalRepayment: number;
  reason: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}

export interface ChatSession {
  id: string;
  userId: string;
  messages: ChatMessage[];
  updatedAt: string;
}

export interface ModelMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  rocAuc: number;
  confusionMatrix: number[][]; // [[TN, FP], [FN, TP]]
}

export interface TrainingResult {
  timestamp: string;
  bestModel: string;
  datasetSize: number;
  models: {
    [key: string]: ModelMetrics;
  };
  featureImportance: {
    feature: string;
    importance: number;
  }[];
}
