import React, { useState, useEffect } from 'react';
import { Landmark, Brain, ShieldAlert, Cpu, LineChart, FileDown, MessageSquareCode, ArrowRight, DollarSign, Percent, Calendar, Check, Send } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { db, collection, addDoc } from '../lib/firebase';
import { useLanguage } from '../lib/translations';
import { useCurrency } from '../lib/currencies';

interface LandingPageProps {
  setCurrentTab: (tab: string) => void;
  user: any;
  onOpenAuth: (mode: 'login' | 'register') => void;
}

export default function LandingPage({ setCurrentTab, user, onOpenAuth }: LandingPageProps) {
  const { t } = useLanguage();
  const { currency, formatAmount, convertAmount, symbol } = useCurrency();
  // EMI Calculator State
  const [emiAmount, setEmiAmount] = useState(100000);
  const [emiRate, setEmiRate] = useState(7.5);
  const [emiTerm, setEmiTerm] = useState(15); // years

  const [emiResult, setEmiResult] = useState({
    monthlyEmi: 0,
    totalInterest: 0,
    totalRepayment: 0,
  });

  // Contact Form State
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Calculate EMI
  useEffect(() => {
    const P = emiAmount;
    const r = emiRate / 12 / 100;
    const n = emiTerm * 12;

    let monthly = 0;
    if (r > 0) {
      monthly = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    } else {
      monthly = P / n;
    }

    const total = monthly * n;
    const interest = total - P;

    setEmiResult({
      monthlyEmi: Math.round(monthly),
      totalInterest: Math.round(interest),
      totalRepayment: Math.round(total),
    });
  }, [emiAmount, emiRate, emiTerm]);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await addDoc(collection(db, 'contact_queries'), {
        ...contactForm,
        createdAt: new Date().toISOString(),
      });
      setSubmitted(true);
      setContactForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      console.error('Error submitting contact form:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const chartData = [
    { name: 'Principal Amount', value: convertAmount(emiAmount), color: '#0ea5e9' },
    { name: 'Total Interest', value: convertAmount(emiResult.totalInterest), color: '#10b981' },
  ];

  const features = [
    {
      icon: <Brain className="h-6 w-6 text-emerald-500" />,
      title: t.feature1Title,
      desc: t.feature1Desc,
    },
    {
      icon: <Cpu className="h-6 w-6 text-sky-500" />,
      title: t.feature3Title,
      desc: t.feature3Desc,
    },
    {
      icon: <MessageSquareCode className="h-6 w-6 text-indigo-500" />,
      title: t.chatTitle,
      desc: t.chatInitial,
    },
    {
      icon: <FileDown className="h-6 w-6 text-purple-500" />,
      title: t.printReport,
      desc: t.feature2Desc,
    },
  ];

  return (
    <div className="flex flex-col bg-slate-50 transition-colors duration-200 dark:bg-slate-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-500/10 via-transparent to-transparent py-20 sm:py-28 dark:from-emerald-950/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
            <Landmark className="h-3.5 w-3.5" />
            <span>Next-Gen Predictive AI Banking Solution</span>
          </div>
          <h1 className="mt-6 font-display text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl dark:text-white">
            {t.heroTitle}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
            {t.heroSubtitle}
          </p>

          <div className="mt-10 flex items-center justify-center space-x-4">
            {user ? (
              <button
                onClick={() => setCurrentTab('predictor')}
                className="flex items-center rounded-lg bg-emerald-500 px-6 py-3 font-semibold text-white shadow-lg hover:bg-emerald-600 focus:outline-none dark:bg-emerald-600 dark:hover:bg-emerald-700"
                id="hero-predict-btn"
              >
                {t.startAssessment}
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
            ) : (
              <button
                onClick={() => onOpenAuth('register')}
                className="flex items-center rounded-lg bg-emerald-500 px-6 py-3 font-semibold text-white shadow-lg hover:bg-emerald-600 focus:outline-none dark:bg-emerald-600 dark:hover:bg-emerald-700"
                id="hero-register-btn"
              >
                {t.startAssessment}
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
            )}
            <a
              href="#emi-calculator"
              className="rounded-lg border border-slate-200 bg-white px-6 py-3 font-semibold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Try EMI Calculator
            </a>
          </div>
        </div>
      </section>

      {/* Grid Features */}
      <section id="features" className="py-16 sm:py-24 bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Engineered for Modern Credit Evaluation
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-slate-500">
              Leverage custom-trained statistical algorithms to bypass manual banking delays and audit credit profile health securely.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feat, idx) => (
              <div 
                key={idx} 
                className="relative rounded-2xl border border-slate-100 bg-slate-50 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-md dark:border-slate-800 dark:bg-slate-950"
              >
                <div className="rounded-xl bg-white p-3 shadow-sm inline-block dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                  {feat.icon}
                </div>
                <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">{feat.title}</h3>
                <p className="mt-2 text-sm text-slate-500 leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EMI Live Calculator Section */}
      <section id="emi-calculator" className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 items-center">
            {/* Left Inputs */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Interactive EMI Estimator
                </h2>
                <p className="mt-2 text-slate-500 text-sm">
                  Simulate interest rates and principal payouts instantly. See exactly how amortization shapes your monthly installments.
                </p>
              </div>

              {/* Amount Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-slate-700 dark:text-slate-300">Loan Amount ({currency})</span>
                  <span className="text-emerald-500 font-bold font-mono">{formatAmount(emiAmount)}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="font-mono text-base text-slate-400 font-extrabold w-5 text-center">{symbol}</span>
                  <input
                    type="range"
                    min="10000"
                    max="1000000"
                    step="5000"
                    value={emiAmount}
                    onChange={(e) => setEmiAmount(Number(e.target.value))}
                    className="h-2 w-full cursor-pointer rounded-lg bg-slate-200 accent-emerald-500 dark:bg-slate-800"
                  />
                </div>
              </div>

              {/* Rate Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-slate-700 dark:text-slate-300">Interest Rate (%)</span>
                  <span className="text-emerald-500 font-bold font-mono">{emiRate}% p.a.</span>
                </div>
                <div className="flex items-center space-x-4">
                  <Percent className="h-5 w-5 text-slate-400" />
                  <input
                    type="range"
                    min="3"
                    max="18"
                    step="0.1"
                    value={emiRate}
                    onChange={(e) => setEmiRate(Number(e.target.value))}
                    className="h-2 w-full cursor-pointer rounded-lg bg-slate-200 accent-emerald-500 dark:bg-slate-800"
                  />
                </div>
              </div>

              {/* Term Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-slate-700 dark:text-slate-300">Loan Duration (Years)</span>
                  <span className="text-emerald-500 font-bold font-mono">{emiTerm} Years</span>
                </div>
                <div className="flex items-center space-x-4">
                  <Calendar className="h-5 w-5 text-slate-400" />
                  <input
                    type="range"
                    min="1"
                    max="30"
                    step="1"
                    value={emiTerm}
                    onChange={(e) => setEmiTerm(Number(e.target.value))}
                    className="h-2 w-full cursor-pointer rounded-lg bg-slate-200 accent-emerald-500 dark:bg-slate-800"
                  />
                </div>
              </div>
            </div>

            {/* Right Visual Breakdown */}
            <div className="lg:col-span-7 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900 grid grid-cols-1 sm:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <div className="rounded-2xl bg-emerald-50 p-4 dark:bg-slate-800 border border-emerald-100 dark:border-slate-800">
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Estimated Monthly EMI</p>
                  <p className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1 font-mono">
                    {formatAmount(emiResult.monthlyEmi)}<span className="text-sm font-normal text-slate-500">/mo</span>
                  </p>
                </div>
                <div className="space-y-2.5 text-sm">
                  <div className="flex justify-between border-b border-slate-100 pb-2 dark:border-slate-800">
                    <span className="text-slate-500">Principal Loan:</span>
                    <span className="font-semibold text-slate-900 dark:text-white font-mono">{formatAmount(emiAmount)}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-2 dark:border-slate-800">
                    <span className="text-slate-500">Total Interest:</span>
                    <span className="font-semibold text-slate-900 dark:text-white font-mono">{formatAmount(emiResult.totalInterest)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Total Repayment:</span>
                    <span className="font-bold text-emerald-500 font-mono">{formatAmount(emiResult.totalRepayment)}</span>
                  </div>
                </div>
              </div>

              {/* Recharts Pie */}
              <div className="h-56 relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {chartData.map((entry, idx) => (
                        <Cell key={`cell-${idx}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${symbol}${Math.round(Number(value)).toLocaleString()}`} contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }} itemStyle={{ color: '#f1f5f9' }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-2xl font-black font-mono text-slate-900 dark:text-white">
                    {Math.round((emiResult.totalInterest / emiResult.totalRepayment) * 100)}%
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Interest Ratio</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Overview: How Our ML works */}
      <section id="about" className="py-16 sm:py-24 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center space-x-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                <Brain className="h-3.5 w-3.5" />
                <span>Under the Hood</span>
              </div>
              <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                The Four Model Ensemble Evaluation Engine
              </h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Rather than relying on a single general statistic, Smart Lender AI trains and fits **four independent mathematical architectures** simultaneously on every dataset run.
              </p>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="rounded bg-sky-100 p-1 text-sky-700 dark:bg-sky-950 dark:text-sky-300 mt-1">
                    <Check className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">Random Forest (Bagging Ensemble)</h4>
                    <p className="text-sm text-slate-500">Constructs a diverse forest of bootstrapped decision trees to avoid overfitting and provide reliable average voting bounds.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="rounded bg-sky-100 p-1 text-sky-700 dark:bg-sky-950 dark:text-sky-300 mt-1">
                    <Check className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">Gradient Boosting (Sequential Residual Learning)</h4>
                    <p className="text-sm text-slate-500">Iteratively fits successive decision trees to correct residual errors, maximizing precision on narrow approval bands.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="rounded bg-sky-100 p-1 text-sky-700 dark:bg-sky-950 dark:text-sky-300 mt-1">
                    <Check className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">K-Nearest Neighbors (KNN Spatial Distance)</h4>
                    <p className="text-sm text-slate-500">Groups applicants into high-dimensional space to cross-evaluate credit patterns against similar historical profiles.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative rounded-3xl border border-slate-200 bg-slate-50 p-8 dark:border-slate-800 dark:bg-slate-950 text-slate-700 dark:text-slate-300 space-y-4">
              <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">Model Selection Metric Comparison</h3>
              <p className="text-sm text-slate-500">
                During retraining, the system evaluates all architectures on an isolated **20% test partition** using cross-entropy matrices:
              </p>
              <div className="space-y-3">
                <div className="rounded-lg bg-white p-3 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex justify-between items-center">
                  <span className="text-xs font-bold font-mono">ROC-AUC Bounds</span>
                  <span className="text-xs bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded font-bold">Discriminative Power</span>
                </div>
                <div className="rounded-lg bg-white p-3 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex justify-between items-center">
                  <span className="text-xs font-bold font-mono">F1-Score Harmonizer</span>
                  <span className="text-xs bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded font-bold">Precision & Recall Union</span>
                </div>
                <div className="rounded-lg bg-white p-3 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex justify-between items-center">
                  <span className="text-xs font-bold font-mono">Gini Index Splitter</span>
                  <span className="text-xs bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded font-bold">Impurity Decrease Tracker</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="text-center space-y-2 mb-8">
              <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                Contact Our Lending Analysts
              </h2>
              <p className="text-slate-500 text-sm max-w-lg mx-auto">
                Have questions about modern credit scoring, our predictive models, or enterprise white-label solutions? Drop us a query.
              </p>
            </div>

            {submitted ? (
              <div className="rounded-2xl bg-emerald-50 p-6 text-center dark:bg-slate-800 border border-emerald-100 dark:border-slate-800">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300">
                  <Check className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">Message Dispatched</h3>
                <p className="mt-2 text-sm text-slate-500">
                  Thank you! Your credit analysis query has been saved to Firestore. Our team will review your application parameters soon.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 text-xs font-bold text-emerald-500 hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500">Your Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Jane Doe"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-sm outline-none focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="jane@example.com"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-sm outline-none focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500">Subject</label>
                  <input
                    type="text"
                    required
                    placeholder="E.g., White-label API or predictive boundaries"
                    value={contactForm.subject}
                    onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-sm outline-none focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500">Query Message</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Detail your question regarding credit evaluation bounds..."
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-sm outline-none focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex justify-center items-center rounded-lg bg-emerald-500 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-600 focus:outline-none disabled:opacity-50 dark:bg-emerald-600 dark:hover:bg-emerald-700"
                >
                  {submitting ? 'Submitting query...' : 'Send Query Message'}
                  <Send className="ml-2 h-4 w-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
