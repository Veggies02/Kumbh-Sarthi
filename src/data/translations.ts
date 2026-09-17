export interface Translations {
  appName: string;
  appSubtitle: string;
  tagline: string;
  heroDesc: string;
  exploreMapBtn: string;
  planPilgrimageBtn: string;
  howCanWeHelp: string;
  searchPlaceholder: string;
  askAiBtn: string;
  tryAsking: string;
  essentialFacilities: string;
  viewAll: string;
  liveMapPreview: string;
  expandMap: string;
  simulatedData: string;
  
  // Tabs
  navDiscover: string;
  navMap: string;
  navRoutes: string;
  navFacilities: string;
  navAssistant: string;
  navItinerary: string;
  navCrowd: string;
  navFamily: string;
  navEmergency: string;
  navAdmin: string;

  // Navigation Screen
  navTitle: string;
  originLabel: string;
  destPlaceholder: string;
  travellingWith: string;
  routePriority: string;
  availableOptions: string;
  startGuidance: string;
  exitGuidance: string;
  whyThisRoute: string;
  recommendedForYou: string;
  trackMyLocation: string;
  locMetBhujbal: string;
  locCurrentGps: string;
  locPanchavati: string;

  // Personas
  elderly: string;
  children: string;
  wheelchair: string;
  family: string;
  solo: string;
  group: string;

  // Priorities
  leastCrowded: string;
  accessibleFirst: string;
  fastest: string;
  balanced: string;

  // Crowd status
  lowCrowd: string;
  modCrowd: string;
  highCrowd: string;
  criticalSurge: string;
  simSurgeActive: string;
  simulateSurgeBtn: string;
  resetSurgeBtn: string;

  // Emergency
  emergencyTitle: string;
  emergencySubtitle: string;
  shareGpsBtn: string;
  nearestHospital: string;
  nearestPolice: string;
  getDirections: string;
  callNow: string;

  // Quick Actions
  findTemple: string;
  findGhat: string;
  findMedical: string;
  findParking: string;
  findFood: string;
  findToilets: string;
  findStay: string;
  emergencySos: string;
}

