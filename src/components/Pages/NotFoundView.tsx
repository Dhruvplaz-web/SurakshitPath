import React from 'react';
import { Compass, Home, MapPin } from 'lucide-react';

interface Props {
  onReturnHome: () => void;
}

export const NotFoundView: React.FC<Props> = ({ onReturnHome }) => {
  return (
    <main
      role="main"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '75vh',
        padding: '32px 16px',
        textAlign: 'center'
      }}
    >
      <div
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          backgroundColor: 'rgba(245, 158, 11, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--accent-amber)',
          marginBottom: '20px',
          boxShadow: '0 0 32px rgba(245, 158, 11, 0.2)'
        }}
      >
        <Compass size={32} />
      </div>

      <div
        style={{
          fontSize: '64px',
          fontWeight: 800,
          fontFamily: 'var(--font-mono)',
          lineHeight: 1,
          color: 'var(--text-primary)',
          letterSpacing: '-2px',
          marginBottom: '8px'
        }}
      >
        404
      </div>

      <h1 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
        Night Corridor Not Found
      </h1>

      <p
        style={{
          fontSize: '13px',
          color: 'var(--text-secondary)',
          maxWidth: '460px',
          lineHeight: 1.6,
          margin: '0 0 24px 0'
        }}
      >
        The requested navigation checkpoint, corridor segment, or page does not exist in the Pune Metropolitan digital twin database. Please return to the active routing cockpit.
      </p>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          onClick={onReturnHome}
          className="btn-civic"
          style={{
            backgroundColor: 'var(--accent-amber)',
            color: '#000',
            fontWeight: 700,
            padding: '10px 20px',
            fontSize: '13px',
            borderRadius: '8px',
            boxShadow: '0 4px 14px rgba(245, 158, 11, 0.3)'
          }}
        >
          <Home size={15} /> Return to Safe Navigation Cockpit
        </button>
      </div>

      <div
        style={{
          marginTop: '40px',
          padding: '14px 20px',
          backgroundColor: 'var(--surface-elevated)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '8px',
          maxWidth: '520px',
          fontSize: '11px',
          color: 'var(--text-muted)'
        }}
      >
        <strong style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '6px' }}>
          <MapPin size={12} color="var(--safe-emerald)" /> Verified Night Corridors Available
        </strong>
        JSPM RSCOE Tathawade · Hinjawadi Phase 1 · Balewadi High Street · SPPU University Circle · FC Road Shivajinagar · Kothrud Depot
      </div>
    </main>
  );
};
