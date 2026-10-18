import React, { useState, useRef } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSilentSosTriggered: () => void;
  currentCoordinates?: [number, number];
}

export const DiscreetEscortModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSilentSosTriggered,
  currentCoordinates
}) => {
  const [display, setDisplay] = useState('0');
  const [previousVal, setPreviousVal] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [sosSent, setSosSent] = useState(false);
  const clearTapCountRef = useRef(0);
  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  if (!isOpen) return null;

  const handleDigit = (digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const handleDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setPreviousVal(null);
    setOperator(null);
    setWaitingForOperand(false);

    // Triple tap AC/C to exit disguise safely
    clearTapCountRef.current += 1;
    if (clearTapCountRef.current >= 3) {
      clearTapCountRef.current = 0;
      onClose();
    }
  };

  const triggerSilentSos = () => {
    if (navigator.vibrate) {
      try {
        navigator.vibrate([100, 50, 100]);
      } catch {}
    }
    if (currentCoordinates) {
      // Trace coordinates quietly for watchdog telemetry
    }
    onSilentSosTriggered();
    setSosSent(true);
    // Keep calculator visible and working so attacker notices nothing
  };

  const handleOperator = (nextOp: string) => {
    const inputValue = parseFloat(display);

    if (previousVal === null) {
      setPreviousVal(inputValue);
    } else if (operator) {
      const currentVal = previousVal || 0;
      let result = currentVal;
      if (operator === '+') result = currentVal + inputValue;
      else if (operator === '-') result = currentVal - inputValue;
      else if (operator === '×') result = currentVal * inputValue;
      else if (operator === '÷') result = inputValue !== 0 ? currentVal / inputValue : 0;
      
      setPreviousVal(result);
      setDisplay(String(result));
    }

    setWaitingForOperand(true);
    setOperator(nextOp);
  };

  const handleEquals = () => {
    // Secret Panic Code Detection: 911, 112, 4444, 999
    if (display === '911' || display === '112' || display === '4444' || display === '999') {
      triggerSilentSos();
      setDisplay('0');
      setPreviousVal(null);
      setOperator(null);
      return;
    }

    // Secret Exit Code: 0000
    if (display === '0000') {
      onClose();
      return;
    }

    const inputValue = parseFloat(display);
    if (operator && previousVal !== null) {
      let result = previousVal;
      if (operator === '+') result = previousVal + inputValue;
      else if (operator === '-') result = previousVal - inputValue;
      else if (operator === '×') result = previousVal * inputValue;
      else if (operator === '÷') result = inputValue !== 0 ? previousVal / inputValue : 0;

      setDisplay(String(result));
      setPreviousVal(null);
      setOperator(null);
      setWaitingForOperand(true);
    }
  };

  const handleEqualsMouseDown = () => {
    longPressTimerRef.current = setTimeout(() => {
      triggerSilentSos();
    }, 1800);
  };

  const handleEqualsMouseUp = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  return (
    <div
      className="discreet-calculator-overlay"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: '#000000',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: '24px 20px calc(24px + env(safe-area-inset-bottom, 0px))',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}
    >
      {/* Discreet Exit & Stealth Status Indicator */}
      <div style={{
        position: 'absolute',
        top: 'calc(16px + env(safe-area-inset-top, 0px))',
        left: '20px',
        right: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        {/* Secret stealth indicator: tiny dot glows green if SOS beacon was dispatched */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: sosSent ? '#10b981' : 'transparent',
            boxShadow: sosSent ? '0 0 8px #10b981' : 'none'
          }} />
          {sosSent && (
            <span style={{ fontSize: '9px', color: '#10b981', opacity: 0.6, fontWeight: 700 }}>
              BEACON ARMED
            </span>
          )}
        </div>

        {/* Discreet Return Button */}
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: 'rgba(255, 255, 255, 0.25)',
            fontSize: '11px',
            cursor: 'pointer',
            padding: '6px 10px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
          title="Exit Stealth Screen"
        >
          <span>✕ Exit</span>
        </button>
      </div>

      {/* Calculator LCD Display */}
      <div style={{
        width: '100%',
        textAlign: 'right',
        color: '#ffffff',
        fontSize: display.length > 8 ? '42px' : '58px',
        fontWeight: 300,
        padding: '0 8px 16px',
        lineHeight: 1,
        letterSpacing: '-0.02em',
        wordBreak: 'break-all'
      }}>
        {display}
      </div>

      {/* Calculator Keypad Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '12px',
        width: '100%',
        maxWidth: '380px',
        margin: '0 auto'
      }}>
        {/* Row 1 */}
        <button
          onClick={handleClear}
          style={keyStyle('#a5a5a5', '#000000')}
        >
          AC
        </button>
        <button
          onClick={() => {
            const val = parseFloat(display);
            setDisplay(String(val * -1));
          }}
          style={keyStyle('#a5a5a5', '#000000')}
        >
          ±
        </button>
        <button
          onClick={() => {
            const val = parseFloat(display);
            setDisplay(String(val / 100));
          }}
          style={keyStyle('#a5a5a5', '#000000')}
        >
          %
        </button>
        <button
          onClick={() => handleOperator('÷')}
          style={keyStyle(operator === '÷' ? '#ffffff' : '#f59e0b', operator === '÷' ? '#f59e0b' : '#ffffff')}
        >
          ÷
        </button>

        {/* Row 2 */}
        <button onClick={() => handleDigit('7')} style={keyStyle('#333333')}>7</button>
        <button onClick={() => handleDigit('8')} style={keyStyle('#333333')}>8</button>
        <button onClick={() => handleDigit('9')} style={keyStyle('#333333')}>9</button>
        <button
          onClick={() => handleOperator('×')}
          style={keyStyle(operator === '×' ? '#ffffff' : '#f59e0b', operator === '×' ? '#f59e0b' : '#ffffff')}
        >
          ×
        </button>

        {/* Row 3 */}
        <button onClick={() => handleDigit('4')} style={keyStyle('#333333')}>4</button>
        <button onClick={() => handleDigit('5')} style={keyStyle('#333333')}>5</button>
        <button onClick={() => handleDigit('6')} style={keyStyle('#333333')}>6</button>
        <button
          onClick={() => handleOperator('-')}
          style={keyStyle(operator === '-' ? '#ffffff' : '#f59e0b', operator === '-' ? '#f59e0b' : '#ffffff')}
        >
          −
        </button>

        {/* Row 4 */}
        <button onClick={() => handleDigit('1')} style={keyStyle('#333333')}>1</button>
        <button onClick={() => handleDigit('2')} style={keyStyle('#333333')}>2</button>
        <button onClick={() => handleDigit('3')} style={keyStyle('#333333')}>3</button>
        <button
          onClick={() => handleOperator('+')}
          style={keyStyle(operator === '+' ? '#ffffff' : '#f59e0b', operator === '+' ? '#f59e0b' : '#ffffff')}
        >
          +
        </button>

        {/* Row 5 */}
        <button
          onClick={() => handleDigit('0')}
          style={{
            ...keyStyle('#333333'),
            gridColumn: 'span 2',
            borderRadius: '40px',
            textAlign: 'left',
            paddingLeft: '28px'
          }}
        >
          0
        </button>
        <button onClick={handleDecimal} style={keyStyle('#333333')}>.</button>
        <button
          onClick={handleEquals}
          onMouseDown={handleEqualsMouseDown}
          onMouseUp={handleEqualsMouseUp}
          onTouchStart={handleEqualsMouseDown}
          onTouchEnd={handleEqualsMouseUp}
          style={keyStyle('#f59e0b', '#ffffff')}
        >
          =
        </button>
      </div>

      <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '10px', color: 'rgba(255, 255, 255, 0.15)' }}>
        Standard Calculator v2.4
      </div>
    </div>
  );
};

const keyStyle = (bgColor: string, textColor: string = '#ffffff'): React.CSSProperties => ({
  backgroundColor: bgColor,
  color: textColor,
  border: 'none',
  borderRadius: '50%',
  aspectRatio: '1 / 1',
  fontSize: '24px',
  fontWeight: 400,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  outline: 'none',
  userSelect: 'none',
  transition: 'filter 0.1s ease',
  WebkitTapHighlightColor: 'transparent'
});
