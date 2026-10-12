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
    reportHazard: 'Report Dark Spot / Hazard',
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
    balancedRoute: 'Balanced Route'
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
    voiceActive: 'आवाज सक्रिय',
    voiceMuted: 'आवाज बंद',
    searchOriginPlaceholder: 'सुरुवातीचे ठिकाण शोधा (उदा. ताथवडे)...',
    searchDestPlaceholder: 'गंतव्यस्थान शोधा (उदा. कोथरूड बस स्टँड)...',
    emergencyShelterLock: 'जवळचा सुरक्षित निवारा',
    candidateRoutes: 'मार्गांची तुलना',
    dualRouteModel: 'दुहेरी मार्ग मॉडेल',
    userImpedance: 'सुरक्षा प्राधान्य नियंत्रण',
    paretoFrontier: 'पॅरेटो फ्रंटियर',
    transparencyXai: 'पारदर्शकता व मॉडेल विश्लेषण',
    radarView: '४-घटक रडार',
    shapView: 'ट्री-शॅप (AI/ML)',
    segmentInspector: 'रस्ता पायाभूत सुविधा तपशील',
    reportHazard: 'अंधार किंवा धोक्याची नोंद करा',
    areYouSafe: 'तुम्ही सुरक्षित आहात का?',
    iAmSafe: 'मी सुरक्षित आहे (रद्द करा)',
    triggerSosNow: 'तातडीने SOS पाठवा',
    nearestHavenSubtitle: '१-क्लिकमध्ये २४/७ पोलीस चौकी किंवा मेडिकल लॉक करा',
    lightingFactor: 'रस्त्यावरील दिवे (प्रकाश)',
    activityFactor: '२४/७ मानवी वर्दळ',
    transitFactor: 'PMPML व मेट्रो पोहोच',
    emergencyFactor: 'पोलीस चौकी / हॉस्पिटल अंतर',
    fastestRoute: 'जलद मार्ग',
    safeRoute: 'उजळ व सुरक्षित मार्ग',
    balancedRoute: 'संतुलित मार्ग'
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
    voiceActive: 'वॉइस सक्रिय',
    voiceMuted: 'वॉइस म्यूट',
    searchOriginPlaceholder: 'शुरुआती स्थान खोजें (उदा. ताथवड़े)...',
    searchDestPlaceholder: 'गंतव्य स्थान खोजें (उदा. कोथरूड स्टैंड)...',
    emergencyShelterLock: 'निकटतम सुरक्षित आश्रय',
    candidateRoutes: 'मार्गों की तुलना',
    dualRouteModel: 'दोहरा मार्ग मॉडल',
    userImpedance: 'सुरक्षा वरीयता नियंत्रण',
    paretoFrontier: 'परेतो फ्रंटियर',
    transparencyXai: 'पारदर्शिता एवं मॉडल विश्लेषण',
    radarView: '4-कारक रडार',
    shapView: 'ट्री-शॅप (AI/ML)',
    segmentInspector: 'सड़क ढांचा सूक्ष्म-निरीक्षण',
    reportHazard: 'अंधेरे या खतरे की सूचना दें',
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
    balancedRoute: 'संतुलित मार्ग'
  }
};

export const getTranslation = (lang: AppLanguage): TranslationDictionary => {
  return DICTIONARY[lang] || DICTIONARY.en;
};
