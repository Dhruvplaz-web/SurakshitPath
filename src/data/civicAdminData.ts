import { DarkSpotRecord, MunicipalTicket, MunicipalRoadProject, CrimeProneZone, CitizenReport } from '../types/routing';

export const PUNE_DARK_SPOTS: DarkSpotRecord[] = [
  {
    edgeId: 'edge_jspm_dark_cut',
    name: 'Tathawade Interior Agricultural Lane',
    roadClass: 'alley',
    lengthMeters: 850,
    lightingFactor: 0.05,
    nightTrafficVolume: 'High',
    priorityScore: 94,
    ward: 'PCMC Ward 21 (Tathawade-Punawale)',
    suggestedAction: 'Install 14 Solar LED Smart Poles & Trim Overgrown Foliage',
    coordinates: [
      [18.6186, 73.7483],
      [18.6170, 73.7540],
      [18.6145, 73.7585]
    ]
  },
  {
    edgeId: 'edge_service_to_sus_alley',
    name: 'Sus Khind Deserted Mountain Cut',
    roadClass: 'alley',
    lengthMeters: 4900,
    lightingFactor: 0.05,
    nightTrafficVolume: 'High',
    priorityScore: 98,
    ward: 'PMC Ward 9 (Baner-Balewadi-Pashan)',
    suggestedAction: 'Deploy High-Mast LED Mast at Pass Entry + Regular Police Patrolling',
    coordinates: [
      [18.5850, 73.7660],
      [18.5620, 73.7690],
      [18.5410, 73.7730]
    ]
  },
  {
    edgeId: 'edge_dark_cut_to_service',
    name: 'Wakad Back-Alley Dirt Connector',
    roadClass: 'service',
    lengthMeters: 3400,
    lightingFactor: 0.10,
    nightTrafficVolume: 'Medium',
    priorityScore: 82,
    ward: 'PCMC Ward 24 (Wakad-Hinjawadi Link)',
    suggestedAction: 'Extend Municipal Grid Connection from Bhujbal Chowk (1.2 km)',
    coordinates: [
      [18.6145, 73.7585],
      [18.6010, 73.7620],
      [18.5850, 73.7660]
    ]
  },
  {
    edgeId: 'edge_sus_alley_to_chandani',
    name: 'Pashan-Chandani Unlit Hill Cut',
    roadClass: 'tertiary',
    lengthMeters: 4100,
    lightingFactor: 0.15,
    nightTrafficVolume: 'Medium',
    priorityScore: 76,
    ward: 'PMC Ward 12 (Kothrud-Bavdhan)',
    suggestedAction: 'Replace non-functional sodium vapor lamps with 60W LED fixtures',
    coordinates: [
      [18.5410, 73.7730],
      [18.5240, 73.7820],
      [18.5080, 73.7920]
    ]
  }
];

export const INITIAL_MUNICIPAL_TICKETS: MunicipalTicket[] = [
  {
    id: 'TICK-4091',
    title: '3 Continuous Lampposts Dark near Tathawade College Corner',
    category: 'broken_lamp',
    locationName: 'JSPM Back Gate, Tathawade',
    ward: 'PCMC Ward 21',
    reportedAt: 'Today, 21:15',
    status: 'pending',
    upvotes: 12,
    edgeId: 'edge_jspm_dark_cut'
  },
  {
    id: 'TICK-4087',
    title: 'Transformer Trip Causing Dark Stretch on Baner High Street',
    category: 'power_trip',
    locationName: 'Opposite Balewadi Phata, Baner',
    ward: 'PMC Ward 9',
    reportedAt: 'Today, 20:40',
    status: 'in_progress',
    upvotes: 28,
    edgeId: 'edge_baner_phata_to_mid'
  },
  {
    id: 'TICK-4074',
    title: 'Overgrown Banyan Tree Blocking Streetlight Visibility',
    category: 'vegetation_block',
    locationName: 'Near Pashan Lake Road',
    ward: 'PMC Ward 9',
    reportedAt: 'Yesterday, 19:30',
    status: 'resolved',
    upvotes: 7,
    edgeId: 'edge_pashan_to_chandani'
  }
];

