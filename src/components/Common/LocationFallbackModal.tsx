import React, { useState } from 'react';
import { PuneLocation, searchPuneLocations } from '../../services/geocodingService';
import { MapPin, Navigation, Crosshair, Search, X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelectLocation: (location: PuneLocation) => void;
  onPickOnMap: () => void;
  onRetryGps: () => void;
  targetField?: 'origin' | 'destination';
}

const COMMON_PUNE_HUBS: PuneLocation[] = [
  {
    id: 'loc_tathawade_jspm',
    name: 'JSPM Rajarshi Shahu College, Tathawade',
    subtitle: 'Wakad-Tathawade Highway Link',
    coordinates: [18.6186, 73.7483],
    category: 'college'
  },
  {
    id: 'loc_wakad_bhujbal',
    name: 'Bhujbal Chowk Flyover, Wakad',
    subtitle: 'Wakad-Hinjawadi Main Junction',
    coordinates: [18.6015, 73.7650],
    category: 'transit'
  },
  {
    id: 'loc_hinjawadi_ph1',
    name: 'Infosys Circle, Hinjawadi Phase 1',
    subtitle: 'Rajiv Gandhi Infotech Park',
    coordinates: [18.5912, 73.7389],
    category: 'it_hub'
  },
  {
    id: 'loc_baner_high_st',
    name: 'Balewadi High Street, Baner',
    subtitle: 'Commercial Arterial & Dining Corridor',
    coordinates: [18.5680, 73.7810],
    category: 'landmark'
  },
  {
    id: 'loc_kothrud_metro',
    name: 'Vanaz Metro Station, Paud Road, Kothrud',
    subtitle: 'Pune Metro Line 2 Terminal',
    coordinates: [18.5085, 73.8040],
    category: 'transit'
  },
  {
    id: 'haven_hosp_aditya_birla',
    name: 'Aditya Birla Memorial Hospital 24/7 Trauma Wing',
    subtitle: 'Thergaon / Chinchwad Corridor',
    coordinates: [18.6180, 73.7850],
    category: 'landmark'
  }
];

export const LocationFallbackModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSelectLocation,
  onPickOnMap,
  onRetryGps,
  targetField = 'origin'
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<PuneLocation[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  if (!isOpen) return null;

  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim().length >= 2) {
      setIsSearching(true);
      try {
        const res = await searchPuneLocations(query);
        setSearchResults(res);
      } finally {
        setIsSearching(false);
      }
    } else {
      setSearchResults([]);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(6px)',
        zIndex: 5000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        animation: 'fadeIn 0.15s ease-out'
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '520px',
          backgroundColor: 'var(--surface-elevated)',
          border: '1px solid var(--border-medium)',
          borderRadius: '12px',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.5)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '90vh'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'var(--surface-card)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: 'rgba(245, 158, 11, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-amber)'
              }}
            >
              <Navigation size={18} />
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-primary)' }}>
                Set {targetField === 'origin' ? 'Starting Point' : 'Destination'}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                Choose a common Pune hub or click directly on the map
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="btn-civic"
            style={{ padding: '6px', borderRadius: '6px', color: 'var(--text-muted)' }}
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        {/* 2 Hero Primary Actions: Pick on Map & Retry GPS */}
        <div style={{ padding: '16px 20px 8px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <button
            type="button"
            onClick={() => {
              onClose();
              onPickOnMap();
            }}
            className="btn-civic btn-primary-amber"
            style={{
              padding: '10px 12px',
              fontSize: '12px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              borderRadius: '8px'
            }}
          >
            <Crosshair size={15} />
            <span>Pick on City Map</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              onRetryGps();
            }}
            className="btn-civic"
            style={{
              padding: '10px 12px',
              fontSize: '12px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              borderRadius: '8px'
            }}
          >
            <Navigation size={15} color="var(--accent-amber)" />
            <span>Retry Live GPS</span>
          </button>
        </div>

        {/* Search Bar */}
        <div style={{ padding: '8px 20px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'var(--surface-card)',
              border: '1px solid var(--border-medium)',
              borderRadius: '8px',
              padding: '8px 12px'
            }}
          >
            <Search size={14} color="var(--text-muted)" />
            <input
              type="text"
              placeholder="Search Pune address, landmark, college, or station..."
              value={searchQuery}
              onChange={handleSearchChange}
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                width: '100%',
                fontSize: '12px',
                color: 'var(--text-primary)'
              }}
              autoFocus
            />
            {isSearching && (
              <span style={{ fontSize: '10px', color: 'var(--accent-amber)' }}>Searching...</span>
            )}
          </div>
        </div>

        {/* Results or Common Pune Hubs */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 20px 20px' }}>
          <div style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px', letterSpacing: '0.05em' }}>
            {searchResults.length > 0 ? `Search Results (${searchResults.length})` : 'Popular Pune Commuter Hubs'}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {(searchResults.length > 0 ? searchResults : COMMON_PUNE_HUBS).map(loc => (
              <div
                key={loc.id}
                onClick={() => {
                  onSelectLocation(loc);
                  onClose();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 12px',
                  backgroundColor: 'var(--surface-card)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent-amber)';
                  (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--surface-hover)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-subtle)';
                  (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--surface-card)';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '6px',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--accent-amber)',
                      flexShrink: 0
                    }}
                  >
                    <MapPin size={14} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {loc.name}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {loc.subtitle}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  className="btn-civic"
                  style={{
                    padding: '4px 8px',
                    fontSize: '11px',
                    fontWeight: 700,
                    color: 'var(--accent-amber)',
                    borderColor: 'var(--accent-amber)',
                    flexShrink: 0
                  }}
                >
                  Select
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
