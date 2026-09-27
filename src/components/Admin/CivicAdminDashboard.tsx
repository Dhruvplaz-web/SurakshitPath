import React, { useState } from 'react';
import {
  PUNE_DARK_SPOTS,
  INITIAL_MUNICIPAL_TICKETS,
  PUNE_MUNICIPAL_ROAD_PROJECTS,
  PUNE_CRIME_PRONE_ZONES
} from '../../data/civicAdminData';
import { MunicipalTicket, CitizenReport } from '../../types/routing';
import {
  Building,
  CheckCircle2,
  Wrench,
  ShieldAlert,
  Download,
  Construction,
  Filter,
  ExternalLink,
  MapPin,
  Camera,
  Mic,
  Eye,
  Sparkles
} from 'lucide-react';

interface Props {
  onHighlightEdge: (edgeId: string) => void;
  citizenReports?: CitizenReport[];
  onUpdateCitizenReport?: (reportId: string, newStatus: CitizenReport['status']) => void;
}

type AdminTab = 'dark_spots' | 'roads' | 'crime' | 'tickets';

export const CivicAdminDashboard: React.FC<Props> = ({
  onHighlightEdge,
  citizenReports = [],
  onUpdateCitizenReport
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('dark_spots');
  const [selectedWard, setSelectedWard] = useState<string>('all');
  const [tickets, setTickets] = useState<MunicipalTicket[]>(INITIAL_MUNICIPAL_TICKETS);
  const [dispatchedWorkOrders, setDispatchedWorkOrders] = useState<string[]>([]);
  const [roadProjects] = useState(PUNE_MUNICIPAL_ROAD_PROJECTS);
  const [reportStatuses, setReportStatuses] = useState<Record<string, CitizenReport['status']>>({});

  const activeReports = citizenReports.map(r => ({
    ...r,
    status: reportStatuses[r.id] || r.status
  }));

  const pendingCitizenCount = activeReports.filter(r => r.status !== 'resolved').length;

  const handleDispatchReport = (rep: CitizenReport) => {
    setReportStatuses(prev => ({ ...prev, [rep.id]: 'investigating' }));
    onUpdateCitizenReport?.(rep.id, 'investigating');
    const newTicket: MunicipalTicket = {
      id: `TICK-${rep.id.replace(/[^a-zA-Z0-9]/g, '').slice(-4) || 'LIVE'}`,
      title: `[Citizen Ingest] ${rep.title}`,
      category: rep.category === 'broken_lamp' ? 'broken_lamp' : 'dark_stretch',
      locationName: rep.landmarkName,
      ward: selectedWard !== 'all' ? selectedWard : 'PCMC Ward 21 / PMC Ward 9',
      reportedAt: 'Just now (Ingested by PMC)',
      status: 'in_progress',
      upvotes: rep.upvotes || 1,
      edgeId: 'edge_jspm_dark_cut'
    };
    setTickets(prev => [newTicket, ...prev]);
  };

  const handleResolveReport = (reportId: string) => {
    setReportStatuses(prev => ({ ...prev, [reportId]: 'resolved' }));
    onUpdateCitizenReport?.(reportId, 'resolved');
  };

  // Filter dark spots by ward
  const filteredDarkSpots = PUNE_DARK_SPOTS.filter(s =>
    selectedWard === 'all' ? true : s.ward.toLowerCase().includes(selectedWard.toLowerCase())
  );

  // Filter road projects by ward
  const filteredRoadProjects = roadProjects.filter(p =>
    selectedWard === 'all' ? true : p.ward.toLowerCase().includes(selectedWard.toLowerCase())
  );

  // Filter crime zones by ward
  const filteredCrimeZones = PUNE_CRIME_PRONE_ZONES.filter(c =>
    selectedWard === 'all' ? true : c.ward.toLowerCase().includes(selectedWard.toLowerCase())
  );

  // Filter tickets by ward
  const filteredTickets = tickets.filter(t =>
    selectedWard === 'all' ? true : t.ward.toLowerCase().includes(selectedWard.toLowerCase())
  );

  const handleExportAuditJson = () => {
    const reportData = {
      agency: 'Pune Municipal Corporation (PMC) & Pimpri Chinchwad Municipal Corporation (PCMC)',
      auditTitle: 'Pune Urban Night Mobility & Municipal Infrastructure Assessment 2026',
      generatedAt: new Date().toISOString(),
      coverageZone: 'Tathawade / Hinjawadi ⇄ Baner ⇄ Kothrud Urban Corridors',
      sdgAlignment: ['SDG 5: Gender Equality', 'SDG 11: Sustainable Cities & Communities'],
      kpiSummary: {
        totalDarkSpotDistanceKm: 13.2,
        activeSmartPoles: 1692,
        offlineSmartPoles: 148,
        uptimePercentage: 91.95,
        totalRoadProjectsBudgetINR: '₹ 15.45 Cr',
        criticalCrimeCorridors: PUNE_CRIME_PRONE_ZONES.length,
        estimatedCapExRetrofitINR: '₹ 1,85,00,000'
      },
      prioritizedDarkSpots: PUNE_DARK_SPOTS,
      municipalRoadProjects: roadProjects,
      crimeProneZones: PUNE_CRIME_PRONE_ZONES,
      citizenTickets: tickets,
      recentCommunityReports: citizenReports
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PMC_PCMC_Master_Municipal_Audit_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportGeoJson = () => {
    const featureCollection = {
      type: 'FeatureCollection',
      metadata: {
        generator: 'SurakshitPath Municipal SCADA Defect Cockpit (PMC / PCMC)',
        exportedAt: new Date().toISOString(),
        totalDarkSpotSegments: PUNE_DARK_SPOTS.length,
        totalRoadProjects: roadProjects.length,
        totalCrimeProneZones: PUNE_CRIME_PRONE_ZONES.length,
        sdgTarget: 'UN SDG 11: Sustainable Cities and Communities'
      },
      features: [
        ...PUNE_DARK_SPOTS.map(spot => ({
          type: 'Feature',
          properties: {
            layer: 'DarkSpot_Streetlight_Outage',
            edgeId: spot.edgeId,
            name: spot.name,
            ward: spot.ward,
            roadClass: spot.roadClass,
            lengthMeters: spot.lengthMeters,
            priorityScore: spot.priorityScore,
            lightingFactor: spot.lightingFactor,
            suggestedAction: spot.suggestedAction,
            workOrderStatus: dispatchedWorkOrders.includes(spot.edgeId) ? 'DISPATCHED' : 'PENDING_APPROVAL'
          },
          geometry: {
            type: 'LineString',
            coordinates: spot.coordinates.map(c => [c[1], c[0]])
          }
        })),
        ...roadProjects.map(proj => ({
          type: 'Feature',
          properties: {
            layer: 'Municipal_Road_Development',
            projectId: proj.id,
            name: proj.name,
            ward: proj.ward,
            budgetINR: proj.budgetINR,
            status: proj.status,
            contractor: proj.contractor,
            completionPercent: proj.completionPercent,
            roadQualityIndex: proj.roadQualityIndex
          },
          geometry: {
            type: 'LineString',
            coordinates: proj.coordinates.map(c => [c[1], c[0]])
          }
        })),
        ...PUNE_CRIME_PRONE_ZONES.map(cz => ({
          type: 'Feature',
          properties: {
            layer: 'Crime_Prone_Night_Zone',
            zoneId: cz.id,
            zoneName: cz.zoneName,
            ward: cz.ward,
            riskLevel: cz.riskLevel,
            policeChowki: cz.policeChowki,
            patrolFrequency: cz.patrolFrequency,
            incidentTypes: cz.incidentTypes.join(', ')
          },
          geometry: {
            type: 'LineString',
            coordinates: cz.coordinates.map(c => [c[1], c[0]])
          }
        }))
      ]
    };

    const blob = new Blob([JSON.stringify(featureCollection, null, 2)], { type: 'application/geo+json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PMC_PCMC_Municipal_GIS_Layers_${Date.now()}.geojson`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportCsv = () => {
    const headers = [
      'Layer_Type',
      'Entity_ID',
      'Location_Name',
      'Ward',
      'Metric_1',
      'Metric_2',
      'Suggested_Intervention_Or_Contractor',
      'Status'
    ];

    const darkSpotRows = PUNE_DARK_SPOTS.map(spot => [
      '"Dark_Spot"',
      `"${spot.edgeId}"`,
      `"${spot.name}"`,
      `"${spot.ward}"`,
      `"${spot.lengthMeters}m"`,
      `"Priority: ${spot.priorityScore}/100"`,
      `"${spot.suggestedAction}"`,
      dispatchedWorkOrders.includes(spot.edgeId) ? '"DISPATCHED"' : '"PENDING"'
    ]);

    const roadRows = roadProjects.map(proj => [
      '"Road_Development"',
      `"${proj.id}"`,
      `"${proj.name}"`,
      `"${proj.ward}"`,
      `"${proj.budgetINR}"`,
      `"Progress: ${proj.completionPercent}%"`,
      `"${proj.contractor}"`,
      `"${proj.status.toUpperCase()}"`
    ]);

    const crimeRows = PUNE_CRIME_PRONE_ZONES.map(cz => [
      '"Crime_Prone_Zone"',
      `"${cz.id}"`,
      `"${cz.zoneName}"`,
      `"${cz.ward}"`,
      `"Risk: ${cz.riskLevel.toUpperCase()}"`,
      `"Incidents: ${cz.pastIncidents30d}/30d"`,
      `"${cz.safetyAction}"`,
      `"${cz.policeChowki}"`
    ]);

    const csvContent = [headers.join(','), ...darkSpotRows.map(r => r.join(',')), ...roadRows.map(r => r.join(',')), ...crimeRows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PMC_PCMC_Municipal_Infrastructure_Data_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleUpdateTicketStatus = (ticketId: string, newStatus: MunicipalTicket['status']) => {
    setTickets(prev =>
      prev.map(t => (t.id === ticketId ? { ...t, status: newStatus } : t))
    );
  };

  const handleIssueWorkOrder = (edgeId: string) => {
    if (!dispatchedWorkOrders.includes(edgeId)) {
      setDispatchedWorkOrders(prev => [...prev, edgeId]);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* Header Banner */}
      <div
        style={{
          backgroundColor: 'rgba(245, 158, 11, 0.08)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          borderRadius: 'var(--radius-lg)',
          padding: '12px 14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: 'var(--shadow-subtle)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: 'rgba(245, 158, 11, 0.18)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-amber)'
            }}
          >
            <Building size={18} />
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-primary)' }}>
              Pune Municipal Civic Cockpit (PMC &amp; PCMC)
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Urban Roads, Streetlight SCADA &amp; Night Crime Prevention
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span
            style={{
              fontSize: '10px',
              fontWeight: 800,
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              color: 'var(--safe-emerald)',
              padding: '2px 8px',
              borderRadius: '4px',
              border: '1px solid var(--safe-emerald)'
            }}
          >
            SCADA ACTIVE
          </span>
          <span
            style={{
              fontSize: '10px',
              fontWeight: 700,
              backgroundColor: 'rgba(59, 130, 246, 0.15)',
              color: 'var(--haven-blue)',
              padding: '2px 8px',
              borderRadius: '4px',
              border: '1px solid var(--haven-blue)'
            }}
          >
            SDG 11
          </span>
        </div>
      </div>

      {/* Live Citizen Hazard Ingestion Notice */}
      {pendingCitizenCount > 0 && (
        <div
          onClick={() => setActiveTab('tickets')}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'rgba(239, 68, 68, 0.08)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            borderRadius: 'var(--radius-md)',
            padding: '10px 14px',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
          title="Click to triage incoming commuter hazard reports"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '18px' }}>🚨</span>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--danger-crimson)' }}>
                {pendingCitizenCount} Live Citizen Hazard {pendingCitizenCount === 1 ? 'Report' : 'Reports'} Ingested
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                Real-time commuter hazard submissions awaiting municipal engineering review
              </div>
            </div>
          </div>

          <button
            type="button"
            className="btn-civic"
            style={{
              padding: '4px 10px',
              fontSize: '11px',
              fontWeight: 700,
              backgroundColor: 'var(--danger-crimson)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px'
            }}
          >
            Review Reports →
          </button>
        </div>
      )}

      {/* Ward Filter Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'var(--surface-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '8px 12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>
          <Filter size={13} color="var(--accent-amber)" />
          <span>Municipal Ward Filter:</span>
        </div>

        <select
          value={selectedWard}
          onChange={(e) => setSelectedWard(e.target.value)}
          style={{
            backgroundColor: 'var(--surface-elevated)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-medium)',
            borderRadius: '6px',
            padding: '4px 8px',
            fontSize: '11px',
            fontWeight: 600,
            outline: 'none',
            cursor: 'pointer'
          }}
          aria-label="Filter by Pune Municipal Ward"
        >
          <option value="all">All Wards (Pune &amp; PCMC)</option>
          <option value="ward 9">PMC Ward 9 (Baner-Balewadi-Pashan)</option>
          <option value="ward 21">PCMC Ward 21 (Tathawade-Punawale)</option>
          <option value="ward 24">PCMC Ward 24 (Wakad-Hinjawadi Link)</option>
          <option value="ward 12">PMC Ward 12 (Kothrud-Bavdhan)</option>
        </select>
      </div>

      {/* 5-Metric Civic Infrastructure KPI Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px' }}>
        <div
          style={{
            backgroundColor: 'var(--surface-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '8px 6px',
            textAlign: 'center'
          }}
        >
          <div style={{ fontSize: '9px', color: 'var(--text-muted)', fontWeight: 700 }}>DARK SPOTS</div>
          <div className="mono-num" style={{ fontSize: '15px', fontWeight: 800, color: 'var(--danger-crimson)' }}>
            {filteredDarkSpots.length}
          </div>
          <div style={{ fontSize: '8px', color: 'var(--text-secondary)' }}>13.2km unlit</div>
        </div>

        <div
          style={{
            backgroundColor: 'var(--surface-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '8px 6px',
            textAlign: 'center'
          }}
        >
          <div style={{ fontSize: '9px', color: 'var(--text-muted)', fontWeight: 700 }}>SMART POLES</div>
          <div className="mono-num" style={{ fontSize: '15px', fontWeight: 800, color: 'var(--safe-emerald)' }}>
            91.9%
          </div>
          <div style={{ fontSize: '8px', color: 'var(--text-secondary)' }}>148 offline</div>
        </div>

        <div
          style={{
            backgroundColor: 'var(--surface-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '8px 6px',
            textAlign: 'center'
          }}
        >
          <div style={{ fontSize: '9px', color: 'var(--text-muted)', fontWeight: 700 }}>ROAD WORKS</div>
          <div className="mono-num" style={{ fontSize: '15px', fontWeight: 800, color: 'var(--accent-amber)' }}>
            {filteredRoadProjects.length}
          </div>
          <div style={{ fontSize: '8px', color: 'var(--text-secondary)' }}>₹15.4 Cr</div>
        </div>

        <div
          style={{
            backgroundColor: 'var(--surface-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '8px 6px',
            textAlign: 'center'
          }}
        >
          <div style={{ fontSize: '9px', color: 'var(--text-muted)', fontWeight: 700 }}>CRIME ZONES</div>
          <div className="mono-num" style={{ fontSize: '15px', fontWeight: 800, color: 'var(--haven-blue)' }}>
            {filteredCrimeZones.length}
          </div>
          <div style={{ fontSize: '8px', color: 'var(--text-secondary)' }}>Police Beats</div>
        </div>

        <div
          onClick={() => setActiveTab('tickets')}
          style={{
            backgroundColor: pendingCitizenCount > 0 ? 'rgba(239, 68, 68, 0.08)' : 'var(--surface-card)',
            border: pendingCitizenCount > 0 ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '8px 6px',
            textAlign: 'center',
            cursor: 'pointer'
          }}
        >
          <div style={{ fontSize: '9px', color: pendingCitizenCount > 0 ? 'var(--danger-crimson)' : 'var(--text-muted)', fontWeight: 700 }}>CITIZEN LIVE</div>
          <div className="mono-num" style={{ fontSize: '15px', fontWeight: 800, color: pendingCitizenCount > 0 ? 'var(--danger-crimson)' : 'var(--accent-amber)' }}>
            {citizenReports.length}
          </div>
          <div style={{ fontSize: '8px', color: pendingCitizenCount > 0 ? 'var(--danger-crimson)' : 'var(--text-secondary)' }}>
            {pendingCitizenCount} pending
          </div>
        </div>
      </div>

      {/* 4-Way Tab Switcher */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          backgroundColor: 'var(--surface-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '3px',
          gap: '2px'
        }}
      >
        <button
          type="button"
          onClick={() => setActiveTab('dark_spots')}
          style={{
            padding: '6px 4px',
            fontSize: '11px',
            fontWeight: 700,
            borderRadius: '4px',
            border: 'none',
            cursor: 'pointer',
            backgroundColor: activeTab === 'dark_spots' ? 'var(--accent-amber)' : 'transparent',
            color: activeTab === 'dark_spots' ? '#000000' : 'var(--text-muted)',
            transition: 'all 0.15s ease'
          }}
        >
          Streetlights
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('roads')}
          style={{
            padding: '6px 4px',
            fontSize: '11px',
            fontWeight: 700,
            borderRadius: '4px',
            border: 'none',
            cursor: 'pointer',
            backgroundColor: activeTab === 'roads' ? 'var(--accent-amber)' : 'transparent',
            color: activeTab === 'roads' ? '#000000' : 'var(--text-muted)',
            transition: 'all 0.15s ease'
          }}
        >
          Road Works
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('crime')}
          style={{
            padding: '6px 4px',
            fontSize: '11px',
            fontWeight: 700,
            borderRadius: '4px',
            border: 'none',
            cursor: 'pointer',
            backgroundColor: activeTab === 'crime' ? 'var(--accent-amber)' : 'transparent',
            color: activeTab === 'crime' ? '#000000' : 'var(--text-muted)',
            transition: 'all 0.15s ease'
          }}
        >
          Crime Zones
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('tickets')}
          style={{
            padding: '6px 4px',
            fontSize: '11px',
            fontWeight: 700,
            borderRadius: '4px',
            border: 'none',
            cursor: 'pointer',
            backgroundColor: activeTab === 'tickets' ? 'var(--accent-amber)' : 'transparent',
            color: activeTab === 'tickets' ? '#000000' : 'var(--text-muted)',
            transition: 'all 0.15s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px'
          }}
        >
          <span>Citizen Triage</span>
          {pendingCitizenCount > 0 && (
            <span
              style={{
                backgroundColor: 'var(--danger-crimson)',
                color: '#ffffff',
                fontSize: '9px',
                fontWeight: 800,
                padding: '1px 5px',
                borderRadius: '999px'
              }}
            >
              {pendingCitizenCount}
            </span>
          )}
        </button>
      </div>

      {/* Export Action Strip */}
      <div
        style={{
          display: 'flex',
          gap: '6px',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'var(--surface-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '8px 12px'
        }}
      >
        <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 700 }}>
          EXPORT FOR ENGINEERING DEPT:
        </span>

        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            type="button"
            onClick={handleExportGeoJson}
            className="btn-civic btn-primary-amber"
            style={{ padding: '4px 8px', fontSize: '10px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}
            title="Export GeoJSON layers for QGIS / ArcGIS"
          >
            <Download size={11} /> GeoJSON
          </button>

          <button
            type="button"
            onClick={handleExportCsv}
            className="btn-civic"
            style={{ padding: '4px 8px', fontSize: '10px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}
            title="Export CSV spreadsheet"
          >
            <Download size={11} /> CSV
          </button>

          <button
            type="button"
            onClick={handleExportAuditJson}
            className="btn-civic"
            style={{ padding: '4px 8px', fontSize: '10px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}
            title="Export JSON audit"
          >
            <Download size={11} /> JSON
          </button>
        </div>
      </div>

      {/* TAB 1: STREETLIGHTS & DARK SPOTS */}
      {activeTab === 'dark_spots' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 4px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)' }}>
              PRIORITIZED UNLIT CORRIDORS ({filteredDarkSpots.length})
            </span>
            <span style={{ fontSize: '10px', color: 'var(--accent-amber)' }}>
              Click stretch to zoom map
            </span>
          </div>

          {filteredDarkSpots.map((spot) => {
            const isWorkOrderIssued = dispatchedWorkOrders.includes(spot.edgeId);

            return (
              <div
                key={spot.edgeId}
                style={{
                  backgroundColor: 'var(--surface-elevated)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '10px 12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <button
                      type="button"
                      onClick={() => onHighlightEdge(spot.edgeId)}
                      style={{
                        background: 'none',
                        border: 'none',
                        padding: 0,
                        textAlign: 'left',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: 700,
                        color: 'var(--accent-amber)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                      title="Click to zoom & highlight this road stretch on the map"
                    >
                      <span>{spot.name}</span>
                      <ExternalLink size={10} />
                    </button>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {spot.ward} · Length: <strong style={{ color: 'var(--text-primary)' }}>{spot.lengthMeters}m</strong>
                    </div>
                  </div>

                  <div
                    style={{
                      backgroundColor: 'rgba(239, 68, 68, 0.15)',
                      color: 'var(--danger-crimson)',
                      border: '1px solid var(--danger-crimson)',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontSize: '10px',
                      fontWeight: 800
                    }}
                  >
                    Risk: {spot.priorityScore}/100
                  </div>
                </div>

                <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                  <strong>Suggested Action:</strong> {spot.suggestedAction}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2px' }}>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                    Illumination Factor: <strong style={{ color: 'var(--danger-crimson)' }}>{(spot.lightingFactor * 100).toFixed(0)}%</strong>
                  </span>

                  <button
                    type="button"
                    onClick={() => handleIssueWorkOrder(spot.edgeId)}
                    className="btn-civic"
                    style={{
                      padding: '3px 8px',
                      fontSize: '10px',
                      backgroundColor: isWorkOrderIssued ? 'rgba(16, 185, 129, 0.2)' : 'var(--surface-hover)',
                      color: isWorkOrderIssued ? 'var(--safe-emerald)' : 'var(--text-primary)',
                      borderColor: isWorkOrderIssued ? 'var(--safe-emerald)' : 'var(--border-subtle)'
                    }}
                  >
                    {isWorkOrderIssued ? (
                      <>
                        <CheckCircle2 size={10} /> Tender #TND-{spot.edgeId.slice(-4)} Dispatched
                      </>
                    ) : (
                      <>
                        <Wrench size={10} /> Issue Streetlight Tender
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: ROAD DEVELOPMENT PROJECTS */}
      {activeTab === 'roads' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 4px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)' }}>
              MUNICIPAL ROAD PROJECTS ({filteredRoadProjects.length})
            </span>
            <span style={{ fontSize: '10px', color: 'var(--safe-emerald)' }}>
              Pavement Index (PCI)
            </span>
          </div>

          {filteredRoadProjects.map((proj) => {
            const statusColor = proj.status === 'completed' ? 'var(--safe-emerald)' : proj.status === 'in_progress' ? 'var(--accent-amber)' : 'var(--haven-blue)';

            return (
              <div
                key={proj.id}
                style={{
                  backgroundColor: 'var(--surface-elevated)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '10px 12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <button
                      type="button"
                      onClick={() => onHighlightEdge(proj.edgeId)}
                      style={{
                        background: 'none',
                        border: 'none',
                        padding: 0,
                        textAlign: 'left',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: 700,
                        color: 'var(--text-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                      title="Inspect road alignment on map"
                    >
                      <Construction size={13} color="var(--accent-amber)" />
                      <span>{proj.name}</span>
                    </button>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      [{proj.id}] · {proj.ward}
                    </div>
                  </div>

                  <span
                    style={{
                      fontSize: '9px',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      color: statusColor,
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      border: `1px solid ${statusColor}`
                    }}
                  >
                    {proj.status.replace('_', ' ')}
                  </span>
                </div>

                {/* Progress Bar & Budget */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-secondary)' }}>
                    <span>Progress: <strong style={{ color: '#fff' }}>{proj.completionPercent}%</strong></span>
                    <span>Budget: <strong style={{ color: 'var(--accent-amber)' }}>{proj.budgetINR}</strong></span>
                  </div>
                  <div style={{ width: '100%', height: '5px', backgroundColor: 'rgba(255, 255, 255, 0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${proj.completionPercent}%`,
                        height: '100%',
                        backgroundColor: proj.completionPercent === 100 ? 'var(--safe-emerald)' : 'var(--accent-amber)',
                        borderRadius: '3px',
                        transition: 'width 0.3s ease'
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '10px', color: 'var(--text-muted)', paddingTop: '2px' }}>
                  <span>Contractor: <strong style={{ color: 'var(--text-secondary)' }}>{proj.contractor}</strong></span>
                  <span>Target: <strong style={{ color: 'var(--text-primary)' }}>{proj.targetDate}</strong></span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 3: CRIME-PRONE ZONES (POLICE RECORDS) */}
      {activeTab === 'crime' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 4px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)' }}>
              POLICE BEAT CRIME ZONES ({filteredCrimeZones.length})
            </span>
            <span style={{ fontSize: '10px', color: 'var(--danger-crimson)' }}>
              High Nocturnal Risk
            </span>
          </div>

          {filteredCrimeZones.map((cz) => {
            const riskBadgeColor = cz.riskLevel === 'critical' ? 'var(--danger-crimson)' : cz.riskLevel === 'high' ? 'var(--accent-amber)' : 'var(--haven-blue)';

            return (
              <div
                key={cz.id}
                style={{
                  backgroundColor: 'var(--surface-elevated)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '10px 12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <button
                      type="button"
                      onClick={() => onHighlightEdge(cz.edgeId)}
                      style={{
                        background: 'none',
                        border: 'none',
                        padding: 0,
                        textAlign: 'left',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: 700,
                        color: 'var(--text-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                      title="Inspect crime risk stretch on map"
                    >
                      <ShieldAlert size={13} color="var(--danger-crimson)" />
                      <span>{cz.zoneName}</span>
                    </button>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {cz.ward} · {cz.policeChowki}
                    </div>
                  </div>

                  <span
                    style={{
                      fontSize: '9px',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      color: riskBadgeColor,
                      backgroundColor: 'rgba(239, 68, 68, 0.12)',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      border: `1px solid ${riskBadgeColor}`
                    }}
                  >
                    {cz.riskLevel} Risk
                  </span>
                </div>

                {/* Incident Types Pills */}
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                  {cz.incidentTypes.map((inc, i) => (
                    <span
                      key={i}
                      style={{
                        fontSize: '9px',
                        padding: '1px 5px',
                        borderRadius: '3px',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid var(--border-subtle)',
                        color: 'var(--text-secondary)'
                      }}
                    >
                      ⚠️ {inc}
                    </span>
                  ))}
                </div>

                <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                  <strong>Mandated Action:</strong> {cz.safetyAction}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '10px', color: 'var(--text-muted)' }}>
                  <span>Patrol: <strong style={{ color: 'var(--safe-emerald)' }}>{cz.patrolFrequency}</strong></span>
                  <span className="mono-num" style={{ color: 'var(--danger-crimson)', fontWeight: 700 }}>
                    {cz.pastIncidents30d} incidents in 30d
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 4: CITIZEN TRIAGE QUEUE */}
      {activeTab === 'tickets' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 4px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)' }}>
              CITIZEN SAFETY REPORTS &amp; TRIAGE ({filteredTickets.length + activeReports.length})
            </span>
            <span style={{ fontSize: '10px', color: 'var(--safe-emerald)' }}>
              PMC / PCMC Rapid Response
            </span>
          </div>

          {activeReports.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ fontSize: '10px', color: 'var(--accent-amber)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                ⭐ Live Ingested Commuter Reports ({activeReports.length})
              </div>
              {activeReports.map(rep => {
                const isResolved = rep.status === 'resolved';
                const isInvestigating = rep.status === 'investigating';
                const urgencyColor = rep.urgency === 'high' ? 'var(--danger-crimson)' : rep.urgency === 'medium' ? 'var(--accent-amber)' : 'var(--haven-blue)';

                return (
                  <div
                    key={rep.id}
                    style={{
                      backgroundColor: isResolved ? 'rgba(16, 185, 129, 0.05)' : isInvestigating ? 'rgba(245, 158, 11, 0.08)' : 'rgba(239, 68, 68, 0.08)',
                      border: `1px solid ${isResolved ? 'var(--safe-emerald)' : isInvestigating ? 'var(--accent-amber)' : 'rgba(239, 68, 68, 0.4)'}`,
                      borderRadius: '8px',
                      padding: '10px 12px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                          <span style={{
                            fontSize: '9px',
                            fontWeight: 800,
                            padding: '1px 6px',
                            borderRadius: '4px',
                            backgroundColor: `${urgencyColor}25`,
                            color: urgencyColor,
                            textTransform: 'uppercase'
                          }}>
                            {rep.urgency} Urgency
                          </span>
                          <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                            ID: {rep.id} · Category: <strong style={{ color: 'var(--text-primary)' }}>{rep.category.replace('_', ' ')}</strong>
                          </span>
                        </div>
                        <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>
                          {rep.title}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                          <MapPin size={11} color="var(--accent-amber)" />
                          <span>{rep.landmarkName}</span>
                          <span>·</span>
                          <span>{rep.upvotes} Citizens confirmed</span>
                        </div>
                      </div>

                      <span
                        style={{
                          fontSize: '9px',
                          fontWeight: 800,
                          textTransform: 'uppercase',
                          color: isResolved ? 'var(--safe-emerald)' : isInvestigating ? 'var(--accent-amber)' : 'var(--danger-crimson)',
                          backgroundColor: isResolved ? 'rgba(16, 185, 129, 0.15)' : isInvestigating ? 'rgba(245, 158, 11, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          border: `1px solid ${isResolved ? 'var(--safe-emerald)' : isInvestigating ? 'var(--accent-amber)' : 'var(--danger-crimson)'}`,
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {isResolved ? 'RESOLVED' : isInvestigating ? 'DISPATCHED (WIP)' : 'PENDING TRIAGE'}
                      </span>
                    </div>

                    {/* Description */}
                    {rep.description && (
                      <div style={{
                        fontSize: '11px',
                        color: 'var(--text-secondary)',
                        backgroundColor: 'var(--surface-card)',
                        padding: '6px 8px',
                        borderRadius: '6px',
                        border: '1px solid var(--border-subtle)'
                      }}>
                        "{rep.description}"
                      </div>
                    )}

                    {/* AI Assessment Pill if present */}
                    {rep.aiRiskScore && (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '10px',
                        backgroundColor: 'rgba(245, 158, 11, 0.1)',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        border: '1px solid rgba(245, 158, 11, 0.25)',
                        flexWrap: 'wrap'
                      }}>
                        <Sparkles size={12} color="var(--accent-amber)" />
                        <span style={{ fontWeight: 700, color: 'var(--accent-amber)' }}>
                          AI Risk: {rep.aiRiskScore}/100
                        </span>
                        {rep.aiRiskRationale && (
                          <span style={{ color: 'var(--text-muted)' }}>— {rep.aiRiskRationale}</span>
                        )}
                      </div>
                    )}

                    {/* Evidence thumbnails */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {rep.photoUrl && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', color: 'var(--haven-blue)' }}>
                          <Camera size={12} />
                          <a
                            href={rep.photoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: 'var(--haven-blue)', textDecoration: 'underline', fontWeight: 600 }}
                          >
                            View Evidence Photo
                          </a>
                        </div>
                      )}

                      {rep.audioNote && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', color: 'var(--safe-emerald)' }}>
                          <Mic size={12} />
                          <span style={{ fontWeight: 600 }}>Audio Note Attached</span>
                        </div>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px', marginTop: '2px' }}>
                      <button
                        type="button"
                        onClick={() => onHighlightEdge('edge_jspm_dark_cut')}
                        className="btn-civic"
                        style={{ padding: '4px 8px', fontSize: '10px', display: 'flex', alignItems: 'center', gap: '4px' }}
                        title="Locate hazard on city map"
                      >
                        <Eye size={11} /> Map View
                      </button>

                      {!isInvestigating && !isResolved && (
                        <button
                          type="button"
                          onClick={() => handleDispatchReport(rep)}
                          className="btn-civic btn-primary-amber"
                          style={{ padding: '4px 8px', fontSize: '10px', display: 'flex', alignItems: 'center', gap: '4px' }}
                          title="Generate municipal work order and dispatch repair crew"
                        >
                          <Wrench size={11} /> Dispatch Work Order
                        </button>
                      )}

                      {!isResolved && (
                        <button
                          type="button"
                          onClick={() => handleResolveReport(rep.id)}
                          className="btn-civic"
                          style={{
                            padding: '4px 8px',
                            fontSize: '10px',
                            color: 'var(--safe-emerald)',
                            borderColor: 'var(--safe-emerald)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                          title="Mark hazard resolved in municipal system"
                        >
                          <CheckCircle2 size={11} /> Mark Resolved
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {filteredTickets.map((t) => {
            const statusColor = t.status === 'resolved' ? 'var(--safe-emerald)' : t.status === 'in_progress' ? 'var(--accent-amber)' : 'var(--danger-crimson)';

            return (
              <div
                key={t.id}
                style={{
                  backgroundColor: 'var(--surface-elevated)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '6px',
                  padding: '8px 10px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    [{t.id}] {t.title}
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                    {t.locationName} · {t.ward} · <strong>{t.upvotes} Citizens confirmed</strong>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span
                    style={{
                      fontSize: '9px',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      color: statusColor,
                      backgroundColor: 'rgba(255,255,255,0.05)',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      border: `1px solid ${statusColor}`
                    }}
                  >
                    {t.status.replace('_', ' ')}
                  </span>

                  {t.status === 'pending' && (
                    <button
                      type="button"
                      onClick={() => handleUpdateTicketStatus(t.id, 'in_progress')}
                      className="btn-civic"
                      style={{ padding: '2px 6px', fontSize: '10px' }}
                      title="Dispatch municipal repair crew"
                    >
                      Dispatch
                    </button>
                  )}

                  {t.status === 'in_progress' && (
                    <button
                      type="button"
                      onClick={() => handleUpdateTicketStatus(t.id, 'resolved')}
                      className="btn-civic"
                      style={{ padding: '2px 6px', fontSize: '10px', color: 'var(--safe-emerald)' }}
                      title="Mark resolved"
                    >
                      Resolve
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
