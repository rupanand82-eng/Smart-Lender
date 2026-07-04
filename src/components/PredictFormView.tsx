import React, { useState } from 'react';
import { User, DollarSign, Activity, FileText, Landmark, ShieldAlert, ArrowLeft, Sparkles, Check } from 'lucide-react';
import { db, collection, addDoc } from '../lib/firebase';
import { FirebaseUser } from '../lib/firebase';
import { useLanguage } from '../lib/translations';
import { useCurrency } from '../lib/currencies';

interface PredictFormViewProps {
  user: FirebaseUser | null;
  onPredictionComplete: (prediction: any) => void;
  onCancel: () => void;
}

export default function PredictFormView({ user, onPredictionComplete, onCancel }: PredictFormViewProps) {
  const { t } = useLanguage();
  const { currency, formatAmount, symbol } = useCurrency();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    applicantName: user?.displayName || '',
    age: 32,
    gender: 'Male',
    married: 'Yes',
    education: 'Graduate',
    selfEmployed: 'No',
    income: 4800, // monthly
    coapplicantIncome: 0,
    loanAmount: 120, // in thousands
    loanTerm: 360, // in months
    creditHistory: 1, // 1: good, 0: bad
    existingLoans: 0,
    savings: 15000,
    expenses: 1800,
    loanPurpose: 'Home',
    propertyArea: 'Semiurban',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: ['age', 'income', 'coapplicantIncome', 'loanAmount', 'loanTerm', 'creditHistory', 'existingLoans', 'savings', 'expenses'].includes(name)
        ? Number(value)
        : value,
    }));
  };

  const handleNextStep = () => {
    if (step === 1 && !formData.applicantName.trim()) {
      setError('Please provide the applicant name.');
      return;
    }
    setError('');
    setStep((prev) => prev + 1);
  };

  const handlePrevStep = () => {
    setError('');
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Call local ML prediction endpoint
      const response = await fetch('/api/ml/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Prediction API failed to evaluate applicant profile.');
      }

      const prediction = await response.json();

      // Bundle with original form inputs
      const fullApplicationRecord = {
        userId: user?.uid || 'guest',
        ...formData,
        status: prediction.approved ? 'Approved' : 'Rejected',
        probability: prediction.probability,
        confidenceScore: prediction.confidenceScore,
        riskLevel: prediction.riskLevel,
        estimatedEMI: prediction.estimatedEMI,
        interestAmount: prediction.interestAmount,
        totalRepayment: prediction.totalRepayment,
        recommendedAmount: prediction.recommendedAmount,
        reason: prediction.reason,
        createdAt: new Date().toISOString(),
      };

      // Direct write to Firebase Firestore
      if (user) {
        await addDoc(collection(db, 'loan_applications'), fullApplicationRecord);
      }

      onPredictionComplete(fullApplicationRecord);
    } catch (err: any) {
      console.error('Submission Error:', err);
      setError(err.message || 'An error occurred while running the ML evaluation pipeline.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Back link */}
      <button
        onClick={onCancel}
        className="mb-6 flex items-center text-sm font-medium text-slate-500 hover:text-slate-950 dark:hover:text-white"
        id="predictor-back-btn"
      >
        <ArrowLeft className="mr-1.5 h-4 w-4" />
        {t.backToHome}
      </button>

      <div className="rounded-3xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
        {/* Title Block */}
        <div className="bg-emerald-500 p-6 sm:p-8 text-white dark:bg-emerald-600 flex justify-between items-center">
          <div>
            <h2 className="font-display text-2xl font-black">{t.newAssessmentTitle}</h2>
            <p className="text-emerald-100 text-xs mt-1">{t.newAssessmentSub}</p>
          </div>
          <Sparkles className="h-8 w-8 text-emerald-200 animate-pulse hidden sm:block" />
        </div>

        {/* Progress Timeline */}
        <div className="border-b border-slate-100 px-6 py-4 dark:border-slate-800 flex justify-between items-center text-xs font-semibold text-slate-400">
          <div className="flex items-center space-x-4">
            <span className={`h-6 w-6 rounded-full flex items-center justify-center border ${
              step >= 1 ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-slate-200'
            }`}>
              {step > 1 ? <Check className="h-3 w-3" /> : '1'}
            </span>
            <span className={step === 1 ? 'text-slate-800 dark:text-white' : ''}>{t.personalHeader}</span>
          </div>
          <div className="h-px bg-slate-200 flex-1 mx-4"></div>
          <div className="flex items-center space-x-4">
            <span className={`h-6 w-6 rounded-full flex items-center justify-center border ${
              step >= 2 ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-slate-200'
            }`}>
              {step > 2 ? <Check className="h-3 w-3" /> : '2'}
            </span>
            <span className={step === 2 ? 'text-slate-800 dark:text-white' : ''}>{t.financialHeader}</span>
          </div>
          <div className="h-px bg-slate-200 flex-1 mx-4"></div>
          <div className="flex items-center space-x-4">
            <span className={`h-6 w-6 rounded-full flex items-center justify-center border ${
              step >= 3 ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-slate-200'
            }`}>
              3
            </span>
            <span className={step === 3 ? 'text-slate-800 dark:text-white' : ''}>{t.loanPrediction}</span>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          {error && (
            <div className="rounded-xl bg-red-50 p-4 text-xs font-medium text-red-700 dark:bg-red-950/30 dark:text-red-400 flex items-start">
              <ShieldAlert className="h-4 w-4 mr-2 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* STEP 1: Personal Profile */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-slate-900 dark:text-white font-bold mb-4 border-b border-slate-100 pb-2 dark:border-slate-800">
                <User className="h-5 w-5 text-emerald-500" />
                <span>Applicant Personal Credentials</span>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500">Applicant Full Name</label>
                <input
                  type="text"
                  name="applicantName"
                  required
                  value={formData.applicantName}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-sm outline-none focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                  placeholder="Jane Doe"
                  id="form-applicant-name"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">Age (Years)</label>
                  <input
                    type="number"
                    name="age"
                    min="18"
                    max="100"
                    required
                    value={formData.age}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-sm outline-none focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-sm outline-none focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">Marital Status</label>
                  <select
                    name="married"
                    value={formData.married}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-sm outline-none focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                  >
                    <option value="Yes">Married</option>
                    <option value="No">Single</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">Education</label>
                  <select
                    name="education"
                    value={formData.education}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-sm outline-none focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                  >
                    <option value="Graduate">University Graduate</option>
                    <option value="Not Graduate">Not Graduate</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">Self Employed</label>
                  <select
                    name="selfEmployed"
                    value={formData.selfEmployed}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-sm outline-none focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                  >
                    <option value="No">No (Salaried Professional)</option>
                    <option value="Yes">Yes (Independent Business)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Financial Audits */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-slate-900 dark:text-white font-bold mb-4 border-b border-slate-100 pb-2 dark:border-slate-800">
                <DollarSign className="h-5 w-5 text-emerald-500" />
                <span>Financial Solvency Parameters</span>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">Applicant Monthly Income ({currency})</label>
                  <input
                    type="number"
                    name="income"
                    required
                    value={formData.income}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-sm outline-none focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                    placeholder="4500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">Co-applicant Monthly Income ({currency})</label>
                  <input
                    type="number"
                    name="coapplicantIncome"
                    required
                    value={formData.coapplicantIncome}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-sm outline-none focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                    placeholder="0 if none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">Liquid Savings Buffer ({currency})</label>
                  <input
                    type="number"
                    name="savings"
                    required
                    value={formData.savings}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-sm outline-none focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">Standard Monthly Expenses ({currency})</label>
                  <input
                    type="number"
                    name="expenses"
                    required
                    value={formData.expenses}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-sm outline-none focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">Credit History Rating</label>
                  <select
                    name="creditHistory"
                    value={formData.creditHistory}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-sm outline-none focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                  >
                    <option value="1">Credit Score Above 700 (Reliable / No defaults)</option>
                    <option value="0">Credit Score Under 700 (Missed payments / Weak history)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">Active Existing Loans</label>
                  <input
                    type="number"
                    name="existingLoans"
                    min="0"
                    max="5"
                    required
                    value={formData.existingLoans}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-sm outline-none focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Requirements */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-slate-900 dark:text-white font-bold mb-4 border-b border-slate-100 pb-2 dark:border-slate-800">
                <Landmark className="h-5 w-5 text-emerald-500" />
                <span>Loan Details & Target Asset</span>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">Requested Loan Principal ({currency} in thousands)</label>
                  <input
                    type="number"
                    name="loanAmount"
                    min="10"
                    max="1000"
                    required
                    value={formData.loanAmount}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-sm outline-none focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                    placeholder={`e.g. 150 (for ${symbol}150,000)`}
                    id="form-loan-amount"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Equivalent to: <span className="font-bold text-emerald-500">{formatAmount(formData.loanAmount * 1000)}</span></p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">Loan Term Duration</label>
                  <select
                    name="loanTerm"
                    value={formData.loanTerm}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-sm outline-none focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                  >
                    <option value="360">30 Years (360 Months)</option>
                    <option value="240">20 Years (240 Months)</option>
                    <option value="180">15 Years (180 Months)</option>
                    <option value="120">10 Years (120 Months)</option>
                    <option value="60">5 Years (60 Months)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">Primary Loan Purpose</label>
                  <select
                    name="loanPurpose"
                    value={formData.loanPurpose}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-sm outline-none focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                  >
                    <option value="Home">Home Purchase / Construction</option>
                    <option value="Personal">Personal Financing</option>
                    <option value="Education">University Education</option>
                    <option value="Business">Commercial Venture</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">Property Zonal Area</label>
                  <select
                    name="propertyArea"
                    value={formData.propertyArea}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-sm outline-none focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                  >
                    <option value="Urban">Urban Zone (High Density / Core Metro)</option>
                    <option value="Semiurban">Semi-urban Zone (Suburban / Expanding Metro)</option>
                    <option value="Rural">Rural Zone (Low Density / Countryside)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Action Footer */}
          <div className="flex justify-between items-center border-t border-slate-100 pt-6 dark:border-slate-800">
            {step > 1 ? (
              <button
                type="button"
                onClick={handlePrevStep}
                className="rounded-lg border border-slate-200 bg-white px-5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Previous Step
              </button>
            ) : (
              <div></div>
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="rounded-lg bg-emerald-500 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-600 focus:outline-none dark:bg-emerald-600 dark:hover:bg-emerald-700"
                id="predictor-next-btn"
              >
                Next Step
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="flex items-center rounded-lg bg-emerald-500 px-6 py-2.5 text-sm font-bold text-white shadow-md hover:bg-emerald-600 focus:outline-none disabled:opacity-50 dark:bg-emerald-600 dark:hover:bg-emerald-700"
                id="predictor-submit-btn"
              >
                {loading ? 'Evaluating applicant profile...' : 'Execute ML Model Prediction'}
                <Sparkles className="ml-2 h-4 w-4 animate-spin" />
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
