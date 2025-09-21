import React, { useState, useRef } from 'react';
import { IoSave, IoFolderOpen, IoPrint, IoSearch } from 'react-icons/io5';
import { FaBold, FaItalic, FaUnderline, FaAlignLeft, FaAlignCenter, FaAlignRight } from 'react-icons/fa';

export const TextEditor: React.FC = () => {
  const [content, setContent] = useState('Welcome to TextEdit\n\nStart typing your document here...');
  const [fontSize, setFontSize] = useState(14);
  const [fontFamily, setFontFamily] = useState('system-ui');
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [textAlign, setTextAlign] = useState('left');
  const [fileName, setFileName] = useState('Untitled');
  const [isModified, setIsModified] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    setIsModified(true);

    // Count words
    const words = newContent.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
  };

  const handleSave = () => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setIsModified(false);
  };

  const handleOpen = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setContent(text);
        setFileName(file.name.replace(/\.[^/.]+$/, ''));
        setIsModified(false);

        // Count words
        const words = text.trim().split(/\s+/).filter(word => word.length > 0);
        setWordCount(words.length);
      };
      reader.readAsText(file);
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${fileName}</title>
            <style>
              body {
                font-family: ${fontFamily};
                font-size: ${fontSize}px;
                line-height: 1.6;
                margin: 20px;
                white-space: pre-wrap;
              }
            </style>
          </head>
          <body>${content}</body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };


  const formatText = (format: string) => {
    switch (format) {
      case 'bold':
        setIsBold(!isBold);
        break;
      case 'italic':
        setIsItalic(!isItalic);
        break;
      case 'underline':
        setIsUnderline(!isUnderline);
        break;
    }
  };


  const textStyle = {
    fontSize: `${fontSize}px`,
    fontFamily,
    fontWeight: isBold ? 'bold' : 'normal',
    fontStyle: isItalic ? 'italic' : 'normal',
    textDecoration: isUnderline ? 'underline' : 'none',
    textAlign: textAlign as 'left' | 'center' | 'right',
  };

  return (
    <div className="flex flex-col h-full bg-white text-gray-900">
      {/* Menu Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-100 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleSave}
            className="flex items-center space-x-1 px-3 py-1 rounded hover:bg-gray-200 transition-colors"
            title="Save (Cmd+S)"
          >
            <IoSave size={16} />
            <span className="text-sm">Save</span>
          </button>

          <button
            onClick={handleOpen}
            className="flex items-center space-x-1 px-3 py-1 rounded hover:bg-gray-200 transition-colors"
            title="Open"
          >
            <IoFolderOpen size={16} />
            <span className="text-sm">Open</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center space-x-1 px-3 py-1 rounded hover:bg-gray-200 transition-colors"
            title="Print"
          >
            <IoPrint size={16} />
            <span className="text-sm">Print</span>
          </button>

          <div className="w-px h-6 bg-gray-300"></div>

          <button
            onClick={() => setShowSearch(!showSearch)}
            className={`flex items-center space-x-1 px-3 py-1 rounded transition-colors ${
              showSearch ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200'
            }`}
            title="Search"
          >
            <IoSearch size={16} />
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">
            {fileName}{isModified ? ' •' : ''}
          </span>
        </div>
      </div>

      {/* Search Bar */}
      {showSearch && (
        <div className="flex items-center px-4 py-2 bg-yellow-50 border-b border-yellow-200">
          <IoSearch size={16} className="text-gray-400 mr-2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search in document..."
            className="flex-1 bg-transparent outline-none text-sm"
          />
          <button
            onClick={() => {
              setShowSearch(false);
              setSearchTerm('');
            }}
            className="ml-2 text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>
      )}

      {/* Formatting Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          {/* Font Controls */}
          <select
            value={fontFamily}
            onChange={(e) => setFontFamily(e.target.value)}
            className="text-sm border border-gray-300 rounded px-2 py-1"
          >
            <option value="system-ui">System</option>
            <option value="Arial">Arial</option>
            <option value="Times New Roman">Times</option>
            <option value="Courier New">Courier</option>
            <option value="Georgia">Georgia</option>
            <option value="Verdana">Verdana</option>
          </select>

          <input
            type="number"
            value={fontSize}
            onChange={(e) => setFontSize(parseInt(e.target.value) || 14)}
            min="8"
            max="72"
            className="w-16 text-sm border border-gray-300 rounded px-2 py-1"
          />

          <div className="w-px h-6 bg-gray-300"></div>

          {/* Text Formatting */}
          <button
            onClick={() => formatText('bold')}
            className={`p-2 rounded transition-colors ${
              isBold ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200'
            }`}
            title="Bold"
          >
            <FaBold size={14} />
          </button>

          <button
            onClick={() => formatText('italic')}
            className={`p-2 rounded transition-colors ${
              isItalic ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200'
            }`}
            title="Italic"
          >
            <FaItalic size={14} />
          </button>

          <button
            onClick={() => formatText('underline')}
            className={`p-2 rounded transition-colors ${
              isUnderline ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200'
            }`}
            title="Underline"
          >
            <FaUnderline size={14} />
          </button>

          <div className="w-px h-6 bg-gray-300"></div>

          {/* Text Alignment */}
          <button
            onClick={() => setTextAlign('left')}
            className={`p-2 rounded transition-colors ${
              textAlign === 'left' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200'
            }`}
            title="Align Left"
          >
            <FaAlignLeft size={14} />
          </button>

          <button
            onClick={() => setTextAlign('center')}
            className={`p-2 rounded transition-colors ${
              textAlign === 'center' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200'
            }`}
            title="Align Center"
          >
            <FaAlignCenter size={14} />
          </button>

          <button
            onClick={() => setTextAlign('right')}
            className={`p-2 rounded transition-colors ${
              textAlign === 'right' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200'
            }`}
            title="Align Right"
          >
            <FaAlignRight size={14} />
          </button>
        </div>

        <div className="text-sm text-gray-500">
          Words: {wordCount}
        </div>
      </div>

      {/* Text Area */}
      <div className="flex-1 relative">
        <textarea
          ref={textAreaRef}
          value={content}
          onChange={handleContentChange}
          style={textStyle}
          className="w-full h-full p-4 resize-none outline-none bg-white"
          placeholder="Start typing your document..."
          spellCheck={true}
        />
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between px-4 py-1 bg-gray-100 border-t border-gray-200 text-xs text-gray-600">
        <div className="flex items-center space-x-4">
          <span>Lines: {content.split('\n').length}</span>
          <span>Characters: {content.length}</span>
          <span>Words: {wordCount}</span>
        </div>
        <div>
          {isModified ? 'Modified' : 'Saved'}
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".txt,.md,.js,.ts,.json,.css,.html"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
};