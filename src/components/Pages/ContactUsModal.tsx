import React, { useState } from 'react';
import { X, Mail, Phone, Building, Send, CheckCircle2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactUsModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'civic_feedback',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.message) return;
    setSubmitted(true);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-title"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(5, 7, 10, 0.85)',
        backdropFilter: 'blur(8px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '720px',
          maxHeight: '88vh',
          backgroundColor: 'var(--surface-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '12px',
          boxShadow: '0 24px 48px rgba(0, 0, 0, 0.9)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'fadeIn 0.2s ease-out'
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'var(--surface-elevated)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: 'rgba(59, 130, 246, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--haven-blue)'
              }}
            >
              <Mail size={18} />
            </div>
            <div>
              <h2 id="contact-title" style={{ fontSize: '15px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                Contact Us &amp; Civic Escalations
              </h2>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                Pune Municipal Support, Research Collaboration &amp; Emergency Escalation
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close Contact Us"
            className="btn-civic"
            style={{ padding: '6px', borderRadius: '6px', background: 'transparent' }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div
          style={{
            padding: '20px',
            overflowY: 'auto',
            fontSize: '13px',
            lineHeight: 1.6,
            color: 'var(--text-secondary)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}
        >
          {/* Emergency Notice */}
          <div
            style={{
              padding: '12px 14px',
              backgroundColor: 'rgba(239, 68, 68, 0.08)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              borderRadius: '8px',
              display: 'flex',
              gap: '12px',
              alignItems: 'center'
            }}
          >
            <Phone size={18} color="var(--danger-crimson)" style={{ flexShrink: 0 }} />
            <div style={{ fontSize: '12px' }}>
              <strong style={{ color: 'var(--text-primary)' }}>Emergency In Progress?</strong> Call National Emergency <strong>112</strong> or Pune Damini Squad at <strong>1091 / 020-26126296</strong> for instant police dispatch.
            </div>
          </div>

          {/* Contact Directory */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '10px' }}>
            <div style={{ padding: '12px', backgroundColor: 'var(--surface-elevated)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Building size={14} color="var(--accent-amber)" /> Municipal Civic Cell
              </div>
              <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                Pune Municipal Corporation (PMC) &amp; PCMC Smart City Desk
              </div>
              <div style={{ fontSize: '12px', color: 'var(--accent-amber)', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
                civic-desk@surakshitpath.org
              </div>
            </div>

            <div style={{ padding: '12px', backgroundColor: 'var(--surface-elevated)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Mail size={14} color="var(--safe-emerald)" /> Research &amp; Open Data
              </div>
              <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                Algorithm Audit, Data Partnerships &amp; University Inquiries
              </div>
              <div style={{ fontSize: '12px', color: 'var(--safe-emerald)', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
                research@surakshitpath.org
              </div>
            </div>
          </div>

          {/* Interactive Form */}
          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '14px' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '10px' }}>
              Send a Civic Feedback or Infrastructure Inquiry
            </div>

            {submitted ? (
              <div
                style={{
                  padding: '16px',
                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid var(--safe-emerald)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <CheckCircle2 size={22} color="var(--safe-emerald)" />
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '13px' }}>
                    Civic Ticket Dispatched Successfully
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    Thank you. Your message has been logged with reference ID <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-amber)' }}>TKT-{Date.now().toString().slice(-6)}</span>.
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Your Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Anjali Deshmukh"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      style={{
                        width: '100%',
                        padding: '8px 10px',
                        borderRadius: '6px',
                        backgroundColor: 'var(--surface-elevated)',
                        border: '1px solid var(--border-subtle)',
                        color: '#fff',
                        fontSize: '12px',
                        outline: 'none'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="anjali@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      style={{
                        width: '100%',
                        padding: '8px 10px',
                        borderRadius: '6px',
                        backgroundColor: 'var(--surface-elevated)',
                        border: '1px solid var(--border-subtle)',
                        color: '#fff',
                        fontSize: '12px',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Topic</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: '6px',
                      backgroundColor: 'var(--surface-elevated)',
                      border: '1px solid var(--border-subtle)',
                      color: '#fff',
                      fontSize: '12px',
                      outline: 'none'
                    }}
                  >
                    <option value="civic_feedback">Infrastructure / Street Lighting Feedback</option>
                    <option value="safe_haven">Register a New 24/7 Safe Haven Store</option>
                    <option value="volunteer">Join as Suraksha Sahayak Volunteer</option>
                    <option value="technical">Algorithm &amp; Bug Escalation</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Message / Road Specifics</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Describe road stretch, landmark, or inquiry..."
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: '6px',
                      backgroundColor: 'var(--surface-elevated)',
                      border: '1px solid var(--border-subtle)',
                      color: '#fff',
                      fontSize: '12px',
                      outline: 'none',
                      resize: 'none'
                    }}
                  />
                </div>

                <button
                  type="submit"
                  className="btn-civic"
                  style={{
                    backgroundColor: 'var(--accent-amber)',
                    color: '#000',
                    fontWeight: 700,
                    padding: '8px 16px',
                    borderRadius: '6px',
                    alignSelf: 'flex-start'
                  }}
                >
                  <Send size={13} /> Submit Escalation
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '12px 20px',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            backgroundColor: 'var(--surface-elevated)'
          }}
        >
          <button
            onClick={onClose}
            className="btn-civic"
            style={{
              padding: '6px 16px',
              borderRadius: '6px'
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
