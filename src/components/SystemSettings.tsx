import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import {
    FaWifi,
    FaBluetooth
} from 'react-icons/fa';
import {
    IoGlobeOutline,
    IoDesktopOutline,
    IoMoonOutline,
    IoBatteryFull,
    IoNotificationsOutline,
    IoVolumeHighOutline,
    IoLockClosedOutline,
    IoColorPaletteOutline,
    IoHardwareChipOutline,
    IoSearchOutline,
    IoChevronForward,
    IoCheckmark,
    IoSunnyOutline
} from 'react-icons/io5';

// --- Types ---
type SettingTab = 'wifi' | 'bluetooth' | 'appearance' | 'display' | 'sound';

export const SystemSettings: React.FC = () => {
    const { isDark, setTheme } = useTheme();
    const [activeTab, setActiveTab] = useState<SettingTab>('appearance');
    const [searchQuery, setSearchQuery] = useState('');

    // Mock State
    const [wifiEnabled, setWifiEnabled] = useState(true);
    const [bluetoothEnabled, setBluetoothEnabled] = useState(true);

    return (
        <div className={`flex h-full w-full font-sans select-none overflow-hidden ${isDark ? 'bg-[#1e1e1e] text-white' : 'bg-[#F6F6F6] text-black'}`}>

            {/* Sidebar */}
            <div className={`w-60 border-r flex flex-col pt-10 px-0 
                ${isDark ? 'bg-[#252525] border-black/20' : 'bg-[#F2F2F2]/80 border-[#D1D1D1] backdrop-blur-xl'}`}>

                {/* Search */}
                <div className="px-3 mb-2">
                    <div className="relative">
                        <IoSearchOutline size={14} className={`absolute left-2 top-1.5 ${isDark ? 'text-gray-400' : 'text-gray-400'}`} />
                        <input
                            type="text"
                            placeholder="Search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={`pl-7 pr-2 py-1 w-full text-xs border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all
                                ${isDark
                                    ? 'bg-white/10 border-white/5 text-white placeholder-gray-500 focus:bg-white/20'
                                    : 'bg-white/50 border-gray-300/50 text-black placeholder-gray-500 focus:bg-white'
                                }`}
                        />
                    </div>
                </div>

                {/* Profile Card */}
                <div className={`mx-3 mb-4 p-2 flex items-center space-x-3 rounded-md transition-colors cursor-default
                    ${isDark ? 'hover:bg-white/5' : 'hover:bg-black/5'}`}>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-400 to-blue-600 flex items-center justify-center text-white shadow-sm">
                        <span className="font-bold text-sm">PK</span>
                    </div>
                    <div className="flex flex-col">
                        <span className={`text-sm font-semibold leading-tight ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>Prashanth</span>
                        <span className="text-xs text-gray-500">Apple ID, iCloud+</span>
                    </div>
                </div>

                {/* Settings List */}
                <div className="flex-1 overflow-y-auto px-2 space-y-0.5 pb-4 custom-scrollbar">
                    <SidebarItem
                        icon={<FaWifi size={16} className="text-white" />}
                        color="bg-blue-500"
                        label="Wi-Fi"
                        active={activeTab === 'wifi'}
                        onClick={() => setActiveTab('wifi')}
                        status={wifiEnabled ? 'On' : 'Off'}
                        isDark={isDark}
                    />
                    <SidebarItem
                        icon={<FaBluetooth size={16} className="text-white" />}
                        color="bg-blue-500"
                        label="Bluetooth"
                        active={activeTab === 'bluetooth'}
                        onClick={() => { setActiveTab('bluetooth'); setBluetoothEnabled(!bluetoothEnabled); }}
                        status={bluetoothEnabled ? 'On' : 'Off'}
                        isDark={isDark}
                    />
                    <SidebarItem
                        icon={<IoGlobeOutline size={16} className="text-white" />}
                        color="bg-blue-500"
                        label="Network"
                        isDark={isDark}
                    />

                    <div className="h-4"></div>

                    <SidebarItem
                        icon={<IoNotificationsOutline size={16} className="text-white" />}
                        color="bg-red-500"
                        label="Notifications"
                        isDark={isDark}
                    />
                    <SidebarItem
                        icon={<IoVolumeHighOutline size={16} className="text-white" />}
                        color="bg-pink-500"
                        label="Sound"
                        active={activeTab === 'sound'}
                        onClick={() => setActiveTab('sound')}
                        isDark={isDark}
                    />
                    <SidebarItem
                        icon={<IoMoonOutline size={16} className="text-white" />}
                        color="bg-indigo-500"
                        label="Focus"
                        isDark={isDark}
                    />
                    <SidebarItem
                        icon={<IoBatteryFull size={16} className="text-white" />}
                        color="bg-green-500"
                        label="Screen Time"
                        isDark={isDark}
                    />

                    <div className="h-4"></div>

                    <SidebarItem
                        icon={<div className="w-4 h-4 rounded-full border-2 border-white/30 bg-gray-400"></div>}
                        color="bg-gray-400"
                        label="General"
                        isDark={isDark}
                    />
                    <SidebarItem
                        icon={<IoColorPaletteOutline size={16} className="text-white" />}
                        color="bg-sky-500"
                        label="Appearance"
                        active={activeTab === 'appearance'}
                        onClick={() => setActiveTab('appearance')}
                        isDark={isDark}
                    />
                    <SidebarItem
                        icon={<IoDesktopOutline size={16} className="text-white" />}
                        color="bg-blue-600"
                        label="Displays"
                        active={activeTab === 'display'}
                        onClick={() => setActiveTab('display')}
                        isDark={isDark}
                    />
                    <SidebarItem
                        icon={<IoHardwareChipOutline size={16} className="text-white" />}
                        color="bg-gray-500"
                        label="Mouse"
                        isDark={isDark}
                    />
                </div>
            </div>

            {/* Content Area */}
            <div className={`flex-1 overflow-y-auto ${isDark ? 'bg-[#1e1e1e]' : 'bg-white'}`}>
                <div className="p-8 max-w-3xl mx-auto">

                    {/* --- APPEARANCE TAB --- */}
                    {activeTab === 'appearance' && (
                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <h1 className={`text-xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>Appearance</h1>

                            {/* Theme Picker */}
                            <div className="flex space-x-6 mb-8">
                                <ThemeOption
                                    label="Light"
                                    active={!isDark}
                                    onClick={() => setTheme('light')}
                                    // Light Mode Preview
                                    preview={<div className="w-full h-full bg-[#F6F6F6] flex"><div className="w-1/3 h-full bg-[#E5E5E5] border-r border-[#D1D1D1]"></div></div>}
                                    isDark={isDark}
                                />
                                <ThemeOption
                                    label="Dark"
                                    active={isDark}
                                    onClick={() => setTheme('dark')}
                                    // Dark Mode Preview
                                    preview={<div className="w-full h-full bg-[#1E1E1E] flex"><div className="w-1/3 h-full bg-[#2D2D2D] border-r border-black"></div></div>}
                                    isDark={isDark}
                                />
                                <ThemeOption
                                    label="Auto"
                                    active={false} // No auto logic implement yet
                                    onClick={() => { }}
                                    preview={<div className="w-full h-full bg-gradient-to-br from-[#F6F6F6] to-[#1E1E1E]"></div>}
                                    isDark={isDark}
                                />
                            </div>

                            {/* Options Group */}
                            <div className={`rounded-lg border overflow-hidden mb-6 ${isDark ? 'bg-[#2d2d2d] border-white/5' : 'bg-white border-gray-200'}`}>
                                <SettingRow label="Accent Color" isDark={isDark}>
                                    <div className="flex space-x-2">
                                        {['bg-blue-500', 'bg-purple-500', 'bg-pink-500', 'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-gray-500'].map(c => (
                                            <div key={c} className={`w-4 h-4 rounded-full ${c} shadow-sm cursor-pointer hover:scale-110 transition-transform ${c === 'bg-blue-500' ? 'ring-2 ring-offset-1 ring-blue-500' : ''}`}></div>
                                        ))}
                                    </div>
                                </SettingRow>
                                <SettingRow label="Highlight Color" borderTop isDark={isDark}>
                                    <select className={`text-sm rounded px-2 py-1 outline-none border ${isDark ? 'bg-black/20 border-white/10 text-gray-300' : 'bg-gray-100 border-gray-200'}`}>
                                        <option>Blue</option>
                                        <option>Purple</option>
                                        <option>Pink</option>
                                    </select>
                                </SettingRow>
                                <SettingRow label="Sidebar Icon Size" borderTop isDark={isDark}>
                                    <select className={`text-sm rounded px-2 py-1 outline-none border ${isDark ? 'bg-black/20 border-white/10 text-gray-300' : 'bg-gray-100 border-gray-200'}`}>
                                        <option>Small</option>
                                        <option>Medium</option>
                                        <option>Large</option>
                                    </select>
                                </SettingRow>
                            </div>

                            <div className={`rounded-lg border overflow-hidden ${isDark ? 'bg-[#2d2d2d] border-white/5' : 'bg-white border-gray-200'}`}>
                                <SettingRow label="Show scroll bars" isDark={isDark}>
                                    <div className={`flex flex-col space-y-2 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                        <label className="flex items-center space-x-2"><input type="radio" name="scroll" /> <span>Automatically based on mouse or trackpad</span></label>
                                        <label className="flex items-center space-x-2"><input type="radio" name="scroll" /> <span>When scrolling</span></label>
                                        <label className="flex items-center space-x-2"><input type="radio" name="scroll" defaultChecked /> <span>Always</span></label>
                                    </div>
                                </SettingRow>
                            </div>
                        </div>
                    )}

                    {/* --- WIFI TAB --- */}
                    {activeTab === 'wifi' && (
                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div className="flex justify-between items-center mb-6">
                                <h1 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Wi-Fi</h1>
                                <Toggle checked={wifiEnabled} onChange={() => setWifiEnabled(!wifiEnabled)} />
                            </div>

                            <div className={`rounded-lg border overflow-hidden mb-6 ${isDark ? 'bg-[#2d2d2d] border-white/5' : 'bg-white border-gray-200'}`}>
                                <div className="p-4 flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white">
                                            <FaWifi size={18} />
                                        </div>
                                        <div>
                                            <div className={`text-sm font-semibold ${isDark ? 'text-gray-200' : ''}`}>Home Network 5G</div>
                                            <div className="text-xs text-green-600 font-medium">Connected</div>
                                        </div>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button className={`px-3 py-1 text-xs font-medium border rounded ${isDark ? 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10' : 'bg-white border-gray-300 hover:bg-gray-50'}`}>Details...</button>
                                    </div>
                                </div>
                            </div>

                            <h2 className="text-xs font-bold text-gray-500 uppercase mb-2 px-2">Known Networks</h2>
                            <div className={`rounded-lg border overflow-hidden ${isDark ? 'bg-[#2d2d2d] border-white/5' : 'bg-white border-gray-200'}`}>
                                <NetworkRow name="Starbucks WiFi" secure isDark={isDark} />
                                <NetworkRow name="Office_Guest" secure isDark={isDark} />
                                <NetworkRow name="iPhone Hotspot" secure={false} strength={2} isDark={isDark} />
                            </div>
                        </div>
                    )}

                    {/* --- DISPLAY TAB --- */}
                    {activeTab === 'display' && (
                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <h1 className={`text-xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>Displays</h1>

                            <div className="flex justify-center mb-8">
                                <div className="relative">
                                    {/* Monitor Visual */}
                                    <div className="w-48 h-32 bg-gray-800 rounded-lg border-4 border-gray-300 shadow-xl flex items-center justify-center relative overflow-hidden">
                                        <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 opacity-80"></div>
                                        <span className="absolute text-white font-medium text-xs bg-black/50 px-2 py-1 rounded">Built-in Display</span>
                                    </div>
                                    <div className="w-16 h-8 bg-gray-300 mx-auto rounded-b-lg mb-1"></div>
                                    <div className="w-24 h-1 bg-gray-300 mx-auto rounded-full shadow-sm"></div>
                                </div>
                            </div>

                            <div className={`rounded-lg border overflow-hidden mb-6 ${isDark ? 'bg-[#2d2d2d] border-white/5' : 'bg-white border-gray-200'}`}>
                                <SettingRow label="Resolution" isDark={isDark}>
                                    <div className="flex space-x-2">
                                        <button className={`px-3 py-1.5 text-xs font-medium rounded border ${isDark ? 'bg-white/10 border-white/5 text-gray-300' : 'bg-gray-100 text-gray-600 border-gray-200'}`}>Default</button>
                                        <button className={`px-3 py-1.5 text-xs font-medium rounded border ${isDark ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}>Scaled</button>
                                    </div>
                                </SettingRow>
                                <SettingRow label="Brightness" borderTop isDark={isDark}>
                                    <div className="flex items-center space-x-3 w-48">
                                        <span className="text-xs text-gray-400"><IoSunnyOutline size={12} /></span>
                                        <input type="range" className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                                        <span className="text-xs text-gray-400"><IoSunnyOutline size={16} /></span>
                                    </div>
                                </SettingRow>
                                <SettingRow label="True Tone" borderTop isDark={isDark}>
                                    <Toggle checked={true} onChange={() => { }} />
                                </SettingRow>
                            </div>
                        </div>
                    )}

                </div>
            </div>

        </div>
    );
}

// --- SUB COMPONENTS ---

const SidebarItem = ({ icon, color, label, active, onClick, status, isDark }: any) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center justify-between px-2 py-1.5 rounded-md transition-colors 
            ${active
                ? 'bg-[#007AFF] text-white'
                : isDark ? 'hover:bg-white/5 text-gray-300' : 'hover:bg-black/5 text-gray-700'
            }`}
    >
        <div className="flex items-center space-x-3">
            <div className={`w-5 h-5 rounded-[4px] ${color} flex items-center justify-center shadow-sm text-white`}>
                {icon}
            </div>
            <span className="text-sm font-medium">{label}</span>
        </div>
        <div className="flex items-center space-x-1">
            {status && <span className={`text-xs ${active ? 'text-blue-100' : 'text-gray-400'}`}>{status}</span>}
            <IoChevronForward size={12} className={`opacity-50 ${active ? 'text-white' : 'text-gray-400'}`} />
        </div>
    </button>
);

const SettingRow = ({ label, children, borderTop, isDark }: any) => (
    <div className={`p-3 flex items-start justify-between ${borderTop ? (isDark ? 'border-t border-white/5' : 'border-t border-gray-100') : ''}`}>
        <span className={`text-sm font-medium mt-1 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>{label}</span>
        <div>{children}</div>
    </div>
);

const NetworkRow = ({ name, secure = true, strength = 3, isDark }: any) => (
    <div className={`p-3 border-b last:border-0 flex items-center justify-between cursor-pointer 
        ${isDark ? 'border-white/5 hover:bg-white/5' : 'border-gray-100 hover:bg-gray-50'}`}>
        <div className="flex items-center space-x-3">
            <span className="text-gray-400 font-bold text-xs">
                {strength === 3 ? 'wifi' : 'hotspot'}
            </span>
            <span className={`text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>{name}</span>
        </div>
        <div className="flex space-x-2 text-gray-400">
            {secure && <IoLockClosedOutline size={12} />}
            <div className="text-xs font-bold text-gray-500">
                {strength === 3 ? '📶' : '••'}
            </div>
        </div>
    </div>
);

const ThemeOption = ({ label, active, onClick, preview, isDark }: any) => (
    <div className="flex flex-col items-center space-y-2 cursor-pointer group" onClick={onClick}>
        <div className={`w-24 h-16 rounded-lg border-2 overflow-hidden shadow-sm transition-all 
            ${active ? 'border-blue-500 ring-2 ring-blue-200' : isDark ? 'border-gray-600 group-hover:border-gray-500' : 'border-gray-200 group-hover:border-gray-300'}`}>
            {preview}
        </div>
        <span className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{label}</span>
        <div className={`w-4 h-4 rounded-full border flex items-center justify-center 
            ${active ? 'bg-blue-500 border-blue-500' : 'bg-transparent border-gray-400'}`}>
            {active && <IoCheckmark size={10} className="text-white" />}
        </div>
    </div>
);

const Toggle = ({ checked, onChange }: any) => (
    <div
        className={`w-10 h-6 rounded-full p-0.5 cursor-pointer transition-colors duration-200 ${checked ? 'bg-blue-500' : 'bg-gray-300'}`}
        onClick={onChange}
    >
        <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${checked ? 'translate-x-4' : 'translate-x-0'}`}></div>
    </div>
);
