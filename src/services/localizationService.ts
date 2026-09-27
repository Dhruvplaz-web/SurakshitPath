import { AppLanguage } from '../types/routing';

export interface TranslationDictionary {
  appName: string;
  appTagline: string;
  testbedSubtitle: string;
  roleCommuter: string;
  roleAdmin: string;
  roleGuardian: string;
  roleVolunteer: string;
  telemetryActive: string;
  sdgAligned: string;
  voiceActive: string;
  voiceMuted: string;
  searchOriginPlaceholder: string;
  searchDestPlaceholder: string;
  emergencyShelterLock: string;
  candidateRoutes: string;
  dualRouteModel: string;
  userImpedance: string;
  paretoFrontier: string;
  transparencyXai: string;
  radarView: string;
  shapView: string;
  segmentInspector: string;
  reportHazard: string;
  areYouSafe: string;
  iAmSafe: string;
  triggerSosNow: string;
  nearestHavenSubtitle: string;
  lightingFactor: string;
  activityFactor: string;
  transitFactor: string;
  emergencyFactor: string;
  fastestRoute: string;
  safeRoute: string;
  balancedRoute: string;
  walkProfile: string;
  twoWheelerProfile: string;
  fourWheelerProfile: string;
  transitProfile: string;
  shareWhatsApp: string;
  duressSecurityCheck: string;
  duressKeypadPrompt: string;
  exportWorkOrders: string;
  zeroInstallTracking: string;
  
  // Navigation & Action Buttons
  rideShield: string;
  sharePass: string;
  guardians: string;
  necessity: string;
  lightMode: string;
  darkMode: string;
  signIn: string;
  signInGuardians: string;
  signOut: string;
  manageGuardians: string;
  fullMap: string;
  showRoutes: string;
  startNavigation: string;
  nearestPolice: string;
  routeToPolice: string;
  routeSafetyPriority: string;
  segmentAudit: string;
  maxSafe: string;
  highSafe: string;
  balanced: string;
  fastest: string;
  illumination: string;
  shelters: string;
  minutes: string;
  petrolPumps: string;
  garages: string;
  towingPuncture: string;
  evChargers: string;
  callNow: string;
  navigateHere: string;
  open24x7: string;
  privacyPolicy: string;
  termsOfService: string;
  aboutUs: string;
  contactUs: string;
  pickOnMap: string;
  currentLocationLabel: string;
  rideShieldSubtitle: string;
  rideShieldNeedCab: string;
  rideShieldChooseProvider: string;
  rideShieldChecklist: string;
  rideShieldStartMonitoring: string;
  rideShieldMonitoringOff: string;
  rideShieldMonitoringOn: string;
  rideShieldDriverDisclaimer: string;
  rideShieldAssistanceDisclaimer: string;
  rideShieldSafetyNote: string;
}

