import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'es' | 'fr' | 'de' | 'hi' | 'te';

export interface LanguageOption {
  code: Language;
  name: string;
  flag: string;
}

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'te', name: 'తెలుగు', flag: '🇮🇳' },
];

export const translations = {
  en: {
    // Navigation
    home: 'Home',
    features: 'Features',
    about: 'About',
    loanPrediction: 'Loan Prediction',
    userDashboard: 'User Dashboard',
    adminPanel: 'Admin Panel',
    login: 'Log In',
    register: 'Sign Up',
    logout: 'Log Out',
    myProfile: 'My Profile',
    switchAccount: 'Switch Account',

    // Hero
    heroTitle: 'Predict Loan Credit Risk with ML Precision',
    heroSubtitle: 'Empower your financial decisions. SmartLender AI evaluates loan eligibility and default risk in real-time with state-of-the-art machine learning.',
    startAssessment: 'Start Free Assessment',
    viewDashboard: 'View Dashboard',
    accuracyLabel: 'ML Model Accuracy',
    defaultRiskLabel: 'Default Rate Control',

    // Features Section
    featuresTitle: 'Advanced Analytics and Intelligence',
    featuresSubtitle: 'Our predictive suite harnesses advanced financial science to generate precise loan metrics.',
    feature1Title: '98.4% XGBoost Precision',
    feature1Desc: 'State-of-the-art gradient boosting pipelines analyze multi-dimensional credit records for high-fidelity predictions.',
    feature2Title: 'Durable Cloud Sync',
    feature2Desc: 'Powered by highly available Firebase Firestore, keeping your historical assessments synchronized across all devices securely.',
    feature3Title: 'Interactive Risk Sandbox',
    feature3Desc: 'Tune down-payment and collateral levels dynamically to observe live updates to applicant risk profiles.',

    // Statistics Section
    statsTitle: 'Global Real-time Activity',
    statsSub: 'Live loan underwriting performance metrics monitored globally.',
    activeApplications: 'Active Applications',
    approvalRate: 'Approval Rate',
    averageDefaultRisk: 'Default Risk',
    lastMonthText: '+12% from last month',
    optimizedText: 'Optimized by SmartAI',
    targetRiskText: 'Target: < 2.5%',

    // Predict Form
    newAssessmentTitle: 'New Risk Assessment',
    newAssessmentSub: 'Input the prospective applicant parameters below. The ML model will run real-time inference to evaluate approval likelihood and volatility indices.',
    personalHeader: '1. Personal Information',
    financialHeader: '2. Financial & Asset Verification',
    fullName: 'Full Name',
    emailAddress: 'Email Address',
    phoneNumber: 'Phone Number',
    age: 'Age (Years)',
    maritalStatus: 'Marital Status',
    dependents: 'Number of Dependents',
    residentialStatus: 'Residential Status',
    annualIncome: 'Annual Income ($)',
    employmentTime: 'Employment Duration (Years)',
    creditScore: 'Credit Score',
    loanAmount: 'Requested Loan Amount ($)',
    loanDuration: 'Loan Duration (Months)',
    collateralValue: 'Collateral Value ($)',
    hasCoSigner: 'Has Co-Signer / Guarantor',
    calculateRisk: 'Run Machine Learning Inference',
    calculating: 'Processing Multi-vector Inference...',

    // Predict Result
    resultTitle: 'Inference Analysis Report',
    resultSub: 'The system has calculated the following multi-dimensional risk matrices.',
    confidenceScore: 'AI Confidence Score',
    recommendation: 'Recommendation',
    statusApproved: 'APPROVED',
    statusRejected: 'HIGH RISK / DECLINED',
    statusReview: 'MANUAL REVIEW',
    recommApproved: 'The applicant displays low income volatility and a superior credit score. Recommend immediate approval with competitive interest rates.',
    recommRejected: 'Applicant exhibits indicators of high financial volatility or insufficient credit score. Recommend manual secondary asset verification.',
    recommReview: 'Applicant sits within the manual review tier. Verify employment history details and consider additional co-signer assets.',
    metricsSummary: 'Metrics Summary',
    dtiRatio: 'Debt-to-Income (DTI)',
    ltvRatio: 'Loan-to-Value (LTV)',
    repaymentAbility: 'Repayment Index',
    excellent: 'Excellent',
    good: 'Good',
    fair: 'Fair',
    poor: 'Poor',
    backToHome: 'Back to Dashboard',
    printReport: 'Export PDF Report',

    // Admin Panel
    systemAdmin: 'System Admin',
    adminDashboardTitle: 'Risk Control Center',
    adminDashboardSub: 'Global machine learning model metrics, historical prediction analysis, and telemetry logs.',
    modelControlHeader: 'ML Underwriting Core',
    currentModel: 'Active Model',
    datasetSize: 'Dataset Size',
    trainingStatus: 'Training Status',
    operationalStatus: 'System Status',
    recentApplications: 'Recent Applications',
    noAppsFound: 'No loan applications found yet.',
    retrainModel: 'Retrain Pipeline',
    importDemoData: 'Seed Benchmark Dataset',

    // Floating Chatbot
    chatTitle: 'Lending AI Companion',
    chatPlaceholder: 'Ask me about credit scores, debt ratios...',
    chatInitial: 'Hello! I am your AI underwriting assistant. How can I assist you with credit risk, loan criteria, or model explainability today?',

    // Auth
    loginTitle: 'Access SmartLender Core',
    loginSub: 'Enter your credentials to access the machine learning assessment console.',
    noAccount: "Don't have an account?",
    hasAccount: 'Already have an account?',
    forgotPassword: 'Forgot Password?',
    password: 'Password',
  },
  es: {
    // Navigation
    home: 'Inicio',
    features: 'Características',
    about: 'Nosotros',
    loanPrediction: 'Predicción de Préstamos',
    userDashboard: 'Panel de Usuario',
    adminPanel: 'Panel de Admin',
    login: 'Iniciar Sesión',
    register: 'Registrarse',
    logout: 'Cerrar Sesión',
    myProfile: 'Mi Perfil',
    switchAccount: 'Cambiar Cuenta',

    // Hero
    heroTitle: 'Predicción de Riesgo de Préstamos con Precisión de ML',
    heroSubtitle: 'Potencie sus decisiones financieras. SmartLender AI evalúa la elegibilidad del préstamo y el riesgo de impago en tiempo real con aprendizaje automático de última generación.',
    startAssessment: 'Iniciar Evaluación Gratuita',
    viewDashboard: 'Ver Panel',
    accuracyLabel: 'Precisión del Modelo ML',
    defaultRiskLabel: 'Control de Tasa de Impago',

    // Features Section
    featuresTitle: 'Análisis Avanzado e Inteligencia',
    featuresSubtitle: 'Nuestra suite predictiva aprovecha la ciencia financiera avanzada para generar métricas de préstamo precisas.',
    feature1Title: '98.4% Precisión XGBoost',
    feature1Desc: 'Los canales de aumento de gradiente de última generación analizan registros de crédito multidimensionales para predicciones de alta fidelidad.',
    feature2Title: 'Sincronización en la Nube Durable',
    feature2Desc: 'Impulsado por Firebase Firestore de alta disponibilidad, manteniendo sus evaluaciones históricas sincronizadas de forma segura en todos los dispositivos.',
    feature3Title: 'Caja de Arena de Riesgo Interactivo',
    feature3Desc: 'Ajuste los niveles de pago inicial y garantía de forma dinámica para observar actualizaciones en vivo de los perfiles de riesgo de los solicitantes.',

    // Statistics Section
    statsTitle: 'Actividad Global en Tiempo Real',
    statsSub: 'Métricas de rendimiento de suscripción de préstamos en vivo monitoreadas a nivel mundial.',
    activeApplications: 'Solicitudes Activas',
    approvalRate: 'Tasa de Aprobación',
    averageDefaultRisk: 'Riesgo de Impago',
    lastMonthText: '+12% desde el mes pasado',
    optimizedText: 'Optimizado por SmartAI',
    targetRiskText: 'Objetivo: < 2.5%',

    // Predict Form
    newAssessmentTitle: 'Nueva Evaluación de Riesgo',
    newAssessmentSub: 'Ingrese los parámetros del solicitante potencial a continuación. El modelo de ML ejecutará inferencia en tiempo real para evaluar la probabilidad de aprobación.',
    personalHeader: '1. Información Personal',
    financialHeader: '2. Verificación Financiera y de Activos',
    fullName: 'Nombre Completo',
    emailAddress: 'Correo Electrónico',
    phoneNumber: 'Número de Teléfono',
    age: 'Edad (Años)',
    maritalStatus: 'Estado Civil',
    dependents: 'Número de Dependientes',
    residentialStatus: 'Estado Residencial',
    annualIncome: 'Ingresos Anuales ($)',
    employmentTime: 'Duración del Empleo (Años)',
    creditScore: 'Puntuación de Crédito',
    loanAmount: 'Monto Solicitado ($)',
    loanDuration: 'Duración del Préstamo (Meses)',
    collateralValue: 'Valor de la Garantía ($)',
    hasCoSigner: 'Tiene Codeudor / Garante',
    calculateRisk: 'Ejecutar Inferencia de IA',
    calculating: 'Procesando Inferencia Multivectorial...',

    // Predict Result
    resultTitle: 'Informe de Análisis de Inferencia',
    resultSub: 'El sistema ha calculado las siguientes matrices de riesgo multidimensionales.',
    confidenceScore: 'Puntaje de Confianza de IA',
    recommendation: 'Recomendación',
    statusApproved: 'APROBADO',
    statusRejected: 'RIESGO ALTO / RECHAZADO',
    statusReview: 'REVISIÓN MANUAL',
    recommApproved: 'El solicitante muestra baja volatilidad de ingresos y una puntuación de crédito superior. Recomendar aprobación inmediata con tasas de interés competitivas.',
    recommRejected: 'El solicitante muestra indicadores de alta volatilidad financiera o puntuación de crédito insuficiente. Recomendar verificación manual de activos secundarios.',
    recommReview: 'El solicitante se encuentra dentro del nivel de revisión manual. Verifique los detalles de su historial laboral y considere activos de codeudores adicionales.',
    metricsSummary: 'Resumen de Métricas',
    dtiRatio: 'Deuda-a-Ingresos (DTI)',
    ltvRatio: 'Préstamo-a-Valor (LTV)',
    repaymentAbility: 'Índice de Reembolso',
    excellent: 'Excelente',
    good: 'Bueno',
    fair: 'Regular',
    poor: 'Deficiente',
    backToHome: 'Volver al Panel',
    printReport: 'Exportar Informe PDF',

    // Admin Panel
    systemAdmin: 'Administrador del Sistema',
    adminDashboardTitle: 'Centro de Control de Riesgos',
    adminDashboardSub: 'Métricas globales del modelo de aprendizaje automático, análisis de predicción histórico y registros del sistema.',
    modelControlHeader: 'Núcleo de Suscripción ML',
    currentModel: 'Modelo Activo',
    datasetSize: 'Tamaño del Conjunto de Datos',
    trainingStatus: 'Estado de Entrenamiento',
    operationalStatus: 'Estado del Sistema',
    recentApplications: 'Solicitudes Recientes',
    noAppsFound: 'Aún no se han encontrado solicitudes de préstamo.',
    retrainModel: 'Reentrenar Canal de Datos',
    importDemoData: 'Sembrar Datos de Referencia',

    // Floating Chatbot
    chatTitle: 'Asistente de Préstamos IA',
    chatPlaceholder: 'Pregúntame sobre puntaje crediticio, DTI...',
    chatInitial: '¡Hola! Soy tu asistente de IA para préstamos. ¿En qué te puedo ayudar hoy respecto al riesgo crediticio, criterios de préstamos o explicabilidad del modelo?',

    // Auth
    loginTitle: 'Acceso a SmartLender',
    loginSub: 'Ingrese sus credenciales para acceder a la consola de evaluación de IA.',
    noAccount: '¿No tiene una cuenta?',
    hasAccount: '¿Ya tiene una cuenta?',
    forgotPassword: '¿Olvidó su contraseña?',
    password: 'Contraseña',
  },
  fr: {
    // Navigation
    home: 'Accueil',
    features: 'Fonctionnalités',
    about: 'À Propos',
    loanPrediction: 'Prédiction de Prêt',
    userDashboard: 'Tableau de Bord',
    adminPanel: 'Console Admin',
    login: 'Connexion',
    register: 'Inscription',
    logout: 'Déconnexion',
    myProfile: 'Mon Profil',
    switchAccount: 'Changer de Compte',

    // Hero
    heroTitle: 'Prédisez le Risque de Crédit avec la Précision de l\'IA',
    heroSubtitle: 'Prenez des décisions financières éclairées. SmartLender AI évalue l\'éligibilité au prêt et le risque de défaut en temps réel grâce à l\'apprentissage automatique.',
    startAssessment: 'Lancer l\'Évaluation Gratuite',
    viewDashboard: 'Voir le Tableau de Bord',
    accuracyLabel: 'Précision du Modèle ML',
    defaultRiskLabel: 'Contrôle du Taux de Défaut',

    // Features Section
    featuresTitle: 'Analyses Avancées et Intelligence',
    featuresSubtitle: 'Notre suite prédictive exploite la science financière de pointe pour générer des indicateurs précis.',
    feature1Title: 'Précision XGBoost 98.4%',
    feature1Desc: 'Des pipelines d\'apprentissage de pointe analysent les données de crédit multidimensionnelles pour des prédictions hautement fiables.',
    feature2Title: 'Synchro Cloud Durable',
    feature2Desc: 'Propulsé par Firebase Firestore à haute disponibilité, garantissant la synchronisation sécurisée de vos historiques sur tous les appareils.',
    feature3Title: 'Simulateur de Risque Interactif',
    feature3Desc: 'Ajustez dynamiquement l\'apport et les garanties pour observer en temps réel l\'évolution du profil de risque.',

    // Statistics Section
    statsTitle: 'Activité Globale en Temps Réel',
    statsSub: 'Indicateurs de performance de souscription de prêts suivis en direct à l\'échelle mondiale.',
    activeApplications: 'Dossiers Actifs',
    approvalRate: 'Taux d\'Approbation',
    averageDefaultRisk: 'Risque de Défaut',
    lastMonthText: '+12% depuis le mois dernier',
    optimizedText: 'Optimisé par SmartAI',
    targetRiskText: 'Cible : < 2.5%',

    // Predict Form
    newAssessmentTitle: 'Nouvelle Évaluation de Risque',
    newAssessmentSub: 'Saisissez les paramètres du demandeur potentiel ci-dessous. Le modèle ML effectuera une inférence en temps réel pour évaluer la probabilité d\'approbation.',
    personalHeader: '1. Informations Personnelles',
    financialHeader: '2. Situation Financière & Patrimoine',
    fullName: 'Nom Complet',
    emailAddress: 'Adresse E-mail',
    phoneNumber: 'Numéro de Téléphone',
    age: 'Âge (Années)',
    maritalStatus: 'Statut Marital',
    dependents: 'Nombre de Personnes à Charge',
    residentialStatus: 'Statut Résidentiel',
    annualIncome: 'Revenu Annuel ($)',
    employmentTime: 'Ancienneté Professionnelle (Années)',
    creditScore: 'Score de Crédit (FICO)',
    loanAmount: 'Montant de l\'Emprunt ($)',
    loanDuration: 'Durée du Prêt (Mois)',
    collateralValue: 'Valeur de la Garantie ($)',
    hasCoSigner: 'Présence d\'un Co-signataire / Garant',
    calculateRisk: 'Lancer l\'Inférence IA',
    calculating: 'Calcul de l\'Inférence Multi-vecteurs...',

    // Predict Result
    resultTitle: 'Rapport d\'Analyse Prédictive',
    resultSub: 'Le système a calculé les indicateurs de risque multidimensionnels suivants.',
    confidenceScore: 'Score de Confiance de l\'IA',
    recommendation: 'Recommandation',
    statusApproved: 'APPROUVÉ',
    statusRejected: 'RISQUE ÉLEVÉ / REFUSÉ',
    statusReview: 'REVUE MANUELLE',
    recommApproved: 'Le demandeur présente une faible volatilité de revenus et un excellent score de crédit. Recommandation d\'approbation immédiate au taux standard.',
    recommRejected: 'Le demandeur présente des signes de forte instabilité financière ou un score de crédit insuffisant. Exiger une contre-expertise manuelle.',
    recommReview: 'Le dossier se situe dans la zone de décision manuelle. Vérifiez l\'historique d\'emploi et demandez éventuellement des garanties supplémentaires.',
    metricsSummary: 'Résumé des Paramètres',
    dtiRatio: 'Endettement / Revenus (DTI)',
    ltvRatio: 'Quotité du Prêt (LTV)',
    repaymentAbility: 'Indice de Solvabilité',
    excellent: 'Excellent',
    good: 'Bon',
    fair: 'Moyen',
    poor: 'Faible',
    backToHome: 'Retour au Tableau de Bord',
    printReport: 'Exporter le Rapport PDF',

    // Admin Panel
    systemAdmin: 'Admin Système',
    adminDashboardTitle: 'Console de Contrôle des Risques',
    adminDashboardSub: 'Indicateurs globaux du modèle d\'apprentissage automatique, historique des prédictions et télémétrie.',
    modelControlHeader: 'Moteur de Souscription ML',
    currentModel: 'Modèle Actif',
    datasetSize: 'Volume du Dataset',
    trainingStatus: 'Statut de l\'Entraînement',
    operationalStatus: 'État des Services',
    recentApplications: 'Dossiers Récents',
    noAppsFound: 'Aucun dossier de prêt trouvé pour le moment.',
    retrainModel: 'Réentraîner le Modèle',
    importDemoData: 'Générer des Données de Test',

    // Floating Chatbot
    chatTitle: 'Assistant IA Prêt',
    chatPlaceholder: 'Posez-moi une question sur les taux, le DTI...',
    chatInitial: 'Bonjour ! Je suis votre assistant virtuel de souscription. Comment puis-je vous aider aujourd\'hui concernant le risque de crédit, les critères d\'éligibilité ou le modèle ?',

    // Auth
    loginTitle: 'Accès SmartLender',
    loginSub: 'Saisissez vos identifiants pour vous connecter à la console d\'évaluation par IA.',
    noAccount: 'Pas encore de compte ?',
    hasAccount: 'Vous avez déjà un compte ?',
    forgotPassword: 'Mot de passe oublié ?',
    password: 'Mot de passe',
  },
  de: {
    // Navigation
    home: 'Startseite',
    features: 'Funktionen',
    about: 'Über Uns',
    loanPrediction: 'Kredit-Prognose',
    userDashboard: 'Benutzer-Dashboard',
    adminPanel: 'Admin-Bereich',
    login: 'Anmelden',
    register: 'Registrieren',
    logout: 'Abmelden',
    myProfile: 'Mein Profil',
    switchAccount: 'Konto wechseln',

    // Hero
    heroTitle: 'Kreditrisiko mit ML-Präzision vorhersagen',
    heroSubtitle: 'Treffen Sie fundierte Finanzentscheidungen. SmartLender AI bewertet die Kreditwürdigkeit und das Ausfallrisiko in Echtzeit mit modernstem maschinellem Lernen.',
    startAssessment: 'Kostenlose Analyse starten',
    viewDashboard: 'Dashboard anzeigen',
    accuracyLabel: 'ML-Modellgenauigkeit',
    defaultRiskLabel: 'Ausfallraten-Kontrolle',

    // Features Section
    featuresTitle: 'Erweiterte Analysen und Intelligenz',
    featuresSubtitle: 'Unsere prädiktive Suite nutzt fortschrittliche Finanzwissenschaft, um präzise Kreditmetriken zu generieren.',
    feature1Title: '98,4% XGBoost-Präzision',
    feature1Desc: 'Modernste Gradient-Boosting-Pipelines analysieren mehrdimensionale Kredithistorien für hochpräzise Vorhersagen.',
    feature2Title: 'Dauerhafte Cloud-Synchronisierung',
    feature2Desc: 'Unterstützt von der hochverfügbaren Firebase Firestore, damit Ihre historischen Analysen auf allen Geräten sicher synchronisiert bleiben.',
    feature3Title: 'Interaktive Risiko-Sandbox',
    feature3Desc: 'Passen Sie Anzahlung und Sicherheiten dynamisch an, um Live-Updates der Risikoprofile der Bewerber zu beobachten.',

    // Statistics Section
    statsTitle: 'Globale Echtzeit-Aktivität',
    statsSub: 'Weltweit überwachte Live-Metriken zur Kreditprüfung.',
    activeApplications: 'Aktive Anträge',
    approvalRate: 'Bewilligungsquote',
    averageDefaultRisk: 'Ausfallrisiko',
    lastMonthText: '+12% im Vergleich zum Vormonat',
    optimizedText: 'Optimiert durch SmartAI',
    targetRiskText: 'Zielwert: < 2,5%',

    // Predict Form
    newAssessmentTitle: 'Neue Risikoanalyse',
    newAssessmentSub: 'Geben Sie unten die Parameter des potenziellen Bewerbers ein. Das ML-Modell führt eine Echtzeit-Inferenz durch, um die Bewilligungswahrscheinlichkeit zu berechnen.',
    personalHeader: '1. Persönliche Informationen',
    financialHeader: '2. Finanz- und Vermögensprüfung',
    fullName: 'Vollständiger Name',
    emailAddress: 'E-Mail-Adresse',
    phoneNumber: 'Telefonnummer',
    age: 'Alter (Jahre)',
    maritalStatus: 'Familienstand',
    dependents: 'Anzahl der Unterhaltsberechtigten',
    residentialStatus: 'Wohnstatus',
    annualIncome: 'Jahreseinkommen ($)',
    employmentTime: 'Anstellungsdauer (Jahre)',
    creditScore: 'Kredit-Score (Schufa)',
    loanAmount: 'Gewünschter Kreditbetrag ($)',
    loanDuration: 'Kreditlaufzeit (Monate)',
    collateralValue: 'Wert der Sicherheiten ($)',
    hasCoSigner: 'Hat Mitunterzeichner / Bürgen',
    calculateRisk: 'ML-Inferenz ausführen',
    calculating: 'Analysiere Datenvektoren...',

    // Predict Result
    resultTitle: 'Analysebericht der Inferenz',
    resultSub: 'Das System hat die folgenden mehrdimensionalen Risikomatrizen berechnet.',
    confidenceScore: 'KI-Konfidenzwert',
    recommendation: 'Empfehlung',
    statusApproved: 'BEWILLIGT',
    statusRejected: 'HOHES RISIKO / ABGELEHNT',
    statusReview: 'MANUELLE PRÜFUNG',
    recommApproved: 'Der Bewerber weist eine geringe Einkommensvolatilität und einen hervorragenden Kredit-Score auf. Sofortige Bewilligung zu attraktiven Zinssätzen empfohlen.',
    recommRejected: 'Der Bewerber zeigt Anzeichen hoher finanzieller Volatilität oder einen unzureichenden Kredit-Score. Manuelle Zusatzprüfung empfohlen.',
    recommReview: 'Der Antrag befindet sich im manuellen Prüfungsbereich. Überprüfen Sie die Beschäftigungshistorie und fordern Sie ggf. weitere Sicherheiten an.',
    metricsSummary: 'Metrik-Zusammenfassung',
    dtiRatio: 'Schulden-zu-Einkommen (DTI)',
    ltvRatio: 'Kredit-zu-Wert (LTV)',
    repaymentAbility: 'Rückzahlungsindex',
    excellent: 'Hervorragend',
    good: 'Gut',
    fair: 'Mittelmäßig',
    poor: 'Schlecht',
    backToHome: 'Zurück zum Dashboard',
    printReport: 'PDF-Bericht exportieren',

    // Admin Panel
    systemAdmin: 'System-Admin',
    adminDashboardTitle: 'Risiko-Kontrollzentrum',
    adminDashboardSub: 'Globale Leistungskennzahlen des Modells, historische Analysen und Systemprotokolle.',
    modelControlHeader: 'ML-Kreditprüfungskern',
    currentModel: 'Aktives Modell',
    datasetSize: 'Dataset-Größe',
    trainingStatus: 'Trainingsstatus',
    operationalStatus: 'Systemstatus',
    recentApplications: 'Letzte Anträge',
    noAppsFound: 'Bisher keine Kreditanträge gefunden.',
    retrainModel: 'Pipeline neu trainieren',
    importDemoData: 'Benchmark-Daten laden',

    // Floating Chatbot
    chatTitle: 'Kredit-KI-Assistent',
    chatPlaceholder: 'Fragen Sie nach Scores, DTI-Verhältnis...',
    chatInitial: 'Hallo! Ich bin Ihr KI-Prüfungsassistent. Wie kann ich Ihnen heute bei Kreditrisiken, Kriterien oder der Modell-Erklärbarkeit helfen?',

    // Auth
    loginTitle: 'Zugang zu SmartLender',
    loginSub: 'Geben Sie Ihre Zugangsdaten ein, um das KI-Analyseportal zu nutzen.',
    noAccount: 'Noch kein Konto?',
    hasAccount: 'Haben Sie bereits ein Konto?',
    forgotPassword: 'Passwort vergessen?',
    password: 'Passwort',
  },
  hi: {
    // Navigation
    home: 'होम',
    features: 'विशेषताएं',
    about: 'हमारे बारे में',
    loanPrediction: 'ऋण पूर्वानुमान',
    userDashboard: 'उपयोगकर्ता डैशबोर्ड',
    adminPanel: 'एडमिन पैनल',
    login: 'लॉग इन करें',
    register: 'साइन अप करें',
    logout: 'लॉग आउट',
    myProfile: 'मेरी प्रोफ़ाइल',
    switchAccount: 'खाता बदलें',

    // Hero
    heroTitle: 'ML सटीकता के साथ ऋण क्रेडिट जोखिम का पूर्वानुमान लगाएं',
    heroSubtitle: 'अपने वित्तीय निर्णयों को सशक्त बनाएं। स्मार्टलेंडर एआई अत्याधुनिक मशीन लर्निंग के साथ वास्तविक समय में ऋण पात्रता और डिफ़ॉल्ट जोखिम का मूल्यांकन करता है।',
    startAssessment: 'मुफ़्त मूल्यांकन शुरू करें',
    viewDashboard: 'डैशबोर्ड देखें',
    accuracyLabel: 'ML मॉडल सटीकता',
    defaultRiskLabel: 'डिफ़ॉल्ट दर नियंत्रण',

    // Features Section
    featuresTitle: 'उन्नत विश्लेषण और बुद्धिमत्ता',
    featuresSubtitle: 'हमारा पूर्वानुमान सुइट सटीक ऋण मेट्रिक्स उत्पन्न करने के लिए उन्नत वित्तीय विज्ञान का उपयोग करता है।',
    feature1Title: '98.4% XGBoost सटीकता',
    feature1Desc: 'अत्याधुनिक ग्रेडिएंट बूस्टिंग पाइपलाइनें उच्च-विश्वसनीयता पूर्वानुमानों के लिए बहु-आयामी क्रेडिट रिकॉर्ड का विश्लेषण करती हैं।',
    feature2Title: 'टिकाऊ क्लाउड सिंक',
    feature2Desc: 'उच्च उपलब्धता वाले फायरबेस स्टोर द्वारा संचालित, आपके ऐतिहासिक मूल्यांकनों को सभी उपकरणों पर सुरक्षित रूप से सिंक रखता है।',
    feature3Title: 'इंटरैक्टिव जोखिम सैंडबॉक्स',
    feature3Desc: 'आवेदक जोखिम प्रोफाइल में लाइव अपडेट देखने के लिए डाउन-पेमेंट और संपार्श्विक स्तरों को गतिशील रूप से ट्यून करें।',

    // Statistics Section
    statsTitle: 'वैश्विक वास्तविक समय गतिविधि',
    statsSub: 'विश्व स्तर पर मॉनिटर किए जाने वाले लाइव लोन अंडरराइटिंग प्रदर्शन मेट्रिक्स।',
    activeApplications: 'सक्रिय आवेदन',
    approvalRate: 'स्वीकृति दर',
    averageDefaultRisk: 'डिफ़ॉल्ट जोखिम',
    lastMonthText: 'पिछले महीने से +12%',
    optimizedText: 'स्मार्टएआई द्वारा अनुकूलित',
    targetRiskText: 'लक्ष्य: < 2.5%',

    // Predict Form
    newAssessmentTitle: 'नया जोखिम मूल्यांकन',
    newAssessmentSub: 'नीचे संभावित आवेदक पैरामीटर दर्ज करें। स्वीकृति की संभावना का मूल्यांकन करने के लिए एमएल मॉडल वास्तविक समय में अनुमान लगाएगा।',
    personalHeader: '1. व्यक्तिगत जानकारी',
    financialHeader: '2. वित्तीय और संपत्ति सत्यापन',
    fullName: 'पूरा नाम',
    emailAddress: 'ईमेल पता',
    phoneNumber: 'फ़ोन नंबर',
    age: 'आयु (वर्ष)',
    maritalStatus: 'वैवाहिक स्थिति',
    dependents: 'आश्रितों की संख्या',
    residentialStatus: 'आवासीय स्थिति',
    annualIncome: 'वार्षिक आय ($)',
    employmentTime: 'रोजगार की अवधि (वर्ष)',
    creditScore: 'क्रेडिट स्कोर',
    loanAmount: 'अनुरोधित ऋण राशि ($)',
    loanDuration: 'ऋण अवधि (महीने)',
    collateralValue: 'संपार्श्विक मूल्य ($)',
    hasCoSigner: 'सह-हस्ताक्षरकर्ता / गारंटर है',
    calculateRisk: 'मशीन लर्निंग निष्कर्ष चलाएं',
    calculating: 'मल्टी-वेक्टर निष्कर्ष प्रसंस्करण...',

    // Predict Result
    resultTitle: 'निष्कर्ष विश्लेषण रिपोर्ट',
    resultSub: 'सिस्टम ने निम्नलिखित बहु-आयामी जोखिम मेट्रिक्स की गणना की है।',
    confidenceScore: 'एआई विश्वास स्कोर',
    recommendation: 'सिफारिश',
    statusApproved: 'स्वीकृत',
    statusRejected: 'उच्च जोखिम / अस्वीकृत',
    statusReview: 'मैनुअल समीक्षा',
    recommApproved: 'आवेदक कम आय अस्थिरता और एक बेहतर क्रेडिट स्कोर प्रदर्शित करता है। प्रतिस्पर्धी ब्याज दरों के साथ तत्काल स्वीकृति की सिफारिश की जाती है।',
    recommRejected: 'आवेदक उच्च वित्तीय अस्थिरता या अपर्याप्त क्रेडिट स्कोर के संकेतक प्रदर्शित करता है। मैन्युअल द्वितीयक संपत्ति सत्यापन की सिफारिश की जाती है।',
    recommReview: 'आवेदक मैनुअल समीक्षा स्तर के भीतर है। रोजगार इतिहास के विवरण सत्यापित करें और अतिरिक्त सह-हस्ताक्षरकर्ता संपार्श्विक पर विचार करें।',
    metricsSummary: 'मेट्रिक्स सारांश',
    dtiRatio: 'ऋण-से-आय (DTI)',
    ltvRatio: 'ऋण-से-मूल्य (LTV)',
    repaymentAbility: 'पुनर्भुगतान सूचकांक',
    excellent: 'उत्कृष्ट',
    good: 'अच्छा',
    fair: 'सामान्य',
    poor: 'खराब',
    backToHome: 'डैशबोर्ड पर वापस जाएं',
    printReport: 'पीडीएफ रिपोर्ट निर्यात करें',

    // Admin Panel
    systemAdmin: 'सिस्टम व्यवस्थापक',
    adminDashboardTitle: 'जोखिम नियंत्रण केंद्र',
    adminDashboardSub: 'वैश्विक मशीन लर्निंग मॉडल मेट्रिक्स, ऐतिहासिक भविष्यवाणी विश्लेषण और सिस्टम लॉग।',
    modelControlHeader: 'एमएल अंडरराइटिंग कोर',
    currentModel: 'सक्रिय मॉडल',
    datasetSize: 'डेटासेट आकार',
    trainingStatus: 'प्रशिक्षण स्थिति',
    operationalStatus: 'सिस्टम स्थिति',
    recentApplications: 'हाल के आवेदन',
    noAppsFound: 'अभी तक कोई ऋण आवेदन नहीं मिला।',
    retrainModel: 'पाइपलाइन को फिर से प्रशिक्षित करें',
    importDemoData: 'बेंचमार्क डेटा लोड करें',

    // Floating Chatbot
    chatTitle: 'लोन एआई सहायक',
    chatPlaceholder: 'क्रेडिट स्कोर, ऋण अनुपात के बारे में पूछें...',
    chatInitial: 'नमस्ते! मैं आपका एआई अंडरराइटिंग सहायक हूं। आज मैं क्रेडिट जोखिम, ऋण मानदंड या मॉडल स्पष्टीकरण में आपकी क्या मदद कर सकता हूं?',

    // Auth
    loginTitle: 'स्मार्टलेंडर एक्सेस',
    loginSub: 'एआई मूल्यांकन कंसोल तक पहुंचने के लिए अपने क्रेडेंशियल दर्ज करें।',
    noAccount: 'खाता नहीं है?',
    hasAccount: 'पहले से ही खाता है?',
    forgotPassword: 'पासवर्ड भूल गए?',
    password: 'पासवर्ड',
  },
  te: {
    // Navigation
    home: 'హోమ్',
    features: 'లక్షణాలు',
    about: 'మా గురించి',
    loanPrediction: 'రుణ అంచనా',
    userDashboard: 'యూజర్ డాష్‌బోర్డ్',
    adminPanel: 'అడ్మిన్ ప్యానెల్',
    login: 'లాగిన్',
    register: 'సైన్ అప్',
    logout: 'లాగ్ అవుట్',
    myProfile: 'నా ప్రొఫైల్',
    switchAccount: 'ఖాతా మార్చండి',

    // Hero
    heroTitle: 'ML ఖచ్చితత్వంతో రుణ క్రెడిట్ రిస్క్ అంచనా వేయండి',
    heroSubtitle: 'మీ ఆర్థిక నిర్ణయాలను శక్తివంతం చేసుకోండి. స్మార్ట్‌లెండర్ AI అత్యాధునిక మెషిన్ లెర్నింగ్‌తో నిజ సమయంలో రుణ అర్హత మరియు డిఫాల్ట్ రిస్క్‌ను అంచనా వేస్తుంది.',
    startAssessment: 'ఉచిత అంచనా ప్రారంభించండి',
    viewDashboard: 'డాష్‌బోర్డ్ చూడండి',
    accuracyLabel: 'ML మోడల్ ఖచ్చితత్వం',
    defaultRiskLabel: 'డిఫాల్ట్ రేట్ నియంత్రణ',

    // Features Section
    featuresTitle: 'అధునాతన అనలిటిక్స్ మరియు ఇంటెలిజెన్స్',
    featuresSubtitle: 'మా అంచనా వ్యవస్థ ఖచ్చితమైన రుణ కొలతలను రూపొందించడానికి అధునాతన ఆర్థిక శాస్త్రాన్ని ఉపయోగిస్తుంది.',
    feature1Title: '98.4% XGBoost ఖచ్చితత్వం',
    feature1Desc: 'అత్యాధునిక గ్రేడియంట్ బూస్టింగ్ పైప్‌లైన్‌లు నమ్మదగిన అంచనాల కోసం బహుళ-కోణాల క్రెడిట్ రికార్డులను విశ్లేషిస్తాయి.',
    feature2Title: 'మన్నికైన క్లౌడ్ సమకాలీకరణ',
    feature2Desc: 'అధిక లభ్యత కలిగిన ఫైర్‌బేస్ ఫైర్‌స్టోర్ ద్వారా ఆధారితమైనది, మీ చారిత్రక అంచనాలను అన్ని పరికరాల్లో సురక్షితంగా సమకాలీకరిస్తుంది.',
    feature3Title: 'ఇంటరాక్టివ్ రిస్క్ శాండ్‌బాక్స్',
    feature3Desc: 'దరఖాస్తుదారుల రిస్క్ ప్రొఫైల్‌లకు ప్రత్యక్ష అప్‌డేట్‌లను గమనించడానికి డౌన్-పేమెంట్ మరియు హామీ శాతం స్థాయిలను డైనమిక్‌గా మార్చండి.',

    // Statistics Section
    statsTitle: 'గ్లోబల్ రియల్-టైమ్ యాక్టివిటీ',
    statsSub: 'ప్రపంచవ్యాప్తంగా పర్యవేక్షించబడే ప్రత్యక్ష రుణ అండర్‌రైటింగ్ పనితీరు కొలతలు.',
    activeApplications: 'యాక్టివ్ అప్లికేషన్లు',
    approvalRate: 'ఆమోదం రేటు',
    averageDefaultRisk: 'డిఫాల్ట్ రిస్క్',
    lastMonthText: 'గత నెల నుండి +12%',
    optimizedText: 'SmartAI ద్వారా ఆప్టిమైజ్ చేయబడింది',
    targetRiskText: 'లక్ష్యం: < 2.5%',

    // Predict Form
    newAssessmentTitle: 'కొత్త రిస్క్ అసెస్‌మెంట్',
    newAssessmentSub: 'క్రింద దరఖాస్తుదారుడి పారామితులను నమోదు చేయండి. ఆమోదం పొందే సంభావ్యతను అంచనా వేయడానికి ML మోడల్ నిజ సమయంలో విశ్లేషిస్తుంది.',
    personalHeader: '1. వ్యక్తిగత సమాచారం',
    financialHeader: '2. ఆర్థిక & ఆస్తి ధృవీకరణ',
    fullName: 'పూర్తి పేరు',
    emailAddress: 'ఈమెయిల్ చిరునామా',
    phoneNumber: 'ఫోన్ నంబర్',
    age: 'వయస్సు (సంవత్సరాలు)',
    maritalStatus: 'వైవాహిక స్థితి',
    dependents: 'ఆధారపడిన వారి సంఖ్య',
    residentialStatus: 'నివాస స్థితి',
    annualIncome: 'वार्षिक ఆదాయం ($)',
    employmentTime: 'ఉద్యోగ కాలపరిమితి (సంవత్సరాలు)',
    creditScore: 'క్రెడిట్ స్కోరు',
    loanAmount: 'కోరిన రుణ మొత్తం ($)',
    loanDuration: 'రుణ కాలపరిమితి (నెలలు)',
    collateralValue: 'హామీ ఆస్తి విలువ ($)',
    hasCoSigner: 'సహ-సంతకందారుడు / హామీదారుడు ఉన్నారు',
    calculateRisk: 'మెషిన్ లెర్నింగ్ విశ్లేషణను రన్ చేయండి',
    calculating: 'మల్టీ-వెక్టర్ విశ్లేషణ జరుగుతోంది...',

    // Predict Result
    resultTitle: 'విశ్లేషణ నివేదిక',
    resultSub: 'సిస్టమ్ క్రింది బహుళ-కోణాల రిస్క్ మ్యాట్రిక్స్‌లను లెక్కించింది.',
    confidenceScore: 'AI విశ్వాస స్కోరు',
    recommendation: 'సిఫార్సు',
    statusApproved: 'ఆమోదించబడింది',
    statusRejected: 'అధిక రిస్క్ / తిరస్కరించబడింది',
    statusReview: 'మాన్యువల్ సమీక్ష',
    recommApproved: 'దరఖాస్తుదారు తక్కువ ఆదాయ అస్థిరతను మరియు అద్భుతమైన క్రెడిట్ స్కోరును కలిగి ఉన్నారు. తక్కువ వడ్డీ రేట్లతో తక్షణ ఆమోదం సిఫార్సు చేయబడింది.',
    recommRejected: 'దరఖాస్తుదారు అధిక ఆర్థిక అస్థిరత లేదా తగినంత క్రెడిట్ స్కోరు లేకపోవడాన్ని సూచిస్తున్నారు. మాన్యువల్ ద్వితీయ ఆస్తి ధృవీకరణ సిఫార్సు చేయబడింది.',
    recommReview: 'దరఖాస్తుదారు మాన్యువల్ సమీక్ష పరిధిలో ఉన్నారు. ఉద్యోగ చరిత్ర వివరాలను ధృవీకరించండి మరియు అదనపు హామీలను పరిగణనలోకి తీసుకోండి.',
    metricsSummary: 'కొలతల సారాంశం',
    dtiRatio: 'రుణం-ఆదాయ నిష్పత్తి (DTI)',
    ltvRatio: 'రుణం-విలువ నిష్పత్తి (LTV)',
    repaymentAbility: 'తిరిగి చెల్లించే సామర్థ్యం',
    excellent: 'అద్భుతం',
    good: 'మంచిది',
    fair: 'సాధారణం',
    poor: 'బలహీనం',
    backToHome: 'డాష్‌బోర్డ్‌కు తిరిగి వెళ్లండి',
    printReport: 'PDF నివేదికను డౌన్‌లోడ్ చేయండి',

    // Admin Panel
    systemAdmin: 'సిస్టమ్ అడ్మినిస్ట్రేటర్',
    adminDashboardTitle: 'రిస్క్ కంట్రోల్ సెంటర్',
    adminDashboardSub: 'గ్లోబల్ మెషిన్ లెర్నింగ్ మోడల్ కొలతలు, చారిత్రక అంచనా విశ్లేషణ మరియు సిస్టమ్ లాగ్‌లు.',
    modelControlHeader: 'ML అండర్‌రైటింగ్ కోర్',
    currentModel: 'యాక్టివ్ మోడల్',
    datasetSize: 'డేటాసెట్ పరిమాణం',
    trainingStatus: 'శిక్షణ స్థితి',
    operationalStatus: 'సిస్టమ్ స్థితి',
    recentApplications: 'ఇటీవలి అప్లికేషన్లు',
    noAppsFound: 'ఇంకా ఎలాంటి రుణ అప్లికేషన్లు కనుగొనబడలేదు.',
    retrainModel: 'పైప్‌లైన్‌ను మళ్లీ శిక్షణ ఇవ్వండి',
    importDemoData: 'బెంచ్‌మార్క్ డేటాను లోడ్ చేయండి',

    // Floating Chatbot
    chatTitle: 'లోన్ AI సహాయకుడు',
    chatPlaceholder: 'క్రెడిట్ స్కోర్లు, రుణ నిష్పత్తుల గురించి అడగండి...',
    chatInitial: 'నమస్కారం! నేను మీ AI అండర్‌రైటింగ్ అసిస్టెంట్‌ని. క్రెడిట్ రిస్క్, రుణ ప్రమాణాలు లేదా మోడల్ వివరణ గురించి ఈరోజు నేను మీకు ఎలా సహాయపడగలను?',

    // Auth
    loginTitle: 'స్మార్ట్‌లెండర్ లాగిన్',
    loginSub: 'AI అంచనా కన్సోల్‌ను యాక్సెస్ చేయడానికి మీ ఆధారాలను నమోదు చేయండి.',
    noAccount: 'ఖాతా లేదా?',
    hasAccount: 'ఇప్పటికే ఖాతా ఉందా?',
    forgotPassword: 'పాస్‌వర్డ్ మర్చిపోయారా?',
    password: 'పాస్‌వర్డ్',
  },
};

const LanguageContext = createContext<{
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations['en'];
} | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('smartlender_language');
    if (saved === 'en' || saved === 'es' || saved === 'fr' || saved === 'de' || saved === 'hi' || saved === 'te') {
      return saved as Language;
    }
    return 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('smartlender_language', lang);
  };

  const t = translations[language];

  return React.createElement(
    LanguageContext.Provider,
    { value: { language, setLanguage, t } },
    children
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
