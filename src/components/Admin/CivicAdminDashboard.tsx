import React, { useState } from 'react';
import { PUNE_DARK_SPOTS, INITIAL_MUNICIPAL_TICKETS } from '../../data/civicAdminData';
import { MunicipalTicket, CitizenReport } from '../../types/routing';
import { Building, AlertTriangle, CheckCircle2, Wrench, ShieldAlert, Download } from 'lucide-react';

interface Props {
  onHighlightEdge: (edgeId: string) => void;
  citizenReports?: CitizenReport[];
}

export const CivicAdminDashboard: React.FC<Props> = ({ onHighlightEdge, citizenReports = [] }) => {
  const [tickets, setTickets] = useState<MunicipalTicket[]>(INITIAL_MUNICIPAL_TICKETS);
  const [dispatchedWorkOrders, setDispatchedWorkOrders] = useState<string[]>([]);

  const handleExportAuditJson = () => {
    const reportData = {
      agency: 'Pune Municipal Corporation (PMC) & Pimpri Chinchwad Municipal Corporation (PCMC)',
      auditTitle: 'Pune Night Mobility & Streetlight Infrastructure Dark-Spot Assessment 2026',
      generatedAt: new Date().toISOString(),
      coverageZone: 'Tathawade / Hinjawadi ⇄ Kothrud Urban Corridor',
      sdgAlignment: ['SDG 5: Gender Equality', 'SDG 11: Sustainable Cities & Communities'],
      kpiSummary: {
        totalDarkSpotDistanceKm: 13.2,
        activeSmartPoles: 1692,
        offlineSmartPoles: 148,
        uptimePercentage: 91.95,
        estimatedCapExRetrofitINR: '₹ 1,85,00,000'
      },
      prioritizedDarkSpots: PUNE_DARK_SPOTS,
      citizenTickets: tickets,
      recentCommunityReports: citizenReports
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PMC_PCMC_Night_Safety_Audit_${Date.now()}.json`;
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Header Banner */}
      <div style={{
        backgroundColor: 'rgba(245, 158, 11, 0.08)',
        border: '1px solid rgba(245, 158, 11, 0.3)',
        borderRadius: '8px',
        padding: '12px 14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Building size={18} color="var(--accent-amber)" />
          <div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
              Pune Municipal Civic Cockpit (PMC & PCMC)
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Urban Infrastructure Inversion & Smart Pole SCADA Monitor
            </div>
          </div>
        </div>

        <span style={{
          fontSize: '10px',
          fontWeight: 700,
          backgroundColor: 'rgba(16, 185, 129, 0.15)',
          color: 'var(--safe-emerald)',
          padding: '2px 8px',
          borderRadius: '4px',
          border: '1px solid var(--safe-emerald)'
        }}>
          SCADA CONNECTED
        </span>
      </div>

      {/* KPI Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
        <div style={{
          backgroundColor: 'var(--surface-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '8px',
          padding: '10px 12px'
        }}>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>CRITICAL DARK SPOTS</div>
          <div className="mono-num" style={{ fontSize: '18px', fontWeight: 800, color: 'var(--danger-crimson)' }}>
            4 Stretches
          </div>
          <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>
            13.2 km high-pedestrian cuts
          </div>
        </div>

        <div style={{
          backgroundColor: 'var(--surface-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '8px',
          padding: '10px 12px'
        }}>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>SMART POLES ACTIVE</div>
          <div className="mono-num" style={{ fontSize: '18px', fontWeight: 800, color: 'var(--safe-emerald)' }}>
            1,692 / 1,840
          </div>
          <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>
            148 offline (91.9% uptime)
          </div>
        </div>
      </div>

      {/* Export Action Strip */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'var(--surface-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '8px',
        padding: '8px 12px'
      }}>
        <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
          Official Ward Audit Report (JSON / SCADA Export)
        </div>

        <button
          onClick={handleExportAuditJson}
          className="btn-civic btn-primary-amber"
          style={{ padding: '6px 12px', fontSize: '11px', fontWeight: 700 }}
        >
          <Download size={13} /> Export Safety Audit (.json)
        </button>
      </div>

      {/* Inverted Dark-Spot Audit Table */}
      <div style={{
        backgroundColor: 'var(--surface-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '8px',
        padding: '12px 14px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <AlertTriangle size={14} color="var(--danger-crimson)" />
            <span>Prioritized Municipal Infrastructure Gaps</span>
          </div>
          <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>By Pedestrian Risk Score</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {PUNE_DARK_SPOTS.map((spot) => {
            const isWorkOrderIssued = dispatchedWorkOrders.includes(spot.edgeId);

            return (
              <div
                key={spot.edgeId}
                style={{
                  backgroundColor: 'var(--surface-elevated)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '6px',
                  padding: '10px 12px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                  <div>
                    <button
                      onClick={() => onHighlightEdge(spot.edgeId)}
                      style={{
                        background: 'none',
                        border: 'none',
                        padding: 0,
                        textAlign: 'left',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: 600,
                        color: 'var(--accent-amber)',
                        textDecoration: 'underline'
                      }}
                    >
                      {spot.name}
                    </button>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                      {spot.ward} · Length: <span className="mono-num">{spot.lengthMeters}m</span>
                    </div>
                  </div>

                  <div style={{
                    backgroundColor: 'rgba(239, 68, 68, 0.15)',
                    color: 'var(--danger-crimson)',
                    border: '1px solid var(--danger-crimson)',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontSize: '10px',
                    fontWeight: 700
                  }}>
                    Priority: {spot.priorityScore}/100
                  </div>
                </div>

                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  <strong>Intervention:</strong> {spot.suggestedAction}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                    Illumination Factor: <strong style={{ color: 'var(--danger-crimson)' }}>{(spot.lightingFactor * 100).toFixed(0)}%</strong>
                  </span>

                  <button
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
                        <CheckCircle2 size={10} /> Work Order #WO-{spot.edgeId.slice(-4)} Dispatched
                      </>
                    ) : (
                      <>
                        <Wrench size={10} /> Issue Municipal Tender
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Citizen Ticket Moderation Queue */}
      <div style={{
        backgroundColor: 'var(--surface-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '8px',
        padding: '12px 14px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldAlert size={14} color="var(--haven-blue)" />
            <span>Citizen Crowdsource Report Triage</span>
          </div>
          <span className="mono-num" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
            {tickets.filter(t => t.status !== 'resolved').length} Active
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {citizenReports.length > 0 && (
            <div style={{ marginBottom: '8px' }}>
              <div style={{ fontSize: '10px', color: 'var(--accent-amber)', fontWeight: 700, marginBottom: '4px', textTransform: 'uppercase' }}>
                ⭐ Just Reported by Commuters ({citizenReports.length})
              </div>
              {citizenReports.map(rep => (
                <div
                  key={rep.id}
                  style={{
                    backgroundColor: 'rgba(245, 158, 11, 0.06)',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                    borderRadius: '6px',
                    padding: '8px 10px',
                    marginBottom: '4px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-primary)' }}>
                      [LIVE] {rep.title}
                    </div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                      {rep.landmarkName} · Urgency: <span style={{ color: 'var(--accent-amber)' }}>{rep.urgency}</span> · Just now
                    </div>
                  </div>

                  <span style={{
                    fontSize: '9px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: 'var(--accent-amber)',
                    backgroundColor: 'rgba(245, 158, 11, 0.1)',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    border: '1px solid var(--accent-amber)'
                  }}>
                    PENDING TRIAGE
                  </span>
                </div>
              ))}
            </div>
          )}

          {tickets.map((t) => {
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
                    {t.locationName} · {t.reportedAt} · <strong>{t.upvotes} Citizens confirmed</strong>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{
                    fontSize: '9px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: statusColor,
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    border: `1px solid ${statusColor}`
                  }}>
                    {t.status.replace('_', ' ')}
                  </span>

                  {t.status === 'pending' && (
                    <button
                      onClick={() => handleUpdateTicketStatus(t.id, 'in_progress')}
                      className="btn-civic"
                      style={{ padding: '2px 6px', fontSize: '10px' }}
                      title="Dispatch repair crew"
                    >
                      Dispatch
                    </button>
                  )}

                  {t.status === 'in_progress' && (
                    <button
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
      </div>
    </div>
  );
};
