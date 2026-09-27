import { GraphNode, GraphEdge } from '../types/routing';

// Comprehensive Multi-Zone Node Network for Pune Metropolitan Region
export const PUNE_NODES: Record<string, GraphNode> = {
  // --- Zone 1: West / Hinjawadi IT Park & Tathawade ---
  node_hinjawadi_ph3: {
    id: 'node_hinjawadi_ph3',
    name: 'Hinjawadi Phase 3 (Megapolis Circle)',
    coordinates: [18.5790, 73.6880]
  },
  node_hinjawadi_ph2: {
    id: 'node_hinjawadi_ph2',
    name: 'Hinjawadi Phase 2 (Wipro Circle)',
    coordinates: [18.5865, 73.7150]
  },
  node_hinjawadi_ph1: {
    id: 'node_hinjawadi_ph1',
    name: 'Hinjawadi Phase 1 (Infosys Circle)',
    coordinates: [18.5912, 73.7389]
  },
  node_jspm: {
    id: 'node_jspm',
    name: 'JSPM RSCOE / Tathawade Campus',
    coordinates: [18.6186, 73.7483]
  },
  node_indira_college: {
    id: 'node_indira_college',
    name: 'Indira College / Wakad-Tathawade Link',
    coordinates: [18.6135, 73.7525]
  },
  node_bhumkar_chowk: {
    id: 'node_bhumkar_chowk',
    name: 'Bhumkar Chowk (Wakad-Tathawade Junction)',
    coordinates: [18.6085, 73.7540]
  },
  node_wakad_bridge: {
    id: 'node_wakad_bridge',
    name: 'Wakad Flyover & Bridge (NH-48 Arterial)',
    coordinates: [18.5982, 73.7634]
  },
  node_dange_chowk: {
    id: 'node_dange_chowk',
    name: 'Dange Chowk BRTS Hub',
    coordinates: [18.6112, 73.7745]
  },
  node_tathawade_dark_cut: {
    id: 'node_tathawade_dark_cut',
    name: 'Tathawade Interior Agricultural Service Lane',
    coordinates: [18.6145, 73.7585]
  },
  node_wakad_service_isolated: {
    id: 'node_wakad_service_isolated',
    name: 'Wakad-Pashan Unlit Bypass Lane',
    coordinates: [18.5850, 73.7660]
  },

  // --- Zone 2: North-West / Balewadi, Baner, Aundh, Pashan ---
  node_balewadi_stadium: {
    id: 'node_balewadi_stadium',
    name: 'Balewadi Sports Complex / High Street Junction',
    coordinates: [18.5775, 73.7695]
  },
  node_baner_phata: {
    id: 'node_baner_phata',
    name: 'Baner Phata (Commercial Arterial)',
    coordinates: [18.5590, 73.7860]
  },
  node_baner_road_mid: {
    id: 'node_baner_road_mid',
    name: 'Baner High Street (Apollo & Wellness Corridor)',
    coordinates: [18.5520, 73.7990]
  },
  node_sus_unlit_alley: {
    id: 'node_sus_unlit_alley',
    name: 'Sus Khind Deserted Mountain Cut',
    coordinates: [18.5410, 73.7730]
  },
  node_pashan_circle: {
    id: 'node_pashan_circle',
    name: 'Pashan Circle / NDA Road Junction',
    coordinates: [18.5360, 73.7920]
  },
  node_aundh_chest_hospital: {
    id: 'node_aundh_chest_hospital',
    name: 'Aundh Medipoint / DP Road',
    coordinates: [18.5480, 73.8110]
  },
  node_bremen_chowk: {
    id: 'node_bremen_chowk',
    name: 'Bremen Chowk (Aundh University Nexus)',
    coordinates: [18.5535, 73.8190]
  },

  // --- Zone 3: Central / University, Shivajinagar, FC Road, COEP ---
  node_university_circle: {
    id: 'node_university_circle',
    name: 'Pune University Gate & Circle (SPPU)',
    coordinates: [18.5308, 73.8288]
  },
  node_sb_road: {
    id: 'node_sb_road',
    name: 'Senapati Bapat Road / Chatushrungi Temple',
    coordinates: [18.5250, 73.8320]
  },
  node_shivajinagar_station: {
    id: 'node_shivajinagar_station',
    name: 'Shivajinagar Railway & Metro Station',
    coordinates: [18.5320, 73.8520]
  },
  node_fc_road: {
    id: 'node_fc_road',
    name: 'Fergusson College Road (FC Road / Deccan)',
    coordinates: [18.5204, 73.8402]
  },
  node_coep_tech: {
    id: 'node_coep_tech',
    name: 'COEP Technological University / Wellesley Rd',
    coordinates: [18.5293, 73.8565]
  },
  node_pune_station: {
    id: 'node_pune_station',
    name: 'Pune Railway Station Central Hub',
    coordinates: [18.5284, 73.8744]
  },

  // --- Zone 4: South-West / Kothrud, Paud Road, Chandani Chowk ---
  node_chandani_chowk: {
    id: 'node_chandani_chowk',
    name: 'Chandani Chowk Multilevel Flyover',
    coordinates: [18.5080, 73.7920]
  },
  node_vanaz_metro: {
    id: 'node_vanaz_metro',
    name: 'Vanaz Metro Station & Depot',
    coordinates: [18.5060, 73.8010]
  },
  node_mit_wpu: {
    id: 'node_mit_wpu',
    name: 'MIT World Peace University (Paud Road)',
    coordinates: [18.5178, 73.8152]
  },
  node_kothrud_stand: {
    id: 'node_kothrud_stand',
    name: 'Kothrud Bus Stand / Karve Road Destination',
    coordinates: [18.5074, 73.8077]
  },

  // --- Zone 5: South / Swargate & Camp ---
  node_swargate: {
    id: 'node_swargate',
    name: 'Swargate MSRTC Bus Terminal & Metro',
    coordinates: [18.5018, 73.8586]
  },

  // --- Zone 6: East / Yerawada, Viman Nagar, Hadapsar ---
  node_yerawada: {
    id: 'node_yerawada',
    name: 'Yerawada Bridge / Ahmednagar Road Entry',
    coordinates: [18.5475, 73.8820]
  },
  node_kalyani_nagar: {
    id: 'node_kalyani_nagar',
    name: 'Kalyani Nagar / Koregaon Park Bridge',
    coordinates: [18.5450, 73.9020]
  },
  node_viman_nagar: {
    id: 'node_viman_nagar',
    name: 'Viman Nagar (Phoenix Marketcity / Symbiosis)',
    coordinates: [18.5679, 73.9143]
  },
  node_hadapsar_magarpatta: {
    id: 'node_hadapsar_magarpatta',
    name: 'Hadapsar / Magarpatta Cybercity',
    coordinates: [18.5120, 73.9280]
  }
};

