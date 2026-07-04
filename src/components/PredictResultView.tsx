import React, { useEffect } from 'react';
import { CheckCircle2, XCircle, ShieldAlert, DollarSign, Calendar, TrendingUp, FileDown, ArrowLeft, RefreshCw, Bookmark } from 'lucide-react';
import { jsPDF } from 'jspdf';
import confetti from 'canvas-confetti';
import { useLanguage } from '../lib/translations';
import { useCurrency } from '../lib/currencies';

interface PredictResultViewProps {
  prediction: any;
  onReset: () => void;
}

export default function PredictResultView({ prediction, onReset }: PredictResultViewProps) {
  const { t } = useLanguage();
  const { currency, formatAmount, symbol } = useCurrency();
  const isApproved = prediction.status === 'Approved';

  // Trigger celebration confetti on successful approval
  useEffect(() => {
    if (isApproved) {
      const duration = 2 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 50 };

      const randomInRange = (min: number, max: number) => {
        return Math.random() * (max - min) + min;
      };

      const interval: any = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [isApproved]);

  const generatePDFReport = () => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    // Styling constants
    const primaryColor = [15, 23, 42]; // deep slate
    const accentColor = isApproved ? [16, 185, 129] : [239, 68, 68]; // green or red
    const textColor = [100, 116, 139]; // slate-500

    // Header bar
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(0, 0, 210, 40, 'F');

    // Title
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.text('Smart Lender AI', 15, 18);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text('AUTOMATED CREDIT RISK & SUITABILITY APPRAISAL', 15, 25);

    // Date
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.text(`Report Date: ${new Date(prediction.createdAt).toLocaleDateString()}`, 150, 18);
    doc.text(`Report ID: SL-${Math.floor(100000 + Math.random() * 900000)}`, 150, 25);

    // Section 1: Result Summary
    doc.setFillColor(248, 250, 252); // light background
    doc.rect(15, 48, 180, 32, 'F');

    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('APPRASAL OUTCOME:', 20, 56);

    doc.setFillColor(accentColor[0], accentColor[1], accentColor[2]);
    doc.rect(20, 60, 45, 10, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.text(prediction.status.toUpperCase(), 25, 66.5);

    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text(`Approval Probability: ${prediction.probability}%`, 75, 62);
    doc.text(`Risk Assessment: ${prediction.riskLevel} Risk`, 75, 68);
    doc.text(`Model Confidence Score: ${prediction.confidenceScore}%`, 75, 74);

    // Section 2: Applicant Profile Details
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.text('Applicant Profile Parameters', 15, 92);
    doc.setDrawColor(226, 232, 240);
    doc.line(15, 95, 195, 95);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(71, 85, 105);

    const leftColX = 15;
    const rightColX = 110;

    doc.text(`Applicant Name: ${prediction.applicantName}`, leftColX, 102);
    doc.text(`Age / Gender: ${prediction.age} years / ${prediction.gender}`, leftColX, 108);
    doc.text(`Marital Status: ${prediction.married}`, leftColX, 114);
    doc.text(`Education Rank: ${prediction.education}`, leftColX, 120);
    doc.text(`Self Employed: ${prediction.selfEmployed}`, leftColX, 126);

    doc.text(`Monthly Income: ${formatAmount(prediction.income)}`, rightColX, 102);
    doc.text(`Coapplicant Income: ${formatAmount(prediction.coapplicantIncome)}`, rightColX, 108);
    doc.text(`Liquid Savings: ${formatAmount(prediction.savings)}`, rightColX, 114);
    doc.text(`Monthly Expenses: ${formatAmount(prediction.expenses)}`, rightColX, 120);
    doc.text(`Credit History rating: ${prediction.creditHistory === 1 ? 'Satisfactory' : 'Unsatisfactory'}`, rightColX, 126);

    // Section 3: Loan and Amortization Details
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.text('Requested Financing & Estimated Amortization', 15, 142);
    doc.line(15, 145, 195, 145);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(71, 85, 105);

    doc.text(`Requested Loan Principal: ${formatAmount(prediction.loanAmount * 1000)}`, leftColX, 152);
    doc.text(`Requested Duration Term: ${prediction.loanTerm} Months (${prediction.loanTerm / 12} Years)`, leftColX, 158);
    doc.text(`Primary Loan Purpose: ${prediction.loanPurpose}`, leftColX, 164);
    doc.text(`Property Zonal Area: ${prediction.propertyArea}`, leftColX, 170);

    doc.text(`Estimated Monthly Installment (EMI): ${formatAmount(prediction.estimatedEMI)}/month`, rightColX, 152);
    doc.text(`Total Estimated Interest Value: ${formatAmount(prediction.interestAmount)}`, rightColX, 158);
    doc.text(`Total Forecasted Repayment: ${formatAmount(prediction.totalRepayment)}`, rightColX, 164);
    doc.text(`Recommended Maximum Loan: ${formatAmount(prediction.recommendedAmount * 1000)}`, rightColX, 170);

    // Section 4: Explainability details
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.text('Model Predictive Justification', 15, 186);
    doc.line(15, 189, 195, 189);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(71, 85, 105);
    const splitExplanation = doc.splitTextToSize(prediction.reason, 180);
    doc.text(splitExplanation, 15, 196);

    // Signatures and audit note
    doc.setFillColor(241, 245, 249);
    doc.rect(15, 245, 180, 20, 'F');
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8.5);
    doc.setTextColor(100, 116, 139);
    doc.text('DISCLAIMER: This report is dynamically compiled using a localized Machine Learning classification suite.', 20, 253);
    doc.text('All variables represent calculated risks; final credit approvals must undergo manual underwriting audits.', 20, 258);

    doc.save(`SmartLender_Appraisal_${prediction.applicantName.replace(/\s+/g, '_')}.pdf`);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Back button */}
      <div className="mb-6 flex justify-between items-center">
        <button
          onClick={onReset}
          className="flex items-center text-sm font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white"
          id="result-back-btn"
        >
          <ArrowLeft className="mr-1.5 h-4 w-4" />
          {t.backToHome}
        </button>

        <button
          onClick={generatePDFReport}
          className="flex items-center rounded-lg bg-emerald-500 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-600 focus:outline-none dark:bg-emerald-600 dark:hover:bg-emerald-700"
          id="download-pdf-report"
        >
          <FileDown className="mr-1.5 h-4 w-4" />
          {t.printReport}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Column: Big Result Card */}
        <div className="lg:col-span-5 flex flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900 text-center items-center justify-center relative overflow-hidden">
          {/* Status color background overlay */}
          <div className={`absolute top-0 left-0 right-0 h-2 ${isApproved ? 'bg-emerald-500' : 'bg-red-500'}`}></div>

          {isApproved ? (
            <div className="rounded-full bg-emerald-100 p-4 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 mb-4 mt-2">
              <CheckCircle2 className="h-16 w-16" />
            </div>
          ) : (
            <div className="rounded-full bg-red-100 p-4 text-red-600 dark:bg-red-950/40 dark:text-red-400 mb-4 mt-2">
              <XCircle className="h-16 w-16" />
            </div>
          )}

          <h3 className="font-display text-2xl font-black text-slate-900 dark:text-white">
            Loan Application {prediction.status}
          </h3>
          <p className="text-slate-500 text-xs mt-1 max-w-[200px]">
            Forecasted by local best-fit ML classifier node.
          </p>

          {/* Radial score metric */}
          <div className="relative h-36 w-36 flex items-center justify-center my-6">
            <svg className="absolute transform -rotate-90" width="130" height="130">
              <circle
                cx="65"
                cy="65"
                r="50"
                stroke={isApproved ? '#e2e8f0' : '#fee2e2'}
                strokeWidth="10"
                fill="transparent"
                className="dark:stroke-slate-800"
              />
              <circle
                cx="65"
                cy="65"
                r="50"
                stroke={isApproved ? '#10b981' : '#ef4444'}
                strokeWidth="10"
                fill="transparent"
                strokeDasharray="314"
                strokeDashoffset={314 - (314 * prediction.probability) / 100}
                strokeLinecap="round"
              />
            </svg>
            <div className="text-center z-10">
              <span className="text-3xl font-black font-mono text-slate-900 dark:text-white">{prediction.probability}%</span>
              <p className="text-[10px] uppercase text-slate-400 font-bold tracking-wider mt-0.5">Approval odds</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 w-full border-t border-slate-100 pt-4 mt-2 dark:border-slate-800 text-xs">
            <div className="text-left bg-slate-50 p-2.5 rounded-xl dark:bg-slate-950">
              <span className="text-slate-400 font-medium block">Risk Assessment</span>
              <span className={`font-black uppercase tracking-wider block mt-0.5 ${
                prediction.riskLevel === 'Low' ? 'text-emerald-500' : prediction.riskLevel === 'Medium' ? 'text-yellow-500' : 'text-red-500'
              }`}>{prediction.riskLevel}</span>
            </div>
            <div className="text-left bg-slate-50 p-2.5 rounded-xl dark:bg-slate-950">
              <span className="text-slate-400 font-medium block">Confidence Metric</span>
              <span className="font-black text-slate-800 dark:text-white block mt-0.5 font-mono">{prediction.confidenceScore}%</span>
            </div>
          </div>
        </div>

        {/* Right Column: Calculations & Explanation */}
        <div className="lg:col-span-7 space-y-6">
          {/* Amortization schedule details */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900">
            <h4 className="font-display text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-emerald-500" />
              Appraisal Estimates & Financing Model
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="rounded-2xl bg-emerald-50 p-4 dark:bg-slate-950 border border-emerald-100 dark:border-slate-800">
                <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold block">Estimated Monthly EMI</span>
                <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1 font-mono block">
                  {formatAmount(prediction.estimatedEMI)}<span className="text-xs font-normal">/mo</span>
                </span>
              </div>
              <div className="rounded-2xl bg-sky-50 p-4 dark:bg-slate-950 border border-sky-100 dark:border-slate-800">
                <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold block">Interest Over Term</span>
                <span className="text-xl font-extrabold text-sky-600 dark:text-sky-400 mt-1 font-mono block">
                  {formatAmount(prediction.interestAmount)}
                </span>
              </div>
              <div className="rounded-2xl bg-indigo-50 p-4 dark:bg-slate-950 border border-indigo-100 dark:border-slate-800">
                <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold block">Total Repayment</span>
                <span className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-1 font-mono block">
                  {formatAmount(prediction.totalRepayment)}
                </span>
              </div>
            </div>

            <div className="space-y-3 text-sm border-t border-slate-100 pt-4 dark:border-slate-800">
              <div className="flex justify-between pb-1">
                <span className="text-slate-500">Requested Principal amount:</span>
                <span className="font-semibold text-slate-900 dark:text-white font-mono">{formatAmount(prediction.loanAmount * 1000)}</span>
              </div>
              <div className="flex justify-between pb-1">
                <span className="text-slate-500">Maximum Suggested Cap:</span>
                <span className="font-semibold text-emerald-500 font-mono">{formatAmount(prediction.recommendedAmount * 1000)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Borrowing Purpose:</span>
                <span className="font-semibold text-slate-900 dark:text-white">{prediction.loanPurpose} Loan ({prediction.propertyArea})</span>
              </div>
            </div>
          </div>

          {/* Model Explanations */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900">
            <h4 className="font-display text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-center">
              <ShieldAlert className="mr-2 h-5 w-5 text-emerald-500" />
              Machine Learning Model Interpretation
            </h4>
            <div className="bg-slate-50 rounded-2xl p-4 text-sm text-slate-600 dark:bg-slate-950 dark:text-slate-300 leading-relaxed">
              <p className="font-medium text-slate-900 dark:text-white mb-2 uppercase tracking-wider text-[11px] flex items-center">
                <Bookmark className="h-3.5 w-3.5 text-emerald-500 mr-1" />
                Decisiveness Weight Explainer:
              </p>
              {prediction.reason}
            </div>
            <p className="text-[11px] text-slate-400 mt-3 italic leading-normal">
              *Smart Lender AI computes these weights dynamically. For optimal results, keep credit history positive and debt obligations under 35% of cumulative monthly earnings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
