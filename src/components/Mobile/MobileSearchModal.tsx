import React, { useEffect, useRef } from 'react';
import { PuneLocation, PUNE_LANDMARKS } from '../../services/geocodingService';
import { LocationSearchBox } from '../Sidebar/LocationSearchBox';
import { X, MapPin, Compass } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  origin: PuneLocation;
  destination: PuneLocation;
  onSelectOrigin: (loc: PuneLocation) => void;
  onSelectDestination: (loc: PuneLocation) => void;
  onSwapLocations: () => void;
  onPickOnMap: (target: 'origin' | 'destination') => void;
  isPickingOnMap: 'origin' | 'destination' | null;
}

export const MobileSearchModal: React.FC<Props> = ({
  isOpen,
  onClose,
  origin,
  destination,
  onSelectOrigin,
  onSelectDestination,
  onSwapLocations,
  onPickOnMap,
  isPickingOnMap
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const popularLandmarks = PUNE_LANDMARKS.slice(0, 8);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="mobile-search-title"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2200,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        padding: 'env(safe-area-inset-top, 12px) 12px env(safe-area-inset-bottom, 12px)',
        animation: 'fadeIn 0.2s ease-out'
      }}
    >
      <div
        ref={modalRef}
        style={{
          backgroundColor: 'var(--surface-elevated)',
          borderRadius: '16px',
          border: '1px solid var(--border-subtle)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '92vh',
          overflow: 'hidden'
        }}
      >
        {/* Header bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 18px',
          borderBottom: '1px solid var(--border-subtle)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Compass size={18} color="var(--accent-amber)" />
            <h2 id="mobile-search-title" style={{ fontSize: '15px', fontWeight: 700, margin: 0 }}>
              Search Routes &amp; Destinations
            </h2>
          </div>
          <button
            onClick={onClose}
            className="btn-civic"
            style={{
              padding: '6px 10px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: '40px',
              minHeight: '40px'
            }}
            aria-label="Close search modal"
          >
            <X size={16} />
          </button>
        </div>

        {/* Search Inputs */}
        <div style={{ padding: '16px 18px', overflowY: 'auto' }}>
          <LocationSearchBox
            origin={origin}
            destination={destination}
            onSelectOrigin={(loc) => {
              onSelectOrigin(loc);
            }}
            onSelectDestination={(loc) => {
              onSelectDestination(loc);
            }}
            onSwapLocations={onSwapLocations}
            onPickOnMap={(target) => {
              onPickOnMap(target);
              onClose(); // Close modal so user can tap directly on the map
            }}
            isPickingOnMap={isPickingOnMap}
          />

          {/* Popular Landmarks Quick Select */}
          <div style={{ marginTop: '20px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
              Quick Destination Picks
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {popularLandmarks.map((loc) => {
                const isCurrentDest = destination.id === loc.id;
                return (
                  <button
                    key={loc.id}
                    onClick={() => {
                      onSelectDestination(loc);
                      onClose();
                    }}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '8px',
                      fontSize: '11.5px',
                      fontWeight: 600,
                      backgroundColor: isCurrentDest ? 'rgba(245, 158, 11, 0.2)' : 'var(--surface-card)',
                      border: `1px solid ${isCurrentDest ? 'var(--accent-amber)' : 'var(--border-subtle)'}`,
                      color: isCurrentDest ? 'var(--accent-amber)' : 'var(--text-primary)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      minHeight: '40px'
                    }}
                  >
                    <MapPin size={12} color={isCurrentDest ? 'var(--accent-amber)' : 'var(--text-muted)'} />
                    <span>{loc.name.split('(')[0].trim()}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Done Button */}
          <div style={{ marginTop: '24px' }}>
            <button
              onClick={onClose}
              className="btn-civic btn-primary-amber"
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '13px',
                fontWeight: 700,
                borderRadius: '10px',
                minHeight: '48px'
              }}
            >
              Apply &amp; View Route on Map
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
