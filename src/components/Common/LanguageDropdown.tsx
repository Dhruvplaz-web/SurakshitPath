import React, { useState, useRef, useEffect } from 'react';
import { AppLanguage } from '../../types/routing';
import { Globe, ChevronDown, Check } from 'lucide-react';

interface Props {
  currentLanguage: AppLanguage;
  onSelectLanguage: (lang: AppLanguage) => void;
}

interface LangItem {
  id: AppLanguage;
  label: string;
  native: string;
}

export const LanguageDropdown: React.FC<Props> = ({
  currentLanguage,
  onSelectLanguage
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages: LangItem[] = [
    { id: 'en', label: 'English', native: 'EN' },
    { id: 'mr', label: 'मराठी', native: 'MR (Pune)' },
    { id: 'hi', label: 'हिंदी', native: 'HI' }
  ];

  const currentLangObj = languages.find(l => l.id === currentLanguage) || languages[0];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div ref={dropdownRef} style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="btn-civic"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          padding: '4px 10px',
          backgroundColor: 'var(--surface-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '9999px',
          fontSize: '11px',
          fontWeight: 600,
          color: 'var(--text-secondary)',
          cursor: 'pointer'
        }}
        title="Change App Language (English, Marathi, Hindi)"
      >
        <Globe size={12} color="var(--text-muted)" />
        <span style={{ fontWeight: 700 }}>{currentLangObj.id.toUpperCase()}</span>
        <ChevronDown size={11} style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }} />
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 6px)',
          right: '0',
          width: '140px',
          backgroundColor: 'var(--surface-elevated)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '8px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
          padding: '4px',
          zIndex: 2000,
          animation: 'slideUp 0.15s ease-out'
        }}>
          {languages.map(lang => {
            const isSelected = lang.id === currentLanguage;
            return (
              <div
                key={lang.id}
                onClick={() => {
                  onSelectLanguage(lang.id);
                  setIsOpen(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '6px 10px',
                  borderRadius: '5px',
                  fontSize: '11px',
                  fontWeight: isSelected ? 700 : 500,
                  color: isSelected ? 'var(--accent-amber)' : 'var(--text-primary)',
                  backgroundColor: isSelected ? 'var(--surface-hover)' : 'transparent',
                  cursor: 'pointer'
                }}
                onMouseEnter={e => {
                  if (!isSelected) (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--surface-hover)';
                }}
                onMouseLeave={e => {
                  if (!isSelected) (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                }}
              >
                <span>{lang.label}</span>
                {isSelected && <Check size={12} color="var(--accent-amber)" />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
