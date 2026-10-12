import { GraphNode, GraphEdge } from '../types/routing';

export const PUNE_NODES: Record<string, GraphNode> = {
  // Origin
  node_jspm: {
    id: 'node_jspm',
    name: 'JSPM RSCOE / Tathawade Campus',
    coordinates: [18.6186, 73.7483]
  },
  // Wakad / NH-48 nodes
  node_bhumkar_chowk: {
    id: 'node_bhumkar_chowk',
    name: 'Bhumkar Chowk (Wakad-Tathawade Junction)',
    coordinates: [18.6085, 73.7540]
  },
  node_wakad_bridge: {
    id: 'node_wakad_bridge',
    name: 'Wakad Flyover & Bridge (NH-48 Corridor)',
    coordinates: [18.5982, 73.7634]
  },
  // Interior Shortcut / Isolated Cut (Low visibility flaw)
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
  // Highway / Arterial Spine
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
  // Sus-Pashan Low Visibility Cut
  node_sus_unlit_alley: {
    id: 'node_sus_unlit_alley',
    name: 'Sus Khind Deserted Service Road',
    coordinates: [18.5410, 73.7730]
  },
  node_pashan_circle: {
    id: 'node_pashan_circle',
    name: 'Pashan Circle / NDA Road Junction',
    coordinates: [18.5360, 73.7920]
  },
  // Transit Spine via Aundh
  node_dange_chowk: {
    id: 'node_dange_chowk',
    name: 'Dange Chowk BRTS Hub',
    coordinates: [18.6112, 73.7745]
  },
  node_aundh_chest_hospital: {
    id: 'node_aundh_chest_hospital',
    name: 'Aundh Medipoint / DP Road',
    coordinates: [18.5480, 73.8110]
  },
  // University & City Hub
  node_university_circle: {
    id: 'node_university_circle',
    name: 'Pune University Gate & Circle',
    coordinates: [18.5308, 73.8288]
  },
  node_sb_road: {
    id: 'node_sb_road',
    name: 'Senapati Bapat Road / Chatushrungi',
    coordinates: [18.5250, 73.8320]
  },
  // Kothrud Destination
  node_chandani_chowk: {
    id: 'node_chandani_chowk',
    name: 'Chandani Chowk Paud Road Junction',
    coordinates: [18.5080, 73.7920]
  },
  node_kothrud_stand: {
    id: 'node_kothrud_stand',
    name: 'Kothrud Bus Stand / Karve Road Destination',
    coordinates: [18.5074, 73.8077]
  }
};