export const PUNE_MUNICIPAL_ROAD_PROJECTS: MunicipalRoadProject[] = [
  {
    id: 'ROAD-PMC-2026-01',
    name: 'Baner-Pashan Link Road Asphalting & Smart Ducting',
    ward: 'PMC Ward 9 (Baner-Balewadi-Pashan)',
    status: 'in_progress',
    budgetINR: '₹ 3.20 Cr',
    completionPercent: 72,
    contractor: 'B.G. Shirke Construction / PMC Civil Dept',
    roadQualityIndex: 82,
    targetDate: 'Oct 2026',
    edgeId: 'edge_baner_mid_to_south',
    coordinates: [
      [18.5582, 73.7885],
      [18.5510, 73.7960],
      [18.5420, 73.8050]
    ]
  },
  {
    id: 'ROAD-PCMC-2026-02',
    name: 'Tathawade to Bhujbal Chowk Smart Streetlight & Drainage Corridor',
    ward: 'PCMC Ward 21 (Tathawade-Punawale)',
    status: 'in_progress',
    budgetINR: '₹ 5.40 Cr',
    completionPercent: 45,
    contractor: 'Eagle Infra PCMC Joint Venture',
    roadQualityIndex: 64,
    targetDate: 'Dec 2026',
    edgeId: 'edge_nh48_tathawade_to_wakad',
    coordinates: [
      [18.6186, 73.7483],
      [18.6100, 73.7550],
      [18.6015, 73.7650]
    ]
  },
  {
    id: 'ROAD-PCMC-2026-03',
    name: 'Hinjawadi Phase 1 to Wakad Flyover Road Resurfacing',
    ward: 'PCMC Ward 24 (Wakad-Hinjawadi Link)',
    status: 'planning',
    budgetINR: '₹ 2.10 Cr',
    completionPercent: 15,
    contractor: 'Pune Smart City Dev Corp (PSCDCL)',
    roadQualityIndex: 58,
    targetDate: 'Jan 2027',
    edgeId: 'edge_wakad_to_baner_phata',
    coordinates: [
      [18.6015, 73.7650],
      [18.5800, 73.7740],
      [18.5680, 73.7810]
    ]
  },
  {
    id: 'ROAD-PMC-2026-04',
    name: 'Kothrud Paud Road Metro Pier Underpass Surface Reconstruction',
    ward: 'PMC Ward 12 (Kothrud-Bavdhan)',
    status: 'completed',
    budgetINR: '₹ 4.75 Cr',
    completionPercent: 100,
    contractor: 'MahaMetro & PMC Works Division',
    roadQualityIndex: 94,
    targetDate: 'Aug 2026',
    edgeId: 'edge_chandani_to_kothrud',
    coordinates: [
      [18.5080, 73.7920],
      [18.5085, 73.8040]
    ]
  }
];

