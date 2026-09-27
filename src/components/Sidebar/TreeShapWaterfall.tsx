import React, { useState, useEffect } from 'react';
import { RouteOption, AppLanguage } from '../../types/routing';
import { predictSafetyWithTreeShap, SafetyFeatureVector, MODEL_BASE_VALUE } from '../../engine/mlSafetyModel';
import { Cpu, ShieldCheck, Sparkles } from 'lucide-react';
import { aiHubService } from '../../services/aiHubService';

interface Props {
  activeRoute: RouteOption;
  language?: AppLanguage;
}

export const TreeShapWaterfall: React.FC<Props> = ({ activeRoute, language = 'en' }) => {
  const [aiExplanation, setAiExplanation] = useState<string>('');
  const [isExplaining, setIsExplaining] = useState(false);

  // Extract aggregate feature vector from active route
  const features: SafetyFeatureVector = {
    roadClassWeight: activeRoute.routeType === 'safe' ? 0.95 : activeRoute.routeType === 'balanced' ? 0.70 : 0.25,
    lampDensityPer100m: Number((activeRoute.factors.lighting * 3.2).toFixed(1)),
    commercialPoiDensity: Math.round(activeRoute.factors.activity * 7),
    distToTransitMeters: Math.round((1 - activeRoute.factors.transit) * 400),
    distToEmergencyMeters: Math.round((1 - activeRoute.factors.emergency) * 1200),
    roadWidthLanes: activeRoute.routeType === 'safe' ? 6 : 2,
    nightHour: 23, // 11 PM
    activeHazardSeverity: activeRoute.factors.incidentPenalty,
    pedestrianFootpath: activeRoute.routeType === 'safe' ? 1.0 : activeRoute.routeType === 'balanced' ? 0.75 : 0.1
  };

  const mlResult = predictSafetyWithTreeShap(features);

  useEffect(() => {
    let isCurrent = true;
    setIsExplaining(true);

    aiHubService
      .explainTreeShapWithGemini({
        routeName: activeRoute.name,
        routeType: activeRoute.routeType,
        safetyScore: mlResult.predictedSafetyScore,
        shapValues: mlResult.shapValues,
        language
      })
      .then((narrative) => {
        if (isCurrent) {
          setAiExplanation(narrative);
          setIsExplaining(false);
        }
      })
      .catch(() => {
        if (isCurrent) setIsExplaining(false);
      });

    return () => {
      isCurrent = false;
    };
  }, [activeRoute.id, activeRoute.routeType, language, mlResult.predictedSafetyScore]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* Header with Model Confidence */}
      <div style={{
        backgroundColor: 'var(--safe-emerald-subtle)',
        border: '1px solid var(--safe-emerald)',
        borderRadius: 'var(--radius-md)',
        padding: '10px 14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Cpu size={16} color="var(--safe-emerald)" />
          <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-primary)' }}>
            TreeSHAP Local Attribution Model
          </span>
        </div>

        <div style={{
          fontSize: '10px',
          fontWeight: 800,
          backgroundColor: 'rgba(16, 185, 129, 0.25)',
          color: 'var(--safe-emerald)',
          padding: '2px 8px',
          borderRadius: 'var(--radius-full)'
        }}>
          {Math.round(mlResult.modelConfidence * 100)}% Confidence
        </div>
      </div>

      {/* Gemini AI TreeSHAP Explanation Card */}
      <div style={{
        backgroundColor: 'rgba(59, 130, 246, 0.08)',
        border: '1px solid rgba(59, 130, 246, 0.3)',
        borderRadius: 'var(--radius-md)',
        padding: '10px 14px',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 800, color: 'var(--haven-blue)' }}>
            <Sparkles size={13} />
            <span>AI Safety Reasoning</span>
          </div>
          <span style={{ fontSize: '9px', fontWeight: 800, padding: '1px 5px', borderRadius: '4px', backgroundColor: 'rgba(59, 130, 246, 0.2)', color: 'var(--haven-blue)' }}>
            Gemini + TreeSHAP
          </span>
        </div>
        <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
          {isExplaining ? 'Generating natural safety explanation...' : aiExplanation}
        </p>
      </div>

      {/* Model Summary Row */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'var(--surface-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        padding: '12px 14px',
        boxShadow: 'var(--shadow-subtle)'
      }}>
        <div>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>BASE VALUE E[f(x)]</div>
          <div className="mono-num" style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-secondary)' }}>
            {MODEL_BASE_VALUE.toFixed(1)} pts
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>PREDICTED SAFETY SCORE</div>
          <div className="mono-num" style={{
            fontSize: '18px',
            fontWeight: 800,
            color: mlResult.predictedSafetyScore >= 70 ? 'var(--safe-emerald)' : 'var(--danger-crimson)'
          }}>
            {mlResult.predictedSafetyScore} / 100
          </div>
        </div>
      </div>

      {/* TreeSHAP Waterfall Breakdown */}
      <div style={{
        backgroundColor: 'var(--surface-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: '14px',
        boxShadow: 'var(--shadow-subtle)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Feature Attributions (φ_i)
          </span>
          <span style={{ fontSize: '10px', color: 'var(--accent-amber)', fontWeight: 700 }}>SHAP Additive Sum</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {mlResult.shapValues.map((item) => {
            const isPositive = item.shapValue >= 0;
            const barWidth = Math.min(100, Math.abs(item.shapValue) * 4.5);

            return (
              <div key={item.featureName} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px' }}>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{item.displayName}</span>
                  <span className="mono-num" style={{
                    fontWeight: 800,
                    color: isPositive ? 'var(--safe-emerald)' : 'var(--danger-crimson)'
                  }}>
                    {isPositive ? `+${item.shapValue.toFixed(1)}` : item.shapValue.toFixed(1)} pts
                  </span>
                </div>

                {/* Micro Bar */}
                <div style={{
                  height: '5px',
                  backgroundColor: 'var(--surface-elevated)',
                  borderRadius: 'var(--radius-full)',
                  overflow: 'hidden',
                  display: 'flex',
                  justifyContent: isPositive ? 'flex-start' : 'flex-end',
                  border: '1px solid var(--border-subtle)'
                }}>
                  <div style={{
                    width: `${barWidth}%`,
                    height: '100%',
                    backgroundColor: isPositive ? 'var(--safe-emerald)' : 'var(--danger-crimson)',
                    borderRadius: 'var(--radius-full)',
                    boxShadow: isPositive ? 'var(--shadow-glow-emerald)' : 'var(--shadow-glow-crimson)'
                  }} />
                </div>

                <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                  {item.description}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Decision Boundary Explanation */}
      <div style={{
        backgroundColor: 'var(--surface-elevated)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        padding: '10px 12px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '11px',
        color: 'var(--text-secondary)'
      }}>
        <ShieldCheck size={16} color="var(--safe-emerald)" style={{ flexShrink: 0 }} />
        <span>
          <strong>Decision Boundary:</strong> {mlResult.decisionBoundary}. Grounded in SafetiPin empirical night mobility audit standards.
        </span>
      </div>
    </div>
  );
};

export default TreeShapWaterfall;
