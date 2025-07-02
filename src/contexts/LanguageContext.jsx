import React, { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

const translations = {
  en: {
    // Navigation
    home: 'Home',
    inquiry: 'Medical Inquiry',
    packages: 'Packages',
    payment: 'Payment',
    aftercare: 'Aftercare',
    admin: 'Admin',

    // Home Page
    welcome: 'Welcome to EMIRAFRIK',
    subtitle: 'Premium Medical Tourism Platform',
    description: 'Connecting Middle East and French-speaking African countries with world-class healthcare in Dubai.',
    startInquiry: 'Start Medical Inquiry',
    viewPackages: 'View Packages',
    whyChooseUs: 'Why Choose EMIRAFRIK?',
    worldClass: 'World-Class Healthcare',
    worldClassDesc: 'Access to Dubai\'s top-tier medical facilities and renowned specialists.',
    personalizedCare: 'Personalized Care',
    personalizedCareDesc: 'Tailored treatment plans and dedicated support throughout your journey.',
    seamlessExperience: 'Seamless Experience',
    seamlessExperienceDesc: 'End-to-end service from consultation to recovery and follow-up care.',

    // Medical Inquiry
    medicalInquiry: 'Medical Inquiry',
    fullName: 'Full Name',
    country: 'Country',
    healthCondition: 'Health Condition',
    healthConditionPlaceholder: 'Please describe your health condition and treatment needs...',
    submitInquiry: 'Submit Inquiry',

    // Chat
    chatWithAssistant: 'Chat with Assistant',
    typeMessage: 'Type your message...',
    send: 'Send',

    // Packages
    medicalPackages: 'Medical Packages',
    filterByBudget: 'Budget',
    filterByCountry: 'Country',
    filterByTreatment: 'Treatment',
    addTourism: 'Add Tourism',
    bookNow: 'Book Now',

    // Payment
    paymentOptions: 'Payment Options',
    creditCard: 'Credit Card',
    mobileMoney: 'Mobile Money',

    // Aftercare
    aftercareSupport: 'Aftercare Support',
    uploadReports: 'Upload Reports',
    scheduleConsultation: 'Schedule Consultation',
    chatWithDoctor: 'Chat with Doctor',
  },
  fr: {
    // Navigation
    home: 'Accueil',
    inquiry: 'Demande Médicale',
    packages: 'Forfaits',
    payment: 'Paiement',
    aftercare: 'Suivi',
    admin: 'Admin',

    // Home Page
    welcome: 'Bienvenue chez EMIRAFRIK',
    subtitle: 'Plateforme Premium de Tourisme Médical',
    description: 'Connecter le Moyen-Orient et les pays africains francophones avec des soins de santé de classe mondiale à Dubaï.',
    startInquiry: 'Commencer une Demande Médicale',
    viewPackages: 'Voir les Forfaits',
    whyChooseUs: 'Pourquoi Choisir EMIRAFRIK?',
    worldClass: 'Soins de Santé de Classe Mondiale',
    worldClassDesc: 'Accès aux installations médicales de premier plan de Dubaï et aux spécialistes renommés.',
    personalizedCare: 'Soins Personnalisés',
    personalizedCareDesc: 'Plans de traitement sur mesure et soutien dédié tout au long de votre parcours.',
    seamlessExperience: 'Expérience Fluide',
    seamlessExperienceDesc: 'Service de bout en bout de la consultation au rétablissement et au suivi.',

    // Medical Inquiry
    medicalInquiry: 'Demande Médicale',
    fullName: 'Nom Complet',
    country: 'Pays',
    healthCondition: 'État de Santé',
    healthConditionPlaceholder: 'Veuillez décrire votre état de santé et vos besoins de traitement...',
    submitInquiry: 'Soumettre la Demande',

    // Chat
    chatWithAssistant: 'Discuter avec l\'Assistant',
    typeMessage: 'Tapez votre message...',
    send: 'Envoyer',

    // Packages
    medicalPackages: 'Forfaits Médicaux',
    filterByBudget: 'Budget',
    filterByCountry: 'Pays',
    filterByTreatment: 'Traitement',
    addTourism: 'Ajouter Tourisme',
    bookNow: 'Réserver Maintenant',

    // Payment
    paymentOptions: 'Options de Paiement',
    creditCard: 'Carte de Crédit',
    mobileMoney: 'Mobile Money',

    // Aftercare
    aftercareSupport: 'Support de Suivi',
    uploadReports: 'Télécharger les Rapports',
    scheduleConsultation: 'Programmer une Consultation',
    chatWithDoctor: 'Discuter avec le Médecin',
  },
  ar: {
    // Navigation
    home: 'الرئيسية',
    inquiry: 'استفسار طبي',
    packages: 'الباقات',
    payment: 'الدفع',
    aftercare: 'المتابعة',
    admin: 'الإدارة',

    // Home Page
    welcome: 'مرحباً بكم في إمارافريك',
    subtitle: 'منصة السياحة العلاجية المتميزة',
    description: 'ربط الشرق الأوسط والدول الأفريقية الناطقة بالفرنسية بالرعاية الصحية عالمية المستوى في دبي.',
    startInquiry: 'بدء استفسار طبي',
    viewPackages: 'عرض الباقات',
    whyChooseUs: 'لماذا تختار إمارافريك؟',
    worldClass: 'رعاية صحية عالمية المستوى',
    worldClassDesc: 'الوصول إلى المرافق الطبية الرائدة في دبي والأخصائيين المشهورين.',
    personalizedCare: 'رعاية شخصية',
    personalizedCareDesc: 'خطط علاج مخصصة ودعم مخصص طوال رحلتك.',
    seamlessExperience: 'تجربة سلسة',
    seamlessExperienceDesc: 'خدمة شاملة من الاستشارة إلى التعافي والمتابعة.',

    // Medical Inquiry
    medicalInquiry: 'استفسار طبي',
    fullName: 'الاسم الكامل',
    country: 'البلد',
    healthCondition: 'الحالة الصحية',
    healthConditionPlaceholder: 'يرجى وصف حالتك الصحية واحتياجات العلاج...',
    submitInquiry: 'إرسال الاستفسار',

    // Chat
    chatWithAssistant: 'تحدث مع المساعد',
    typeMessage: 'اكتب رسالتك...',
    send: 'إرسال',

    // Packages
    medicalPackages: 'الباقات الطبية',
    filterByBudget: 'الميزانية',
    filterByCountry: 'البلد',
    filterByTreatment: 'العلاج',
    addTourism: 'إضافة سياحة',
    bookNow: 'احجز الآن',

    // Payment
    paymentOptions: 'خيارات الدفع',
    creditCard: 'بطاقة ائتمان',
    mobileMoney: 'موبايل موني',

    // Aftercare
    aftercareSupport: 'دعم المتابعة',
    uploadReports: 'رفع التقارير',
    scheduleConsultation: 'جدولة استشارة',
    chatWithDoctor: 'تحدث مع الطبيب',
  }
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');

  const t = (key) => {
    return translations[currentLanguage]?.[key] || translations.en[key] || key;
  };

  const changeLanguage = (lang) => {
    setCurrentLanguage(lang);
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageProvider;