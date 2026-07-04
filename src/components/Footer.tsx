import React from 'react';
import { Landmark, Shield, Lock, FileText, CheckCircle } from 'lucide-react';

export default function Footer({ setCurrentTab }: { setCurrentTab: (tab: string) => void }) {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 text-slate-600 transition-colors duration-200 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Logo & About */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center space-x-2" onClick={() => setCurrentTab('home')}>
              <div className="rounded-lg bg-emerald-500 p-1.5 text-white">
                <Landmark className="h-5 w-5" />
              </div>
              <span className="font-display text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                Smart<span className="text-emerald-500">Lender</span>
              </span>
            </div>
            <p className="text-sm">
              Next-generation financial eligibility forecasting engine powered by state-of-the-art machine learning algorithms.
            </p>
            <div className="flex items-center space-x-3 text-xs text-slate-400 dark:text-slate-500">
              <span className="flex items-center"><Lock className="h-3 w-3 mr-1" /> SSL Secured</span>
              <span className="flex items-center"><Shield className="h-3 w-3 mr-1" /> FDIC Compliant Guidelines</span>
            </div>
          </div>

          {/* Core Services */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-900 dark:text-white">Solutions</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <button onClick={() => setCurrentTab('predictor')} className="hover:text-emerald-500 transition-colors">Home Mortgage Predictor</button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('predictor')} className="hover:text-emerald-500 transition-colors">Education Loan Evaluation</button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('predictor')} className="hover:text-emerald-500 transition-colors">Commercial Credit Scoring</button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('predictor')} className="hover:text-emerald-500 transition-colors">Unsecured Personal Eligibility</button>
              </li>
            </ul>
          </div>

          {/* Useful Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-900 dark:text-white">Resources</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <button onClick={() => setCurrentTab('features')} className="hover:text-emerald-500 transition-colors">Smart Features</button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('about')} className="hover:text-emerald-500 transition-colors">How Our ML Works</button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('home')} className="hover:text-emerald-500 transition-colors">EMI Amortization</button>
              </li>
              <li>
                <a href="#contact" onClick={() => setCurrentTab('home')} className="hover:text-emerald-500 transition-colors">Contact Financial Advisory</a>
              </li>
            </ul>
          </div>

          {/* Accreditations */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-900 dark:text-white">Security & Auditing</h3>
            <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-emerald-500" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">F1 Score Optimized</h4>
                  <p className="text-[11px] text-slate-500">Cross-validated across 4 distinct architectures.</p>
                </div>
              </div>
              <div className="mt-3 flex items-center space-x-3 border-t border-slate-100 pt-3 dark:border-slate-800">
                <FileText className="h-5 w-5 text-emerald-500" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Audit Trail Persistent</h4>
                  <p className="text-[11px] text-slate-500">Secure Firestore log record collection.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-200 pt-8 text-center text-xs text-slate-500 dark:border-slate-800 dark:text-slate-600">
          <p>© 2026 Smart Lender AI Inc. Developed under compliance and fair lending standards. All projections are informational.</p>
        </div>
      </div>
    </footer>
  );
}