export const PUNE_EDGES: GraphEdge[] = [
  // ==========================================
  // SECTION A: HINJAWADI TO TATHAWADE & WAKAD
  // ==========================================
  {
    id: 'edge_hinj3_to_hinj2',
    source: 'node_hinjawadi_ph3',
    target: 'node_hinjawadi_ph2',
    name: 'Phase 3 to Phase 2 Tech Spine',
    roadClass: 'primary',
    lengthMeters: 2900,
    explicitLit: true,
    spilloverPoiCount: 5,
    activeNightPois: 6,
    transitDistanceMeters: 80,
    emergencyDistanceMeters: 400,
    coordinates: [
      [18.5790, 73.6880],
      [18.5830, 73.7010],
      [18.5865, 73.7150]
    ]
  },
  {
    id: 'edge_hinj2_to_hinj1',
    source: 'node_hinjawadi_ph2',
    target: 'node_hinjawadi_ph1',
    name: 'Hinjawadi IT Main Boulevard',
    roadClass: 'primary',
    lengthMeters: 2700,
    explicitLit: true,
    spilloverPoiCount: 7,
    activeNightPois: 8,
    transitDistanceMeters: 50,
    emergencyDistanceMeters: 200,
    coordinates: [
      [18.5865, 73.7150],
      [18.5890, 73.7270],
      [18.5912, 73.7389]
    ]
  },
  {
    id: 'edge_hinj1_to_wakad_bridge',
    source: 'node_hinjawadi_ph1',
    target: 'node_wakad_bridge',
    name: 'Hinjawadi-Wakad Flyover Link',
    roadClass: 'primary',
    lengthMeters: 2800,
    explicitLit: true,
    spilloverPoiCount: 6,
    activeNightPois: 7,
    transitDistanceMeters: 90,
    emergencyDistanceMeters: 300,
    coordinates: [
      [18.5912, 73.7389],
      [18.5950, 73.7510],
      [18.5982, 73.7634]
    ]
  },
  {
    id: 'edge_jspm_to_bhumkar',
    source: 'node_jspm',
    target: 'node_bhumkar_chowk',
    name: 'Tathawade-Bhumkar Highway Link',
    roadClass: 'trunk',
    lengthMeters: 1400,
    explicitLit: true,
    spilloverPoiCount: 4,
    activeNightPois: 5,
    transitDistanceMeters: 120,
    emergencyDistanceMeters: 450,
    coordinates: [
      [18.6186, 73.7483],
      [18.6140, 73.7510],
      [18.6085, 73.7540]
    ]
  },
  {
    id: 'edge_bhumkar_to_wakad_bridge',
    source: 'node_bhumkar_chowk',
    target: 'node_wakad_bridge',
    name: 'NH-48 Expressway Wakad Arterial',
    roadClass: 'trunk',
    lengthMeters: 1600,
    explicitLit: true,
    spilloverPoiCount: 5,
    activeNightPois: 6,
    transitDistanceMeters: 90,
    emergencyDistanceMeters: 300,
    coordinates: [
      [18.6085, 73.7540],
      [18.6030, 73.7590],
      [18.5982, 73.7634]
    ]
  },
  {
    id: 'edge_jspm_to_dange',
    source: 'node_jspm',
    target: 'node_dange_chowk',
    name: 'Tathawade-Thergaon BRTS Link',
    roadClass: 'primary',
    lengthMeters: 3100,
    explicitLit: true,
    spilloverPoiCount: 3,
    activeNightPois: 4,
    transitDistanceMeters: 60,
    emergencyDistanceMeters: 600,
    coordinates: [
      [18.6186, 73.7483],
      [18.6150, 73.7610],
      [18.6112, 73.7745]
    ]
  },

  // ==========================================
  // SECTION B: ISOLATED CUTS / BACK-ALLEYS (SHORTCUTS WITH LOW SAFETY)
  // ==========================================
  {
    id: 'edge_jspm_dark_cut',
    source: 'node_jspm',
    target: 'node_tathawade_dark_cut',
    name: 'Tathawade Interior Agri Cut',
    roadClass: 'alley',
    lengthMeters: 850,
    explicitLit: false,
    spilloverPoiCount: 0,
    activeNightPois: 0,
    transitDistanceMeters: 450,
    emergencyDistanceMeters: 1200,
    coordinates: [
      [18.6186, 73.7483],
      [18.6170, 73.7540],
      [18.6145, 73.7585]
    ]
  },
  {
    id: 'edge_dark_cut_to_service',
    source: 'node_tathawade_dark_cut',
    target: 'node_wakad_service_isolated',
    name: 'Wakad Deserted Agricultural Backroad',
    roadClass: 'service',
    lengthMeters: 3400,
    explicitLit: false,
    spilloverPoiCount: 0,
    activeNightPois: 0,
    transitDistanceMeters: 650,
    emergencyDistanceMeters: 1800,
    coordinates: [
      [18.6145, 73.7585],
      [18.6010, 73.7620],
      [18.5850, 73.7660]
    ]
  },
  {
    id: 'edge_service_to_sus_alley',
    source: 'node_wakad_service_isolated',
    target: 'node_sus_unlit_alley',
    name: 'Sus Khind Unmonitored Mountain Pass',
    roadClass: 'alley',
    lengthMeters: 4900,
    explicitLit: false,
    spilloverPoiCount: 0,
    activeNightPois: 0,
    transitDistanceMeters: 800,
    emergencyDistanceMeters: 2200,
    coordinates: [
      [18.5850, 73.7660],
      [18.5620, 73.7690],
      [18.5410, 73.7730]
    ]
  },
  {
    id: 'edge_sus_alley_to_chandani',
    source: 'node_sus_unlit_alley',
    target: 'node_chandani_chowk',
    name: 'Pashan-Bavdhan Isolated Hill Road',
    roadClass: 'tertiary',
    lengthMeters: 4100,
    explicitLit: false,
    spilloverPoiCount: 1,
    activeNightPois: 1,
    transitDistanceMeters: 550,
    emergencyDistanceMeters: 1400,
    coordinates: [
      [18.5410, 73.7730],
      [18.5240, 73.7820],
      [18.5080, 73.7920]
    ]
  },

  // ==========================================
  // SECTION C: HIGHWAY ARTERIAL SAFE CORRIDOR (NH-48 & BANER)
  // ==========================================
  {
    id: 'edge_wakad_to_balewadi',
    source: 'node_wakad_bridge',
    target: 'node_balewadi_stadium',
    name: 'NH-48 Balewadi High Street Arterial',
    roadClass: 'trunk',
    lengthMeters: 2400,
    explicitLit: true,
    spilloverPoiCount: 6,
    activeNightPois: 7,
    transitDistanceMeters: 80,
    emergencyDistanceMeters: 250,
    coordinates: [
      [18.5982, 73.7634],
      [18.5880, 73.7665],
      [18.5775, 73.7695]
    ]
  },
  {
    id: 'edge_balewadi_to_baner_phata',
    source: 'node_balewadi_stadium',
    target: 'node_baner_phata',
    name: 'Baner High-Mast Lit Boulevard',
    roadClass: 'primary',
    lengthMeters: 2700,
    explicitLit: true,
    spilloverPoiCount: 7,
    activeNightPois: 8,
    transitDistanceMeters: 50,
    emergencyDistanceMeters: 180,
    coordinates: [
      [18.5775, 73.7695],
      [18.5680, 73.7775],
      [18.5590, 73.7860]
    ]
  },
  {
    id: 'edge_baner_phata_to_mid',
    source: 'node_baner_phata',
    target: 'node_baner_road_mid',
    name: 'Baner 24/7 Commercial Frontage',
    roadClass: 'primary',
    lengthMeters: 1600,
    explicitLit: true,
    spilloverPoiCount: 8,
    activeNightPois: 9,
    transitDistanceMeters: 40,
    emergencyDistanceMeters: 120,
    coordinates: [
      [18.5590, 73.7860],
      [18.5550, 73.7925],
      [18.5520, 73.7990]
    ]
  },
  {
    id: 'edge_baner_to_aundh',
    source: 'node_baner_road_mid',
    target: 'node_aundh_chest_hospital',
    name: 'Baner-Aundh Lit Connector',
    roadClass: 'secondary',
    lengthMeters: 1800,
    explicitLit: true,
    spilloverPoiCount: 5,
    activeNightPois: 6,
    transitDistanceMeters: 70,
    emergencyDistanceMeters: 300,
    coordinates: [
      [18.5520, 73.7990],
      [18.5500, 73.8050],
      [18.5480, 73.8110]
    ]
  },
  {
    id: 'edge_dange_to_aundh',
    source: 'node_dange_chowk',
    target: 'node_aundh_chest_hospital',
    name: 'Aundh-Ravet Dedicated BRTS Corridor',
    roadClass: 'primary',
    lengthMeters: 7200,
    explicitLit: true,
    spilloverPoiCount: 4,
    activeNightPois: 5,
    transitDistanceMeters: 30,
    emergencyDistanceMeters: 400,
    coordinates: [
      [18.6112, 73.7745],
      [18.5910, 73.7870],
      [18.5710, 73.7990],
      [18.5480, 73.8110]
    ]
  },
  {
    id: 'edge_aundh_to_univ',
    source: 'node_aundh_chest_hospital',
    target: 'node_university_circle',
    name: 'Ganeshkhind Lit Avenue',
    roadClass: 'primary',
    lengthMeters: 2500,
    explicitLit: true,
    spilloverPoiCount: 6,
    activeNightPois: 7,
    transitDistanceMeters: 60,
    emergencyDistanceMeters: 220,
    coordinates: [
      [18.5480, 73.8110],
      [18.5390, 73.8200],
      [18.5308, 73.8288]
    ]
  },
  {
    id: 'edge_baner_mid_to_univ',
    source: 'node_baner_road_mid',
    target: 'node_university_circle',
    name: 'Pune University-Baner Link Road',
    roadClass: 'primary',
    lengthMeters: 3800,
    explicitLit: true,
    spilloverPoiCount: 5,
    activeNightPois: 6,
    transitDistanceMeters: 80,
    emergencyDistanceMeters: 250,
    coordinates: [
      [18.5520, 73.7990],
      [18.5420, 73.8130],
      [18.5308, 73.8288]
    ]
  },
  {
    id: 'edge_univ_to_sb_road',
    source: 'node_university_circle',
    target: 'node_sb_road',
    name: 'Senapati Bapat Road Smart Corridor',
    roadClass: 'primary',
    lengthMeters: 1100,
    explicitLit: true,
    spilloverPoiCount: 7,
    activeNightPois: 8,
    transitDistanceMeters: 40,
    emergencyDistanceMeters: 150,
    coordinates: [
      [18.5308, 73.8288],
      [18.5280, 73.8300],
      [18.5250, 73.8320]
    ]
  },

  // ==========================================
  // SECTION D: UNIVERSITY / SB ROAD TO SHIVAJINAGAR & FC ROAD
  // ==========================================
  {
    id: 'edge_univ_to_shivajinagar',
    source: 'node_university_circle',
    target: 'node_shivajinagar_station',
    name: 'Ganeshkhind-Shivajinagar Metro Transit Spine',
    roadClass: 'primary',
    lengthMeters: 2600,
    explicitLit: true,
    spilloverPoiCount: 7,
    activeNightPois: 8,
    transitDistanceMeters: 40,
    emergencyDistanceMeters: 180,
    coordinates: [
      [18.5308, 73.8288],
      [18.5315, 73.8410],
      [18.5320, 73.8520]
    ]
  },
  {
    id: 'edge_sb_road_to_fc_road',
    source: 'node_sb_road',
    target: 'node_fc_road',
    name: 'Deccan-FC Road Lit Youth Frontage',
    roadClass: 'secondary',
    lengthMeters: 1400,
    explicitLit: true,
    spilloverPoiCount: 9,
    activeNightPois: 9,
    transitDistanceMeters: 50,
    emergencyDistanceMeters: 200,
    coordinates: [
      [18.5250, 73.8320],
      [18.5225, 73.8360],
      [18.5204, 73.8402]
    ]
  },
  {
    id: 'edge_fc_road_to_shivajinagar',
    source: 'node_fc_road',
    target: 'node_shivajinagar_station',
    name: 'FC-JM Road Shivajinagar Connector',
    roadClass: 'primary',
    lengthMeters: 1800,
    explicitLit: true,
    spilloverPoiCount: 8,
    activeNightPois: 8,
    transitDistanceMeters: 40,
    emergencyDistanceMeters: 150,
    coordinates: [
      [18.5204, 73.8402],
      [18.5260, 73.8460],
      [18.5320, 73.8520]
    ]
  },
  {
    id: 'edge_shivajinagar_to_coep',
    source: 'node_shivajinagar_station',
    target: 'node_coep_tech',
    name: 'Wellesley Road COEP Metro Flyover',
    roadClass: 'primary',
    lengthMeters: 800,
    explicitLit: true,
    spilloverPoiCount: 5,
    activeNightPois: 6,
    transitDistanceMeters: 30,
    emergencyDistanceMeters: 100,
    coordinates: [
      [18.5320, 73.8520],
      [18.5305, 73.8540],
      [18.5293, 73.8565]
    ]
  },
  {
    id: 'edge_coep_to_pune_station',
    source: 'node_coep_tech',
    target: 'node_pune_station',
    name: 'Dr. Ambedkar Road Station Link',
    roadClass: 'primary',
    lengthMeters: 2100,
    explicitLit: true,
    spilloverPoiCount: 8,
    activeNightPois: 9,
    transitDistanceMeters: 30,
    emergencyDistanceMeters: 150,
    coordinates: [
      [18.5293, 73.8565],
      [18.5290, 73.8650],
      [18.5284, 73.8744]
    ]
  },

  // ==========================================
  // SECTION E: CENTRAL TO KOTHRUD & SWARGATE
  // ==========================================
  {
    id: 'edge_sb_road_to_kothrud',
    source: 'node_sb_road',
    target: 'node_kothrud_stand',
    name: 'Paud Road / Law College Safe Corridor',
    roadClass: 'primary',
    lengthMeters: 3200,
    explicitLit: true,
    spilloverPoiCount: 6,
    activeNightPois: 7,
    transitDistanceMeters: 60,
    emergencyDistanceMeters: 200,
    coordinates: [
      [18.5250, 73.8320],
      [18.5160, 73.8200],
      [18.5074, 73.8077]
    ]
  },
  {
    id: 'edge_fc_road_to_kothrud',
    source: 'node_fc_road',
    target: 'node_kothrud_stand',
    name: 'Karve Road Metro Corridor',
    roadClass: 'primary',
    lengthMeters: 3600,
    explicitLit: true,
    spilloverPoiCount: 7,
    activeNightPois: 8,
    transitDistanceMeters: 40,
    emergencyDistanceMeters: 220,
    coordinates: [
      [18.5204, 73.8402],
      [18.5130, 73.8230],
      [18.5074, 73.8077]
    ]
  },
  {
    id: 'edge_fc_road_to_swargate',
    source: 'node_fc_road',
    target: 'node_swargate',
    name: 'Tilak Road-Swargate Nexus',
    roadClass: 'primary',
    lengthMeters: 2900,
    explicitLit: true,
    spilloverPoiCount: 7,
    activeNightPois: 8,
    transitDistanceMeters: 40,
    emergencyDistanceMeters: 180,
    coordinates: [
      [18.5204, 73.8402],
      [18.5100, 73.8500],
      [18.5018, 73.8586]
    ]
  },
  {
    id: 'edge_kothrud_to_swargate',
    source: 'node_kothrud_stand',
    target: 'node_swargate',
    name: 'Laxmi Road / Sinhagad Link',
    roadClass: 'secondary',
    lengthMeters: 5600,
    explicitLit: true,
    spilloverPoiCount: 5,
    activeNightPois: 6,
    transitDistanceMeters: 70,
    emergencyDistanceMeters: 350,
    coordinates: [
      [18.5074, 73.8077],
      [18.5040, 73.8330],
      [18.5018, 73.8586]
    ]
  },
  {
    id: 'edge_chandani_to_kothrud',
    source: 'node_chandani_chowk',
    target: 'node_kothrud_stand',
    name: 'Paud Road-Vanaz Metro Lit Highway',
    roadClass: 'primary',
    lengthMeters: 2100,
    explicitLit: true,
    spilloverPoiCount: 6,
    activeNightPois: 7,
    transitDistanceMeters: 40,
    emergencyDistanceMeters: 250,
    coordinates: [
      [18.5080, 73.7920],
      [18.5076, 73.8000],
      [18.5074, 73.8077]
    ]
  },

  // ==========================================
  // SECTION F: EAST PUNE / YERAWADA, VIMAN NAGAR & HADAPSAR
  // ==========================================
  {
    id: 'edge_coep_to_yerawada',
    source: 'node_coep_tech',
    target: 'node_yerawada',
    name: 'Sangamwadi Bridge & Lit Arterial',
    roadClass: 'primary',
    lengthMeters: 3400,
    explicitLit: true,
    spilloverPoiCount: 6,
    activeNightPois: 7,
    transitDistanceMeters: 50,
    emergencyDistanceMeters: 280,
    coordinates: [
      [18.5293, 73.8565],
      [18.5390, 73.8690],
      [18.5475, 73.8820]
    ]
  },
  {
    id: 'edge_yerawada_to_viman',
    source: 'node_yerawada',
    target: 'node_viman_nagar',
    name: 'Ahmednagar Road Phoenix Transit Spine',
    roadClass: 'primary',
    lengthMeters: 3800,
    explicitLit: true,
    spilloverPoiCount: 8,
    activeNightPois: 9,
    transitDistanceMeters: 40,
    emergencyDistanceMeters: 200,
    coordinates: [
      [18.5475, 73.8820],
      [18.5580, 73.8980],
      [18.5679, 73.9143]
    ]
  },
  {
    id: 'edge_yerawada_to_kalyani',
    source: 'node_yerawada',
    target: 'node_kalyani_nagar',
    name: 'Kalyani Nagar Lit Commercial Avenue',
    roadClass: 'secondary',
    lengthMeters: 2300,
    explicitLit: true,
    spilloverPoiCount: 7,
    activeNightPois: 8,
    transitDistanceMeters: 60,
    emergencyDistanceMeters: 300,
    coordinates: [
      [18.5475, 73.8820],
      [18.5460, 73.8920],
      [18.5450, 73.9020]
    ]
  },
  {
    id: 'edge_kalyani_to_hadapsar',
    source: 'node_kalyani_nagar',
    target: 'node_hadapsar_magarpatta',
    name: 'Mundhwa-Magarpatta Cybercity Highway',
    roadClass: 'primary',
    lengthMeters: 4600,
    explicitLit: true,
    spilloverPoiCount: 7,
    activeNightPois: 8,
    transitDistanceMeters: 60,
    emergencyDistanceMeters: 300,
    coordinates: [
      [18.5450, 73.9020],
      [18.5290, 73.9150],
      [18.5120, 73.9280]
    ]
  },
  {
    id: 'edge_swargate_to_hadapsar',
    source: 'node_swargate',
    target: 'node_hadapsar_magarpatta',
    name: 'Solapur Road BRTS Corridor',
    roadClass: 'primary',
    lengthMeters: 7400,
    explicitLit: true,
    spilloverPoiCount: 6,
    activeNightPois: 7,
    transitDistanceMeters: 40,
    emergencyDistanceMeters: 350,
    coordinates: [
      [18.5018, 73.8586],
      [18.5060, 73.8930],
      [18.5120, 73.9280]
    ]
  },
  {
    id: 'edge_pune_station_to_yerawada',
    source: 'node_pune_station',
    target: 'node_yerawada',
    name: 'Bund Garden Road Station Corridor',
    roadClass: 'primary',
    lengthMeters: 2300,
    explicitLit: true,
    spilloverPoiCount: 7,
    activeNightPois: 8,
    transitDistanceMeters: 40,
    emergencyDistanceMeters: 180,
    coordinates: [
      [18.5284, 73.8744],
      [18.5370, 73.8780],
      [18.5475, 73.8820]
    ]
  }
];