export const PUNE_CRIME_PRONE_ZONES: CrimeProneZone[] = [
  {
    id: 'CRIME-PUNE-01',
    zoneName: 'Sus Khind Deserted Mountain Pass',
    ward: 'PMC Ward 9 / Bavdhan Boundary',
    policeChowki: 'Chatushrungi Police Station & Bavdhan Beat',
    riskLevel: 'critical',
    incidentTypes: ['Night Snatching', 'Hostile Loitering', 'Zero Surveillance'],
    pastIncidents30d: 5,
    patrolFrequency: 'Beat Marshal every 45 mins',
    safetyAction: 'Install 18 High-Mast Solar CCTV Poles + Dedicated Night Police Barrier',
    edgeId: 'edge_service_to_sus_alley',
    coordinates: [
      [18.5850, 73.7660],
      [18.5620, 73.7690],
      [18.5410, 73.7730]
    ]
  },
  {
    id: 'CRIME-PUNE-02',
    zoneName: 'Tathawade Interior Agriculture Cut',
    ward: 'PCMC Ward 21 (Tathawade-Punawale)',
    policeChowki: 'Wakad Police Station (Pink Chowki)',
    riskLevel: 'critical',
    incidentTypes: ['Isolated Stalking', 'Unlit Blind Corners'],
    pastIncidents30d: 4,
    patrolFrequency: 'Damini Squad Night Patrol',
    safetyAction: 'Tender issued for continuous 60W LED fixtures & dense bush clearance',
    edgeId: 'edge_jspm_dark_cut',
    coordinates: [
      [18.6186, 73.7483],
      [18.6170, 73.7540],
      [18.6145, 73.7585]
    ]
  },
  {
    id: 'CRIME-PUNE-03',
    zoneName: 'Wakad Back-Alley Dirt Connector',
    ward: 'PCMC Ward 24 (Wakad-Hinjawadi Link)',
    policeChowki: 'Hinjawadi Police Chowki',
    riskLevel: 'high',
    incidentTypes: ['Mobile Snatching', 'Pothole Ambush Hazard'],
    pastIncidents30d: 3,
    patrolFrequency: 'PCR Van 112 static point',
    safetyAction: 'Extend municipal grid connection from Bhujbal Chowk (1.2 km)',
    edgeId: 'edge_dark_cut_to_service',
    coordinates: [
      [18.6145, 73.7585],
      [18.6010, 73.7620],
      [18.5850, 73.7660]
    ]
  },
  {
    id: 'CRIME-PUNE-04',
    zoneName: 'Pashan-Chandani Unlit Hill Curve',
    ward: 'PMC Ward 12 (Kothrud-Bavdhan)',
    policeChowki: 'Kothrud Police Station',
    riskLevel: 'moderate',
    incidentTypes: ['Drunk Loitering', 'Non-functional Sodium Lamps'],
    pastIncidents30d: 2,
    patrolFrequency: 'Kothrud Beat 2 Van',
    safetyAction: 'Sodium vapor replacement with Philips Smart Connected LED',
    edgeId: 'edge_sus_alley_to_chandani',
    coordinates: [
      [18.5410, 73.7730],
      [18.5240, 73.7820],
      [18.5080, 73.7920]
    ]
  }
];

export const INITIAL_CITIZEN_REPORTS: CitizenReport[] = [
  {
    id: 'CR-PUNE-2026-01',
    category: 'broken_lamp',
    title: 'Faulty Streetlights & Total Blackout on JSPM Back Gate Link',
    description: '3 consecutive municipal LED poles have failed. Extremely dark unlit pedestrian corridor after 8:30 PM.',
    coordinates: [18.6186, 73.7483],
    reportedAt: Date.now() - 3600000 * 2,
    status: 'investigating',
    upvotes: 19,
    urgency: 'high',
    landmarkName: 'JSPM Imperial College Corner, Tathawade',
    aiRiskScore: 88,
    aiRiskRationale: 'Critical illumination deficit on pedestrian footpath directly intersecting highway service slip.',
    photoUrl: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'CR-PUNE-2026-02',
    category: 'cctv_blindspot',
    title: 'Isolated Underpass Stretch near Wakad Bhujbal Chowk',
    description: 'Blind corner under bridge structure with zero surveillance coverage. Frequent complaints of aggressive loitering.',
    coordinates: [18.6015, 73.7650],
    reportedAt: Date.now() - 3600000 * 5,
    status: 'verified',
    upvotes: 24,
    urgency: 'high',
    landmarkName: 'Bhujbal Chowk Flyover Underpass, Wakad',
    aiRiskScore: 84,
    aiRiskRationale: 'Elevated crime incidence zone with zero active CCTV telemetry during nocturnal hours.'
  },
  {
    id: 'CR-PUNE-2026-03',
    category: 'pothole_hazard',
    title: 'Deep Unbarricaded Excavation Trench on Baner Road',
    description: 'Road cut open for underground municipal ducting with no reflective barricades or warning lights.',
    coordinates: [18.5680, 73.7810],
    reportedAt: Date.now() - 3600000 * 11,
    status: 'investigating',
    upvotes: 11,
    urgency: 'medium',
    landmarkName: 'Baner High Street Junction',
    aiRiskScore: 68,
    aiRiskRationale: 'Significant physical roadway obstruction posing two-wheeler collision and pedestrian fall risks.'
  }
];

