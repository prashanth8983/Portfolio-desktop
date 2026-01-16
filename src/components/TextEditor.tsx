import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
  FaBold, FaItalic, FaUnderline, FaStrikethrough,
  FaAlignLeft, FaAlignCenter, FaAlignRight, FaAlignJustify,
  FaChevronDown, FaSpinner, FaCheck, FaCloud,
  FaListUl, FaListOl, FaUndo, FaRedo,
  FaHighlighter, FaPalette, FaIndent, FaOutdent
} from 'react-icons/fa';
import { AuthDialog } from './AuthDialog';
import { getFeedbackAuth, setFeedbackAuth } from '../utils/session';

// Debounce helper
function useDebouncedCallback<T extends (...args: string[]) => void>(
  callback: T,
  delay: number
): T {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const debouncedCallback = useCallback((...args: Parameters<T>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }, [callback, delay]) as T;

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedCallback;
}

interface FeedbackEntry {
  id: string;
  first_name: string;
  message: string;
  created_at: string;
}

interface TextEditorProps {
  mode?: 'default' | 'feedback';
  fileName?: string;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://portfolio-backend-prashanth.fly.dev';

// Color options
const TEXT_COLORS = [
  { name: 'Black', value: '#000000' },
  { name: 'Dark Gray', value: '#4a4a4a' },
  { name: 'Red', value: '#e53935' },
  { name: 'Orange', value: '#fb8c00' },
  { name: 'Green', value: '#43a047' },
  { name: 'Blue', value: '#1e88e5' },
  { name: 'Purple', value: '#8e24aa' },
];

const HIGHLIGHT_COLORS = [
  { name: 'None', value: 'transparent' },
  { name: 'Yellow', value: '#ffeb3b' },
  { name: 'Green', value: '#c8e6c9' },
  { name: 'Blue', value: '#bbdefb' },
  { name: 'Pink', value: '#f8bbd9' },
  { name: 'Orange', value: '#ffe0b2' },
];

export const TextEditor: React.FC<TextEditorProps> = ({
  mode = 'default',
  fileName = 'Untitled',
}) => {
  const [activeFormats, setActiveFormats] = useState<string[]>([]);
  const [font, setFont] = useState('Helvetica');
  const [fontSize, setFontSize] = useState('14px');
  const [showTextColorPicker, setShowTextColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [zoom, setZoom] = useState(100);
  const editorRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const textColorRef = useRef<HTMLDivElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);
  const isInitializedRef = useRef(false);

  // Feedback mode state - check session for existing auth
  const [feedbacks, setFeedbacks] = useState<FeedbackEntry[]>([]);
  const [isLoading, setIsLoading] = useState(mode === 'feedback');
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [userInfo, setUserInfo] = useState<{ firstName: string; email: string } | null>(() => {
    if (mode === 'feedback') {
      const savedAuth = getFeedbackAuth();
      return savedAuth;
    }
    return null;
  });
  const [showNotification, setShowNotification] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [, setUserFeedbackId] = useState<string | null>(null); // Track user's own feedback for editing
  const [editingFeedbackId, setEditingFeedbackId] = useState<string | null>(null); // Which feedback is being edited
  const userInputRef = useRef<HTMLSpanElement | null>(null);
  const lastSavedContentRef = useRef<string>('');

  // Close color pickers when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (textColorRef.current && !textColorRef.current.contains(e.target as Node)) {
        setShowTextColorPicker(false);
      }
      if (highlightRef.current && !highlightRef.current.contains(e.target as Node)) {
        setShowHighlightPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update word/char count
  const updateCounts = useCallback(() => {
    if (editorRef.current) {
      const text = editorRef.current.innerText || '';
      const words = text.trim().split(/\s+/).filter(w => w.length > 0);
      setWordCount(words.length);
      setCharCount(text.length);
    }
  }, []);

  // Find the user's own feedback (if they have one)
  const userOwnFeedback = useMemo(() => {
    if (!userInfo) return null;
    // Match by first name (since email is not returned from API for privacy)
    // In a real app, you'd use a session token or user ID
    return feedbacks.find(f => f.first_name === userInfo.firstName) || null;
  }, [feedbacks, userInfo]);

  // Build the feedback document HTML (like a shared Google Doc)
  const buildFeedbackHTML = useCallback((userName: string | null, editingId: string | null) => {
    let html = `<div style="margin-bottom: 2rem;" contenteditable="false">
      <h1 style="font-size: 1.5rem; font-weight: 600; color: #1f2937;">Feedback</h1>
    </div>`;

    // Add existing feedbacks
    feedbacks.forEach((feedback) => {
      const isOwnFeedback = userOwnFeedback?.id === feedback.id;
      const isEditing = editingId === feedback.id;

      if (isEditing) {
        // Editable version of user's own feedback
        html += `<div style="margin-bottom: 1rem;" data-feedback-id="${feedback.id}">
          <p style="color: #1f2937; line-height: 1.625;">
            <span style="font-weight: 600; color: #111827;" contenteditable="false">${feedback.first_name}</span>
            <span style="color: #9ca3af; margin: 0 0.5rem;" contenteditable="false">—</span>
            <span id="edit-input-${feedback.id}" class="editable-feedback" style="color: #1f2937; outline: none; border-bottom: 1px dashed #3b82f6;">${feedback.message}</span>
          </p>
        </div>`;
      } else {
        // Read-only feedback (clickable if it's user's own)
        const clickableStyle = isOwnFeedback ? 'cursor: pointer;' : '';
        const clickableAttr = isOwnFeedback ? `data-editable="true" data-feedback-id="${feedback.id}"` : '';
        html += `<div style="margin-bottom: 1rem; ${clickableStyle}" contenteditable="false" ${clickableAttr}>
          <p style="color: #1f2937; line-height: 1.625;">
            <span style="font-weight: 600; color: #111827;">${feedback.first_name}</span>
            <span style="color: #9ca3af; margin: 0 0.5rem;">—</span>
            <span class="${isOwnFeedback ? 'own-feedback' : ''}" style="${isOwnFeedback ? 'border-bottom: 1px dashed transparent;' : ''}">${feedback.message}</span>
            ${isOwnFeedback ? '<span style="color: #9ca3af; font-size: 0.75rem; margin-left: 0.5rem;">(click to edit)</span>' : ''}
          </p>
        </div>`;
      }
    });

    // Add the user's input area (for new feedback) only if user doesn't have existing feedback
    if (userName && !userOwnFeedback) {
      html += `<div style="margin-top: 1.5rem;">
        <p style="color: #1f2937; line-height: 1.625;">
          <span style="font-weight: 600; color: #111827;" contenteditable="false">${userName}</span>
          <span style="color: #9ca3af; margin: 0 0.5rem;" contenteditable="false">—</span>
          <span id="user-input" style="color: #1f2937; outline: none;"></span>
        </p>
      </div>`;
    } else if (!userName) {
      html += `<div style="margin-top: 1.5rem;" contenteditable="false">
        <p style="color: #6b7280; font-size: 0.875rem; cursor: pointer;" id="sign-in-prompt">Click here to sign in and leave a message</p>
      </div>`;
    }

    return html;
  }, [feedbacks, userOwnFeedback]);

  // Initialize/update editor content for feedback mode
  useEffect(() => {
    if (mode === 'feedback' && editorRef.current && !isLoading) {
      // Save current editing content if any
      const currentUserInput = editorRef.current.querySelector('#user-input');
      const currentEditInput = editingFeedbackId ? editorRef.current.querySelector(`#edit-input-${editingFeedbackId}`) : null;
      const currentText = currentEditInput?.textContent || currentUserInput?.textContent || '';

      editorRef.current.innerHTML = buildFeedbackHTML(userInfo?.firstName || null, editingFeedbackId);

      // Restore any text the user was typing
      if (editingFeedbackId) {
        const editInput = editorRef.current.querySelector(`#edit-input-${editingFeedbackId}`);
        if (editInput && currentText && currentText !== lastSavedContentRef.current) {
          editInput.textContent = currentText;
        }
      } else {
        const newUserInput = editorRef.current.querySelector('#user-input');
        if (newUserInput && currentText) {
          newUserInput.textContent = currentText;
        }
        userInputRef.current = newUserInput as HTMLSpanElement;
      }

      updateCounts();
    }
  }, [mode, isLoading, feedbacks, userInfo, editingFeedbackId, buildFeedbackHTML, updateCounts]);

  // Initialize editor content on mount (only once) - for default mode only
  useEffect(() => {
    if (editorRef.current && !isInitializedRef.current && mode !== 'feedback') {
      // Start with empty content for default mode
      editorRef.current.innerHTML = '<p><br></p>';
      isInitializedRef.current = true;
      updateCounts();
    }
  }, [mode, updateCounts]);

  // Keyboard shortcuts - work for both modes
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!editorRef.current?.contains(document.activeElement) && document.activeElement !== editorRef.current) return;

