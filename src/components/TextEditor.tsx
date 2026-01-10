import React, { useState, useRef } from 'react';
import {
  FaBold, FaItalic, FaUnderline,
  FaAlignLeft, FaAlignCenter, FaAlignRight,
  FaChevronDown
} from 'react-icons/fa';

interface TextEditorProps {
  onClose?: () => void;
  onMinimize?: () => void;
  onMaximize?: () => void;
}

export const TextEditor: React.FC<TextEditorProps> = ({
  onClose,
  onMinimize,
  onMaximize,
}) => {
  const [content, setContent] = useState('<p style="margin-bottom: 1em;"><b>Hello, World!</b></p><p style="margin-bottom: 1em;">This is a realistic macOS-style TextEdit replica.</p><p style="margin-bottom: 1em;">It features a <i>rich text</i> environment, proper page layout, and the authentic "Big Sur" aesthetic.</p>');
  const [activeFormats, setActiveFormats] = useState<string[]>([]);
  const [font, setFont] = useState('Helvetica');
  const [fontSize, setFontSize] = useState('14px');
  const editorRef = useRef<HTMLDivElement>(null);

  // Execute standard editing commands
  const format = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
    checkFormats();
    editorRef.current?.focus();
  };

  // Check cursor position
  const checkFormats = () => {
    const formats = [];
    if (document.queryCommandState('bold')) formats.push('bold');
    if (document.queryCommandState('italic')) formats.push('italic');
    if (document.queryCommandState('underline')) formats.push('underline');
    if (document.queryCommandState('justifyLeft')) formats.push('justifyLeft');
    if (document.queryCommandState('justifyCenter')) formats.push('justifyCenter');
    if (document.queryCommandState('justifyRight')) formats.push('justifyRight');
    setActiveFormats(formats);
  };

  // Handle Font Change
  const handleFontChange = (newFont: string) => {
    setFont(newFont);
    format('fontName', newFont);
  };

  // Handle Size Change
  const handleSizeChange = (newSize: string) => {
    let sizeVal = "3";
    if (newSize === '12px') sizeVal = "3";
    if (newSize === '14px') sizeVal = "4";
    if (newSize === '18px') sizeVal = "5";
    if (newSize === '24px') sizeVal = "6";
    format('fontSize', sizeVal);
    setFontSize(newSize);
  };

  return (
    <div className="flex flex-col h-full bg-[#F6F6F6] font-sans select-none overflow-hidden rounded-xl border border-black/10 ring-1 ring-black/20">

      {/* Title Bar */}
      <div className="h-12 bg-[#F6F6F6] flex items-center px-4 justify-between shrink-0 relative draggable-region">
        {/* Traffic Lights */}
        <div className="flex space-x-2 group z-10 traffic-lights">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose?.();
            }}
            className="w-3 h-3 rounded-full bg-[#FF5F57] border-[0.5px] border-[#E0443E] flex items-center justify-center shadow-sm hover:brightness-90 transition-all"
          >
            <span className="opacity-0 group-hover:opacity-100 text-[8px] font-bold text-black/50">✕</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMinimize?.();
            }}
            className="w-3 h-3 rounded-full bg-[#FEBC2E] border-[0.5px] border-[#D3A125] flex items-center justify-center shadow-sm hover:brightness-90 transition-all"
          >
            <span className="opacity-0 group-hover:opacity-100 text-[8px] font-bold text-black/50">−</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMaximize?.();
            }}
            className="w-3 h-3 rounded-full bg-[#28C840] border-[0.5px] border-[#1AAB29] flex items-center justify-center shadow-sm hover:brightness-90 transition-all"
          >
            <span className="opacity-0 group-hover:opacity-100 text-[8px] font-bold text-black/50">+</span>
          </button>
        </div>

        {/* Title with Icon */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="flex items-center space-x-2 opacity-90">
            <div className="w-4 h-5 bg-white border border-gray-300 rounded-[2px] flex items-center justify-center shadow-sm">
              <span className="text-[6px] font-bold text-gray-400">TXT</span>
            </div>
            <span className="text-sm font-semibold text-gray-700 tracking-tight">Untitled</span>
            <span className="text-xs text-gray-400 font-medium translate-y-[1px]"> — Edited</span>
          </div>
        </div>

        <div className="w-16"></div>
      </div>

      {/* Toolbar */}
      <div className="h-10 bg-[#F6F6F6] border-b border-[#D6D6D6] flex items-center px-4 space-x-3 shrink-0">

        {/* Font Family Dropdown */}
        <div className="relative group">
          <select
            value={font}
            onChange={(e) => handleFontChange(e.target.value)}
            className="appearance-none text-xs font-medium border border-gray-300 rounded-[4px] pl-2 pr-6 py-1 bg-white shadow-sm outline-none focus:ring-1 focus:ring-blue-500 min-w-[100px] cursor-pointer"
          >
            <option value="Helvetica">Helvetica</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Courier New">Courier New</option>
            <option value="Arial">Arial</option>
          </select>
          <FaChevronDown size={8} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
        </div>

        {/* Font Size Dropdown */}
        <div className="relative">
          <select
            value={fontSize}
            onChange={(e) => handleSizeChange(e.target.value)}
            className="appearance-none text-xs font-medium border border-gray-300 rounded-[4px] pl-2 pr-5 py-1 bg-white shadow-sm outline-none focus:ring-1 focus:ring-blue-500 w-[50px] cursor-pointer"
          >
            <option value="12px">12</option>
            <option value="14px">14</option>
            <option value="18px">18</option>
            <option value="24px">24</option>
          </select>
          <FaChevronDown size={8} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
        </div>

        <div className="w-px h-5 bg-gray-300/50 mx-1"></div>

        {/* Formatting Buttons */}
        <div className="flex bg-white/50 rounded-md border border-gray-200/50 p-0.5 space-x-0.5">
          <ToolbarButton
            icon={<FaBold size={12} />}
            isActive={activeFormats.includes('bold')}
            onClick={() => format('bold')}
          />
          <ToolbarButton
            icon={<FaItalic size={12} />}
            isActive={activeFormats.includes('italic')}
            onClick={() => format('italic')}
          />
          <ToolbarButton
            icon={<FaUnderline size={12} />}
            isActive={activeFormats.includes('underline')}
            onClick={() => format('underline')}
          />
        </div>

        <div className="w-px h-5 bg-gray-300/50 mx-1"></div>

        {/* Alignment Buttons */}
        <div className="flex bg-white/50 rounded-md border border-gray-200/50 p-0.5 space-x-0.5">
          <ToolbarButton
            icon={<FaAlignLeft size={12} />}
            isActive={activeFormats.includes('justifyLeft')}
            onClick={() => format('justifyLeft')}
          />
          <ToolbarButton
            icon={<FaAlignCenter size={12} />}
            isActive={activeFormats.includes('justifyCenter')}
            onClick={() => format('justifyCenter')}
          />
          <ToolbarButton
            icon={<FaAlignRight size={12} />}
            isActive={activeFormats.includes('justifyRight')}
            onClick={() => format('justifyRight')}
          />
        </div>
      </div>

      {/* Ruler */}
      <div className="h-7 bg-[#FBFBFB] border-b border-[#D6D6D6] flex items-end relative overflow-hidden shrink-0 shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]">
        <div className="w-full h-full relative mx-auto max-w-[800px] border-l border-r border-gray-200 bg-[#FBFBFB]">
          {[...Array(30)].map((_, i) => (
            <div key={i} className="absolute bottom-0 h-1.5 w-px bg-gray-300" style={{left: `${i * 3.4}%`}}>
              {i % 2 === 0 && i !== 0 && (
                <span className="absolute -top-3.5 -left-1 text-[9px] text-gray-400 font-medium select-none">{i/2}</span>
              )}
            </div>
          ))}
          {/* Left Margin Indicator */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            <div className="absolute top-0 left-0 w-4 h-full bg-gray-100/50 border-r border-gray-200/50"></div>
            <div className="absolute top-0 right-0 w-4 h-full bg-gray-100/50 border-l border-gray-200/50"></div>
          </div>
        </div>
      </div>

      {/* Editor Area (Scrollable Container) */}
      <div
        className="flex-1 bg-[#EBEBEB] overflow-y-auto cursor-text flex justify-center py-8 relative focus:outline-none textedit-scrollarea"
        onClick={() => editorRef.current?.focus()}
      >
        {/* The 'Paper' Page */}
        <div
          ref={editorRef}
          className="bg-white w-full max-w-[800px] min-h-[1050px] shadow-sm px-16 py-12 outline-none text-gray-900 leading-relaxed text-base focus:outline-none selection:bg-blue-200"
          contentEditable
          suppressContentEditableWarning
          onInput={(e) => setContent(e.currentTarget.innerHTML)}
          onSelect={checkFormats}
          onKeyUp={checkFormats}
          onMouseUp={checkFormats}
          style={{
            boxShadow: '0 2px 8px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.1)',
            fontFamily: font,
          }}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>

      {/* Footer (Status Bar) */}
      <div className="h-6 bg-[#F6F6F6] border-t border-[#D1D1D1] flex items-center justify-between px-3 text-[10px] text-gray-500 font-medium select-none">
        <span className="cursor-default hover:text-gray-800">100%</span>
        <span className="cursor-default hover:text-gray-800">UTF-8</span>
      </div>

      {/* Custom scrollbar styles */}
      <style>{`
        .textedit-scrollarea::-webkit-scrollbar {
          width: 10px;
          height: 10px;
        }
        .textedit-scrollarea::-webkit-scrollbar-track {
          background: transparent;
        }
        .textedit-scrollarea::-webkit-scrollbar-thumb {
          background: #C1C1C1;
          border-radius: 5px;
          border: 2px solid #EBEBEB;
        }
        .textedit-scrollarea::-webkit-scrollbar-thumb:hover {
          background: #A8A8A8;
        }
      `}</style>
    </div>
  );
};

// Helper Component for Toolbar Buttons
const ToolbarButton = ({ icon, isActive, onClick }: { icon: React.ReactNode, isActive: boolean, onClick: () => void }) => (
  <button
    className={`p-1.5 rounded-[4px] transition-all duration-75 ${
      isActive
        ? 'bg-[#DCDCDC] text-black shadow-inner'
        : 'text-gray-700 hover:bg-[#E5E5E5] active:bg-[#DCDCDC] active:shadow-inner'
    }`}
    onMouseDown={(e) => { e.preventDefault(); onClick(); }}
  >
    {icon}
  </button>
);

export default TextEditor;
