import React, { useMemo } from 'react';
import { useLiveShelters } from '../../services/liveShelterService';
import { SafeHaven, AppLanguage } from '../../types/routing';
import { getTranslation } from '../../services/localizationService';
import { Shield, Phone, Navigation, AlertOctagon, Radio } from 'lucide-react';

interface Props {
  currentCoordinates: [number, number];
  onRerouteToPolice: (station: SafeHaven) => void;
  currentLanguage?: AppLanguage;
}

// Comprehensive Verified Pune Police Stations & Pink Chowkis Directory
const VERIFIED_PUNE_POLICE_STATIONS: SafeHaven[] = [
  {
    id: 'haven_police_hinjawadi',
    name: 'Hinjawadi Police Station & Women Helpdesk',
    type: 'police',
    coordinates: [18.5912, 73.7389],
    address: 'Near Shivaji Chowk, Hinjawadi Phase 1 IT Park, Pune',
    timing: '24/7 Active Beat Patrol & Pink Chowki',
    contact: '020-22934200 / 112',
    trustScore: 99,
    verifiedBy: 'Maharashtra Police',
    facilities: ['Armed Beat Guard', 'CCTV Network', 'Women Helpdesk', 'Wireless PCR Link']
  },
  {
    id: 'haven_police_wakad',
    name: 'Wakad Police Station & Pink Chowki',
    type: 'police',
    coordinates: [18.6015, 73.7650],
    address: 'Near Bhujbal Chowk Flyover, Wakad, Pimpri-Chinchwad',
    timing: '24/7 Active Patrol & Damini Squad Link',
    contact: '020-27278100 / 112',
    trustScore: 99,
    verifiedBy: 'PCMC Police Commissionerate',
    facilities: ['Dedicated Damini Squad Unit', 'Pink Women Helpdesk', '24/7 Patrol PCR Vans', 'Safe Hold Area']
  },
  {
    id: 'haven_police_baner',
    name: 'Baner Police Chowki (Chatushrungi Division)',
    type: 'police',
    coordinates: [18.5590, 73.7890],
    address: 'Baner High Street, near Balewadi Phata, Pune',
    timing: '24/7 Police Outpost & Night Beat',
    contact: '020-25652835 / 112',
    trustScore: 98,
    verifiedBy: 'Pune City Police',
    facilities: ['24/7 PCR Patrol', 'Emergency Women Desk', 'Direct Wireless Dispatch']
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
    id: 'haven_police_deccan',
    name: 'Deccan Gymkhana Police Station (FC Road Beat)',
    type: 'police',
    coordinates: [18.5185, 73.8420],
    address: 'Prabhat Road / FC Road Junction, Deccan, Pune',
    timing: '24/7 Women Safety Helpdesk & Rapid PCR',
    contact: '020-25675005 / 112',
    trustScore: 99,
    verifiedBy: 'Pune City Police',
    facilities: ['24/7 Lady Police Officer', 'Damini Squad Patrol', 'CCTV Monitoring Room']
  },
  {
    id: 'haven_police_kothrud',
    name: 'Kothrud Police Station & Damini Squad Chowki',
    type: 'police',
    coordinates: [18.5085, 73.8040],
    address: 'Near Kothrud Stand, Paud Road, Pune',
    timing: '24/7 Police Station',
    contact: '020-25383500 / 112',
    trustScore: 98,
    verifiedBy: 'Pune City Police',
    facilities: ['24/7 Active Officers', 'Beat Van Dispatch', 'Lit Compound', 'Emergency Triage']
  },
  {
    id: 'haven_police_pimpri',
    name: 'Pimpri Police Station & PCR Hub',
    type: 'police',
    coordinates: [18.6250, 73.8020],
    address: 'Old Mumbai-Pune Highway, Pimpri Chowk',
    timing: '24/7 Police Station',
    contact: '020-27412323 / 112',
    trustScore: 98,
    verifiedBy: 'PCMC Police Commissionerate',
    facilities: ['24/7 Armed Sentry', 'Damini Patrol', 'CCTV Network']
  },
  {
    id: 'haven_police_ravet',
    name: 'Ravet-Kiwale Police Outpost (Expressway Link)',
    type: 'police',
    coordinates: [18.6480, 73.7380],
    address: 'Near Mukai Chowk, Ravet, Pune',
    timing: '24/7 Highway Patrol Chowki',
    contact: '020-27650100 / 112',
    trustScore: 97,
    verifiedBy: 'PCMC Police',
    facilities: ['Highway Patrol PCR', '24/7 Lighting', 'Emergency First Response']
  },
  {
    id: 'haven_police_swargate',
    name: 'Swargate Police Station',
    type: 'police',
    coordinates: [18.5015, 73.8580],
    address: 'Near Swargate Bus Stand & Metro Station, Pune',
    timing: '24/7 Police Station',
    contact: '020-24440100 / 112',
    trustScore: 98,
    verifiedBy: 'Pune City Police',
    facilities: ['Transit Beat Patrol', 'Women Helpdesk', '24/7 Sentry']
  }
];

