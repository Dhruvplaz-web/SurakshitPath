import React from 'react';
import { RouteOption } from '../../types/routing';
import { ShieldCheck, Zap, Bus, Clock, Navigation, AlertTriangle } from 'lucide-react';

interface Props {
  routes: {
    fastest: RouteOption;
    safe: RouteOption;
    balanced: RouteOption;
  };
  activeRouteId: string;
  onSelectRoute: (id: string) => void;
}

export const RouteComparisonCard: React.FC<Props> = ({
  routes,
  activeRouteId,
  onSelectRoute
}) => {
  const routeList = [routes.safe, routes.fastest, routes.balanced];

  const getScoreClass = (score: number) => {
    if (score >= 75) return 'score-high';
    if (score >= 50) return 'score-medium';
    return 'score-low';
  };

  const getRouteIcon = (type: RouteOption['routeType']) => {
    switch (type) {
      case 'safe': return <ShieldCheck size={16} color="var(--safe-emerald)" />;
      case 'fastest': return <Zap size={16} color="var(--accent-amber)" />;
      case 'balanced': return <Bus size={16} color="var(--haven-blue)" />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {routeList.map((route) => {
        const isActive = route.id === activeRouteId;
        const scoreClass = getScoreClass(route.safetyScore);

        return (
          <div
            key={route.id}
            onClick={() => onSelectRoute(route.id)}
            className={`route-card ${isActive ? 'active' : ''}`}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') onSelectRoute(route.id);
            }}
          >
            <div className="route-card-header">
              <div>
                <div className="route-title">
                  {getRouteIcon(route.routeType)}
                  <span>{route.name}</span>
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {route.tagline}
                </div>
              </div>

              <div className={`score-badge ${scoreClass}`}>
                <span>{route.safetyScore}</span>
                <span style={{ fontSize: '10px', opacity: 0.8 }}>/100</span>
              </div>
            </div>

            <div className="route-stats-row">
              <div className="stat-item">
                <Clock size={12} />
                <span className="mono-num" style={{ fontWeight: 600 }}>{route.durationMinutes} mins</span>
              </div>
              <div className="stat-item">
                <Navigation size={12} />
                <span className="mono-num">{(route.distanceMeters / 1000).toFixed(1)} km</span>
              </div>
              {route.routeType === 'fastest' && (
                <div className="stat-item" style={{ color: 'var(--danger-crimson)', marginLeft: 'auto' }}>
                  <AlertTriangle size={12} />
                  <span>Unlit Cuts</span>
                </div>
              )}
            </div>

            {/* Factor breakdown mini-bars */}
            <div className="factor-progress-container">
              <div className="factor-row">
                <span style={{ color: 'var(--text-secondary)' }}>Lighting Coverage</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div className="progress-track">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${Math.round(route.factors.lighting * 100)}%`,
                        backgroundColor: route.factors.lighting >= 0.7 ? 'var(--safe-emerald)' : 'var(--danger-crimson)'
                      }}
                    />
                  </div>
                  <span className="mono-num" style={{ width: '28px', textAlign: 'right' }}>
                    {Math.round(route.factors.lighting * 100)}%
                  </span>
                </div>
              </div>

              <div className="factor-row">
                <span style={{ color: 'var(--text-secondary)' }}>24/7 Active Frontage</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div className="progress-track">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${Math.round(route.factors.activity * 100)}%`,
                        backgroundColor: 'var(--accent-amber)'
                      }}
                    />
                  </div>
                  <span className="mono-num" style={{ width: '28px', textAlign: 'right' }}>
                    {Math.round(route.factors.activity * 100)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
