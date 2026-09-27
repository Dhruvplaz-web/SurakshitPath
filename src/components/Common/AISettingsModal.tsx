import React, { useState } from 'react';
import { X, Sparkles, Key, CheckCircle2, ExternalLink, ShieldCheck, Zap } from 'lucide-react';
import { aiHubService } from '../../services/aiHubService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const AISettingsModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [geminiKey, setGeminiKey] = useState(
    localStorage.getItem('surakshit_gemini_api_key') || ''
  );
  const [grokKey, setGrokKey] = useState(
    localStorage.getItem('surakshit_grok_api_key') || ''
  );
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    aiHubService.setCustomKeys(geminiKey, grokKey);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  const hasEnvGemini = Boolean((import.meta as any).env?.VITE_GEMINI_API_KEY);
  const hasEnvGrok = Boolean((import.meta as any).env?.VITE_GROK_API_KEY);

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(5, 7, 12, 0.85)',
        backdropFilter: 'blur(12px)',
        zIndex: 6000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
    >
      <div
        className="modal-dialog"
        style={{
          width: '100%',
          maxWidth: '480px',
          backgroundColor: 'var(--surface-card)',
          borderRadius: '20px',
          border: '1.5px solid var(--border-medium)',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.75)',
          padding: '24px',
          color: 'var(--text-primary)',
          position: 'relative'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              backgroundColor: 'rgba(59, 130, 246, 0.15)',
              border: '1px solid var(--haven-blue)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--haven-blue)'
            }}>
              <Sparkles size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '17px', fontWeight: 800, margin: 0 }}>
                AI Engine Configuration
              </h2>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                Powers multimodal hazard audits & real-time Pune street intelligence.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="btn-civic"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: 'var(--surface-hover)',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-muted)',
              cursor: 'pointer'
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Feature status callout */}
        <div style={{
          backgroundColor: 'var(--surface-elevated)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '12px',
          padding: '12px 14px',
          marginBottom: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}>
              <Zap size={13} color="var(--safe-emerald)" />
              Google Gemini 2.5 Flash
            </span>
            <span style={{
              fontSize: '10px',
              fontWeight: 800,
              padding: '1px 6px',
              borderRadius: '4px',
              backgroundColor: (geminiKey || hasEnvGemini) ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.15)',
              color: (geminiKey || hasEnvGemini) ? 'var(--safe-emerald)' : 'var(--accent-amber)'
            }}>
              {(geminiKey || hasEnvGemini) ? 'Active' : 'Offline Heuristic'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}>
              <Zap size={13} color="var(--haven-blue)" />
              xAI Grok Real-Time Feed
            </span>
            <span style={{
              fontSize: '10px',
              fontWeight: 800,
              padding: '1px 6px',
              borderRadius: '4px',
              backgroundColor: (grokKey || hasEnvGrok) ? 'rgba(59, 130, 246, 0.2)' : 'rgba(245, 158, 11, 0.15)',
              color: (grokKey || hasEnvGrok) ? 'var(--haven-blue)' : 'var(--accent-amber)'
            }}>
              {(grokKey || hasEnvGrok) ? 'Active' : 'Municipal Archive'}
            </span>
          </div>
        </div>

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Gemini API Key */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: 700 }}>
                Google Gemini API Key
              </label>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                style={{ fontSize: '11px', color: 'var(--haven-blue)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '3px' }}
              >
                <span>Get Free Key</span>
                <ExternalLink size={10} />
              </a>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                value={geminiKey}
                onChange={e => setGeminiKey(e.target.value)}
                placeholder={hasEnvGemini ? 'Loaded from .env (Override here)' : 'AIzaSy...'}
                className="input-civic"
                style={{ width: '100%', paddingLeft: '32px', fontSize: '12px' }}
              />
              <Key size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>
              Powers multimodal hazard photo verification & Indic (Marathi/Hindi) NLP.
            </div>
          </div>

          {/* Grok API Key */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: 700 }}>
                xAI Grok API Key
              </label>
              <a
                href="https://console.x.ai/"
                target="_blank"
                rel="noreferrer"
                style={{ fontSize: '11px', color: 'var(--haven-blue)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '3px' }}
              >
                <span>Get Grok Key</span>
                <ExternalLink size={10} />
              </a>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                value={grokKey}
                onChange={e => setGrokKey(e.target.value)}
                placeholder={hasEnvGrok ? 'Loaded from .env (Override here)' : 'xai-...'}
                className="input-civic"
                style={{ width: '100%', paddingLeft: '32px', fontSize: '12px' }}
              />
              <Key size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>
              Powers real-time social alerts (@PuneCityTraffic, waterlogging, sudden diversions).
            </div>
          </div>

          {/* Privacy Note */}
          <div style={{
            fontSize: '10px',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            lineHeight: 1.3
          }}>
            <ShieldCheck size={14} color="var(--safe-emerald)" style={{ flexShrink: 0 }} />
            <span>Keys are stored strictly locally in your browser memory and never transmitted to our telemetry servers.</span>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
            <button
              type="button"
              onClick={onClose}
              className="btn-civic"
              style={{ flex: 1, padding: '10px', fontSize: '12px', fontWeight: 700 }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-civic btn-primary-amber"
              style={{ flex: 2, padding: '10px', fontSize: '12px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
            >
              {savedSuccess ? (
                <>
                  <CheckCircle2 size={15} />
                  <span>Keys Saved!</span>
                </>
              ) : (
                <>
                  <Sparkles size={15} />
                  <span>Save & Activate AI</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default AISettingsModal;