export const NearestPoliceCard: React.FC<Props> = ({
  currentCoordinates,
  onRerouteToPolice,
  currentLanguage = 'en'
}) => {
  const t = getTranslation(currentLanguage);
  const { havens: liveHavens } = useLiveShelters(currentCoordinates);

  // Dynamically compute closest police station in REAL TIME using currentCoordinates
  const { station, distanceMeters } = useMemo(() => {
    // 1. Merge live Overpass police stations with verified directory
    const livePolice = liveHavens.filter(h => h.type === 'police');
    const existingIds = new Set(livePolice.map(p => p.id));
    const allPolice = [...livePolice, ...VERIFIED_PUNE_POLICE_STATIONS.filter(p => !existingIds.has(p.id))];

    let closest = allPolice[0] || VERIFIED_PUNE_POLICE_STATIONS[0];
    let minDistSq = Infinity;

    for (const p of allPolice) {
      const dLat = (p.coordinates[0] - currentCoordinates[0]) * 111000;
      const dLng = (p.coordinates[1] - currentCoordinates[1]) * 105000;
      const distSq = dLat * dLat + dLng * dLng;

      if (distSq < minDistSq) {
        minDistSq = distSq;
        closest = p;
      }
    }

    return {
      station: closest,
      distanceMeters: Math.round(Math.sqrt(minDistSq))
    };
  }, [currentCoordinates[0], currentCoordinates[1], liveHavens]);

  // Extract direct phone digits for tel: link
  const rawPhone = (station.contact || '112').split('/')[0].replace(/[^0-9]/g, '');
  const walkingEtaMinutes = Math.max(1, Math.ceil(distanceMeters / 75));
  const drivingEtaMinutes = Math.max(1, Math.ceil(distanceMeters / 450));

  const policeSubtitle = currentLanguage === 'mr'
    ? 'पुणे शहर पोलीस बीट गस्त'
    : currentLanguage === 'hi'
      ? 'पुणे नगर पुलिस गश्ती दल'
      : 'Pune City Police Beat Patrol';

  const callStationLabel = currentLanguage === 'mr'
    ? 'ठाण्यात कॉल करा'
    : currentLanguage === 'hi'
      ? 'थाने में कॉल करें'
      : 'Call Station';

  const rerouteLabel = currentLanguage === 'mr'
    ? 'मार्ग वळवा'
    : currentLanguage === 'hi'
      ? 'मार्ग बदलें'
      : 'Reroute Here';

  return (
    <div
      style={{
        backgroundColor: 'rgba(30, 58, 138, 0.14)',
        border: '1px solid rgba(59, 130, 246, 0.35)',
        borderRadius: 'var(--radius-lg)',
        padding: '12px 14px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        boxShadow: '0 2px 12px rgba(30, 58, 138, 0.15)',
        transition: 'border-color 0.2s ease'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '6px',
              backgroundColor: 'rgba(59, 130, 246, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--haven-blue)'
            }}
          >
            <Shield size={16} />
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>{t.nearestPolice}</span>
              <span style={{ fontSize: '9px', fontWeight: 800, color: 'var(--safe-emerald)', backgroundColor: 'rgba(16, 185, 129, 0.15)', padding: '1px 6px', borderRadius: '4px', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                <Radio size={9} className="animate-pulse" />
                LIVE SYNC
              </span>
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
              {policeSubtitle} · ~{walkingEtaMinutes} min walk ({drivingEtaMinutes} min PCR drive)
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span
            className="mono-num"
            style={{
              fontSize: '11px',
              fontWeight: 800,
              color: 'var(--haven-blue)',
              backgroundColor: 'rgba(59, 130, 246, 0.12)',
              padding: '2px 6px',
              borderRadius: '4px',
              border: '1px solid rgba(59, 130, 246, 0.3)'
            }}
          >
            {distanceMeters < 1000 ? `${distanceMeters}m` : `${(distanceMeters / 1000).toFixed(1)}km`}
          </span>
          <span
            style={{
              fontSize: '9px',
              fontWeight: 700,
              backgroundColor: 'rgba(16, 185, 129, 0.2)',
              color: 'var(--safe-emerald)',
              padding: '2px 6px',
              borderRadius: '4px',
              textTransform: 'uppercase'
            }}
          >
            {t.open24x7 || '24/7 OPEN'}
          </span>
        </div>
      </div>

      <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
        <strong style={{ color: '#fff' }}>{station.name}</strong> · {station.address}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
        {/* Direct Call to Station */}
        <a
          href={`tel:${rawPhone}`}
          className="btn-civic"
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            padding: '6px 10px',
            fontSize: '11px',
            fontWeight: 700,
            textDecoration: 'none',
            backgroundColor: 'rgba(59, 130, 246, 0.18)',
            borderColor: 'rgba(59, 130, 246, 0.4)',
            color: '#60a5fa'
          }}
          title={`Call ${station.name} at ${station.contact}`}
        >
          <Phone size={12} />
          <span>{callStationLabel}</span>
        </a>

        {/* 1-Tap Emergency Reroute */}
        <button
          type="button"
          onClick={() => onRerouteToPolice(station)}
          className="btn-civic"
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            padding: '6px 10px',
            fontSize: '11px',
            fontWeight: 700,
            backgroundColor: 'rgba(245, 158, 11, 0.18)',
            borderColor: 'rgba(245, 158, 11, 0.4)',
            color: 'var(--accent-amber)'
          }}
          title="Directly reroute active journey to this police outpost via safest illuminated path"
        >
          <Navigation size={12} />
          <span>{rerouteLabel}</span>
        </button>

        {/* 112 National Emergency Helpline */}
        <a
          href="tel:112"
          className="btn-civic"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
            padding: '6px 10px',
            fontSize: '11px',
            fontWeight: 800,
            textDecoration: 'none',
            backgroundColor: 'rgba(239, 68, 68, 0.2)',
            borderColor: 'rgba(239, 68, 68, 0.5)',
            color: '#f87171'
          }}
          title="Call 112 All-India National Emergency Helpline"
        >
          <AlertOctagon size={12} />
          <span>112</span>
        </a>
      </div>
    </div>
  );
};
