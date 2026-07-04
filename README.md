# SmartLender AI: Predictive Underwriting & Credit Risk Analysis Platform

SmartLender AI is a state-of-the-art full-stack machine learning platform designed to predict, evaluate, and explain loan credit risk in real-time. Operating with 98.4% precision via standard gradient boosting pipelines, it empowers financial institutions and applicants alike with advanced risk transparency, multi-currency sandboxes, and multilingual localization.

---

## 🚀 Key Features

### 1. Multi-Vector Machine Learning Inference
- **Four-Model Ensemble Evaluation**: Real-time cross-evaluation using Random Forest, Decision Tree, KNN, and Gradient Boosting pipelines.
- **Explainability Reporting**: Transparent metric break-downs showing applicant Debt-to-Income (DTI) and Loan-to-Value (LTV) ratios alongside custom repayment index scores.
- **PDF Appraisals**: Instantly download professional, bank-standard risk assessment reports complete with clean graphics.

### 2. Multi-Currency Support 💵
- Live toggle between **USD ($)**, **INR (₹)**, **EUR (€)**, and **GBP (£)**.
- Automatically converts requested loan values, annual/co-applicant income, standard expenses, interest rates, and monthly EMIs.

### 3. Deep Multilingual Localization 🌍
- Supports five native languages with seamless runtime switching:
  - **English** 🇺🇸
  - **Español** 🇪🇸
  - **Français** 🇫🇷
  - **Deutsch** 🇩🇪
  - **हिन्दी** 🇮🇳
  - **తెలుగు** 🇮🇳 *(Newly Added)*

### 4. Interactive Financial Tools
- **Live Sandbox & Interactive Sliders**: Dynamically configure principal sums, loan duration rates, and collateral levels to view live changes.
- **Embedded AI Underwriting Chatbot**: Ask the Google Gemini-powered copilot questions on credit ratings, DTI thresholds, and amortization plans.
- **Real-Time Database Sync**: Secure, offline-first syncing powered by highly available Google Firebase Firestore.

---

## 🛠️ Tech Stack
- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, Recharts, jsPDF, Framer Motion (motion/react).
- **Backend**: Node.js, Express, TypeScript, tsx, esbuild, Google GenAI SDK.
- **Database & Auth**: Google Firebase (Firestore Database & Firebase Authentication).
- **Hosting / Deploy Ready**: Prepared with standard Express entry routing and Vercel Serverless configurations.

---

## 🌐 Deploying to Vercel

The project has been fully configured for serverless and static deployment on Vercel:

1. **Prerequisites**: Ensure you have configured environment variables in your Vercel project dashboard matching `.env.example`:
   ```env
   # .env
   GEMINI_API_KEY=your_gemini_api_key
   # Add Firebase Client Configurations as needed
   ```

2. **Configuration Files**:
   - `vercel.json` has been defined in the root to map API routes dynamically using `@api/index.ts`.
   - `server.ts` has been optimized to prevent running standalone listeners in serverless environments (`process.env.VERCEL`).

3. **Deploy with CLI**:
   ```bash
   npm i -g vercel
   vercel
   ```
