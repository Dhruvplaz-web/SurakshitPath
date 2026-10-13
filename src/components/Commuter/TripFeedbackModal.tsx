/**
 * SurakshitPath - 2-Tier Commuter Trip Feedback Modal
 * 
 * Provides an instantaneous feedback loop for night travel:
 * - Tier 1: Rapid 5-Star + Tag Sentiment (10 seconds)
 * - Tier 2: Seamless handoff to PMC Civic Hazard Reporting
 */

import React, { useState, useEffect } from 'react';
import {
  X,
  Star,
  AlertTriangle,
  Send,
  CheckCircle2,
  ThumbsUp
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onOpenHazardReport: () => void;
  routeName?: string;
  destinationName?: string;
}

const SENTIMENT_TAGS = [
  { id: 'lit', label: 'Well-Lit Streets ✨', positive: true },
  { id: 'shops', label: 'Active Frontage / Open Shops 🏬', positive: true },
  { id: 'police', label: 'Police Patrol Seen 🚓', positive: true },
  { id: 'dark', label: 'Dark Spot Stretches 🌑', positive: false },
  { id: 'isolated', label: 'Isolated Corridors ⚠️', positive: false },
  { id: 'dogs', label: 'Stray Dog Hazard 🐕', positive: false }
];

export const TripFeedbackModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onOpenHazardReport,
  routeName: _routeName = 'Safe Corridor',
  destinationName = 'Destination'
}) => {
  const [rating, setRating] = useState(5);
  const [selectedTags, setSelectedTags] = useState<string[]>(['lit', 'shops']);
  const [comments, setComments] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const toggleTag = (id: string) => {
    setSelectedTags((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      onClose();
      setIsSubmitted(false);
    }, 2000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="feedback-modal-title"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9998,
        backgroundColor: 'rgba(5, 7, 10, 0.82)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '480px',
          backgroundColor: 'var(--surface-elevated, #16181f)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          boxShadow: '0 24px 64px rgba(0, 0, 0, 0.65)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            background: 'linear-gradient(180deg, rgba(16, 185, 129, 0.08) 0%, transparent 100%)',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--safe-emerald, #10b981)'
              }}
            >
              <ThumbsUp size={18} />
            </div>
            <div>
              <h2
                id="feedback-modal-title"
                style={{
                  fontSize: '18px',
                  fontWeight: 800,
                  color: 'var(--text-primary, #f8fafc)',
                  margin: 0
                }}
              >
                You Have Arrived Safely! 🎉
              </h2>
              <p style={{ fontSize: '11px', color: 'var(--text-muted, #94a3b8)', margin: '2px 0 0 0' }}>
                How was your nocturnal route experience to {destinationName}?
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-muted, #94a3b8)',
              cursor: 'pointer'
            }}
            title="Close"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '24px' }}>
          {isSubmitted ? (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <CheckCircle2 size={42} color="var(--safe-emerald, #10b981)" style={{ margin: '0 auto 12px auto' }} />
              <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)' }}>
                Thank you for keeping Pune safe!
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                Your feedback calibrates our safety cost weights for fellow nocturnal commuters.
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Star Rating */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  CORRIDOR SAFETY RATING
                </span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '4px',
                        color: star <= rating ? '#fbbf24' : 'rgba(255, 255, 255, 0.15)',
                        transition: 'transform 0.15s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.2)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    >
                      <Star size={28} fill={star <= rating ? '#fbbf24' : 'transparent'} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Sentiment Chips */}
              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
                  KEY OBSERVATIONS (SELECT ALL THAT APPLY)
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {SENTIMENT_TAGS.map((tag) => {
                    const isSelected = selectedTags.includes(tag.id);
                    return (
                      <button
                        key={tag.id}
                        type="button"
                        onClick={() => toggleTag(tag.id)}
                        style={{
                          padding: '6px 10px',
                          borderRadius: '8px',
                          fontSize: '11px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          border: isSelected
                            ? `1px solid ${tag.positive ? 'var(--safe-emerald, #10b981)' : 'var(--danger-crimson, #ef4444)'}`
                            : '1px solid rgba(255, 255, 255, 0.1)',
                          backgroundColor: isSelected
                            ? tag.positive
                              ? 'rgba(16, 185, 129, 0.15)'
                              : 'rgba(239, 68, 68, 0.15)'
                            : 'rgba(255, 255, 255, 0.03)',
                          color: isSelected
                            ? tag.positive
                              ? 'var(--safe-emerald, #10b981)'
                              : '#fca5a5'
                            : 'var(--text-secondary)'
                        }}
                      >
                        {tag.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Optional Comments */}
              <div>
                <input
                  type="text"
                  placeholder="Optional: Any specific dark stretches or notes?"
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  style={{
                    width: '100%',
                    backgroundColor: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    fontSize: '12px',
                    color: '#fff',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Submit Rating Button */}
              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '10px 16px',
                  backgroundColor: 'var(--safe-emerald, #10b981)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <Send size={13} />
                <span>Submit Trip Rating</span>
              </button>

              {/* Tier 2: PMC Hazard Report Prompt */}
              <div
                style={{
                  marginTop: '8px',
                  padding: '12px 14px',
                  backgroundColor: 'rgba(239, 68, 68, 0.06)',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertTriangle size={16} color="var(--danger-crimson, #ef4444)" />
                  <div style={{ fontSize: '11px', color: 'var(--text-primary)' }}>
                    Encountered a dark spot or broken streetlight?
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenHazardReport();
                  }}
                  style={{
                    backgroundColor: 'transparent',
                    border: '1px solid var(--danger-crimson, #ef4444)',
                    color: 'var(--danger-crimson, #ef4444)',
                    borderRadius: '6px',
                    padding: '4px 10px',
                    fontSize: '11px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  File Civic Report →
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default TripFeedbackModal;