const DICTIONARY: Record<AppLanguage, TranslationDictionary> = {
  en: {
    appName: 'SurakshitPath',
    appTagline: 'PS-20 · Night Navigation',
    testbedSubtitle: 'Pune Metropolitan Testbed: Tathawade / Hinjawadi ⇄ Kothrud',
    roleCommuter: 'Commuter',
    roleAdmin: 'Civic Admin (PMC)',
    roleGuardian: 'Trusted Guardian',
    roleVolunteer: 'Suraksha Sahayak',
    telemetryActive: 'Turf.js Telemetry Active',
    sdgAligned: 'SDG 5 & 11 Aligned',
    voiceActive: 'Voice Active',
    voiceMuted: 'Voice Muted',
    searchOriginPlaceholder: 'Search Origin (e.g. JSPM Tathawade)...',
    searchDestPlaceholder: 'Search Destination (e.g. Kothrud Stand)...',
    emergencyShelterLock: 'Nearest Safe Haven',
    candidateRoutes: 'Candidate Routes Comparison',
    dualRouteModel: 'Dual-Route Model',
    userImpedance: 'User Impedance Control',
    paretoFrontier: 'Agency & Pareto Frontier',
    transparencyXai: 'Explainability & Model Transparency',
    radarView: '4-Factor Radar',
    shapView: 'TreeSHAP (ML)',
    segmentInspector: 'Micro-Segment Physical Infrastructure',
    reportHazard: 'Report Hazard',
    areYouSafe: 'Are You Safe?',
    iAmSafe: 'I Am Safe (Dismiss)',
    triggerSosNow: 'Trigger SOS Now',
    nearestHavenSubtitle: '1-Tap lock to nearest 24/7 Police Chowki or Pharmacy',
    lightingFactor: 'Street Illumination',
    activityFactor: '24/7 Human Activity',
    transitFactor: 'PMPML & Metro Access',
    emergencyFactor: 'Emergency Haven Proximity',
    fastestRoute: 'Fastest Route',
    safeRoute: 'High-Visibility Safe Route',
    balancedRoute: 'Balanced Route',
    walkProfile: 'Walking',
    twoWheelerProfile: 'Two-Wheeler',
    fourWheelerProfile: 'Four-Wheeler',
    transitProfile: 'Public Transit',
    shareWhatsApp: 'Share Live Trail on WhatsApp',
    duressSecurityCheck: 'Dual-PIN Security Check-In',
    duressKeypadPrompt: 'Enter 4-digit PIN (Master: 4729 | Duress: 9999)',
    exportWorkOrders: 'Export SCADA Work Orders (GeoJSON/CSV)',
    zeroInstallTracking: 'Zero-Install Guardian Live Tracking',
    
    rideShield: 'Ride Shield',
    sharePass: 'Share Pass',
    guardians: 'Guardians',
    necessity: 'Necessity',
    lightMode: 'Light',
    darkMode: 'Dark',
    signIn: 'Sign In',
    signInGuardians: 'Sign In & Guardians',
    signOut: 'Sign Out',
    manageGuardians: 'Manage Guardians',
    fullMap: 'Full Map',
    showRoutes: 'Show Routes',
    startNavigation: 'Start Navigation',
    nearestPolice: 'Nearest Police Station',
    routeToPolice: 'Route to Police',
    routeSafetyPriority: 'Route Safety Priority',
    segmentAudit: 'Turn-by-Turn Segment Audit',
    maxSafe: 'Max Safe',
    highSafe: 'High Safe',
    balanced: 'Balanced',
    fastest: 'Fastest',
    illumination: 'Illumination',
    shelters: 'Shelters',
    minutes: 'min',
    petrolPumps: '⛽ Petrol Pumps',
    garages: '🔧 24x7 Garages',
    towingPuncture: '🛞 Towing & Puncture',
    evChargers: '⚡ EV Chargers',
    callNow: 'Call',
    navigateHere: 'Navigate Here',
    open24x7: '24x7 OPEN',
    privacyPolicy: 'Privacy Policy',
    termsOfService: 'Terms of Service',
    aboutUs: 'About Us',
    contactUs: 'Contact Us',
    pickOnMap: 'Pick on Map',
    currentLocationLabel: '📍 Your Current Location',

    rideShieldSubtitle: 'Select a safe corridor then launch Ride Shield to book a safety-aware cab journey with live monitoring.',
    rideShieldNeedCab: 'Need a cab for this night route? Launch safety-aware assistance?',
    rideShieldChooseProvider: 'Choose your cab provider',
    rideShieldChecklist: 'Ride Shield safety pre-departure checklist',
    rideShieldStartMonitoring: 'Start live trip monitoring',
    rideShieldMonitoringOff: 'Live trip monitoring is OFF',
    rideShieldMonitoringOn: 'Live trip monitoring is ON',
    rideShieldDriverDisclaimer: 'Driver selection and driver verification are handled by the ride provider.',
    rideShieldAssistanceDisclaimer: 'Safety-aware ride assistance helps you plan and monitor the journey safely without guaranteeing driver safety.',
    rideShieldSafetyNote: 'Safety-focused ride assistance: always share your vehicle plate with a guardian, always start live monitoring, always have access to SOS.'
  },
  mr: {
    appName: 'सुरक्षितपथ',
    appTagline: 'PS-20 · रात्रीचे सुरक्षित नेव्हिगेशन',
    testbedSubtitle: 'पुणे महानगर क्षेत्र: ताथवडे / हिंजवडी ⇄ कोथरूड',
    roleCommuter: 'प्रवासी',
    roleAdmin: 'मनपा प्रशासन (PMC)',
    roleGuardian: 'विश्वसनीय पालक',
    roleVolunteer: 'सुरक्षा सहाय्यक',
    telemetryActive: 'टर्फ.जेएस सक्रिय',
    sdgAligned: 'SDG ५ व ११ सुसंगत',
    voiceActive: 'आवाज सुरू',
    voiceMuted: 'आवाज बंद',
    searchOriginPlaceholder: 'सुरुवातीचे ठिकाण शोधा (उदा. ताथवडे)...',
    searchDestPlaceholder: 'गंतव्यस्थान शोधा (उदा. कोथरूड बस स्टँड)...',
    emergencyShelterLock: 'जवळचा सुरक्षित निवारा',
    candidateRoutes: 'पर्यायी मार्गांची तुलना',
    dualRouteModel: 'दुहेरी मार्ग मॉडेल',
    userImpedance: 'सुरक्षा प्राधान्य नियंत्रण',
    paretoFrontier: 'पॅरेटो फ्रंटियर',
    transparencyXai: 'पारदर्शकता व मॉडेल विश्लेषण',
    radarView: '४-घटक रडार',
    shapView: 'ट्री-शॅप (AI/ML)',
    segmentInspector: 'रस्ता पायाभूत सुविधा तपशील',
    reportHazard: 'धोका नोंदवा',
    areYouSafe: 'तुम्ही सुरक्षित आहात का?',
    iAmSafe: 'मी सुरक्षित आहे',
    triggerSosNow: 'तातडीने SOS पाठवा',
    nearestHavenSubtitle: '१-क्लिकमध्ये २४/७ पोलीस चौकी किंवा मेडिकल लॉक करा',
    lightingFactor: 'रस्त्यावरील प्रकाश (दिवे)',
    activityFactor: '२४/७ मानवी वर्दळ',
    transitFactor: 'PMPML व मेट्रो पोहोच',
    emergencyFactor: 'पोलीस चौकी / हॉस्पिटल अंतर',
    fastestRoute: 'जलद मार्ग',
    safeRoute: 'उजळ व सुरक्षित मार्ग',
    balancedRoute: 'संतुलित मार्ग',
    walkProfile: 'पायदळ',
    twoWheelerProfile: 'दुचाकी',
    fourWheelerProfile: 'चारचाकी',
    transitProfile: 'सार्वजनिक वाहतूक (PMPML)',
    shareWhatsApp: 'व्हॉट्सअ‍ॅपवर थेट मार्ग शेअर करा',
    duressSecurityCheck: 'ड्युअल-पिन सुरक्षा पडताळणी',
    duressKeypadPrompt: '४-अंकी पिन प्रविष्ट करा (मास्टर: ४७२९ | ड्युरेस: ९९९९)',
    exportWorkOrders: 'दुरुस्ती आदेश निर्यात (GeoJSON/CSV)',
    zeroInstallTracking: 'झिरो-इन्स्टॉल थेट पालक ट्रॅकिंग',
    
    rideShield: 'राईड शील्ड',
    sharePass: 'पास शेअर करा',
    guardians: 'पालक',
    necessity: 'तातडीच्या गरजा',
    lightMode: 'उजेड',
    darkMode: 'गडद',
    signIn: 'साइन इन',
    signInGuardians: 'साइन इन / पालक',
    signOut: 'साइन आउट',
    manageGuardians: 'पालक व्यवस्थापन',
    fullMap: 'पूर्ण नकाशा',
    showRoutes: 'मार्ग दाखवा',
    startNavigation: 'नेव्हिगेशन सुरू करा',
    nearestPolice: 'जवळचे पोलीस ठाणे',
    routeToPolice: 'पोलीस ठाण्याकडे मार्ग',
    routeSafetyPriority: 'मार्ग सुरक्षा प्राधान्य',
    segmentAudit: 'वळणनिहाय रस्ता तपासणी',
    maxSafe: 'कमाल सुरक्षित',
    highSafe: 'अधिक सुरक्षित',
    balanced: 'संतुलित',
    fastest: 'सर्वात जलद',
    illumination: 'प्रकाश',
    shelters: 'सुरक्षित निवारे',
    minutes: 'मि.',
    petrolPumps: '⛽ पेट्रोल पंप',
    garages: '🔧 २४/७ गॅरेज',
    towingPuncture: '🛞 टोईंग व पंक्चर',
    evChargers: '⚡ ईव्ही चार्जिंग',
    callNow: 'कॉल करा',
    navigateHere: 'येथे मार्ग काढा',
    open24x7: '२४/७ सुरू',
    privacyPolicy: 'गोपनीयता धोरण',
    termsOfService: 'सेवा अटी',
    aboutUs: 'सुरक्षितपथ विषयी',
    contactUs: 'संपर्क',
    pickOnMap: 'नकाशावर निवडा',
    currentLocationLabel: '📍 आपले सध्याचे स्थान',

    rideShieldSubtitle: 'सुरक्षित कॉरिडोर निवडा आणि राइड शील्ड सुरू करा.',
    rideShieldNeedCab: 'या रात्रीच्या मार्गासाठी कॅब हवी आहे का?',
    rideShieldChooseProvider: 'कॅब प्रदाता निवडा',
    rideShieldChecklist: 'राइड शील्ड सुरक्षा पूर्व-प्रयाण तपासणी',
    rideShieldStartMonitoring: 'लाइव्ह प्रवास निरीक्षण सुरू करा',
    rideShieldMonitoringOff: 'लाइव्ह प्रवास निरीक्षण बंद आहे',
    rideShieldMonitoringOn: 'लाइव्ह प्रवास निरीक्षण सुरू आहे',
    rideShieldDriverDisclaimer: 'चालक निवड आणि पडताळणी राइड प्रदात्याद्वारे केली जाते.',
    rideShieldAssistanceDisclaimer: 'सुरक्षितता-जागरूक राइड सहाय्य प्रवास सुरक्षितपणे नियोजित आणि परीक्षण करण्यात मदत करते.',
    rideShieldSafetyNote: 'सुरक्षा-केंद्रित राइड सहाय्य: वाहन नोंदणी क्रमांक नेहमी पालकाशी शेअर करा, लाइव्ह निरीक्षण सुरू करा, SOS प्रवेश ठेवा.'
  },
  hi: {
    appName: 'सुरक्षितपथ',
    appTagline: 'PS-20 · रात्रि सुरक्षित नेविगेशन',
    testbedSubtitle: 'पुणे मेट्रोपॉलिटन कॉरिडोर: ताथवडे / हिंजवड़ी ⇄ कोथरूड',
    roleCommuter: 'यात्री',
    roleAdmin: 'नगर निगम प्रशासन (PMC)',
    roleGuardian: 'विश्वसनीय अभिभावक',
    roleVolunteer: 'सुरक्षा सहायक',
    telemetryActive: 'टर्फ.जेएस टेलीमेट्री सक्रिय',
    sdgAligned: 'SDG 5 एवं 11 समर्थित',
    voiceActive: 'वॉइस चालू',
    voiceMuted: 'वॉइस बंद',
    searchOriginPlaceholder: 'शुरुआती स्थान खोजें (उदा. ताथवड़े)...',
    searchDestPlaceholder: 'गंतव्य स्थान खोजें (उदा. कोथरूड स्टैंड)...',
    emergencyShelterLock: 'निकटतम सुरक्षित आश्रय',
    candidateRoutes: 'वैकल्पिक मार्गों की तुलना',
    dualRouteModel: 'दोहरा मार्ग मॉडल',
    userImpedance: 'सुरक्षा वरीयता नियंत्रण',
    paretoFrontier: 'परेतो फ्रंटियर',
    transparencyXai: 'पारदर्शिता एवं मॉडल विश्लेषण',
    radarView: '4-कारक रडार',
    shapView: 'ट्री-शॅप (AI/ML)',
    segmentInspector: 'सड़क ढांचा सूक्ष्म-निरीक्षण',
    reportHazard: 'खतरे की सूचना दें',
    areYouSafe: 'क्या आप सुरक्षित हैं?',
    iAmSafe: 'मैं सुरक्षित हूँ',
    triggerSosNow: 'तुरंत SOS भेजें',
    nearestHavenSubtitle: '1-क्लिक में 24/7 पुलिस चौकी या फार्मेसी लॉक करें',
    lightingFactor: 'स्ट्रीट लाइट रोशनी',
    activityFactor: '24/7 सक्रिय मानवीय हलचल',
    transitFactor: 'PMPML एवं मेट्रो पहुंच',
    emergencyFactor: 'इमरजेंसी चौकी निकटता',
    fastestRoute: 'सबसे तेज़ मार्ग',
    safeRoute: 'उजाले से भरा सुरक्षित मार्ग',
    balancedRoute: 'संतुलित मार्ग',
    walkProfile: 'पैदल',
    twoWheelerProfile: 'दोपहिया',
    fourWheelerProfile: 'चारपहिया',
    transitProfile: 'सार्वजनिक परिवहन (PMPML)',
    shareWhatsApp: 'व्हाट्सएप पर लाइव रूट साझा करें',
    duressSecurityCheck: 'दोहरा-पिन सुरक्षा सत्यापन',
    duressKeypadPrompt: '4-अंकीय पिन दर्ज करें (मास्टर: 4729 | ड्यूरेस: 9999)',
    exportWorkOrders: 'कार्य आदेश निर्यात (GeoJSON/CSV)',
    zeroInstallTracking: 'ज़ीरो-इंस्टॉल लाइव अभिभावक ट्रैकिंग',
    
    rideShield: 'राइड शील्ड',
    sharePass: 'पास साझा करें',
    guardians: 'अभिभावक',
    necessity: 'आपातकालीन सेवाएं',
    lightMode: 'लाइट',
    darkMode: 'डार्क',
    signIn: 'साइन इन',
    signInGuardians: 'साइन इन / अभिभावक',
    signOut: 'साइन आउट',
    manageGuardians: 'अभिभावक प्रबंध',
    fullMap: 'पूरा नक्शा',
    showRoutes: 'मार्ग दिखाएं',
    startNavigation: 'नेविगेशन शुरू करें',
    nearestPolice: 'निकटतम पुलिस स्टेशन',
    routeToPolice: 'पुलिस स्टेशन का मार्ग',
    routeSafetyPriority: 'मार्ग सुरक्षा प्राथमिकता',
    segmentAudit: 'मोड़-दर-मोड़ सड़क ऑडिट',
    maxSafe: 'सर्वाधिक सुरक्षित',
    highSafe: 'उच्च सुरक्षित',
    balanced: 'संतुलित',
    fastest: 'सबसे तेज़',
    illumination: 'रोशनी',
    shelters: 'सुरक्षित आश्रय',
    minutes: 'मिनट',
    petrolPumps: '⛽ पेट्रोल पंप',
    garages: '🔧 24x7 गैरेज',
    towingPuncture: '🛞 टोइंग एवं पंक्चर',
    evChargers: '⚡ ईवी चार्जर',
    callNow: 'कॉल करें',
    navigateHere: 'यहाँ का मार्ग लें',
    open24x7: '24x7 खुला',
    privacyPolicy: 'गोपनीयता नीति',
    termsOfService: 'सेवा शर्तें',
    aboutUs: 'हमारे बारे में',
    contactUs: 'संपर्क करें',
    pickOnMap: 'नक्शे पर चुनें',
    currentLocationLabel: '📍 आपका वर्तमान स्थान',

    rideShieldSubtitle: 'सुरक्षित कॉरिडोर चुनें और राइड शील्ड लॉन्च करें।',
    rideShieldNeedCab: 'इस रात के मार्ग के लिए कैब चाहिए?',
    rideShieldChooseProvider: 'कैब प्रदाता चुनें',
    rideShieldChecklist: 'राइड शील्ड सुरक्षा प्री-डिपार्चर चेकलिस्ट',
    rideShieldStartMonitoring: 'लाइव ट्रिप मॉनिटरिंग शुरू करें',
    rideShieldMonitoringOff: 'लाइव ट्रिप मॉनिटरिंग बंद है',
    rideShieldMonitoringOn: 'लाइव ट्रिप मॉनिटरिंग चालू है',
    rideShieldDriverDisclaimer: 'ड्राइवर का चयन और सत्यापन राइड प्रदाता द्वारा किया जाता है।',
    rideShieldAssistanceDisclaimer: 'सुरक्षा-जागरूक राइड सहायता सुरक्षित रूप से यात्रा की योजना बनाने में मदद करती है।',
    rideShieldSafetyNote: 'सुरक्षा-केंद्रित राइड सहायता: वाहन नंबर हमेशा अभिभावक के साथ साझा करें, लाइव मॉनिटरिंग शुरू करें, SOS पहुंच रखें।'
  }
};

export const getTranslation = (lang: AppLanguage): TranslationDictionary => {
  return DICTIONARY[lang] || DICTIONARY.en;
};
