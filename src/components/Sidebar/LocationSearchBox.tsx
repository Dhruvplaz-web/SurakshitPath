import React, { useState, useEffect, useRef } from 'react';
import { PuneLocation, searchPuneLocations } from '../../services/geocodingService';
import { MapPin, ArrowDownUp, Crosshair, Search, Building2, GraduationCap, Bus } from 'lucide-react';

interface Props {
  origin: PuneLocation;
  destination: PuneLocation;
  onSelectOrigin: (loc: PuneLocation) => void;
  onSelectDestination: (loc: PuneLocation) => void;
  onSwapLocations: () => void;
  onPickOnMap: (target: 'origin' | 'destination') => void;
  isPickingOnMap: 'origin' | 'destination' | null;
}

export const LocationSearchBox: React.FC<Props> = ({
  origin,
  destination,
  onSelectOrigin,
  onSelectDestination,
  onSwapLocations,
  onPickOnMap,
  isPickingOnMap
}) => {
  const [activeField, setActiveField] = useState<'origin' | 'destination' | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<PuneLocation[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Search effect with 250ms debounce and cancellation guard
  useEffect(() => {
    if (!activeField) return;
    let isCancelled = false;

    const timer = setTimeout(() => {
      searchPuneLocations(searchQuery).then(res => {
        if (!isCancelled) setResults(res);
      });
    }, 250);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [searchQuery, activeField]);

  // Handle outside click to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setActiveField(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getCategoryIcon = (category: PuneLocation['category']) => {
    switch (category) {
      case 'college': return <GraduationCap size={13} color="var(--accent-amber)" />;
      case 'transit': return <Bus size={13} color="var(--haven-blue)" />;
      case 'it_hub': return <Building2 size={13} color="var(--safe-emerald)" />;
      default: return <MapPin size={13} color="var(--text-muted)" />;
    }
  };

  return (
    <div style={{
      backgroundColor: 'var(--surface-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: '8px',
      padding: '12px 14px',
      position: 'relative'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
        <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
          Pune Corridor Route Points
        </div>

        <button
          onClick={onSwapLocations}
          className="btn-civic"
          style={{ padding: '2px 6px', fontSize: '10px' }}
          title="Swap Origin and Destination"
        >
          <ArrowDownUp size={11} /> Swap
        </button>
      </div>

      {/* Origin Field */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
        <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'var(--safe-emerald)', flexShrink: 0 }} />
        <div style={{ flex: 1, position: 'relative' }}>
          <button
            onClick={() => {
              setActiveField('origin');
              setSearchQuery('');
            }}
            className="btn-civic"
            style={{
              width: '100%',
              justifyContent: 'flex-start',
              textAlign: 'left',
              padding: '6px 10px',
              backgroundColor: 'var(--surface-elevated)',
              fontSize: '12px',
              color: 'var(--text-primary)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            <span style={{ fontWeight: 600 }}>{origin.name}</span>
          </button>
        </div>
        <button
          onClick={() => onPickOnMap('origin')}
          className="btn-civic"
          style={{
            padding: '6px',
            backgroundColor: isPickingOnMap === 'origin' ? 'var(--accent-amber)' : 'var(--surface-elevated)',
            color: isPickingOnMap === 'origin' ? '#000' : 'var(--text-secondary)'
          }}
          title="Pick Origin on Map"
        >
          <Crosshair size={13} />
        </button>
      </div>

      {/* Destination Field */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'var(--accent-amber)', flexShrink: 0 }} />
        <div style={{ flex: 1, position: 'relative' }}>
          <button
            onClick={() => {
              setActiveField('destination');
              setSearchQuery('');
            }}
            className="btn-civic"
            style={{
              width: '100%',
              justifyContent: 'flex-start',
              textAlign: 'left',
              padding: '6px 10px',
              backgroundColor: 'var(--surface-elevated)',
              fontSize: '12px',
              color: 'var(--text-primary)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            <span style={{ fontWeight: 600 }}>{destination.name}</span>
          </button>
        </div>
        <button
          onClick={() => onPickOnMap('destination')}
          className="btn-civic"
          style={{
            padding: '6px',
            backgroundColor: isPickingOnMap === 'destination' ? 'var(--accent-amber)' : 'var(--surface-elevated)',
            color: isPickingOnMap === 'destination' ? '#000' : 'var(--text-secondary)'
          }}
          title="Pick Destination on Map"
        >
          <Crosshair size={13} />
        </button>
      </div>

      {/* Interactive Autocomplete Dropdown Modal / Popover */}
      {activeField && (
        <div
          ref={dropdownRef}
          style={{
            position: 'absolute',
            top: activeField === 'origin' ? '38px' : '76px',
            left: '12px',
            right: '12px',
            backgroundColor: 'var(--surface-hover)',
            border: '1px solid var(--accent-amber)',
            borderRadius: '8px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.7)',
            zIndex: 2000,
            padding: '8px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 8px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '6px' }}>
            <Search size={13} color="var(--accent-amber)" />
            <input
              type="text"
              autoFocus
              placeholder={`Search Pune landmark or street for ${activeField}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                background: 'transparent',
                border: 'none',
                color: '#fff',
                fontSize: '12px',
                outline: 'none'
              }}
            />
          </div>

          <div style={{ maxHeight: '180px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {results.map((loc) => (
              <button
                key={loc.id}
                onClick={() => {
                  if (activeField === 'origin') onSelectOrigin(loc);
                  else onSelectDestination(loc);
                  setActiveField(null);
                }}
                className="btn-civic"
                style={{
                  justifyContent: 'flex-start',
                  textAlign: 'left',
                  padding: '6px 8px',
                  fontSize: '11px',
                  backgroundColor: 'transparent',
                  border: 'none'
                }}
              >
                <div style={{ marginTop: '2px', marginRight: '6px' }}>
                  {getCategoryIcon(loc.category)}
                </div>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{loc.name}</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{loc.subtitle}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
