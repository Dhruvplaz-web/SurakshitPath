import { SafeHaven } from '../types/routing';

export const PUNE_SAFE_HAVENS: SafeHaven[] = [
  // 24/7 Verified Women & Crisis Shelters (Government & Verified Trust)
  {
    id: 'haven_shelter_sakhi_pune',
    name: 'Sakhi One-Stop Crisis Centre (Women Safe Shelter)',
    type: 'women_shelter',
    coordinates: [18.5284, 73.8742],
    address: 'Near Collector Office & Sassoon Hospital Complex, Pune',
    timing: '24/7 Safe Stay, Medical & Legal Aid for Women',
    contact: '020-26127394 / 181',
    trustScore: 99,
    verifiedBy: 'Ministry of WCD & Pune Police',
    facilities: ['24/7 Lady Police Guard', 'Private Safe Rooms', 'CCTV Enclosed', 'Emergency Medical Care']
  },
  {
    id: 'haven_shelter_pmc_deccan',
    name: 'PMC Deccan 24/7 Urban Transit Shelter',
    type: 'crisis_shelter',
    coordinates: [18.5175, 73.8415],
    address: 'Opposite Sambhaji Park, Deccan Gymkhana, FC Road, Pune',
    timing: '24 Hours Open · Guarded Municipal Safe Haven',
    contact: '020-25501000',
    trustScore: 96,
    verifiedBy: 'Pune Municipal Corporation (PMC)',
    facilities: ['Security Guard on Duty', 'High-Mast Floodlighting', 'Phone Charging & Water', 'CCTV']
  },
  {
    id: 'haven_shelter_wakad_pcmc',
    name: 'PCMC Wakad Women Care & Emergency Refuge',
    type: 'women_shelter',
    coordinates: [18.5995, 73.7680],
    address: 'Datta Mandir Chowk, Near Pink Police Chowki, Wakad, Pune',
    timing: '24/7 Emergency Sanctuary for Women & Night Commuters',
    contact: '020-27278100 / 1091',
    trustScore: 98,
    verifiedBy: 'PCMC & Wakad Police Pink Chowki',
    facilities: ['Direct Police Chowki Link', 'Guarded Gated Entry', 'Emergency Beds', '24/7 Matron']
  },
  {
    id: 'haven_shelter_mahila_kothrud',
    name: 'Mahila Seva Mandal Emergency Shelter',
    type: 'women_shelter',
    coordinates: [18.5050, 73.8180],
    address: 'Karve Road, Near SNDT College, Kothrud, Pune',
    timing: '24 Hours Open · Verified Safe Haven for Women',
    contact: '020-25442845 / 181',
    trustScore: 97,
    verifiedBy: 'Social Welfare Dept & PMC',
    facilities: ['24/7 Female Warden', 'Enclosed CCTV Perimeter', 'Doctor on Call', 'Rest Sanctuary']
  },
  {
    id: 'haven_shelter_gurudwara_camp',
    name: 'Gurudwara Guru Nanak Darbar 24/7 Sanctuary',
    type: 'temple_sanctuary',
    coordinates: [18.5140, 73.8790],
    address: 'Camp / Pune Station Corridor, Pune',
    timing: '24/7 Open Sanctuary · Constant Footfall & Safe Rest Area',
    contact: '020-26361818',
    trustScore: 99,
    verifiedBy: 'Gurudwara Trust & Pune Police',
    facilities: ['24/7 Gated Security', 'Continuous Active Frontage', 'Langar & Clean Drinking Water', 'Well-Lit']
  },
  {
    id: 'haven_shelter_gurudwara_akurdi',
    name: 'Gurudwara Guru Gobind Singh 24/7 Safe Haven',
    type: 'temple_sanctuary',
    coordinates: [18.6480, 73.7780],
    address: 'Old Mumbai-Pune Highway, Akurdi, Pune',
    timing: '24/7 Open Community Haven · Safe Waiting Area',
    contact: '020-27651234',
    trustScore: 98,
    verifiedBy: 'Trust & PCMC Police Beat',
    facilities: ['24/7 Security Staff', 'Rest Hall', 'Lit Frontage', 'Safe Haven']
  },
  {
    id: 'haven_temple_chatushrungi',
    name: 'Shri Chatushrungi Mata Temple 24/7 Guarded Precinct',
    type: 'temple_sanctuary',
    coordinates: [18.5390, 73.8290],
    address: 'Senapati Bapat Road, Near SB Road Police Chowki, Pune',
    timing: '24/7 Illuminated Courtyard · Security & Police Beat',
    contact: '020-25656565',
    trustScore: 98,
    verifiedBy: 'Temple Trust & Chatushrungi Police',
    facilities: ['24/7 Security Sentries', 'Floodlit Outer Courtyard', 'Perimeter CCTV', 'Police Beat Point']
  },
  {
    id: 'haven_temple_dagdusheth',
    name: 'Dagdusheth Halwai Ganpati 24/7 Security Enclave',
    type: 'temple_sanctuary',
    coordinates: [18.5165, 73.8562],
    address: 'Budhwar Peth, Shivaji Road, Pune',
    timing: '24/7 Armed Guarded Enclave & Continuous Illumination',
    contact: '020-24451122',
    trustScore: 99,
    verifiedBy: 'Pune Police & Trust Security Wing',
    facilities: ['Armed Police Sentries', '24/7 Perimeter CCTV', 'High-Mast Lighting', 'Continuous Night Watch']
  },

  // 24/7 Helpline & Crisis Centres
  {
    id: 'haven_helpline_pune_hub',
    name: 'Pune District Women & Child Helpline Hub (181 / 1091)',
    type: 'helpline_centre',
    coordinates: [18.5310, 73.8520],
    address: 'Near Family Court & Police Commissionerate, Shivajinagar, Pune',
    timing: '24/7 Emergency Dispatch, Counseling & Safe Transit Refuge',
    contact: '181 / 1091 / 020-25538000',
    trustScore: 99,
    verifiedBy: 'Dept of Women & Child Development & Pune Police',
    facilities: ['Direct 181 Dispatch Room', 'Emergency Shelter Van', 'Lady Officers On-Duty', 'Secure Refuge']
  },

  // 24/7 Supermarts & Convenience Stores (Staffed & Illuminated Safe Zones)
  {
    id: 'haven_mart_wellness_kalyani',
    name: 'Wellness Forever 24/7 Supermart & Health Store',
    type: 'supermart_247',
    coordinates: [18.5470, 73.9030],
    address: 'Central Avenue, Near Joggers Park, Kalyani Nagar, Pune',
    timing: '24/7 Open · Staffed & Illuminated Storefront',
    contact: '020-26655100',
    trustScore: 98,
    verifiedBy: 'Commercial Night Safety Audit',
    facilities: ['24/7 Security Guard', 'Bright Neon Frontage', 'Always Staffed (3+ Staff)', 'Active CCTV']
  },
  {
    id: 'haven_mart_natures_basket',
    name: "Nature's Basket 24/7 Express Mart & Night Sanctuary",
    type: 'supermart_247',
    coordinates: [18.5605, 73.8060],
    address: 'DP Road, Near Medipoint Hospital, Aundh, Pune',
    timing: '24 Hours Open · Guarded Commercial Safe Zone',
    contact: '020-27299000',
    trustScore: 97,
    verifiedBy: 'Pune Commercial Association',
    facilities: ['Dedicated Night Guard', 'Well-Lit Parking & Entry', 'CCTV System', 'Emergency First-Aid']
  },
  {
    id: 'haven_mart_shell_wakad',
    name: 'Shell Select 24/7 Express Mart & Highway Sanctuary',
    type: 'supermart_247',
    coordinates: [18.5980, 73.7620],
    address: 'Wakad Flyover, NH-48 Mumbai-Pune Expressway Junction',
    timing: '24/7 Staffed Mart & Lit Forecourt',
    contact: '020-67123456',
    trustScore: 98,
    verifiedBy: 'Highway Safety Patrol & PCMC',
    facilities: ['High-Mast Floodlighting', '24/7 Attendants & Mart', 'Night Security Guard', 'Safe Parking Sanctuary']
  },
  {
    id: 'haven_mart_apollo_fc',
    name: 'Apollo 24/7 Convenience Store & Life Hub',
    type: 'supermart_247',
    coordinates: [18.5240, 73.8420],
    address: 'Fergusson College (FC) Road, Shivajinagar, Pune',
    timing: '24 Hours Open · Staffed & Monitored',
    contact: '020-25539999',
    trustScore: 98,
    verifiedBy: 'FDA & City Safety Protocol',
    facilities: ['24/7 On-Duty Staff', 'Continuous Street Visibility', 'CCTV Surveillance', 'Digital Emergency Pay']
  },

  // Police Stations & Chowkis
  {
    id: 'haven_police_hinjawadi',
    name: 'Hinjawadi Police Station',
    type: 'police',
    coordinates: [18.5912, 73.7389],
    address: 'Phase 1, Hinjawadi Rajiv Gandhi Infotech Park, Pune',
    timing: '24/7 Emergency Police Outpost',
    contact: '020-22934200 / 112',
    trustScore: 99,
    verifiedBy: 'Maharashtra Police',
    facilities: ['Armed Beat Guard', 'CCTV Network', 'Women Helpdesk', 'Wireless Radio Link']
  },
  {
    id: 'haven_police_wakad',
    name: 'Wakad Police Station & Pink Chowki',
    type: 'police',
    coordinates: [18.6015, 73.7650],
    address: 'Near Bhujbal Chowk, Wakad, Pimpri-Chinchwad',
    timing: '24/7 Active Patrol & Women Helpdesk',
    contact: '020-27278100 / 112',
    trustScore: 99,
    verifiedBy: 'PCMC Police Commissionerate',
    facilities: ['Dedicated Damini Squad Unit', 'Pink Women Helpdesk', '24/7 Patrol PCR Vans', 'Safe Hold Area']
  },
  {
    id: 'haven_police_chatushrungi',
    name: 'Chatushrungi Police Station',
    type: 'police',
    coordinates: [18.5365, 73.8315],
    address: 'Senapati Bapat Road, Near Pune University Circle, Pune',
    timing: '24/7 Police Station',
    contact: '020-25652835 / 112',
    trustScore: 98,
    verifiedBy: 'Pune City Police',
    facilities: ['24/7 Control Room', 'Armed Sentries', 'Perimeter Floodlights', 'Women Assistance Cell']
  },
  {
    id: 'haven_police_kothrud',
    name: 'Kothrud Police Station',
    type: 'police',
    coordinates: [18.5085, 73.8040],
    address: 'Near Kothrud Stand, Paud Road, Pune',
    timing: '24/7 Police Station',
    contact: '020-25383500 / 112',
    trustScore: 98,
    verifiedBy: 'Pune City Police',
    facilities: ['24/7 Active Officers', 'Beat Van Dispatch', 'Lit Compound', 'Emergency Triage']
  },

  // 24/7 Verified Pharmacies
  {
    id: 'haven_pharm_wellness_wakad',
    name: 'Wellness Forever 24/7 Pharmacy',
    type: 'pharmacy_247',
    coordinates: [18.6022, 73.7638],
    address: 'Shop 4, Datta Mandir Road, Wakad, Pune',
    timing: '24 Hours Open · Lit Frontage & Security',
    contact: '1800-102-4247',
    trustScore: 95,
    verifiedBy: 'FDA Maharashtra & Retail Trust',
    facilities: ['High-Lux LED Frontage', '24/7 Pharmacist & Staff', 'CCTV Surveillance', 'Digital Billing']
  },
  {
    id: 'haven_pharm_apollo_baner',
    name: 'Apollo Pharmacy 24x7',
    type: 'pharmacy_247',
    coordinates: [18.5582, 73.7885],
    address: 'Baner High Street, Opposite Balewadi Phata, Pune',
    timing: '24 Hours Open · CCTV Monitored',
    contact: '020-67123456',
    trustScore: 96,
    verifiedBy: 'Apollo Hospitals Group',
    facilities: ['Continuous Street Lighting', 'Security Guard on Duty', 'CCTV Cameras', 'Emergency Medicines']
  },
  {
    id: 'haven_pharm_wellness_kothrud',
    name: 'Wellness Forever Kothrud Depot',
    type: 'pharmacy_247',
    coordinates: [18.5065, 73.8062],
    address: 'Karve Road, Near Kothrud Bus Depot, Pune',
    timing: '24 Hours Open · Verified Safe Haven',
    contact: '1800-102-4247',
    trustScore: 95,
    verifiedBy: 'FDA Maharashtra',
    facilities: ['Bright High-Mast Area', 'Active Staff on Floor', 'CCTV Record', 'Phone Pay Point']
  },

  // Emergency Hospitals
  {
    id: 'haven_hosp_jupiter',
    name: 'Jupiter Hospital Emergency Care',
    type: 'hospital',
    coordinates: [18.5605, 73.7788],
    address: 'Near Balewadi Sports Complex, Baner, Pune',
    timing: '24/7 Emergency & Trauma Center · Guarded',
    contact: '020-27992799',
    trustScore: 99,
    verifiedBy: 'NABH Accredited Hospital',
    facilities: ['24/7 Armed Security', 'Well-Lit Gated Entrance', 'Trauma Emergency Team', 'Safe Public Lobby']
  },
  {
    id: 'haven_hosp_sahyadri_kothrud',
    name: 'Sahyadri Super Speciality Hospital',
    type: 'hospital',
    coordinates: [18.5042, 73.8115],
    address: 'Plot 30C, Erandwane / Karve Road, Kothrud, Pune',
    timing: '24/7 Emergency & Casualty Wing',
    contact: '020-67213000',
    trustScore: 99,
    verifiedBy: 'NABH Accredited Hospital',
    facilities: ['24/7 Security Desk', 'CCTV Network', 'Casualty Triage Waiting Room', 'Ambulance Bay']
  },
  {
    id: 'haven_hosp_ruby_hall',
    name: 'Ruby Hall Clinic 24/7 Emergency & Trauma Centre',
    type: 'hospital',
    coordinates: [18.5320, 73.8770],
    address: '40 Sassoon Road, Near Pune Railway Station, Pune',
    timing: '24/7 Level-1 Emergency & Trauma Care · Guarded Campus',
    contact: '020-66455100 / 1066',
    trustScore: 99,
    verifiedBy: 'NABH & Directorate of Health Services',
    facilities: ['Dedicated 24/7 Emergency ER', 'Armed Hospital Guards', 'Ambulance Fleet On-Duty', 'Lit Triage Area']
  },
  {
    id: 'haven_hosp_aditya_birla',
    name: 'Aditya Birla Memorial Hospital 24/7 Trauma Wing',
    type: 'hospital',
    coordinates: [18.6250, 73.7840],
    address: 'Aditya Birla Hospital Marg, Thergaon, Pimpri-Chinchwad',
    timing: '24/7 Comprehensive Emergency Services',
    contact: '020-30717500 / 1057',
    trustScore: 99,
    verifiedBy: 'JCI / NABH Accredited',
    facilities: ['24/7 Trauma Specialists', 'Guarded Gated Campus', 'High Security Presence', '24/7 Emergency Wing']
  },

  // Transit Hubs with CISF / Security
  {
    id: 'haven_transit_wakad_brts',
    name: 'Wakad Bridge PMPML Transit Hub',
    type: 'transit_hub',
    coordinates: [18.5985, 73.7630],
    address: 'NH-48 Wakad Flyover, Pune',
    timing: 'Frequent Night Transit · Well Lit Bus Shelter',
    contact: '020-24503355',
    trustScore: 92,
    verifiedBy: 'PMPML Transit Authority',
    facilities: ['BRTS Lit Platforms', 'Municipal CCTV', 'Transit Staff Present', 'High Footfall']
  },
  {
    id: 'haven_transit_univ_circle',
    name: 'Savitribai Phule University Transit Node',
    type: 'transit_hub',
    coordinates: [18.5315, 73.8295],
    address: 'Ganeshkhind Road, University Circle, Pune',
    timing: 'Active Transit Station · Continuous Footfall',
    contact: '020-25601111',
    trustScore: 94,
    verifiedBy: 'Pune Traffic Police & PMPML',
    facilities: ['Police Traffic Booth', 'Continuous Night Flow', 'Illuminated Island', 'CCTV Coverage']
  },
  {
    id: 'haven_transit_kothrud_depot',
    name: 'Kothrud Bus Depot Terminal',
    type: 'transit_hub',
    coordinates: [18.5078, 73.8070],
    address: 'Paud Road, Kothrud, Pune',
    timing: 'Terminal Station · Staffed & Lit',
    contact: '020-25383512',
    trustScore: 93,
    verifiedBy: 'PMPML Operations Division',
    facilities: ['24/7 Depot Security', 'Lit Concrete Concourse', 'Operating Night Buses', 'Rest Shed']
  }
];