      // For feedback mode, handle Enter to submit
      if (mode === 'feedback' && e.key === 'Enter' && !e.shiftKey) {
        const userInput = editorRef.current?.querySelector('#user-input');
        if (userInput?.contains(document.activeElement) || document.activeElement === userInput) {
          e.preventDefault();
          submitFeedback();
          return;
        }
      }

      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const modifier = isMac ? e.metaKey : e.ctrlKey;

      if (modifier) {
        switch (e.key.toLowerCase()) {
          case 'b':
            e.preventDefault();
            format('bold');
            break;
          case 'i':
            e.preventDefault();
            format('italic');
            break;
          case 'u':
            e.preventDefault();
            format('underline');
            break;
          case 'z':
            if (e.shiftKey) {
              e.preventDefault();
              format('redo');
            } else {
              e.preventDefault();
              format('undo');
            }
            break;
          case 'y':
            e.preventDefault();
            format('redo');
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [mode]);

  // Fetch feedbacks on mount if in feedback mode
  useEffect(() => {
    if (mode === 'feedback') {
      fetchFeedbacks();
    }
  }, [mode]);

  // Show notification after loading
  useEffect(() => {
    if (mode === 'feedback' && !isLoading && feedbacks.length > 0) {
      setShowNotification(true);
      const timer = setTimeout(() => setShowNotification(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [mode, isLoading, feedbacks.length]);

  const fetchFeedbacks = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/feedbacks`);
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setFeedbacks(data);
    } catch (err) {
      console.error('Error fetching feedbacks:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-save function for updating existing feedback
  const autoSaveFeedback = useCallback(async (feedbackId: string, message: string) => {
    if (!userInfo || !message.trim()) return;

    // Don't save if content hasn't changed
    if (message.trim() === lastSavedContentRef.current) {
      return;
    }

    setSaveStatus('saving');

    try {
      const response = await fetch(`${API_BASE_URL}/api/feedbacks/${feedbackId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userInfo.email,
          message: message.trim(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save');
      }

      lastSavedContentRef.current = message.trim();
      setSaveStatus('saved');

      // Reset to idle after showing "saved" briefly
      setTimeout(() => {
        setSaveStatus('idle');
      }, 2000);
    } catch (err) {
      console.error('Error auto-saving feedback:', err);
      setSaveStatus('error');
    }
  }, [userInfo]);

  // Debounced auto-save (1.5 second delay after typing stops)
  const debouncedAutoSave = useDebouncedCallback(autoSaveFeedback, 1500);

  // Handle input changes for auto-save
  const handleFeedbackInput = useCallback(() => {
    if (!editingFeedbackId) return;

    const editInput = editorRef.current?.querySelector(`#edit-input-${editingFeedbackId}`);
    const message = editInput?.textContent || '';

    if (message.trim() && message.trim() !== lastSavedContentRef.current) {
      setSaveStatus('saving');
      debouncedAutoSave(editingFeedbackId, message);
    }
  }, [editingFeedbackId, debouncedAutoSave]);

  const submitFeedback = async () => {
    const userInput = editorRef.current?.querySelector('#user-input');
    const message = userInput?.textContent?.trim() || '';

    if (!userInfo || !message) return;

    setIsSubmitting(true);
    setSaveStatus('saving');

    try {
      const response = await fetch(`${API_BASE_URL}/api/feedbacks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          first_name: userInfo.firstName,
          email: userInfo.email,
          message: message,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit feedback');
      }

      const data = await response.json();
      lastSavedContentRef.current = message;
      setSaveStatus('saved');

      // Set the newly created feedback as the one being edited
      if (data.id) {
        setUserFeedbackId(data.id);
        setEditingFeedbackId(data.id);
      }

      // Success - refresh feedbacks
      await fetchFeedbacks();

      setTimeout(() => {
        setSaveStatus('idle');
      }, 2000);
    } catch (err) {
      console.error('Error submitting feedback:', err);
      setSaveStatus('error');
      // Show error in the editor
      if (userInput) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to submit';
        userInput.innerHTML = `<span style="color: #ef4444;">${errorMsg} - </span>${message}`;
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAuthSubmit = (firstName: string, email: string) => {
    setUserInfo({ firstName, email });
    setIsAuthDialogOpen(false);

    // Save to session for persistence across reloads
    setFeedbackAuth(firstName, email);

    // Focus the user input after a short delay (to allow re-render)
    setTimeout(() => {
      const userInput = editorRef.current?.querySelector('#user-input') as HTMLElement;
      if (userInput) {
        userInput.focus();
        // Scroll to the input area
        scrollContainerRef.current?.scrollTo({
          top: scrollContainerRef.current.scrollHeight,
          behavior: 'smooth'
        });
      }
    }, 100);
  };

  const handleEditorAreaClick = (e: React.MouseEvent) => {
    // For feedback mode, handle clicks on sign-in prompt or editable feedbacks
    if (mode === 'feedback') {
      const target = e.target as HTMLElement;

      // Check if user clicked sign-in prompt or isn't logged in
      if (target.id === 'sign-in-prompt' || !userInfo) {
        setIsAuthDialogOpen(true);
        return;
      }

      // Check if user clicked on their own editable feedback
      const editableParent = target.closest('[data-editable="true"]');
      if (editableParent) {
        const feedbackId = editableParent.getAttribute('data-feedback-id');
        if (feedbackId && userOwnFeedback?.id === feedbackId) {
          // Start editing this feedback
          const feedback = feedbacks.find(f => f.id === feedbackId);
          if (feedback) {
            lastSavedContentRef.current = feedback.message;
            setEditingFeedbackId(feedbackId);
            // Focus will be set after re-render
            setTimeout(() => {
              const editInput = editorRef.current?.querySelector(`#edit-input-${feedbackId}`) as HTMLElement;
              if (editInput) {
                editInput.focus();
                // Move cursor to end
                const selection = window.getSelection();
                const range = document.createRange();
                range.selectNodeContents(editInput);
                range.collapse(false);
                selection?.removeAllRanges();
                selection?.addRange(range);
              }
            }, 50);
          }
          return;
        }
      }

      // Focus the user input area (for new feedback)
      const userInput = editorRef.current?.querySelector('#user-input') as HTMLElement;
      if (userInput) {
        userInput.focus();
        // Move cursor to end
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(userInput);
        range.collapse(false);
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
      return;
    }
    editorRef.current?.focus();
  };

