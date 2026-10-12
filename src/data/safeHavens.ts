import { SafeHaven } from '../types/routing';

export const PUNE_SAFE_HAVENS: SafeHaven[] = [
  // ==========================================
  // 1. POLICE STATIONS & WOMEN HELP DESKS (PINK CHOWKIS)
  // ==========================================
  {
    id: 'haven_police_hinjawadi',
    name: 'Hinjawadi Police Station',
    type: 'police',
    coordinates: [18.5912, 73.7389],
    address: 'Phase 1, Hinjawadi Rajiv Gandhi Infotech Park, Pune',
    timing: '24/7 Emergency Police Outpost',
    contact: '020-22934200 / 112',
    is24x7: true,
    askForAngelaTrained: true,
    hasPhoneCharger: true,
    safeWaitingArea: true,
    securityStaffOnDuty: true,
    accreditationBadge: 'Pune City Police Verified'
  },
  {
    id: 'haven_police_wakad',
    name: 'Wakad Police Station & Pink Chowki',
    type: 'police',
    coordinates: [18.6015, 73.7650],
    address: 'Near Bhujbal Chowk, Datta Mandir Road, Wakad, Pune',
    timing: '24/7 Active Patrol & Women Helpdesk',
    contact: '020-27278100 / 112',
    is24x7: true,
    askForAngelaTrained: true,
    hasPhoneCharger: true,
    safeWaitingArea: true,
    securityStaffOnDuty: true,
    accreditationBadge: 'Pink Safety Chowki Accredited'
  },
  {
    id: 'haven_police_chatushrungi',
    name: 'Chatushrungi Police Station',
    type: 'police',
    coordinates: [18.5365, 73.8315],
    address: 'Senapati Bapat Road, Near Pune University Circle, Pune',
    timing: '24/7 Police Station & Highway Patrol',
    contact: '020-25652835 / 112',
    is24x7: true,
    askForAngelaTrained: true,
    hasPhoneCharger: true,
    safeWaitingArea: true,
    securityStaffOnDuty: true,
    accreditationBadge: 'Pune City Police HQ Wing'
  },
  {
    id: 'haven_police_kothrud',
    name: 'Kothrud Police Station',
    type: 'police',
    coordinates: [18.5085, 73.8040],
    address: 'Near Kothrud Stand, Paud Road, Pune',
    timing: '24/7 Police Outpost',
    contact: '020-25383500 / 112',
    is24x7: true,
    askForAngelaTrained: true,
    hasPhoneCharger: true,
    safeWaitingArea: true,
    securityStaffOnDuty: true,
    accreditationBadge: 'Pune City Police Verified'
  },
  {
    id: 'haven_police_shivajinagar',
    name: 'Shivajinagar Police Headquarters',
    type: 'police',
    coordinates: [18.5312, 73.8505],
    address: 'FC Road / Congress House Road, Shivajinagar, Pune',
    timing: '24/7 Central Operations Control',
    contact: '020-25536263 / 112',
    is24x7: true,
    askForAngelaTrained: true,
    hasPhoneCharger: true,
    safeWaitingArea: true,
    securityStaffOnDuty: true,
    accreditationBadge: 'Central Police Command'
  },

  // ==========================================
  // 2. 24/7 VERIFIED PHARMACIES ("ASK FOR ANGELA" TRAINED)
  // ==========================================
  {
    id: 'haven_pharm_wellness_wakad',
    name: 'Wellness Forever 24/7 Pharmacy',
    type: 'pharmacy_247',
    coordinates: [18.6022, 73.7638],
    address: 'Shop 4, Datta Mandir Road, Wakad, Pune',
    timing: '24 Hours Open · CCTV & Security Guard',
    contact: '1800-102-4247',
    is24x7: true,
    askForAngelaTrained: true,
    hasPhoneCharger: true,
    safeWaitingArea: true,
    securityStaffOnDuty: true,
    accreditationBadge: 'Ask for Angela Certified Refuge'
  },
  {
    id: 'haven_pharm_apollo_baner',
    name: 'Apollo Pharmacy 24x7 Baner High St',
    type: 'pharmacy_247',
    coordinates: [18.5582, 73.7885],
    address: 'Baner High Street, Opposite Balewadi Phata, Pune',
    timing: '24 Hours Open · Lit Frontage & SOS Desk',
    contact: '020-67123456',
    is24x7: true,
    askForAngelaTrained: true,
    hasPhoneCharger: true,
    safeWaitingArea: true,
    securityStaffOnDuty: true,
    accreditationBadge: 'Ask for Angela Certified Refuge'
  },
  {
    id: 'haven_pharm_medplus_aundh',
    name: 'MedPlus 24/7 Aundh DP Road',
    type: 'pharmacy_247',
    coordinates: [18.5528, 73.8055],
    address: 'Near Medipoint Hospital, DP Road, Aundh, Pune',
    timing: '24 Hours Open · Guarded Refuge',
    contact: '020-25881234',
    is24x7: true,
    askForAngelaTrained: true,
    hasPhoneCharger: true,
    safeWaitingArea: true,
    securityStaffOnDuty: true,
    accreditationBadge: 'Ask for Angela Certified Refuge'
  },
  {
    id: 'haven_pharm_wellness_kothrud',
    name: 'Wellness Forever Kothrud Depot',
    type: 'pharmacy_247',
    coordinates: [18.5065, 73.8062],
    address: 'Karve Road, Near Kothrud Bus Depot, Pune',
    timing: '24 Hours Open · Verified Safe Haven',
    contact: '1800-102-4247',
    is24x7: true,
    askForAngelaTrained: true,
    hasPhoneCharger: true,
    safeWaitingArea: true,
    securityStaffOnDuty: true,
    accreditationBadge: 'Ask for Angela Certified Refuge'
  },
  {
    id: 'haven_pharm_apollo_fc_road',
    name: 'Apollo Pharmacy 24x7 FC Road',
    type: 'pharmacy_247',
    coordinates: [18.5245, 73.8415],
    address: 'Fergusson College Road, Deccan Gymkhana, Pune',
    timing: '24 Hours Open · Active Commercial Frontage',
    contact: '020-25679900',
    is24x7: true,
    askForAngelaTrained: true,
    hasPhoneCharger: true,
    safeWaitingArea: true,
    securityStaffOnDuty: true,
    accreditationBadge: 'Ask for Angela Certified Refuge'
  },

  // ==========================================
  // 3. EMERGENCY HOSPITALS & CASUALTY WINGS
  // ==========================================
  {
    id: 'haven_hosp_jupiter',
    name: 'Jupiter Hospital Emergency & Trauma Care',
    type: 'hospital',
    coordinates: [18.5605, 73.7788],
    address: 'Near Balewadi Sports Complex, Baner Link Road, Pune',
    timing: '24/7 Emergency & Casualty Wing · Security Guarded',
    contact: '020-27992799',
    is24x7: true,
    askForAngelaTrained: true,
    hasPhoneCharger: true,
    safeWaitingArea: true,
    securityStaffOnDuty: true,
    accreditationBadge: 'Tier-1 Emergency Care Shelter'
  },
  {
    id: 'haven_hosp_aundh_dist',
    name: 'Aundh District Government Hospital',
    type: 'hospital',
    coordinates: [18.5710, 73.8020],
    address: 'Near Sangvi Phata, Aundh, Pune',
    timing: '24/7 Emergency & Police Surgeon Casualty',
    contact: '020-27280200',
    is24x7: true,
    askForAngelaTrained: true,
    hasPhoneCharger: true,
    safeWaitingArea: true,
    securityStaffOnDuty: true,
    accreditationBadge: 'Government Emergency Hospital'
  },
  {
    id: 'haven_hosp_sahyadri_kothrud',
    name: 'Sahyadri Super Speciality Hospital',
    type: 'hospital',
    coordinates: [18.5042, 73.8115],
    address: 'Plot 30C, Erandwane / Karve Road, Kothrud, Pune',
    timing: '24/7 Emergency & Casualty Wing',
    contact: '020-67213000',
    is24x7: true,
    askForAngelaTrained: true,
    hasPhoneCharger: true,
    safeWaitingArea: true,
    securityStaffOnDuty: true,
    accreditationBadge: 'NABH Accredited Safe Facility'
  },
  {
    id: 'haven_hosp_poona_hospital',
    name: 'Poona Hospital Emergency Center',
    type: 'hospital',
    coordinates: [18.5120, 73.8440],
    address: 'Near Alka Talkies Chowk, Sadashiv Peth, Pune',
    timing: '24/7 Trauma Emergency',
    contact: '020-24331707',
    is24x7: true,
    askForAngelaTrained: true,
    hasPhoneCharger: true,
    safeWaitingArea: true,
    securityStaffOnDuty: true,
    accreditationBadge: 'Emergency Trauma Facility'
  },

  // ==========================================
  // 4. COMMERCIAL 24/7 REFUGES & FUEL HUBS
  // ==========================================
  {
    id: 'haven_comm_shell_balewadi',
    name: 'Shell 24/7 Fuel & Deli Plaza',
    type: 'commercial_refuge',
    coordinates: [18.5795, 73.7680],
    address: 'NH-48 Bypass, Balewadi High Street Exit, Pune',
    timing: '24 Hours Open · High-Mast LED Lighting & Security',
    contact: '020-67904400',
    is24x7: true,
    askForAngelaTrained: true,
    hasPhoneCharger: true,
    safeWaitingArea: true,
    securityStaffOnDuty: true,
    accreditationBadge: 'Highway Safe Haven Certified'
  },
  {
    id: 'haven_comm_bpcl_wakad',
    name: 'Bharat Petroleum 24/7 City Oasis',
    type: 'commercial_refuge',
    coordinates: [18.6080, 73.7555],
    address: 'Bhumkar Chowk, Tathawade-Wakad Link, Pune',
    timing: '24 Hours Open · 24/7 Convenience Store & Air',
    contact: '020-27401122',
    is24x7: true,
    askForAngelaTrained: true,
    hasPhoneCharger: true,
    safeWaitingArea: true,
    securityStaffOnDuty: true,
    accreditationBadge: 'Highway Safe Haven Certified'
  },
  {
    id: 'haven_comm_hp_baner',
    name: 'HP Auto Care 24x7 Baner Road',
    type: 'commercial_refuge',
    coordinates: [18.5550, 73.7930],
    address: 'Baner Main Road, Near Pancard Club Road, Pune',
    timing: '24 Hours Open · Well Lit & Staffed',
    contact: '020-25651100',
    is24x7: true,
    askForAngelaTrained: true,
    hasPhoneCharger: true,
    safeWaitingArea: true,
    securityStaffOnDuty: true,
    accreditationBadge: 'Commercial Safe Refuge'
  },

  // ==========================================
  // 5. STAFFED PUBLIC TRANSIT HUBS
  // ==========================================
  {
    id: 'haven_transit_wakad_brts',
    name: 'Wakad Bridge PMPML Transit Terminal',
    type: 'transit_hub',
    coordinates: [18.5985, 73.7630],
    address: 'NH-48 Wakad Flyover Hub, Pune',
    timing: '24 Hours Active · Security Guarded Bus Bay',
    contact: '020-24503355',
    is24x7: true,
    askForAngelaTrained: false,
    hasPhoneCharger: true,
    safeWaitingArea: true,
    securityStaffOnDuty: true,
    accreditationBadge: 'PMPML Transit Hub'
  },
  {
    id: 'haven_transit_univ_circle',
    name: 'Savitribai Phule University Transit Hub',
    type: 'transit_hub',
    coordinates: [18.5315, 73.8295],
    address: 'Ganeshkhind Road, University Circle, Pune',
    timing: '24/7 Transit Interchange · Lit Shelter & CCTV',
    contact: 'PMPML Control: 020-24503355',
    is24x7: true,
    askForAngelaTrained: true,
    hasPhoneCharger: true,
    safeWaitingArea: true,
    securityStaffOnDuty: true,
    accreditationBadge: 'PMC Public Safety Node'
  },
  {
    id: 'haven_transit_kothrud_depot',
    name: 'Kothrud Bus Depot Central Terminal',
    type: 'transit_hub',
    coordinates: [18.5078, 73.8070],
    address: 'Paud Road, Kothrud, Pune',
    timing: '24 Hours Staffed Depot · Security Guard Post',
    contact: '020-25381122',
    is24x7: true,
    askForAngelaTrained: false,
    hasPhoneCharger: true,
    safeWaitingArea: true,
    securityStaffOnDuty: true,
    accreditationBadge: 'PMPML Staffed Depot'
  }
];
