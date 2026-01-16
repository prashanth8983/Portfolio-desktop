import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import {
  IoMailOutline,
  IoFileTrayOutline,
  IoPaperPlaneOutline,
  IoTrashOutline,
  IoArchiveOutline,
  IoAlertCircleOutline,
  IoSearchOutline,
  IoCreateOutline,
  IoArrowUndoOutline,
  IoArrowRedoOutline,
  IoArrowForwardOutline,
  IoChevronDownOutline,
  IoStarOutline,
  IoAttachOutline,
  IoEllipsisHorizontal,
  IoFlag
} from 'react-icons/io5';

// --- Types ---
type Email = {
  id: string;
  sender: string;
  email: string;
  subject: string;
  snippet: string;
  content: string;
  date: string;
  unread: boolean;
  flagged: boolean;
  mailbox: 'inbox' | 'sent' | 'junk' | 'trash';
};

export const Mail: React.FC = () => {
  const { isDark } = useTheme();
  const [selectedMailbox, setSelectedMailbox] = useState<'inbox' | 'sent' | 'junk' | 'trash'>('inbox');
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>('1');
  const [searchQuery, setSearchQuery] = useState('');

  // --- Mock Data ---
  const emails: Email[] = [
    {
      id: '1',
      sender: 'Apple',
      email: 'no_reply@email.apple.com',
      subject: 'Your receipt for iCloud Storage',
      snippet: 'Here is your receipt for the 200GB iCloud+ plan. Total: $2.99/mo.',
      content: 'Dear Customer,\n\nThis email confirms your payment for the iCloud+ 200GB Storage plan.\n\nDate: Oct 24, 2026\nAmount: $2.99\nPayment Method: Apple Pay\n\nThank you for choosing Apple services.',
      date: '10:42 AM',
      unread: true,
      flagged: false,
      mailbox: 'inbox'
    },
    {
      id: '2',
      sender: 'GitHub',
      email: 'noreply@github.com',
      subject: '[GitHub] A new public key was added to your account',
      snippet: 'The following SSH key was added to your account: "MacBook Pro".',
      content: 'Hey there,\n\nA new public key was added to your account.\n\nKey Title: MacBook Pro\nFingerprint: SHA256:...\n\nIf you did not do this, please contact support immediately.',
      date: 'Yesterday',
      unread: false,
      flagged: true,
      mailbox: 'inbox'
    },
    {
      id: '3',
      sender: 'Sarah Connor',
      email: 'sarah@resistance.net',
      subject: 'Project Update: Skynet',
      snippet: 'We need to talk about the neural net processor timeline.',
      content: 'The timeline has shifted. We need to move the meeting to Tuesday. Bring the schematics.\n\n- Sarah',
      date: 'Monday',
      unread: false,
      flagged: false,
      mailbox: 'inbox'
    },
    {
      id: '4',
      sender: 'Prashanth',
      email: 'me@prashanth.dev',
      subject: 'Re: Design Assets',
      snippet: 'Attached are the final SVGs for the project.',
      content: 'Hi Team,\n\nPlease find the attached assets for the Q4 marketing campaign. Let me know if you need any changes.\n\nBest,\nPrashanth',
      date: 'Oct 20',
      unread: false,
      flagged: false,
      mailbox: 'sent'
    },
    {
      id: '5',
      sender: 'Lottery Winner',
      email: 'money@rich.com',
      subject: 'YOU WON $1,000,000!!!!',
      snippet: 'Click this link to claim your prize instantly.',
      content: 'CLICK HERE NOW!!!',
      date: 'Oct 15',
      unread: true,
      flagged: false,
      mailbox: 'junk'
    }
  ];

  // Filter Logic
  const filteredEmails = emails.filter(email =>
    email.mailbox === selectedMailbox &&
    (email.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.subject.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const selectedEmail = emails.find(e => e.id === selectedEmailId);

  return (
    <div className={`flex flex-col h-full w-full font-sans overflow-hidden select-none ${isDark ? 'bg-[#1e1e1e] text-gray-200' : 'bg-white text-gray-800'}`}>

      {/* Toolbar */}
      <div className={`h-12 border-b flex items-center px-4 justify-between shrink-0 z-20 ${isDark ? 'bg-[#2d2d2d] border-black/20' : 'bg-[#F6F6F6]/90 border-[#D1D1D1]'}`}>
        {/* Left: Action Icons */}
        <div className="flex items-center space-x-4">
          <div className={`flex space-x-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            <button className={`p-1 rounded disabled:opacity-30 ${isDark ? 'hover:bg-white/10' : 'hover:bg-black/5'}`} title="Check Mail"><IoMailOutline size={18} /></button>
            <button className={`p-1 rounded disabled:opacity-30 ${isDark ? 'hover:bg-white/10' : 'hover:bg-black/5'}`} title="Compose"><IoCreateOutline size={18} /></button>
            <div className={`w-px h-4 mx-2 self-center ${isDark ? 'bg-gray-600' : 'bg-gray-300'}`}></div>
            <button className={`p-1 rounded disabled:opacity-30 ${isDark ? 'hover:bg-white/10' : 'hover:bg-black/5'}`} title="Archive"><IoArchiveOutline size={18} /></button>
            <button className={`p-1 rounded disabled:opacity-30 ${isDark ? 'hover:bg-white/10' : 'hover:bg-black/5'}`} title="Delete"><IoTrashOutline size={18} /></button>
          </div>
        </div>

        {/* Right: Search */}
        <div className="relative">
          <IoSearchOutline size={14} className={`absolute left-2 top-1.5 ${isDark ? 'text-gray-400' : 'text-gray-400'}`} />
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`pl-7 pr-2 py-1 text-xs border rounded-md w-48 focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-sm transition-all
                            ${isDark
                ? 'bg-black/20 border-white/10 text-white placeholder-gray-500'
                : 'bg-white border-gray-300 text-black placeholder-gray-400'
              }`}
          />
        </div>
      </div>

      {/* Three-Pane Content Layout */}
      <div className="flex flex-1 overflow-hidden">

        {/* Pane 1: Mailboxes Sidebar */}
        <div className={`w-48 border-r flex flex-col pt-2
                    ${isDark ? 'bg-[#252525] border-black/20' : 'bg-[#F2F2F2]/95 border-[#D1D1D1]'}`}>
          <div className="px-2 mb-2">
            <h3 className={`text-[10px] font-bold uppercase px-2 mb-1 mt-2 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Favorites</h3>
            <SidebarItem
              icon={<IoFileTrayOutline size={14} />}
              label="Inbox"
              count={2}
              active={selectedMailbox === 'inbox'}
              onClick={() => setSelectedMailbox('inbox')}
              isDark={isDark}
            />
            <SidebarItem
              icon={<IoPaperPlaneOutline size={14} />}
              label="Sent"
              active={selectedMailbox === 'sent'}
              onClick={() => setSelectedMailbox('sent')}
              isDark={isDark}
            />
            <SidebarItem
              icon={<IoAlertCircleOutline size={14} />}
              label="Junk"
              active={selectedMailbox === 'junk'}
              onClick={() => setSelectedMailbox('junk')}
              isDark={isDark}
            />
            <SidebarItem
              icon={<IoTrashOutline size={14} />}
              label="Trash"
              active={selectedMailbox === 'trash'}
              onClick={() => setSelectedMailbox('trash')}
              isDark={isDark}
            />
          </div>
        </div>

        {/* Pane 2: Message List */}
        <div className={`w-80 border-r flex flex-col ${isDark ? 'bg-[#1e1e1e] border-black/20' : 'bg-white border-[#E5E5E5]'}`}>
          <div className={`h-8 border-b flex items-center justify-between px-3
                        ${isDark ? 'bg-[#2d2d2d] border-black/20 text-gray-400' : 'bg-[#FBFBFB] border-[#E5E5E5] text-gray-600'}`}>
            <span className="text-xs font-semibold">Sort by Date</span>
            <IoChevronDownOutline size={12} className="opacity-70" />
          </div>
          <div className="flex-1 overflow-y-auto">
            {filteredEmails.map(email => (
              <div
                key={email.id}
                onClick={() => setSelectedEmailId(email.id)}
                className={`px-4 py-3 border-b cursor-default select-none group
                                    ${isDark ? 'border-white/5' : 'border-gray-100'}
                                    ${selectedEmailId === email.id
                    ? 'bg-[#007AFF] text-white'
                    : isDark
                      ? 'hover:bg-white/5 text-gray-300'
                      : 'hover:bg-[#F5F5F5] text-gray-900'
                  }`}
              >
                <div className="flex justify-between items-baseline mb-0.5">
                  <span className={`text-sm font-semibold truncate
                                        ${email.unread && selectedEmailId !== email.id ? 'text-blue-500 font-bold' : ''}
                                        ${selectedEmailId === email.id ? 'text-white' : ''}
                                    `}>
                    {email.sender}
                  </span>
                  <span className={`text-[11px] ${selectedEmailId === email.id ? 'text-blue-100' : isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    {email.date}
                  </span>
                </div>
                <div className={`text-xs truncate mb-1 ${selectedEmailId === email.id ? 'text-white' : isDark ? 'text-gray-400' : 'text-gray-800'}`}>
                  {email.subject}
                </div>
                <div className={`text-[11px] line-clamp-2 leading-relaxed ${selectedEmailId === email.id ? 'text-blue-100' : isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                  {email.snippet}
                </div>
                {email.flagged && (
                  <div className="mt-1 flex justify-end">
                    <IoFlag size={10} className={selectedEmailId === email.id ? 'text-white' : 'text-orange-500'} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Pane 3: Reading Pane (Detail) */}
        <div className={`flex-1 flex flex-col ${isDark ? 'bg-[#1e1e1e]' : 'bg-white'}`}>
          {selectedEmail ? (
            <>
              {/* Email Header */}
              <div className={`p-6 border-b ${isDark ? 'border-white/10' : 'border-[#F0F0F0]'}`}>
                <div className="flex justify-between items-start mb-4">
                  <h1 className={`text-xl font-bold leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {selectedEmail.subject}
                  </h1>
                  <div className="flex space-x-2 text-gray-400">
                    {selectedEmail.flagged && <IoFlag size={16} className="text-orange-500" />}
                    <IoStarOutline size={16} className="hover:text-yellow-400 cursor-pointer" />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm
                                            ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gradient-to-br from-gray-200 to-gray-300 text-gray-600'}`}>
                      {selectedEmail.sender.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className={`text-sm font-semibold flex items-center gap-2 ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
                        {selectedEmail.sender}
                        <span className="text-gray-400 font-normal text-xs">&lt;{selectedEmail.email}&gt;</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        To: Prashanth
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400 flex flex-col items-end">
                    <span>{selectedEmail.date}</span>
                    <div className="flex items-center gap-1 mt-1 text-gray-300">
                      <IoAttachOutline size={12} />
                      <IoEllipsisHorizontal size={12} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Email Body */}
              <div className={`flex-1 p-8 overflow-y-auto text-sm leading-relaxed whitespace-pre-line selection:bg-blue-100
                                ${isDark ? 'text-gray-300 selection:bg-blue-900' : 'text-gray-800'}`}>
                {selectedEmail.content}
              </div>

              {/* Reply Bar */}
              <div className={`h-12 border-t flex items-center px-4 space-x-2 shrink-0
                                ${isDark ? 'bg-[#2d2d2d] border-white/10' : 'bg-[#F9F9F9] border-[#E5E5E5]'}`}>
                <p className="text-xs text-gray-400 mr-2">Click to reply...</p>
                <button className={`p-1.5 rounded ${isDark ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-black/5 text-gray-600'}`}><IoArrowUndoOutline size={16} /></button>
                <button className={`p-1.5 rounded ${isDark ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-black/5 text-gray-600'}`}><IoArrowRedoOutline size={16} /></button>
                <button className={`p-1.5 rounded ${isDark ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-black/5 text-gray-600'}`}><IoArrowForwardOutline size={16} /></button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-300 select-none">
              <IoMailOutline size={64} className="opacity-20" />
              <p className="mt-4 font-medium opacity-50">No Message Selected</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}

// Helper for Sidebar Items
const SidebarItem = ({ icon, label, count, active, onClick, isDark }: any) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center justify-between px-3 py-1.5 rounded-md text-sm transition-colors mb-0.5
            ${active
        ? isDark ? 'bg-white/10 text-white font-medium' : 'bg-[#DCDCDC] text-black font-medium'
        : isDark ? 'text-gray-400 hover:bg-white/5' : 'text-gray-700 hover:bg-black/5'
      }`}
  >
    <div className="flex items-center space-x-2">
      <span className={active ? 'text-[#007AFF]' : 'text-gray-500'}>{icon}</span>
      <span>{label}</span>
    </div>
    {count && (
      <span className="text-xs font-medium text-gray-400">{count}</span>
    )}
  </button>
);
