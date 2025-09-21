import React, { useState, useEffect } from 'react';

export const Calculator: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const inputNumber = (num: string) => {
    if (waitingForOperand) {
      setDisplay(num);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  const clear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const performOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);

      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const calculate = (firstValue: number, secondValue: number, operation: string): number => {
    switch (operation) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case '×':
        return firstValue * secondValue;
      case '÷':
        return firstValue / secondValue;
      case '=':
        return secondValue;
      default:
        return secondValue;
    }
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    const { key } = e;

    if (key >= '0' && key <= '9') {
      inputNumber(key);
    } else if (key === '.') {
      inputDecimal();
    } else if (key === '+') {
      performOperation('+');
    } else if (key === '-') {
      performOperation('-');
    } else if (key === '*') {
      performOperation('×');
    } else if (key === '/') {
      e.preventDefault();
      performOperation('÷');
    } else if (key === 'Enter' || key === '=') {
      performOperation('=');
    } else if (key === 'Escape' || key === 'c' || key === 'C') {
      clear();
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [display, operation, previousValue, waitingForOperand]);

  const Button: React.FC<{
    onClick: () => void;
    className?: string;
    children: React.ReactNode;
  }> = ({ onClick, className = '', children }) => (
    <button
      onClick={onClick}
      className={`h-12 rounded-lg font-medium text-lg transition-all duration-150 active:scale-95 ${className}`}
    >
      {children}
    </button>
  );

  return (
    <div className="bg-gray-900 text-white p-4 rounded-lg w-80 shadow-2xl">
      {/* Display */}
      <div className="bg-black rounded-lg p-4 mb-4 text-right">
        <div className="text-3xl font-light overflow-hidden">
          {display.length > 12 ? parseFloat(display).toExponential(6) : display}
        </div>
      </div>

      {/* Buttons */}
      <div className="grid grid-cols-4 gap-2">
        {/* Row 1 */}
        <Button
          onClick={clear}
          className="bg-gray-600 hover:bg-gray-500 text-black"
        >
          AC
        </Button>
        <Button
          onClick={() => {
            if (display !== '0') {
              setDisplay(display.slice(0, -1) || '0');
            }
          }}
          className="bg-gray-600 hover:bg-gray-500 text-black"
        >
          ⌫
        </Button>
        <Button
          onClick={() => {
            const value = parseFloat(display) / 100;
            setDisplay(String(value));
          }}
          className="bg-gray-600 hover:bg-gray-500 text-black"
        >
          %
        </Button>
        <Button
          onClick={() => performOperation('÷')}
          className={`${
            operation === '÷'
              ? 'bg-white text-orange-500'
              : 'bg-orange-500 hover:bg-orange-400'
          }`}
        >
          ÷
        </Button>

        {/* Row 2 */}
        <Button
          onClick={() => inputNumber('7')}
          className="bg-gray-700 hover:bg-gray-600"
        >
          7
        </Button>
        <Button
          onClick={() => inputNumber('8')}
          className="bg-gray-700 hover:bg-gray-600"
        >
          8
        </Button>
        <Button
          onClick={() => inputNumber('9')}
          className="bg-gray-700 hover:bg-gray-600"
        >
          9
        </Button>
        <Button
          onClick={() => performOperation('×')}
          className={`${
            operation === '×'
              ? 'bg-white text-orange-500'
              : 'bg-orange-500 hover:bg-orange-400'
          }`}
        >
          ×
        </Button>

        {/* Row 3 */}
        <Button
          onClick={() => inputNumber('4')}
          className="bg-gray-700 hover:bg-gray-600"
        >
          4
        </Button>
        <Button
          onClick={() => inputNumber('5')}
          className="bg-gray-700 hover:bg-gray-600"
        >
          5
        </Button>
        <Button
          onClick={() => inputNumber('6')}
          className="bg-gray-700 hover:bg-gray-600"
        >
          6
        </Button>
        <Button
          onClick={() => performOperation('-')}
          className={`${
            operation === '-'
              ? 'bg-white text-orange-500'
              : 'bg-orange-500 hover:bg-orange-400'
          }`}
        >
          −
        </Button>

        {/* Row 4 */}
        <Button
          onClick={() => inputNumber('1')}
          className="bg-gray-700 hover:bg-gray-600"
        >
          1
        </Button>
        <Button
          onClick={() => inputNumber('2')}
          className="bg-gray-700 hover:bg-gray-600"
        >
          2
        </Button>
        <Button
          onClick={() => inputNumber('3')}
          className="bg-gray-700 hover:bg-gray-600"
        >
          3
        </Button>
        <Button
          onClick={() => performOperation('+')}
          className={`${
            operation === '+'
              ? 'bg-white text-orange-500'
              : 'bg-orange-500 hover:bg-orange-400'
          }`}
        >
          +
        </Button>

        {/* Row 5 */}
        <Button
          onClick={() => inputNumber('0')}
          className="bg-gray-700 hover:bg-gray-600 col-span-2"
        >
          0
        </Button>
        <Button
          onClick={inputDecimal}
          className="bg-gray-700 hover:bg-gray-600"
        >
          .
        </Button>
        <Button
          onClick={() => performOperation('=')}
          className="bg-orange-500 hover:bg-orange-400"
        >
          =
        </Button>
      </div>

      {/* Keyboard shortcuts info */}
      <div className="mt-4 text-xs text-gray-400 text-center">
        Keyboard shortcuts: Numbers, +, -, *, /, Enter, Escape
      </div>
    </div>
  );
};