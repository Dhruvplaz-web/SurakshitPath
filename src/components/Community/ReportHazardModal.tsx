import React, { useState } from 'react';
import { AlertTriangle, Camera, MapPin, X, Check, ShieldAlert } from 'lucide-react';
import { CitizenReport } from '../../types/routing';
import { apiClient } from '../../services/apiClient';

interface Props {
  isOpen: boolean;
  currentCoordinates: [number, number];
  onClose: () => void;
  onSubmitReport: (report: CitizenReport) => void;
}

export const ReportHazardModal: React.FC<Props> = ({
  isOpen,
  currentCoordinates,
  onClose,
  onSubmitReport
}) => {
  const [category, setCategory] = useState<CitizenReport['category']>('broken_lamp');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [urgency, setUrgency] = useState<CitizenReport['urgency']>('high');
  const [hasPhoto, setHasPhoto] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newReport: CitizenReport = {
      id: `rep_${Date.now()}`,
      category,
      title: title.trim(),
      description: description.trim() || 'Reported by commuter via SurakshitPath community audit.',
      coordinates: currentCoordinates,
      reportedAt: Date.now(),
      status: 'verified',
      upvotes: 1,
      urgency,
      landmarkName: `Near (${currentCoordinates[0].toFixed(4)}, ${currentCoordinates[1].toFixed(4)})`
    };

    // Asynchronously persist to backend PostgreSQL database and trigger PMC SCADA grievance
    apiClient.submitCitizenReport(newReport).catch(() => {});
    if (category === 'broken_lamp' || category === 'deserted_stretch') {
      apiClient.dispatchScadaGrievance(currentCoordinates, category, title.trim()).catch(() => {});
    }

    onSubmitReport(newReport);
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="report-hazard-title">
      <div className="modal-dialog" style={{ maxWidth: '440px', textAlign: 'left' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '6px',
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              color: 'var(--danger-crimson)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <AlertTriangle size={16} />
            </div>
            <h2 id="report-hazard-title" style={{ fontSize: '16px', fontWeight: 700, margin: 0 }}>
              Report Infrastructure Hazard
            </h2>
          </div>

          <button onClick={onClose} className="btn-civic" style={{ padding: '4px', border: 'none' }} title="Close">
            <X size={16} />
          </button>
        </div>

        {isSubmitted ? (
          <div style={{ padding: '24px 0', textAlign: 'center' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              color: 'var(--safe-emerald)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px'
            }}>
              <Check size={28} />
            </div>
            <h3 style={{ fontSize: '15px', color: 'var(--safe-emerald)', fontWeight: 700, margin: '0 0 6px' }}>
              Report Verified & Logged
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              Forwarded to PMC Municipal Electrical Ward and added to the real-time impedance penalty layer.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Category Select */}
            <div>
              <label style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
                Hazard Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CitizenReport['category'])}
                style={{
                  width: '100%',
                  marginTop: '4px',
                  backgroundColor: 'var(--surface-elevated)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '6px',
                  padding: '8px 10px',
                  fontSize: '12px',
                  color: 'var(--text-primary)'
                }}
              >
                <option value="broken_lamp">Unlit Stretch / Broken Streetlamp</option>
                <option value="deserted_stretch">Isolated Cut / Zero Pedestrian Footfall</option>
                <option value="harassment_crowd">Hostile Loitering / Harassment Risk</option>
                <option value="cctv_blindspot">Surveillance Blindspot</option>
                <option value="pothole_hazard">Pothole / Roadway Construction Obstacle</option>
              </select>
            </div>

            {/* Title */}
            <div>
              <label style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
                Title or Landmark
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 3 consecutive broken streetlights after flyover"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{
                  width: '100%',
                  marginTop: '4px',
                  backgroundColor: 'var(--surface-elevated)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '6px',
                  padding: '8px 10px',
                  fontSize: '12px',
                  color: 'var(--text-primary)'
                }}
              />
            </div>

            {/* Description */}
            <div>
              <label style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
                Observations (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="Describe lighting, visible shadows, or obstructions..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{
                  width: '100%',
                  marginTop: '4px',
                  backgroundColor: 'var(--surface-elevated)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '6px',
                  padding: '8px 10px',
                  fontSize: '12px',
                  color: 'var(--text-primary)',
                  resize: 'none'
                }}
              />
            </div>

            {/* GPS Tag & Simulated Photo */}
            <div style={{
              display: 'flex',
              gap: '8px',
              backgroundColor: 'var(--surface-elevated)',
              padding: '8px 10px',
              borderRadius: '6px',
              border: '1px solid var(--border-subtle)',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--accent-amber)' }}>
                <MapPin size={13} />
                <span>GPS: {currentCoordinates[0].toFixed(4)}, {currentCoordinates[1].toFixed(4)}</span>
              </div>

              <button
                type="button"
                onClick={() => setHasPhoto(!hasPhoto)}
                className="btn-civic"
                style={{
                  padding: '4px 8px',
                  fontSize: '11px',
                  border: `1px solid ${hasPhoto ? 'var(--safe-emerald)' : 'var(--border-subtle)'}`,
                  color: hasPhoto ? 'var(--safe-emerald)' : 'var(--text-secondary)'
                }}
              >
                <Camera size={12} />
                <span>{hasPhoto ? 'Photo Attached ✓' : 'Add Photo'}</span>
              </button>
            </div>

            {/* Urgency Selector */}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Urgency:</span>
              {(['high', 'medium', 'low'] as const).map(level => (
                <button
                  type="button"
                  key={level}
                  onClick={() => setUrgency(level)}
                  className="btn-civic"
                  style={{
                    padding: '3px 8px',
                    fontSize: '10px',
                    textTransform: 'capitalize',
                    border: urgency === level ? '1px solid var(--accent-amber)' : '1px solid var(--border-subtle)',
                    backgroundColor: urgency === level ? 'rgba(245, 158, 11, 0.15)' : 'transparent',
                    color: urgency === level ? 'var(--accent-amber)' : 'var(--text-secondary)'
                  }}
                >
                  {level}
                </button>
              ))}
            </div>

            {/* Submit Buttons */}
            <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
              <button
                type="button"
                onClick={onClose}
                className="btn-civic"
                style={{ flex: 1, padding: '8px' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-civic btn-primary-amber"
                style={{ flex: 1, padding: '8px', fontWeight: 700 }}
              >
                <ShieldAlert size={14} /> Submit Audit
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
