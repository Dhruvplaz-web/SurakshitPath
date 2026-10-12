import { DarkSpotRecord, MunicipalTicket } from '../types/routing';

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