export const PUNE_EDGES: GraphEdge[] = [
  // --- HIGHWAY ARTERIAL SAFE CORRIDOR (Well-lit NH-48 & Baner) ---
  {
    id: 'edge_jspm_to_bhumkar',
    source: 'node_jspm',
    target: 'node_bhumkar_chowk',
    name: 'Tathawade-Bhumkar Highway Link',
    roadClass: 'primary',
    lengthMeters: 1350,
    explicitLit: true,
    spilloverPoiCount: 3, // HPCL pump, Decathlon, 24/7 dhaba
    activeNightPois: 4,
    transitDistanceMeters: 150,
    emergencyDistanceMeters: 650,
    coordinates: [
      [18.6186, 73.7483],
      [18.6140, 73.7505],
      [18.6085, 73.7540]
    ]
  },
  {
    id: 'edge_bhumkar_to_wakad_bridge',
    source: 'node_bhumkar_chowk',
    target: 'node_wakad_bridge',
    name: 'NH-48 Wakad Arterial Corridor',
    roadClass: 'trunk',
    lengthMeters: 1400,
    explicitLit: true,
    spilloverPoiCount: 4, // BPCL petrol pump, Indian Oil, Wakad Chowki, food mall
    activeNightPois: 6,
    transitDistanceMeters: 80,
    emergencyDistanceMeters: 300,
    coordinates: [
      [18.6085, 73.7540],
      [18.6040, 73.7580],
      [18.5982, 73.7634]
    ]
  },
  {
    id: 'edge_wakad_to_balewadi',
    source: 'node_wakad_bridge',
    target: 'node_balewadi_stadium',
    name: 'NH-48 Balewadi Stadium Express Spine',
    roadClass: 'trunk',
    lengthMeters: 2400,
    explicitLit: true,
    spilloverPoiCount: 4, // 24/7 Shell pump, Balewadi High St entrance, Jupiter Hospital nearby
    activeNightPois: 5,
    transitDistanceMeters: 120,
    emergencyDistanceMeters: 450,
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
    name: 'Baner Main Link Road',
    roadClass: 'primary',
    lengthMeters: 2300,
    explicitLit: true,
    spilloverPoiCount: 5, // Apollo 24/7, McDonalds late-drive, ATMs, lit commercial complex
    activeNightPois: 7,
    transitDistanceMeters: 100,
    emergencyDistanceMeters: 550,
    coordinates: [
      [18.5775, 73.7695],
      [18.5680, 73.7770],
      [18.5590, 73.7860]
    ]
  },
  {
    id: 'edge_baner_phata_to_mid',
    source: 'node_baner_phata',
    target: 'node_baner_road_mid',
    name: 'Baner High Street Corridor',
    roadClass: 'primary',
    lengthMeters: 1600,
    explicitLit: true,
    spilloverPoiCount: 6, // Wellness Forever 24/7, multiple lit restaurants, bank ATMs
    activeNightPois: 8,
    transitDistanceMeters: 90,
    emergencyDistanceMeters: 600,
    coordinates: [
      [18.5590, 73.7860],
      [18.5550, 73.7925],
      [18.5520, 73.7990]
    ]
  },
  {
    id: 'edge_baner_mid_to_univ',
    source: 'node_baner_road_mid',
    target: 'node_university_circle',
    name: 'Baner-Pune University Arterial Avenue',
    roadClass: 'primary',
    lengthMeters: 3800,
    explicitLit: true,
    spilloverPoiCount: 5, // Chatushrungi Police Station, SPPU Security Gate, HP pump
    activeNightPois: 6,
    transitDistanceMeters: 60,
    emergencyDistanceMeters: 250,
    coordinates: [
      [18.5520, 73.7990],
      [18.5420, 73.8120],
      [18.5308, 73.8288]
    ]
  },
  {
    id: 'edge_univ_to_sb_road',
    source: 'node_university_circle',
    target: 'node_sb_road',
    name: 'Senapati Bapat Road Boulevard',
    roadClass: 'primary',
    lengthMeters: 1100,
    explicitLit: true,
    spilloverPoiCount: 5, // JW Marriott lit frontage, police checkpost, Symbiosis gate
    activeNightPois: 7,
    transitDistanceMeters: 50,
    emergencyDistanceMeters: 200,
    coordinates: [
      [18.5308, 73.8288],
      [18.5280, 73.8305],
      [18.5250, 73.8320]
    ]
  },
  {
    id: 'edge_sb_road_to_kothrud',
    source: 'node_sb_road',
    target: 'node_kothrud_stand',
    name: 'Law College - Karve Road Connector',
    roadClass: 'primary',
    lengthMeters: 3200,
    explicitLit: true,
    spilloverPoiCount: 5, // Sahyadri Hospital, Kothrud Police Station, Wellness Forever
    activeNightPois: 7,
    transitDistanceMeters: 70,
    emergencyDistanceMeters: 180,
    coordinates: [
      [18.5250, 73.8320],
      [18.5170, 73.8210],
      [18.5074, 73.8077]
    ]
  },

  // --- DANGEROUS / UNLIT SHORTCUT ALLEY EDGES (Fastest Route traps) ---
  {
    id: 'edge_jspm_dark_cut',
    source: 'node_jspm',
    target: 'node_tathawade_dark_cut',
    name: 'Tathawade Interior Agricultural Lane (Unlit)',
    roadClass: 'alley',
    lengthMeters: 850,
    explicitLit: false,
    spilloverPoiCount: 0,
    activeNightPois: 0,
    transitDistanceMeters: 750,
    emergencyDistanceMeters: 1800,
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
    name: 'Wakad Back-Alley Dirt Connector (Deserted)',
    roadClass: 'service',
    lengthMeters: 3400,
    explicitLit: false,
    spilloverPoiCount: 0,
    activeNightPois: 0,
    transitDistanceMeters: 900,
    emergencyDistanceMeters: 1600,
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
    name: 'Sus Khind Unpaved Mountain Bypass (Pitch Dark)',
    roadClass: 'alley',
    lengthMeters: 4900,
    explicitLit: false,
    spilloverPoiCount: 0,
    activeNightPois: 0,
    transitDistanceMeters: 1200,
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
    name: 'Pashan-Chandani Unlit Hill Cut',
    roadClass: 'tertiary',
    lengthMeters: 4100,
    explicitLit: false,
    spilloverPoiCount: 1,
    activeNightPois: 1,
    transitDistanceMeters: 650,
    emergencyDistanceMeters: 1400,
    coordinates: [
      [18.5410, 73.7730],
      [18.5240, 73.7820],
      [18.5080, 73.7920]
    ]
  },
  {
    id: 'edge_chandani_to_kothrud',
    source: 'node_chandani_chowk',
    target: 'node_kothrud_stand',
    name: 'Paud Road Flyover Cut',
    roadClass: 'secondary',
    lengthMeters: 1700,
    explicitLit: true,
    spilloverPoiCount: 3,
    activeNightPois: 4,
    transitDistanceMeters: 180,
    emergencyDistanceMeters: 400,
    coordinates: [
      [18.5080, 73.7920],
      [18.5075, 73.8000],
      [18.5074, 73.8077]
    ]
  },

  // --- BALANCED TRANSIT CORRIDOR (Aundh - Pashan Circle route) ---
  {
    id: 'edge_bhumkar_to_dange',
    source: 'node_bhumkar_chowk',
    target: 'node_dange_chowk',
    name: 'Dange Chowk BRTS Link Road',
    roadClass: 'secondary',
    lengthMeters: 2300,
    explicitLit: true,
    spilloverPoiCount: 3,
    activeNightPois: 4,
    transitDistanceMeters: 90,
    emergencyDistanceMeters: 700,
    coordinates: [
      [18.6085, 73.7540],
      [18.6100, 73.7640],
      [18.6112, 73.7745]
    ]
  },
  {
    id: 'edge_dange_to_aundh',
    source: 'node_dange_chowk',
    target: 'node_aundh_chest_hospital',
    name: 'Ravet-Aundh BRTS Spine',
    roadClass: 'primary',
    lengthMeters: 7600,
    explicitLit: true,
    spilloverPoiCount: 4,
    activeNightPois: 5,
    transitDistanceMeters: 70,
    emergencyDistanceMeters: 450,
    coordinates: [
      [18.6112, 73.7745],
      [18.5800, 73.7920],
      [18.5480, 73.8110]
    ]
  },
  {
    id: 'edge_aundh_to_univ',
    source: 'node_aundh_chest_hospital',
    target: 'node_university_circle',
    name: 'Ganeshkhind Road Avenue',
    roadClass: 'primary',
    lengthMeters: 2600,
    explicitLit: true,
    spilloverPoiCount: 5,
    activeNightPois: 6,
    transitDistanceMeters: 60,
    emergencyDistanceMeters: 300,
    coordinates: [
      [18.5480, 73.8110],
      [18.5390, 73.8200],
      [18.5308, 73.8288]
    ]
  },
  {
    id: 'edge_baner_phata_to_pashan',
    source: 'node_baner_phata',
    target: 'node_pashan_circle',
    name: 'Pashan-Baner Link Road',
    roadClass: 'secondary',
    lengthMeters: 2800,
    explicitLit: true,
    spilloverPoiCount: 2,
    activeNightPois: 3,
    transitDistanceMeters: 210,
    emergencyDistanceMeters: 800,
    coordinates: [
      [18.5590, 73.7860],
      [18.5470, 73.7890],
      [18.5360, 73.7920]
    ]
  },
  {
    id: 'edge_pashan_to_chandani',
    source: 'node_pashan_circle',
    target: 'node_chandani_chowk',
    name: 'NDA-Pashan Road Connector',
    roadClass: 'secondary',
    lengthMeters: 3400,
    explicitLit: true,
    spilloverPoiCount: 2,
    activeNightPois: 2,
    transitDistanceMeters: 250,
    emergencyDistanceMeters: 900,
    coordinates: [
      [18.5360, 73.7920],
      [18.5220, 73.7910],
      [18.5080, 73.7920]
    ]
  }
];