  // Execute standard editing commands (for default mode)
  const format = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
    checkFormats();
    editorRef.current?.focus();
  };

  const checkFormats = () => {
    const formats = [];
    if (document.queryCommandState('bold')) formats.push('bold');
    if (document.queryCommandState('italic')) formats.push('italic');
    if (document.queryCommandState('underline')) formats.push('underline');
    if (document.queryCommandState('strikeThrough')) formats.push('strikeThrough');
    if (document.queryCommandState('justifyLeft')) formats.push('justifyLeft');
    if (document.queryCommandState('justifyCenter')) formats.push('justifyCenter');
    if (document.queryCommandState('justifyRight')) formats.push('justifyRight');
    if (document.queryCommandState('justifyFull')) formats.push('justifyFull');
    if (document.queryCommandState('insertUnorderedList')) formats.push('insertUnorderedList');
    if (document.queryCommandState('insertOrderedList')) formats.push('insertOrderedList');
    setActiveFormats(formats);
  };

  const handleFontChange = (newFont: string) => {
    setFont(newFont);
    format('fontName', newFont);
  };

  const handleSizeChange = (newSize: string) => {
    const sizeMap: Record<string, string> = {
      '10px': '1',
      '12px': '2',
      '14px': '3',
      '16px': '4',
      '18px': '5',
      '24px': '6',
      '32px': '7',
    };
    format('fontSize', sizeMap[newSize] || '3');
    setFontSize(newSize);
  };

  const applyTextColor = (color: string) => {
    format('foreColor', color);
    setShowTextColorPicker(false);
  };

  const applyHighlight = (color: string) => {
    if (color === 'transparent') {
      format('removeFormat');
    } else {
      format('hiliteColor', color);
    }
    setShowHighlightPicker(false);
  };

  const isFeedbackMode = mode === 'feedback';
  const displayFileName = isFeedbackMode ? 'Feedback.txt' : fileName;

  return (
    <div className="flex flex-col h-full bg-[#F6F6F6] font-sans select-none overflow-hidden">
      {/* Notification Banner (feedback mode only) */}
      {isFeedbackMode && showNotification && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top-2 fade-in duration-300">
          <div className="bg-[#323232] text-white text-xs px-4 py-2 rounded-lg shadow-lg">
            Scroll down to add your feedback
          </div>
        </div>
      )}

      {/* Title Bar - traffic lights handled by Window component */}
      <div className="h-12 bg-[#F6F6F6] flex items-center px-4 justify-center shrink-0 relative">
        <div className="flex items-center space-x-2 opacity-90">
          <div className="w-4 h-5 bg-white border border-gray-300 rounded-[2px] flex items-center justify-center shadow-sm">
            <span className="text-[6px] font-bold text-gray-400">TXT</span>
          </div>
          <span className="text-sm font-semibold text-gray-700 tracking-tight">{displayFileName}</span>
          {!isFeedbackMode && <span className="text-xs text-gray-400 font-medium translate-y-[1px]"> — Edited</span>}
        </div>
      </div>

      {/* Toolbar - shown for both modes */}
      <div className="bg-[#F6F6F6] border-b border-[#D6D6D6] flex flex-wrap items-center px-3 py-1.5 gap-1 shrink-0">
          {/* Undo/Redo */}
          <div className="flex bg-white/50 rounded-md border border-gray-200/50 p-0.5 space-x-0.5">
            <ToolbarButton
              icon={<FaUndo size={11} />}
              isActive={false}
              onClick={() => format('undo')}
              title="Undo (⌘Z)"
            />
            <ToolbarButton
              icon={<FaRedo size={11} />}
              isActive={false}
              onClick={() => format('redo')}
              title="Redo (⌘⇧Z)"
            />
          </div>

          <div className="w-px h-5 bg-gray-300/50 mx-1"></div>

          {/* Font Family Dropdown */}
          <div className="relative">
            <select
              value={font}
              onChange={(e) => handleFontChange(e.target.value)}
              className="appearance-none text-xs font-medium border border-gray-300 rounded-[4px] pl-2 pr-6 py-1 bg-white shadow-sm outline-none focus:ring-1 focus:ring-blue-500 min-w-[90px] cursor-pointer"
            >
              <option value="Helvetica">Helvetica</option>
              <option value="Arial">Arial</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Georgia">Georgia</option>
              <option value="Courier New">Courier New</option>
              <option value="Verdana">Verdana</option>
              <option value="Comic Sans MS">Comic Sans</option>
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
              <option value="10px">10</option>
              <option value="12px">12</option>
              <option value="14px">14</option>
              <option value="16px">16</option>
              <option value="18px">18</option>
              <option value="24px">24</option>
              <option value="32px">32</option>
            </select>
            <FaChevronDown size={8} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
          </div>

          <div className="w-px h-5 bg-gray-300/50 mx-1"></div>

          {/* Text Formatting Buttons */}
          <div className="flex bg-white/50 rounded-md border border-gray-200/50 p-0.5 space-x-0.5">
            <ToolbarButton
              icon={<FaBold size={11} />}
              isActive={activeFormats.includes('bold')}
              onClick={() => format('bold')}
              title="Bold (⌘B)"
            />
            <ToolbarButton
              icon={<FaItalic size={11} />}
              isActive={activeFormats.includes('italic')}
              onClick={() => format('italic')}
              title="Italic (⌘I)"
            />
            <ToolbarButton
              icon={<FaUnderline size={11} />}
              isActive={activeFormats.includes('underline')}
              onClick={() => format('underline')}
              title="Underline (⌘U)"
            />
            <ToolbarButton
              icon={<FaStrikethrough size={11} />}
              isActive={activeFormats.includes('strikeThrough')}
              onClick={() => format('strikeThrough')}
              title="Strikethrough"
            />
          </div>

          <div className="w-px h-5 bg-gray-300/50 mx-1"></div>

          {/* Text Color */}
          <div className="relative" ref={textColorRef}>
            <ToolbarButton
              icon={<FaPalette size={11} />}
              isActive={showTextColorPicker}
              onClick={() => { setShowTextColorPicker(!showTextColorPicker); setShowHighlightPicker(false); }}
              title="Text Color"
            />
            {showTextColorPicker && (
              <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 p-2 z-50">
                <div className="flex gap-1">
                  {TEXT_COLORS.map((color) => (
                    <button
                      key={color.value}
                      className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
                      style={{ backgroundColor: color.value }}
                      onClick={() => applyTextColor(color.value)}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Highlight Color */}
          <div className="relative" ref={highlightRef}>
            <ToolbarButton
              icon={<FaHighlighter size={11} />}
              isActive={showHighlightPicker}
              onClick={() => { setShowHighlightPicker(!showHighlightPicker); setShowTextColorPicker(false); }}
              title="Highlight"
            />
            {showHighlightPicker && (
              <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 p-2 z-50">
                <div className="flex gap-1">
                  {HIGHLIGHT_COLORS.map((color) => (
                    <button
                      key={color.value}
                      className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
                      style={{ backgroundColor: color.value === 'transparent' ? '#fff' : color.value }}
                      onClick={() => applyHighlight(color.value)}
                      title={color.name}
                    >
                      {color.value === 'transparent' && <span className="text-[10px] text-gray-400">✕</span>}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="w-px h-5 bg-gray-300/50 mx-1"></div>

          {/* Alignment Buttons */}
          <div className="flex bg-white/50 rounded-md border border-gray-200/50 p-0.5 space-x-0.5">
            <ToolbarButton
              icon={<FaAlignLeft size={11} />}
              isActive={activeFormats.includes('justifyLeft')}
              onClick={() => format('justifyLeft')}
              title="Align Left"
            />
            <ToolbarButton
              icon={<FaAlignCenter size={11} />}
              isActive={activeFormats.includes('justifyCenter')}
              onClick={() => format('justifyCenter')}
              title="Align Center"
            />
            <ToolbarButton
              icon={<FaAlignRight size={11} />}
              isActive={activeFormats.includes('justifyRight')}
              onClick={() => format('justifyRight')}
              title="Align Right"
            />
            <ToolbarButton
              icon={<FaAlignJustify size={11} />}
              isActive={activeFormats.includes('justifyFull')}
              onClick={() => format('justifyFull')}
              title="Justify"
            />
          </div>

          <div className="w-px h-5 bg-gray-300/50 mx-1"></div>

          {/* List Buttons */}
          <div className="flex bg-white/50 rounded-md border border-gray-200/50 p-0.5 space-x-0.5">
            <ToolbarButton
              icon={<FaListUl size={11} />}
              isActive={activeFormats.includes('insertUnorderedList')}
              onClick={() => format('insertUnorderedList')}
              title="Bullet List"
            />
            <ToolbarButton
              icon={<FaListOl size={11} />}
              isActive={activeFormats.includes('insertOrderedList')}
              onClick={() => format('insertOrderedList')}
              title="Numbered List"
            />
          </div>

          <div className="w-px h-5 bg-gray-300/50 mx-1"></div>

          {/* Indent Buttons */}
          <div className="flex bg-white/50 rounded-md border border-gray-200/50 p-0.5 space-x-0.5">
            <ToolbarButton
              icon={<FaOutdent size={11} />}
              isActive={false}
              onClick={() => format('outdent')}
              title="Decrease Indent"
            />
            <ToolbarButton
              icon={<FaIndent size={11} />}
              isActive={false}
              onClick={() => format('indent')}
              title="Increase Indent"
            />
          </div>

          <div className="w-px h-5 bg-gray-300/50 mx-1"></div>

          {/* Zoom Controls */}
          <div className="flex items-center bg-white/50 rounded-md border border-gray-200/50 p-0.5 space-x-1">
            <button
              className="px-1.5 py-0.5 text-xs font-medium text-gray-700 hover:bg-[#E5E5E5] active:bg-[#DCDCDC] rounded transition-all"
              onClick={() => setZoom(Math.max(25, zoom - 10))}
              title="Zoom Out"
            >
              −
            </button>
            <span className="text-[10px] font-medium text-gray-600 min-w-[32px] text-center">{zoom}%</span>
            <button
              className="px-1.5 py-0.5 text-xs font-medium text-gray-700 hover:bg-[#E5E5E5] active:bg-[#DCDCDC] rounded transition-all"
              onClick={() => setZoom(Math.min(200, zoom + 10))}
              title="Zoom In"
            >
              +
            </button>
          </div>
        </div>

      {/* Ruler - shown for both modes */}
      <div className="h-6 bg-[#FBFBFB] border-b border-[#D6D6D6] flex items-end relative overflow-hidden shrink-0 shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]">
          <div className="w-full h-full relative mx-auto max-w-[800px] border-l border-r border-gray-200 bg-[#FBFBFB]">
            {[...Array(30)].map((_, i) => (
              <div key={i} className="absolute bottom-0 h-1.5 w-px bg-gray-300" style={{left: `${i * 3.4}%`}}>
                {i % 2 === 0 && i !== 0 && (
                  <span className="absolute -top-3 -left-1 text-[8px] text-gray-400 font-medium select-none">{i/2}</span>
                )}
              </div>
            ))}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
              <div className="absolute top-0 left-0 w-4 h-full bg-gray-100/50 border-r border-gray-200/50"></div>
              <div className="absolute top-0 right-0 w-4 h-full bg-gray-100/50 border-l border-gray-200/50"></div>
            </div>
          </div>
        </div>

      {/* Editor Area */}
      <div
        ref={scrollContainerRef}
        className="flex-1 bg-[#EBEBEB] overflow-y-auto cursor-text flex justify-center py-8 relative focus:outline-none textedit-scrollarea"
        onClick={handleEditorAreaClick}
      >
        {/* Loading spinner for feedback mode */}
        {isFeedbackMode && isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#EBEBEB]">
            <FaSpinner className="animate-spin text-gray-400 text-2xl" />
          </div>
        )}

        {/* Submitting overlay for feedback mode */}
        {isFeedbackMode && isSubmitting && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10">
            <div className="flex items-center gap-2 text-gray-600">
              <FaSpinner className="animate-spin" />
              <span className="text-sm">Posting...</span>
            </div>
          </div>
        )}

        {/* Single contentEditable editor for both modes - A4 size with zoom */}
        <div
          className="transition-transform duration-200 ease-out origin-top shrink-0"
          style={{ transform: `scale(${zoom / 100})` }}
        >
          <div
            ref={editorRef}
            className="bg-white shadow-sm px-12 py-10 outline-none text-gray-900 leading-relaxed text-base focus:outline-none selection:bg-blue-200"
            contentEditable={!isFeedbackMode || (isFeedbackMode && userInfo !== null)}
            suppressContentEditableWarning
            onInput={() => {
              updateCounts();
              if (isFeedbackMode && editingFeedbackId) {
                handleFeedbackInput();
              }
            }}
            onSelect={checkFormats}
            onKeyUp={checkFormats}
            onMouseUp={checkFormats}
            style={{
              boxShadow: '0 2px 8px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.1)',
              fontFamily: font,
              width: '595px',
              minHeight: '842px',
            }}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="h-6 bg-[#F6F6F6] border-t border-[#D1D1D1] flex items-center justify-between px-3 text-[10px] text-gray-500 font-medium select-none">
        <span className="cursor-default hover:text-gray-800">
          {isFeedbackMode
            ? userInfo
              ? userOwnFeedback
                ? `Signed in as ${userInfo.firstName} · ${feedbacks.length} message${feedbacks.length !== 1 ? 's' : ''} · Click your message to edit`
                : `Signed in as ${userInfo.firstName} · ${feedbacks.length} message${feedbacks.length !== 1 ? 's' : ''} · Press Enter to submit`
              : `${feedbacks.length} message${feedbacks.length !== 1 ? 's' : ''}`
            : `${wordCount} words, ${charCount} characters`
          }
        </span>
        <div className="flex items-center gap-2">
          {/* Save status indicator */}
          {isFeedbackMode && editingFeedbackId && (
            <span className="flex items-center gap-1">
              {saveStatus === 'saving' && (
                <>
                  <FaCloud className="text-blue-500 animate-pulse" size={10} />
                  <span className="text-blue-500">Saving...</span>
                </>
              )}
              {saveStatus === 'saved' && (
                <>
                  <FaCheck className="text-green-500" size={10} />
                  <span className="text-green-500">Saved</span>
                </>
              )}
              {saveStatus === 'error' && (
                <span className="text-red-500">Save failed</span>
              )}
            </span>
          )}
          <span className="cursor-default hover:text-gray-800">UTF-8</span>
        </div>
      </div>

      {/* Auth Dialog (feedback mode) */}
      {isFeedbackMode && (
        <AuthDialog
          isOpen={isAuthDialogOpen}
          onClose={() => setIsAuthDialogOpen(false)}
          onSubmit={handleAuthSubmit}
          title="Sign Guestbook"
          message="Enter your name and email to leave a message. Only your first name will be displayed."
        />
      )}

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
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9CA3AF;
          font-style: italic;
        }
        #user-input:focus {
          outline: none;
        }
        #sign-in-prompt:hover {
          text-decoration: underline;
        }
        [contenteditable] ul, [contenteditable] ol {
          padding-left: 1.5em;
          margin: 0.5em 0;
        }
        [contenteditable] li {
          margin: 0.25em 0;
        }
        /* Editable feedback styles */
        [data-editable="true"]:hover .own-feedback {
          border-bottom-color: #3b82f6 !important;
        }
        .editable-feedback:focus {
          outline: none;
        }
      `}</style>
    </div>
  );
};

// Helper Component for Toolbar Buttons
const ToolbarButton = ({
  icon,
  isActive,
  onClick,
  title
}: {
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
  title?: string;
}) => (
  <button
    className={`p-1.5 rounded-[4px] transition-all duration-75 ${
      isActive
        ? 'bg-[#DCDCDC] text-black shadow-inner'
        : 'text-gray-700 hover:bg-[#E5E5E5] active:bg-[#DCDCDC] active:shadow-inner'
    }`}
    onMouseDown={(e) => { e.preventDefault(); onClick(); }}
    title={title}
  >
    {icon}
  </button>
);

export default TextEditor;
