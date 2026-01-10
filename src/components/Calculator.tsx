import React, { useState, useEffect, useCallback } from 'react';

type ButtonType = 'number' | 'operator' | 'function';
type ButtonConfig = {
  label: string;
  value: string;
  type: ButtonType;
};

export const Calculator: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [value, setValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [lastKeyPressed, setLastKeyPressed] = useState<string>('');

  const inputDigit = useCallback((digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      if (display.replace(/[^0-9]/g, '').length >= 9) return;
      setDisplay(display === '0' ? digit : display + digit);
    }
  }, [display, waitingForOperand]);

  const inputDot = useCallback(() => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  }, [display, waitingForOperand]);

  const clearDisplay = useCallback(() => {
    setDisplay('0');
    setLastKeyPressed('');
    if (display === '0' && lastKeyPressed !== '=') {
      setValue(null);
      setOperator(null);
      setWaitingForOperand(false);
    }
  }, [display, lastKeyPressed]);

  const toggleSign = useCallback(() => {
    const newValue = parseFloat(display) * -1;
    setDisplay(String(newValue));
  }, [display]);

  const inputPercent = useCallback(() => {
    const currentValue = parseFloat(display);
    if (currentValue === 0) return;
    const newValue = currentValue / 100;
    setDisplay(String(newValue));
  }, [display]);

  const calculate = useCallback((left: number, right: number, op: string): number => {
    switch (op) {
      case '/': return right === 0 ? NaN : left / right;
      case '*': return left * right;
      case '+': return left + right;
      case '-': return left - right;
      case '=': return right;
      default: return right;
    }
  }, []);

  const performOperation = useCallback((nextOperator: string) => {
    const inputValue = parseFloat(display);

    if (value === null) {
      setValue(inputValue);
    } else if (operator) {
      const currentValue = value || 0;
      const newValue = calculate(currentValue, inputValue, operator);
      setValue(newValue);
      setDisplay(String(newValue));
    }

    setWaitingForOperand(true);
    setOperator(nextOperator);
  }, [display, value, operator, calculate]);

  const formatDisplay = (numStr: string): string => {
    const num = parseFloat(numStr);
    if (isNaN(num)) return 'Error';

    if (numStr.length > 9) {
      return num.toPrecision(6).toString().replace('+', '');
    }

    const parts = numStr.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  };

  const getFontSize = (): string => {
    const len = display.length;
    if (len > 8) return 'text-4xl';
    if (len > 6) return 'text-5xl';
    return 'text-6xl';
  };

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    let { key } = event;

    if (key === 'Enter') key = '=';
    if (key === '/') event.preventDefault();

    if (/\d/.test(key)) {
      inputDigit(key);
    } else if (key === '.') {
      inputDot();
    } else if (key === '=' || key === 'Enter') {
      performOperation('=');
    } else if (key === 'Backspace') {
      setDisplay(display.length > 1 ? display.slice(0, -1) : '0');
    } else if (key === 'Escape') {
      clearDisplay();
    } else if (['+', '-', '*', '/'].includes(key)) {
      performOperation(key);
    } else if (key === '%') {
      inputPercent();
    }
    setLastKeyPressed(key);
  }, [display, inputDigit, inputDot, performOperation, clearDisplay, inputPercent]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const getButtonClass = (btn: ButtonConfig): string => {
    const base = "h-16 rounded-full flex items-center justify-center text-2xl font-normal transition-all duration-75 select-none shadow-[0_1px_1px_rgba(0,0,0,0.2)]";

    if (btn.type === 'function') {
      return `${base} bg-[#a5a5a5] text-black active:bg-[#c8c8c8] hover:bg-[#b8b8b8]`;
    }
    if (btn.type === 'operator') {
      const isActive = operator === btn.value && waitingForOperand;
      return `${base} ${isActive ? 'bg-white text-[#FF9F0A]' : 'bg-[#FF9F0A] text-white hover:bg-[#ffb340]'} active:bg-[#cc7f08]`;
    }
    if (btn.value === '0') {
      return `${base} col-span-2 justify-start pl-7 bg-[#333333] text-white active:bg-[#5a5a5a] hover:bg-[#444444]`;
    }
    return `${base} bg-[#333333] text-white active:bg-[#5a5a5a] hover:bg-[#444444]`;
  };

  const buttons: ButtonConfig[] = [
    { label: display === '0' && value === null ? 'AC' : 'C', value: 'clear', type: 'function' },
    { label: '±', value: 'sign', type: 'function' },
    { label: '%', value: 'percent', type: 'function' },
    { label: '÷', value: '/', type: 'operator' },
    { label: '7', value: '7', type: 'number' },
    { label: '8', value: '8', type: 'number' },
    { label: '9', value: '9', type: 'number' },
    { label: '×', value: '*', type: 'operator' },
    { label: '4', value: '4', type: 'number' },
    { label: '5', value: '5', type: 'number' },
    { label: '6', value: '6', type: 'number' },
    { label: '−', value: '-', type: 'operator' },
    { label: '1', value: '1', type: 'number' },
    { label: '2', value: '2', type: 'number' },
    { label: '3', value: '3', type: 'number' },
    { label: '+', value: '+', type: 'operator' },
    { label: '0', value: '0', type: 'number' },
    { label: '.', value: '.', type: 'number' },
    { label: '=', value: '=', type: 'operator' },
  ];

  const handleButtonClick = (btn: ButtonConfig) => {
    if (btn.value === 'clear') clearDisplay();
    else if (btn.value === 'sign') toggleSign();
    else if (btn.value === 'percent') inputPercent();
    else if (btn.type === 'operator') performOperation(btn.value);
    else if (btn.value === '.') inputDot();
    else inputDigit(btn.value);

    setLastKeyPressed(btn.value);
  };

  return (
    <div className="h-full w-full bg-[#1c1c1c] flex flex-col">
      {/* Display Area */}
      <div className="flex-1 flex items-end justify-end px-6 pb-2 min-h-[80px]">
        <span className={`text-white font-light tracking-tight transition-all duration-100 ${getFontSize()}`}>
          {formatDisplay(display)}
        </span>
      </div>

      {/* Buttons Grid */}
      <div className="grid grid-cols-4 gap-3 p-4">
        {buttons.map((btn) => (
          <button
            key={btn.value}
            onClick={() => handleButtonClick(btn)}
            className={getButtonClass(btn)}
          >
            {btn.label}
          </button>
        ))}
      </div>
    </div>
  );
};
