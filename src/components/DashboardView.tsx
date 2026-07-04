import React, { useState, useEffect } from 'react';
import { db, collection, query, where, getDocs, orderBy, doc, setDoc, updateProfile } from '../lib/firebase';
import { FirebaseUser } from '../lib/firebase';
import { FileText, Calendar, PlusCircle, CheckCircle, XCircle, Trash2, ArrowUpRight, ShieldCheck, Mail, Phone, Bookmark, Download } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { useCurrency } from '../lib/currencies';

interface DashboardViewProps {
  user: FirebaseUser;
  setCurrentTab: (tab: string) => void;
  onSelectApplication: (app: any) => void;
}

export default function DashboardView({ user, setCurrentTab, onSelectApplication }: DashboardViewProps) {
  const { currency, formatAmount, symbol } = useCurrency();
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Profile fields state
  const [profileName, setProfileName] = useState(user.displayName || '');
  const [profilePhone, setProfilePhone] = useState('');
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);

  // Fetch applications from Firestore
  const fetchApplications = async () => {
    setLoading(true);
    setError('');
    try {
      const q = query(
        collection(db, 'loan_applications'),
        where('userId', '==', user.uid)
      );
      const querySnapshot = await getDocs(q);
      const list: any[] = [];
      querySnapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...docSnap.data() });
      });
      // Sort client-side by createdAt descending to avoid composite index requirement
      list.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
      setApplications(list);
    } catch (err: any) {
      console.error('Error fetching applications:', err);
      setError('Could not fetch historical loan applications. Ensure Firestore collection indexes are configured.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
    
    // Load phone number from a local profile doc if it exists
    const loadProfileDetails = async () => {
      try {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDocs(query(collection(db, 'users'), where('uid', '==', user.uid)));
        if (!docSnap.empty) {
          const uDoc = docSnap.docs[0].data();
          if (uDoc.phoneNumber) setProfilePhone(uDoc.phoneNumber);
        }
      } catch (err) {
        console.warn('Profile doc fetch issue:', err);
      }
    };
    loadProfileDetails();
  }, [user]);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileSaved(false);
    try {
      // 1. Update Firebase Auth Profile
      await updateProfile(user, {
        displayName: profileName,
      });

      // 2. Update user document in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: profileName,
        phoneNumber: profilePhone,
        role: 'user',
        updatedAt: new Date().toISOString(),
      }, { merge: true });

      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 3000);
    } catch (err: any) {
      console.error('Profile Save Error:', err);
      setError('Failed to update user profile metadata.');
    } finally {
      setProfileSaving(false);
    }
  };

  const handleDownloadPDF = (app: any) => {
    const docPdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const isApproved = app.status === 'Approved';
    const primaryColor = [15, 23, 42];
    const accentColor = isApproved ? [16, 185, 129] : [239, 68, 68];

    // Header bar
    docPdf.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    docPdf.rect(0, 0, 210, 40, 'F');

    // Title
    docPdf.setTextColor(255, 255, 255);
    docPdf.setFont('helvetica', 'bold');
    docPdf.setFontSize(22);
    docPdf.text('Smart Lender AI', 15, 18);
    
    docPdf.setFont('helvetica', 'normal');
    docPdf.setFontSize(10);
    docPdf.text('AUTOMATED CREDIT RISK & SUITABILITY APPRAISAL', 15, 25);

    // Date
    docPdf.setTextColor(255, 255, 255);
    docPdf.setFontSize(9);
    docPdf.text(`Report Date: ${new Date(app.createdAt).toLocaleDateString()}`, 150, 18);
    docPdf.text(`Report ID: SL-${Math.floor(100000 + Math.random() * 900000)}`, 150, 25);

    // Summary block
    docPdf.setFillColor(248, 250, 252);
    docPdf.rect(15, 48, 180, 32, 'F');

    docPdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    docPdf.setFont('helvetica', 'bold');
    docPdf.setFontSize(11);
    docPdf.text('APPRASAL OUTCOME:', 20, 56);

    docPdf.setFillColor(accentColor[0], accentColor[1], accentColor[2]);
    docPdf.rect(20, 60, 45, 10, 'F');
    docPdf.setTextColor(255, 255, 255);
    docPdf.setFontSize(11);
    docPdf.text(app.status.toUpperCase(), 25, 66.5);

    docPdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    docPdf.setFontSize(10);
    docPdf.text(`Approval Probability: ${app.probability}%`, 75, 62);
    docPdf.text(`Risk Assessment: ${app.riskLevel} Risk`, 75, 68);
    docPdf.text(`Model Confidence Score: ${app.confidenceScore}%`, 75, 74);

    // Section 2: Details
    docPdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    docPdf.setFont('helvetica', 'bold');
    docPdf.setFontSize(13);
    docPdf.text('Applicant Profile Parameters', 15, 92);
    docPdf.line(15, 95, 195, 95);

    docPdf.setFont('helvetica', 'normal');
    docPdf.setFontSize(10);
    docPdf.setTextColor(71, 85, 105);

    docPdf.text(`Applicant Name: ${app.applicantName}`, 15, 102);
    docPdf.text(`Age / Gender: ${app.age} / ${app.gender}`, 15, 108);
    docPdf.text(`Married / Education: ${app.married} / ${app.education}`, 15, 114);
    docPdf.text(`Requested Principal: ${formatAmount(app.loanAmount * 1000)}`, 15, 120);
    docPdf.text(`Monthly Income: ${formatAmount(app.income)}`, 110, 102);
    docPdf.text(`Coapplicant Income: ${formatAmount(app.coapplicantIncome)}`, 110, 108);
    docPdf.text(`Liquid Savings Buffer: ${formatAmount(app.savings)}`, 110, 114);
    docPdf.text(`Monthly Amortization (EMI): ${formatAmount(app.estimatedEMI)}/month`, 110, 120);

    // Section 3: Explanation
    docPdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    docPdf.setFont('helvetica', 'bold');
    docPdf.setFontSize(13);
    docPdf.text('Model Predictive Justification', 15, 136);
    docPdf.line(15, 139, 195, 139);

    docPdf.setFont('helvetica', 'normal');
    docPdf.setFontSize(9.5);
    docPdf.setTextColor(71, 85, 105);
    const splitExplanation = docPdf.splitTextToSize(app.reason, 180);
    docPdf.text(splitExplanation, 15, 146);

    docPdf.save(`SmartLender_Appraisal_${app.applicantName.replace(/\s+/g, '_')}.pdf`);
  };

  // Math totals
  const totalApps = applications.length;
  const approvedApps = applications.filter((a) => a.status === 'Approved').length;
  const rejectedApps = applications.filter((a) => a.status === 'Rejected').length;
  const totalLentValue = applications
    .filter((a) => a.status === 'Approved')
    .reduce((sum, a) => sum + (a.loanAmount || 0), 0) * 1000;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Welcome Block */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between rounded-3xl bg-slate-900 p-6 sm:p-8 text-white dark:bg-slate-950 shadow-lg gap-4">
        <div>
          <h2 className="font-display text-2xl font-black">Welcome Back, {user.displayName || 'Borrower'}</h2>
          <p className="text-slate-400 text-xs mt-1">Check loan histories, update metadata, and start a predictive run.</p>
        </div>
        <button
          onClick={() => setCurrentTab('predictor')}
          className="flex items-center self-start sm:self-center rounded-xl bg-emerald-500 hover:bg-emerald-600 font-semibold text-white px-5 py-3 shadow-md focus:outline-none transition-all duration-200 hover:scale-[1.02]"
          id="dashboard-new-predict-btn"
        >
          <PlusCircle className="mr-2 h-5 w-5" />
          Apply New Prediction
        </button>
      </div>

      {/* Summary Cards Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Total Applications</span>
          <span className="text-3xl font-black text-slate-900 dark:text-white mt-1.5 block font-mono">{totalApps}</span>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Approved Loans</span>
          <span className="text-3xl font-black text-emerald-500 mt-1.5 block font-mono">{approvedApps}</span>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Rejected Applications</span>
          <span className="text-3xl font-black text-red-500 mt-1.5 block font-mono">{rejectedApps}</span>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Cumulative Approved Cap ({currency})</span>
          <span className="text-3xl font-black text-indigo-500 mt-1.5 block font-mono">{formatAmount(totalLentValue)}</span>
        </div>
      </div>

      {/* Profile & History Split */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Column: Recent Applications */}
        <div className="lg:col-span-8 space-y-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-md dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
            <h3 className="font-display text-lg font-black text-slate-900 dark:text-white mb-4">
              Recent Application Records
            </h3>

            {loading ? (
              <div className="py-12 text-center text-slate-400 text-sm font-medium">
                Loading credit history logs...
              </div>
            ) : applications.length === 0 ? (
              <div className="py-16 text-center text-slate-400 space-y-4">
                <p className="text-sm">No historical loan appraisals recorded on this account.</p>
                <button
                  onClick={() => setCurrentTab('predictor')}
                  className="rounded-lg bg-emerald-50/50 text-emerald-600 hover:bg-emerald-50 border border-emerald-100 px-4 py-2 text-xs font-bold"
                >
                  Create first evaluation
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 font-bold text-xs uppercase tracking-wider dark:border-slate-800">
                      <th className="py-3 px-2">Loan Detail</th>
                      <th className="py-3 px-2">Requested Cap</th>
                      <th className="py-3 px-2">Risk Index</th>
                      <th className="py-3 px-2">Status</th>
                      <th className="py-3 px-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {applications.map((app) => (
                      <tr key={app.id} className="hover:bg-slate-50 dark:hover:bg-slate-950 transition-colors">
                        <td className="py-3 px-2">
                          <span className="font-semibold text-slate-950 dark:text-white block">{app.loanPurpose} Loan</span>
                          <span className="text-[11px] text-slate-400 font-mono flex items-center mt-0.5">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(app.createdAt).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="py-3 px-2 font-mono font-bold text-slate-800 dark:text-slate-200">
                          {formatAmount(app.loanAmount * 1000)}
                        </td>
                        <td className="py-3 px-2">
                          <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold ${
                            app.riskLevel === 'Low' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30' : app.riskLevel === 'Medium' ? 'bg-yellow-50 text-yellow-700 dark:bg-yellow-950/30' : 'bg-red-50 text-red-700 dark:bg-red-950/30'
                          }`}>
                            {app.riskLevel}
                          </span>
                        </td>
                        <td className="py-3 px-2">
                          {app.status === 'Approved' ? (
                            <span className="flex items-center text-emerald-500 font-bold text-xs">
                              <CheckCircle className="h-4 w-4 mr-1 flex-shrink-0" /> Approved
                            </span>
                          ) : (
                            <span className="flex items-center text-red-500 font-bold text-xs">
                              <XCircle className="h-4 w-4 mr-1 flex-shrink-0" /> Rejected
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-2 text-right space-x-1 flex justify-end items-center">
                          <button
                            onClick={() => onSelectApplication(app)}
                            className="p-1.5 rounded bg-slate-50 border border-slate-100 text-slate-600 hover:text-emerald-500 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400"
                            title="View breakdown appraisal"
                          >
                            <ArrowUpRight className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDownloadPDF(app)}
                            className="p-1.5 rounded bg-slate-50 border border-slate-100 text-slate-600 hover:text-emerald-500 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400"
                            title="Export to A4 PDF"
                          >
                            <Download className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Profile settings update */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-md dark:border-slate-800 dark:bg-slate-900">
            <h3 className="font-display text-lg font-black text-slate-900 dark:text-white mb-4">
              Profile Management
            </h3>

            <form onSubmit={handleProfileSave} className="space-y-4">
              {profileSaved && (
                <div className="rounded-xl bg-emerald-50 p-3 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400">
                  Profile metadata successfully synchronized to Firestore.
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Account Email</label>
                <div className="flex items-center space-x-2 rounded-lg border border-slate-150 bg-slate-100/50 p-2.5 text-slate-500 text-sm dark:border-slate-800 dark:bg-slate-950 font-mono">
                  <Mail className="h-4 w-4" />
                  <span className="truncate">{user.email}</span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Full Name</label>
                <input
                  type="text"
                  required
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-sm outline-none focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                  placeholder="Jane Doe"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="tel"
                    value={profilePhone}
                    onChange={(e) => setProfilePhone(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={profileSaving}
                className="w-full flex items-center justify-center rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2.5 text-xs shadow-sm focus:outline-none disabled:opacity-50 dark:bg-emerald-600 dark:hover:bg-emerald-700"
                id="profile-save-btn"
              >
                {profileSaving ? 'Saving profile details...' : 'Save Profile Details'}
              </button>
            </form>
          </div>

          {/* Secure Audit Notice */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-950 text-slate-500 space-y-2">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center">
              <ShieldCheck className="h-4 w-4 text-emerald-500 mr-1.5" /> Credit Privacy Agreement
            </h4>
            <p className="text-[11px] leading-relaxed">
              Smart Lender AI encrypts all applicant features before running local models. Your detailed financial metrics are stored on isolated Firebase clusters and are accessible only by credentialed administrators.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