export const TRANSLATIONS: Record<'en' | 'hi' | 'mr', Translations> = {
  en: {
    appName: "Kumbh Saathi",
    appSubtitle: "Nashik & Trimbakeshwar Smart Pilgrim Companion",
    tagline: '"Your Smart Companion for a Safer Kumbh Journey"',
    heroDesc: "Discover sacred ghats & temples, plan an accessible pilgrimage for your family, and navigate through live crowd-aware recommended routes.",
    exploreMapBtn: "Explore Nashik Map",
    planPilgrimageBtn: "Plan My Pilgrimage",
    howCanWeHelp: "How can we help your pilgrimage today?",
    searchPlaceholder: "Type in English, हिन्दी, or मराठी (e.g., 'Ram Kund jaana hai', 'I have elderly parents')",
    askAiBtn: "Ask AI",
    tryAsking: "Try asking:",
    essentialFacilities: "Essential Facilities & Quick Discovery",
    viewAll: "View All",
    liveMapPreview: "Live Interactive Map Preview",
    expandMap: "Expand Full Map",
    simulatedData: "Simulated Data",

    navDiscover: "Discover",
    navMap: "Smart Map",
    navRoutes: "Navigation",
    navFacilities: "Nearby Facilities",
    navAssistant: "AI Saathi",
    navItinerary: "Plan Pilgrimage",
    navCrowd: "Crowd Status",
    navFamily: "Family Group",
    navEmergency: "Emergency SOS",
    navAdmin: "Admin Simulator",

    navTitle: "Smart Pilgrim Navigation",
    originLabel: "Your Origin:",
    destPlaceholder: "Search destination (e.g. Ram Kund, Kalaram Mandir)",
    travellingWith: "Travelling With:",
    routePriority: "Route Priority:",
    availableOptions: "Available Route Options",
    startGuidance: "Start Guidance",
    exitGuidance: "Exit Guidance",
    whyThisRoute: "Why this route:",
    recommendedForYou: "Recommended for You",
    trackMyLocation: "Track My Location",
    locMetBhujbal: "MET Bhujbal Knowledge City (Adgaon, Nashik)",
    locCurrentGps: "Live GPS (My Location)",
    locPanchavati: "Panchavati Malegaon Stand",

    elderly: "Elderly",
    children: "Children",
    wheelchair: "Wheelchair",
    family: "Family",
    solo: "Solo",
    group: "Large Group",

    leastCrowded: "Least Crowded",
    accessibleFirst: "Accessible First",
    fastest: "Fastest",
    balanced: "Balanced",

    lowCrowd: "LOW CROWD",
    modCrowd: "MODERATE",
    highCrowd: "HIGH CROWD",
    criticalSurge: "CRITICAL SURGE",
    simSurgeActive: "Simulated Crowd Surge Active at Ram Kund (92%)",
    simulateSurgeBtn: "⚡ Simulate Surge",
    resetSurgeBtn: "Reset Surge",

    emergencyTitle: "Emergency Assistance & SOS",
    emergencySubtitle: "Immediate response coordinator for Nashik & Trimbakeshwar Kumbh Mela",
    shareGpsBtn: "Share Live GPS",
    nearestHospital: "Nearest Emergency Hospital",
    nearestPolice: "Nearest Police Station",
    getDirections: "Get Directions",
    callNow: "Call 108 / 112",

    findTemple: "Find a Temple",
    findGhat: "Find a Ghat",
    findMedical: "Medical Help",
    findParking: "Find Parking",
    findFood: "Restaurants & Food",
    findToilets: "Clean Toilets",
    findStay: "Hotels & Stay",
    emergencySos: "Emergency SOS"
  },

  hi: {
    appName: "कुंभ साथी",
    appSubtitle: "नासिक एवं त्र्यंबकेश्वर स्मार्ट तीर्थयात्री साथी",
    tagline: '"आपकी सुरक्षित और सुगम कुंभ यात्रा का साथी"',
    heroDesc: "पवित्र घाटों और मंदिरों की खोज करें, बुजुर्ग माता-पिता के लिए सुगम दर्शन प्लान बनाएं और भीड़-मुक्त सुरक्षित मार्गों से यात्रा करें।",
    exploreMapBtn: "नासिक मानचित्र देखें",
    planPilgrimageBtn: "तीर्थ दर्शन प्लान बनाएं",
    howCanWeHelp: "आज हम आपकी तीर्थयात्रा में क्या सहायता कर सकते हैं?",
    searchPlaceholder: "हिंदी, मराठी या अंग्रेजी में पूछें (जैसे: 'राम कुंड जाना है', 'माता-पिता साथ हैं')",
    askAiBtn: "AI से पूछें",
    tryAsking: "उदाहरण:",
    essentialFacilities: "आवश्यक सुविधाएं और त्वरित खोज",
    viewAll: "सभी देखें",
    liveMapPreview: "लाइव इंटरएक्टिव मैप पूर्वावलोकन",
    expandMap: "पूरा मैप खोलें",
    simulatedData: "डेमो / सिमुलेटेड डेटा",

    navDiscover: "मुख्य पृष्ठ",
    navMap: "स्मार्ट मैप",
    navRoutes: "नेविगेशन मार्ग",
    navFacilities: "निकटवर्ती सुविधाएं",
    navAssistant: "AI कुंभ साथी",
    navItinerary: "दर्शन योजना",
    navCrowd: "भीड़ की स्थिति",
    navFamily: "परिवार ट्रैकर",
    navEmergency: "आपातकालीन SOS",
    navAdmin: "एडमिन सिमुलेटर",

    navTitle: "स्मार्ट तीर्थयात्री नेविगेशन",
    originLabel: "आपका स्थान:",
    destPlaceholder: "गंतव्य खोजें (उदा. राम कुंड, काळाराम मंदिर)",
    travellingWith: "साथ में कौन हैं:",
    routePriority: "मार्ग प्राथमिकता:",
    availableOptions: "उपलब्ध मार्ग विकल्प",
    startGuidance: "मार्गदर्शन शुरू करें",
    exitGuidance: "मार्गदर्शन समाप्त करें",
    whyThisRoute: "यह मार्ग क्यों चुनें:",
    recommendedForYou: "आपके लिए अनुशंसित मार्ग",
    trackMyLocation: "मेरा स्थान ट्रैक करें",
    locMetBhujbal: "MET भुजबल नॉलेज सिटी (आडगाव, नासिक)",
    locCurrentGps: "लाइव GPS (मेरा वर्तमान स्थान)",
    locPanchavati: "पंचवटी मालेगांव स्टैंड",

    elderly: "वरिष्ठ (बुजुर्ग)",
    children: "बच्चे",
    wheelchair: "व्हीलचेयर",
    family: "परिवार",
    solo: "अकेले",
    group: "बड़ा समूह",

    leastCrowded: "कम भीड़ वाला",
    accessibleFirst: "समतल/रैंप युक्त",
    fastest: "सबसे तेज़",
    balanced: "संतुलित",

    lowCrowd: "कम भीड़",
    modCrowd: "मध्यम भीड़",
    highCrowd: "भारी भीड़",
    criticalSurge: "अत्यधिक भीड़ (अलर्ट)",
    simSurgeActive: "राम कुंड पर अत्यधिक भीड़ सिमुलेशन सक्रिय (92%)",
    simulateSurgeBtn: "⚡ भीड़ वृद्धि सिमुलेट करें",
    resetSurgeBtn: "सामान्य करें",

    emergencyTitle: "आपातकालीन सहायता और SOS",
    emergencySubtitle: "नासिक एवं त्र्यंबकेश्वर कुंभ मेला त्वरित सहायता केंद्र",
    shareGpsBtn: "लाइव GPS लोकेशन साझा करें",
    nearestHospital: "निकटतम आपातकालीन अस्पताल",
    nearestPolice: "निकटतम पुलिस चौकी",
    getDirections: "रास्ता देखें",
    callNow: "108 / 112 डायल करें",

    findTemple: "मंदिर खोजें",
    findGhat: "घाट खोजें",
    findMedical: "चिकित्सा सहायता",
    findParking: "पार्किंग खोजें",
    findFood: "रेस्टोरेंट व भोजन",
    findToilets: "स्वच्छ प्रसाधन",
    findStay: "होटल व विश्राम",
    emergencySos: "आपातकालीन SOS"
  },

  mr: {
    appName: "कुंभ साथी",
    appSubtitle: "नाशिक व त्र्यंबकेश्वर स्मार्ट भाविक साहाय्यक",
    tagline: '"आपल्या सुरक्षित व सुखकर कुंभ प्रवासाचा खरा साथीदार"',
    heroDesc: "पवित्र घाट आणि मंदिरांचा शोध घ्या, वृद्ध पालकांसाठी पायऱ्यांविना सुलभ दर्शन नियोजन करा आणि गर्दी-मुक्त सुरक्षित मार्गाने प्रवास करा.",
    exploreMapBtn: "नाशिक नकाशा पहा",
    planPilgrimageBtn: "दर्शन नियोजन करा",
    howCanWeHelp: "आपल्या कुंभ यात्रेसाठी आम्ही काय मदत करू शकतो?",
    searchPlaceholder: "मराठी, हिंदी किंवा इंग्रजीत विचारा (उदा. 'रामकुंडला जायचे आहे', 'आई-वडील सोबत आहेत')",
    askAiBtn: "AI ला विचारा",
    tryAsking: "उदाहरणे:",
    essentialFacilities: "महत्त्वाच्या सुविधा व तत्पर सेवा",
    viewAll: "सर्व पहा",
    liveMapPreview: "थेट नकाशा पूर्वावलोकन",
    expandMap: "पूर्ण नकाशा उघडा",
    simulatedData: "प्रात्यक्षिक / सिमुलेटेड माहिती",

    navDiscover: "मुख्य दालन",
    navMap: "स्मार्ट नकाशा",
    navRoutes: "नेव्हिगेशन मार्ग",
    navFacilities: "जवळपासच्या सुविधा",
    navAssistant: "AI कुंभ साथी",
    navItinerary: "दर्शन नियोजन",
    navCrowd: "गर्दी स्थिती",
    navFamily: "कुटुंब ट्रॅकर",
    navEmergency: "आपत्कालीन SOS",
    navAdmin: "प्रशासक सिमुलेटर",

    navTitle: "स्मार्ट भाविक नेव्हिगेशन",
    originLabel: "आपले स्थान:",
    destPlaceholder: "स्थळ शोधा (उदा. रामकुंड, काळाराम मंदिर)",
    travellingWith: "सोबत कोण आहेत:",
    routePriority: "मार्ग प्राधान्य:",
    availableOptions: "उपलब्ध मार्ग पर्याय",
    startGuidance: "मार्गदर्शन सुरू करा",
    exitGuidance: "मार्गदर्शन बंद करा",
    whyThisRoute: "हाच मार्ग का निवडावा:",
    recommendedForYou: "आपल्यासाठी सर्वोत्तम शिफारस",
    trackMyLocation: "माझे स्थान ट्रॅक करा",
    locMetBhujbal: "MET भुजबळ नॉलेज सिटी (आडगाव, नाशिक)",
    locCurrentGps: "थेट GPS (माझे सध्याचे स्थान)",
    locPanchavati: "पंचवटी मालेगाव स्टँड",

    elderly: "ज्येष्ठ नागरिक",
    children: "लहान मुले",
    wheelchair: "व्हीलचेयर",
    family: "कुटुंब",
    solo: "एकटे भाविक",
    group: "मोठा गट",

    leastCrowded: "कमी गर्दीचा मार्ग",
    accessibleFirst: "सुलभ / रॅम्प मार्ग",
    fastest: "सर्वात जलद",
    balanced: "संतुलित",

    lowCrowd: "कमी गर्दी",
    modCrowd: "मध्यम गर्दी",
    highCrowd: "जास्त गर्दी",
    criticalSurge: "अति गर्दी (सावधान)",
    simSurgeActive: "रामकुंड येथे अति गर्दी सिमुलेशन सुरू (९२%)",
    simulateSurgeBtn: "⚡ गर्दी वाढवा (सिम्युलेट)",
    resetSurgeBtn: "पुन्हा सामान्य करा",

    emergencyTitle: "आपत्कालीन मदत आणि SOS",
    emergencySubtitle: "नाशिक व त्र्यंबकेश्वर कुंभमेळा त्वरित प्रतिसाद कक्ष",
    shareGpsBtn: "थेट GPS स्थान पाठवा",
    nearestHospital: "जवळचे शासकीय रुग्णालय",
    nearestPolice: "जवळची पोलीस चौकी",
    getDirections: "दिशामार्ग मिळवा",
    callNow: "१०८ / ११२ वर कॉल करा",

    findTemple: "मंदिर शोधा",
    findGhat: "घाट शोधा",
    findMedical: "वैद्यकीय मदत",
    findParking: "पार्किंग शोधा",
    findFood: "रेस्टॉरंट व भोजन",
    findToilets: "स्वच्छतागृह",
    findStay: "हॉटेल व निवास",
    emergencySos: "आपत्कालीन SOS"
  }
};
