import React, { useState, useRef, useEffect } from 'react';
import { UserRole, AppLanguage } from '../../types/routing';
import { getTranslation } from '../../services/localizationService';
import { User, Building, Users, ChevronDown, Check } from 'lucide-react';

interface Props {
  currentRole: UserRole;
  onSelectRole: (role: UserRole) => void;
  currentLanguage: AppLanguage;
}

interface RoleOption {
  id: UserRole;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  badge: string;
}

export const RoleDropdown: React.FC<Props> = ({
  currentRole,
  onSelectRole,
  currentLanguage
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const t = getTranslation(currentLanguage);

  const roles: RoleOption[] = [
    {
      id: 'commuter',
      title: t.roleCommuter,
      subtitle: 'Multi-Modal Routes, Weather, SOS & Trusted Guardians',
      icon: <User size={15} color="var(--accent-amber)" />,
      badge: 'Core'
    },
    {
      id: 'admin',
      title: t.roleAdmin,
      subtitle: 'Municipal Road Development, Streetlights & Dark-Spots',
      icon: <Building size={15} color="var(--haven-blue)" />,
      badge: 'PMC / PCMC'
    },
    {
      id: 'volunteer',
      title: t.roleVolunteer,
      subtitle: 'Emergency Safety Responders & Police Damini Squad Liaison',
      icon: <Users size={15} color="#ec4899" />,
      badge: 'First Responder'
    }
  ];

  const activeRoleOption = roles.find(r => r.id === currentRole) || roles[0];

  // Close when clicking outside
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
          gap: '8px',
          padding: '6px 14px',
          backgroundColor: 'var(--surface-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '8px',
          fontSize: '12px',
          fontWeight: 600,
          color: 'var(--text-primary)',
          cursor: 'pointer',
          transition: 'all 0.15s ease',
          boxShadow: '0 2px 6px rgba(0,0,0,0.08)'
        }}
        title="Select Civic Role (Commuter, Admin, Guardian, Volunteer)"
      >
        <span style={{ display: 'flex', alignItems: 'center' }}>
          {activeRoleOption.icon}
        </span>
        <span>{activeRoleOption.title}</span>
        <span style={{
          fontSize: '10px',
          padding: '1px 6px',
          borderRadius: '9999px',
          backgroundColor: 'var(--accent-amber-glow)',
          color: 'var(--accent-amber)',
          fontWeight: 700
        }}>
          {activeRoleOption.badge}
        </span>
        <ChevronDown size={13} style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease', color: 'var(--text-muted)' }} />
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 6px)',
          left: '0',
          width: '300px',
          backgroundColor: 'var(--surface-elevated)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '10px',
          boxShadow: '0 12px 32px rgba(0,0,0,0.4)',
          padding: '6px',
          zIndex: 2000,
          animation: 'slideUp 0.15s ease-out'
        }}>
          <div style={{
            padding: '6px 10px',
            fontSize: '10px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            color: 'var(--text-muted)',
            borderBottom: '1px solid var(--border-subtle)',
            marginBottom: '4px'
          }}>
            Switch Operational Role
          </div>

          {roles.map(role => {
            const isSelected = role.id === currentRole;
            return (
              <div
                key={role.id}
                onClick={() => {
                  onSelectRole(role.id);
                  setIsOpen(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '8px 10px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  backgroundColor: isSelected ? 'var(--surface-hover)' : 'transparent',
                  border: isSelected ? '1px solid var(--border-subtle)' : '1px solid transparent',
                  transition: 'background 0.12s ease'
                }}
                onMouseEnter={e => {
                  if (!isSelected) (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--surface-hover)';
                }}
                onMouseLeave={e => {
                  if (!isSelected) (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                }}
              >
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '6px',
                  backgroundColor: isSelected ? 'var(--accent-amber-glow)' : 'var(--surface-card)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {role.icon}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: isSelected ? 'var(--accent-amber)' : 'var(--text-primary)'
                  }}>
                    <span>{role.title}</span>
                    {isSelected && <Check size={14} color="var(--accent-amber)" />}
                  </div>
                  <div style={{
                    fontSize: '11px',
                    color: 'var(--text-muted)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    marginTop: '1px'
                  }}>
                    {role.subtitle}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
