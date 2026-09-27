import React, { useState, useEffect, useRef } from 'react';
import {
  AlertTriangle,
  Camera,
  MapPin,
  X,
  Check,
  ShieldAlert,
  Mic,
  MicOff,
  Image as ImageIcon,
  Trash2,
  Sparkles,
  RefreshCw,
  Maximize2
} from 'lucide-react';
import { CitizenReport } from '../../types/routing';
import { aiRiskService, AIRiskAssessment } from '../../services/aiRiskService';
import { aiHubService, GeminiHazardResult } from '../../services/aiHubService';

interface Props {
  isOpen: boolean;
  currentCoordinates: [number, number];
  onClose: () => void;
  onSubmitReport: (report: CitizenReport) => void;
  onTriggerSos?: () => void;
}

export const ReportHazardModal: React.FC<Props> = ({
  isOpen,
  currentCoordinates,
  onClose,
  onSubmitReport,
  onTriggerSos
}) => {
  const [category, setCategory] = useState<CitizenReport['category']>('broken_lamp');
  const [customCategory, setCustomCategory] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [urgency, setUrgency] = useState<CitizenReport['urgency']>('high');
  const [urgencyManuallyOverridden, setUrgencyManuallyOverridden] = useState(false);

  // Photo state
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoName, setPhotoName] = useState<string>('');
  const [isPhotoLightboxOpen, setIsPhotoLightboxOpen] = useState(false);

  // Speech-to-text state
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [interimTranscript, setInterimTranscript] = useState('');

  // AI assessment state
  const [aiAssessment, setAiAssessment] = useState<AIRiskAssessment | null>(null);
  const [geminiResult, setGeminiResult] = useState<GeminiHazardResult | null>(null);
  const [isAiEvaluating, setIsAiEvaluating] = useState(false);

  const [isSubmitted, setIsSubmitted] = useState(false);

  // File input refs
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize Speech Recognition capability
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      setSpeechSupported(true);
    } else {
      setSpeechSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore cleanup error
        }
      }
    };
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        if (isPhotoLightboxOpen) {
          setIsPhotoLightboxOpen(false);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isPhotoLightboxOpen, onClose]);

  // Run AI Risk Evaluation (instant local heuristic + debounced Gemini Multimodal audit)
  useEffect(() => {
    if (!isOpen) return;

    // 1. Fast local pre-pass so the UI displays instant score feedback without network latency
    const local = aiRiskService.evaluateRisk({
      title,
      description,
      category,
      customCategory,
      hasPhoto: !!photoPreview,
      coordinates: currentCoordinates
    });
    setAiAssessment(local);

    if (!urgencyManuallyOverridden) {
      setUrgency(local.urgency);
    }

    // 2. Debounced deep Gemini Multimodal & Indic verification
    setIsAiEvaluating(true);
    const abortController = new AbortController();

    const timer = setTimeout(async () => {
      try {
        const gemini = await aiHubService.verifyHazardReport(
          {
            title: title.trim() || category,
            description: description.trim(),
            category,
            customCategory,
            photoDataUrl: photoPreview,
            coordinates: currentCoordinates
          },
          abortController.signal
        );

        setGeminiResult(gemini);
        setAiAssessment(prev => {
          if (!prev) return local;
          return {
            ...prev,
            riskScore: Math.round(gemini.severityScore * 100),
            urgency: gemini.urgency,
            confidence: gemini.confidence,
            rationale: gemini.explanation,
            factors: [
              ...prev.factors.filter(f => !f.toLowerCase().includes('gemini') && !f.toLowerCase().includes('lux')),
              `Lux: ${gemini.estimatedLuxLevel.replace('_', ' ').toUpperCase()}`,
              gemini.source === 'gemini-multimodal' ? 'Verified by Gemini 2.5 Multimodal AI' : 'Verified by Spatial Prior Engine'
            ]
          };
        });

        if (!urgencyManuallyOverridden) {
          setUrgency(gemini.urgency);
        }
      } catch {
        // Fallback already active
      } finally {
        setIsAiEvaluating(false);
      }
    }, 400);

    return () => {
      clearTimeout(timer);
      abortController.abort();
    };
  }, [title, description, category, customCategory, photoPreview, currentCoordinates, urgencyManuallyOverridden, isOpen]);

  if (!isOpen) return null;

  // Toggle Voice Dictation / Speech Recognition
  const toggleSpeechRecognition = () => {
    if (!speechSupported) {
      setSpeechError('Speech recognition is not supported in this browser. Please type or use system voice keyboard.');
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
      setIsListening(false);
      setInterimTranscript('');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-IN'; // Indian English / multilingual accent support

      recognition.onstart = () => {
        setIsListening(true);
        setSpeechError(null);
      };

      recognition.onresult = (event: any) => {
        let interim = '';
        let finalizedChunk = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const trans = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalizedChunk += trans + ' ';
          } else {
            interim += trans;
          }
        }

        if (finalizedChunk) {
          setDescription(prev => {
            const trimmed = prev.trim();
            return trimmed ? `${trimmed} ${finalizedChunk.trim()}` : finalizedChunk.trim();
          });

          // Auto-suggest title from spoken phrase if title is currently blank
          if (!title.trim()) {
            setTitle(finalizedChunk.trim().slice(0, 55));
          }
        }

        setInterimTranscript(interim);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition status:', event.error);
        setIsListening(false);
        setInterimTranscript('');
        if (event.error === 'not-allowed') {
          setSpeechError('Microphone access denied. Please grant permission in browser settings.');
        } else if (event.error === 'no-speech') {
          setSpeechError('No speech detected. Please speak closer to microphone.');
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        setInterimTranscript('');
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error('Failed to initialize speech recognition:', err);
      setIsListening(false);
      setSpeechError('Failed to start microphone. Please try again.');
    }
  };

  // Image File Handling (Camera & Gallery)
  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('Photo size exceeds 10MB limit. Please select a smaller photo.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Compress image preview if needed using canvas
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDimension = 1200;
        let width = img.width;
        let height = img.height;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
          setPhotoPreview(compressedDataUrl);
          setPhotoName(file.name || 'camera_photo.jpg');
        } else {
          setPhotoPreview(result);
          setPhotoName(file.name || 'hazard_photo.jpg');
        }
      };
      img.src = result;
    };
    reader.readAsDataURL(file);

    // Reset input value so re-selecting same photo triggers onChange
    e.target.value = '';
  };

  const handleRemovePhoto = () => {
    setPhotoPreview(null);
    setPhotoName('');
  };

  const handleUrgencyClick = (level: CitizenReport['urgency']) => {
    setUrgency(level);
    setUrgencyManuallyOverridden(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (isListening && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
    }

    const newReport: CitizenReport = {
      id: `rep_${Date.now()}`,
      category,
      otherCategoryDetail: category === 'other' ? customCategory.trim() : undefined,
      title: title.trim(),
      description: description.trim() || 'Reported by commuter via SurakshitPath community audit.',
      coordinates: currentCoordinates,
      reportedAt: Date.now(),
      status: 'verified',
      upvotes: 1,
      urgency,
      landmarkName: `Near (${currentCoordinates[0].toFixed(4)}, ${currentCoordinates[1].toFixed(4)})`,
      photoUrl: photoPreview || undefined,
      aiRiskScore: aiAssessment?.riskScore,
      aiRiskRationale: aiAssessment?.rationale
    };

    onSubmitReport(newReport);
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 1600);
  };

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="report-hazard-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      style={{ zIndex: 1200 }}
    >
      <div
        className="modal-dialog"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '460px',
          width: '94%',
          maxHeight: '90vh',
          overflowY: 'auto',
          textAlign: 'left',
          borderRadius: '12px',
          padding: '18px 20px',
          backgroundColor: 'var(--surface-card)',
          border: '1px solid var(--border-medium)',
          boxShadow: 'var(--shadow-elevated)'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                color: 'var(--danger-crimson)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(239, 68, 68, 0.3)'
              }}
            >
              <AlertTriangle size={18} />
            </div>
            <div>
              <h2 id="report-hazard-title" style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                Report Road Hazard & Safety Audit
              </h2>
              <p style={{ margin: '2px 0 0', fontSize: '11px', color: 'var(--text-secondary)' }}>
                Empirical infrastructure telemetry & multi-factor threat detection
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="btn-civic"
            style={{ padding: '6px', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
            title="Close"
          >
            <X size={16} />
          </button>
        </div>

        {/* Hidden File Inputs for Real Camera & Gallery */}
        <input
          type="file"
          ref={cameraInputRef}
          accept="image/*"
          capture="environment"
          style={{ display: 'none' }}
          onChange={handlePhotoSelect}
        />
        <input
          type="file"
          ref={galleryInputRef}
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handlePhotoSelect}
        />

        {isSubmitted ? (
          <div style={{ padding: '32px 0', textAlign: 'center' }}>
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                color: 'var(--safe-emerald)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 14px',
                border: '1px solid rgba(16, 185, 129, 0.3)'
              }}
            >
              <Check size={32} />
            </div>
            <h3 style={{ fontSize: '16px', color: 'var(--safe-emerald)', fontWeight: 700, margin: '0 0 6px' }}>
              Hazard Verified & Spatially Snapped
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', maxWidth: '340px', margin: '0 auto 10px', lineHeight: 1.4 }}>
              Logged into SurakshitPath edge penalization model. Ward maintenance ticket forwarded to PMC Electrical Dept.
            </p>
            {aiAssessment && (
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 10px',
                  borderRadius: '20px',
                  backgroundColor: 'rgba(245, 158, 11, 0.12)',
                  color: 'var(--accent-amber)',
                  fontSize: '11px',
                  fontWeight: 600
                }}
              >
                <Sparkles size={12} />
                <span>AI Risk Score: {aiAssessment.riskScore}/100 ({aiAssessment.urgency.toUpperCase()})</span>
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Category Select */}
            <div>
              <label style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Hazard Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CitizenReport['category'])}
                style={{
                  width: '100%',
                  marginTop: '4px',
                  backgroundColor: 'var(--surface-elevated)',
                  border: '1px solid var(--border-medium)',
                  borderRadius: '6px',
                  padding: '9px 10px',
                  fontSize: '12px',
                  color: 'var(--text-primary)',
                  outline: 'none'
                }}
              >
                <option value="broken_lamp">Unlit Stretch / Broken Streetlamp</option>
                <option value="deserted_stretch">Isolated Cut / Zero Pedestrian Footfall</option>
                <option value="harassment_crowd">Hostile Loitering / Harassment Risk</option>
                <option value="cctv_blindspot">Surveillance Blindspot</option>
                <option value="pothole_hazard">Pothole / Roadway Construction Obstacle</option>
                <option value="other">Other Hazard / Unspecified Issue</option>
              </select>
            </div>

            {/* Custom Category Input if "Other" Selected */}
            {category === 'other' && (
              <div style={{ animation: 'fadeIn 0.2s ease-in' }}>
                <label style={{ fontSize: '11px', color: 'var(--accent-amber)', fontWeight: 600, textTransform: 'uppercase' }}>
                  Specify Problem Type
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Broken pavement, exposed live electric wires, open drainage, stray animals..."
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  style={{
                    width: '100%',
                    marginTop: '4px',
                    backgroundColor: 'var(--surface-elevated)',
                    border: '1px solid rgba(245, 158, 11, 0.4)',
                    borderRadius: '6px',
                    padding: '8px 10px',
                    fontSize: '12px',
                    color: 'var(--text-primary)',
                    outline: 'none'
                  }}
                />
              </div>
            )}

            {/* Title / Landmark */}
            <div>
              <label style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
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
                  border: '1px solid var(--border-medium)',
                  borderRadius: '6px',
                  padding: '8px 10px',
                  fontSize: '12px',
                  color: 'var(--text-primary)',
                  outline: 'none'
                }}
              />
            </div>

            {/* Description with Voice Dictation Feature */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <label style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Observations & Voice Note
                </label>

                {/* Voice Input Button */}
                <button
                  type="button"
                  onClick={toggleSpeechRecognition}
                  className="btn-civic"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '3px 8px',
                    fontSize: '11px',
                    borderRadius: '14px',
                    backgroundColor: isListening ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.12)',
                    color: isListening ? 'var(--danger-crimson)' : 'var(--accent-amber)',
                    border: isListening ? '1px solid var(--danger-crimson)' : '1px solid rgba(245, 158, 11, 0.3)',
                    cursor: 'pointer',
                    fontWeight: 600
                  }}
                  title={speechSupported ? 'Tap to speak your observation' : 'Speech recognition not supported in this browser'}
                >
                  {isListening ? (
                    <>
                      <MicOff size={12} style={{ animation: 'pulse 1s infinite' }} />
                      <span>Stop Listening</span>
                    </>
                  ) : (
                    <>
                      <Mic size={12} />
                      <span>Speak Note (Voice-to-Text)</span>
                    </>
                  )}
                </button>
              </div>

              {/* Real-time Voice Transcription Indicator */}
              {isListening && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '6px 10px',
                    marginBottom: '6px',
                    borderRadius: '6px',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    fontSize: '11px',
                    color: 'var(--danger-crimson)'
                  }}
                >
                  <div
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--danger-crimson)',
                      boxShadow: '0 0 8px var(--danger-crimson)'
                    }}
                  />
                  <span style={{ fontWeight: 600 }}>Listening... Speak naturally (Hindi / English / Marathi)</span>
                  {interimTranscript && (
                    <span style={{ color: 'var(--text-secondary)', fontStyle: 'italic', marginLeft: 'auto' }}>
                      "{interimTranscript}"
                    </span>
                  )}
                </div>
              )}

              {speechError && (
                <div style={{ fontSize: '11px', color: 'var(--accent-amber)', marginBottom: '4px' }}>
                  ℹ️ {speechError}
                </div>
              )}

              <textarea
                rows={2}
                placeholder="Describe lighting, visible shadows, hostile crowds, or speak via mic..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{
                  width: '100%',
                  backgroundColor: 'var(--surface-elevated)',
                  border: '1px solid var(--border-medium)',
                  borderRadius: '6px',
                  padding: '8px 10px',
                  fontSize: '12px',
                  color: 'var(--text-primary)',
                  resize: 'none',
                  outline: 'none'
                }}
              />
            </div>

            {/* GPS Tag & Real Photo Attachment (Camera + Gallery) */}
            <div
              style={{
                backgroundColor: 'var(--surface-elevated)',
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--accent-amber)' }}>
                  <MapPin size={13} />
                  <span>GPS: {currentCoordinates[0].toFixed(4)}, {currentCoordinates[1].toFixed(4)}</span>
                </div>

                {/* Photo Action Buttons */}
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    type="button"
                    onClick={() => cameraInputRef.current?.click()}
                    className="btn-civic"
                    style={{
                      padding: '4px 8px',
                      fontSize: '11px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      border: '1px solid var(--border-medium)',
                      color: 'var(--text-primary)',
                      cursor: 'pointer'
                    }}
                    title="Take a live photo using camera"
                  >
                    <Camera size={12} />
                    <span>Camera</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => galleryInputRef.current?.click()}
                    className="btn-civic"
                    style={{
                      padding: '4px 8px',
                      fontSize: '11px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      border: '1px solid var(--border-medium)',
                      color: 'var(--text-primary)',
                      cursor: 'pointer'
                    }}
                    title="Upload photo from phone gallery or computer files"
                  >
                    <ImageIcon size={12} />
                    <span>Gallery / Files</span>
                  </button>
                </div>
              </div>

              {/* Photo Preview Thumbnail & Actions */}
              {photoPreview && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '6px 8px',
                    backgroundColor: 'rgba(16, 185, 129, 0.08)',
                    borderRadius: '6px',
                    border: '1px solid rgba(16, 185, 129, 0.25)'
                  }}
                >
                  <img
                    src={photoPreview}
                    alt="Hazard Evidence"
                    onClick={() => setIsPhotoLightboxOpen(true)}
                    style={{
                      width: '44px',
                      height: '44px',
                      objectFit: 'cover',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}
                    title="Click to view full photo"
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--safe-emerald)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Check size={12} /> Photo Evidence Attached
                    </div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {photoName || 'Captured Photo'}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button
                      type="button"
                      onClick={() => setIsPhotoLightboxOpen(true)}
                      className="btn-civic"
                      style={{ padding: '4px', border: 'none', color: 'var(--text-secondary)' }}
                      title="Enlarge Photo"
                    >
                      <Maximize2 size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="btn-civic"
                      style={{ padding: '4px', border: 'none', color: 'var(--danger-crimson)' }}
                      title="Remove Photo"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* AI Urgency & Risk Assessment Card */}
            {aiAssessment && (
              <div
                style={{
                  backgroundColor:
                    aiAssessment.urgency === 'high'
                      ? 'rgba(239, 68, 68, 0.08)'
                      : aiAssessment.urgency === 'medium'
                      ? 'rgba(245, 158, 11, 0.08)'
                      : 'rgba(16, 185, 129, 0.08)',
                  border: `1px solid ${
                    aiAssessment.urgency === 'high'
                      ? 'rgba(239, 68, 68, 0.3)'
                      : aiAssessment.urgency === 'medium'
                      ? 'rgba(245, 158, 11, 0.3)'
                      : 'rgba(16, 185, 129, 0.3)'
                  }`,
                  borderRadius: '8px',
                  padding: '9px 12px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Sparkles
                      size={13}
                      style={{
                        color:
                          aiAssessment.urgency === 'high'
                            ? 'var(--danger-crimson)'
                            : aiAssessment.urgency === 'medium'
                            ? 'var(--accent-amber)'
                            : 'var(--safe-emerald)'
                      }}
                    />
                    <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                      AI Risk Engine
                    </span>
                    <span
                      style={{
                        fontSize: '9px',
                        fontWeight: 800,
                        padding: '1px 5px',
                        borderRadius: '4px',
                        backgroundColor: geminiResult?.source === 'gemini-multimodal' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(59, 130, 246, 0.15)',
                        color: geminiResult?.source === 'gemini-multimodal' ? '#34d399' : 'var(--haven-blue)',
                        border: `1px solid ${geminiResult?.source === 'gemini-multimodal' ? '#10b981' : 'rgba(59,130,246,0.3)'}`
                      }}
                    >
                      {geminiResult?.source === 'gemini-multimodal' ? 'Gemini 2.5 Flash' : 'Hybrid AI'}
                    </span>
                  </div>

                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      color:
                        aiAssessment.urgency === 'high'
                          ? 'var(--danger-crimson)'
                          : aiAssessment.urgency === 'medium'
                          ? 'var(--accent-amber)'
                          : 'var(--safe-emerald)'
                    }}
                  >
                    {isAiEvaluating ? 'Verifying with AI...' : `Risk: ${aiAssessment.riskScore}/100`}
                  </span>
                </div>

                <p style={{ margin: '0 0 6px', fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.35 }}>
                  {aiAssessment.rationale}
                </p>

                {/* Photo Vision Audit Tag */}
                {geminiResult?.photoAssessment && photoPreview && (
                  <div style={{
                    fontSize: '10px',
                    color: '#93c5fd',
                    marginBottom: '6px',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    padding: '3px 8px',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <span>📷 Vision Audit:</span>
                    <strong>{geminiResult.photoAssessment}</strong>
                  </div>
                )}

                {/* Factors Chips */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {aiAssessment.factors.map((factor, idx) => (
                    <span
                      key={idx}
                      style={{
                        fontSize: '9px',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        backgroundColor: 'var(--surface-card)',
                        border: '1px solid var(--border-subtle)',
                        color: 'var(--text-secondary)'
                      }}
                    >
                      {factor}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Imminent Danger Prompt to Trigger Instant SOS */}
            {aiAssessment?.isImminentDanger && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '7px 10px',
                  borderRadius: '6px',
                  backgroundColor: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid var(--danger-crimson)',
                  color: 'var(--danger-crimson)',
                  fontSize: '11px',
                  fontWeight: 600
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ShieldAlert size={14} />
                  <span>Immediate threat detected: Are you in acute danger?</span>
                </div>
                {onTriggerSos && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onTriggerSos();
                    }}
                    style={{
                      padding: '3px 8px',
                      borderRadius: '4px',
                      backgroundColor: 'var(--danger-crimson)',
                      color: '#ffffff',
                      border: 'none',
                      fontSize: '10px',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Activate SOS Now
                  </button>
                )}
              </div>
            )}

            {/* Urgency Selector with AI Auto-Assigned Badge */}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Urgency:</span>
              {(['high', 'medium', 'low'] as const).map(level => {
                const isAiRecommended = aiAssessment?.urgency === level;
                const isSelected = urgency === level;

                return (
                  <button
                    type="button"
                    key={level}
                    onClick={() => handleUrgencyClick(level)}
                    className="btn-civic"
                    style={{
                      padding: '4px 10px',
                      fontSize: '10px',
                      textTransform: 'capitalize',
                      position: 'relative',
                      border: isSelected
                        ? level === 'high'
                          ? '1px solid var(--danger-crimson)'
                          : level === 'medium'
                          ? '1px solid var(--accent-amber)'
                          : '1px solid var(--safe-emerald)'
                        : '1px solid var(--border-subtle)',
                      backgroundColor: isSelected
                        ? level === 'high'
                          ? 'rgba(239, 68, 68, 0.15)'
                          : level === 'medium'
                          ? 'rgba(245, 158, 11, 0.15)'
                          : 'rgba(16, 185, 129, 0.15)'
                        : 'transparent',
                      color: isSelected
                        ? level === 'high'
                          ? 'var(--danger-crimson)'
                          : level === 'medium'
                          ? 'var(--accent-amber)'
                          : 'var(--safe-emerald)'
                        : 'var(--text-secondary)',
                      fontWeight: isSelected ? 700 : 500,
                      cursor: 'pointer'
                    }}
                  >
                    {level}
                    {isAiRecommended && !urgencyManuallyOverridden && (
                      <span
                        style={{
                          marginLeft: '4px',
                          fontSize: '8px',
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          padding: '1px 3px',
                          borderRadius: '3px'
                        }}
                      >
                        AI
                      </span>
                    )}
                  </button>
                );
              })}

              {urgencyManuallyOverridden && (
                <button
                  type="button"
                  onClick={() => {
                    setUrgencyManuallyOverridden(false);
                    if (aiAssessment) setUrgency(aiAssessment.urgency);
                  }}
                  style={{
                    marginLeft: 'auto',
                    border: 'none',
                    background: 'none',
                    color: 'var(--text-muted)',
                    fontSize: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '3px',
                    cursor: 'pointer'
                  }}
                  title="Reset to AI Recommended urgency"
                >
                  <RefreshCw size={10} /> Reset AI
                </button>
              )}
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
              <button
                type="button"
                onClick={onClose}
                className="btn-civic"
                style={{ flex: 1, padding: '9px', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-civic btn-primary-amber"
                style={{
                  flex: 1.4,
                  padding: '9px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  cursor: 'pointer'
                }}
              >
                <ShieldAlert size={14} /> Submit Audit
              </button>
            </div>
          </form>
        )}

        {/* Photo Full-View Lightbox Modal */}
        {isPhotoLightboxOpen && photoPreview && (
          <div
            className="modal-overlay"
            style={{ zIndex: 1300, backgroundColor: 'rgba(0,0,0,0.85)' }}
            onClick={() => setIsPhotoLightboxOpen(false)}
          >
            <div
              style={{
                position: 'relative',
                maxWidth: '90vw',
                maxHeight: '85vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={photoPreview}
                alt="Enlarged Hazard Proof"
                style={{
                  maxWidth: '100%',
                  maxHeight: '80vh',
                  objectFit: 'contain',
                  borderRadius: '8px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.8)'
                }}
              />
              <button
                onClick={() => setIsPhotoLightboxOpen(false)}
                className="btn-civic"
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  padding: '8px',
                  backgroundColor: 'rgba(0,0,0,0.6)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '50%',
                  cursor: 'pointer'
                }}
              >
                <X size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
