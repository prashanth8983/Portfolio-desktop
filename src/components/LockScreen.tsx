import React, { useState, useEffect } from 'react';
import {
    FaArrowRight,
    FaTimes,
    FaWifi,
    FaBatteryFull,
    FaUser,
    FaQuestionCircle,
    FaApple,
    FaExpand
} from 'react-icons/fa';
import Notification from './Notification';

// --- Types ---
type User = {
    id: string;
    name: string;
    avatar: string; // URL or Initials
    hasPassword: boolean;
};

interface LockScreenProps {
    onUnlock: () => void;
    isLocked: boolean;
}

export const LockScreen: React.FC<LockScreenProps> = ({ onUnlock, isLocked }) => {
    // --- Configuration ---
    const users: User[] = [
        {
            id: 'prashanth',
            name: 'Prashanth',
            avatar: 'https://github.com/prashanth8983.png',
            hasPassword: true
        },
        {
            id: 'guest',
            name: 'Guest User',
            avatar: 'guest',
            hasPassword: false
        }
    ];

    // --- State ---
    const [bootState, _setBootState] = useState<'booting' | 'hiding' | 'completed'>('completed');
    const [bootProgress, _setBootProgress] = useState(0);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [password, setPassword] = useState('');
    const [loginStatus, setLoginStatus] = useState<'idle' | 'verifying' | 'success' | 'error'>('idle');
    const [dateState, setDateState] = useState(new Date());
    const [isLoaded, setIsLoaded] = useState(false); // Triggers animations on direct load

    // Boot Sequence Effect
    // Boot Sequence Effect
    useEffect(() => {
        // Trigger animations after mount
        setTimeout(() => setIsLoaded(true), 100);
    }, []);

    // Reset state when locked
    useEffect(() => {
        if (isLocked) {
            setSelectedUser(null);
            setPassword('');
            setLoginStatus('idle');
        }
    }, [isLocked]);

    // Request fullscreen on mount
    useEffect(() => {
        const requestFullscreen = () => {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch(() => {
                    // Silently fail - browsers require user interaction for fullscreen
                });
            }
        };

        // Try on first user interaction
        const handleInteraction = () => {
            requestFullscreen();
            document.removeEventListener('click', handleInteraction);
        };

        document.addEventListener('click', handleInteraction);
        return () => document.removeEventListener('click', handleInteraction);
    }, []);

    // Update time every minute
    useEffect(() => {
        const timer = setInterval(() => setDateState(new Date()), 1000 * 60);
        return () => clearInterval(timer);
    }, []);

    // Format Date & Time for the Big Clock
    const timeString = dateState.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: false });
    const dateString = dateState.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });

    // Handle User Selection
    const handleUserClick = (user: User) => {
        if (selectedUser?.id === user.id) return;
        setSelectedUser(user);
        setPassword('');
        setLoginStatus('idle');
    };

    // Handle Login Attempt
    const handleLogin = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!selectedUser) return;

        if (selectedUser.id === 'guest') {
            setLoginStatus('verifying');
            setTimeout(() => {
                setLoginStatus('success');
                setTimeout(() => onUnlock(), 500);
            }, 1500);
        } else {
            if (!password.trim()) return;
            setLoginStatus('verifying');
            setTimeout(() => {
                // Mock password check - accept anything for demo
                if (password.length > 0) {
                    setLoginStatus('success');
                    setTimeout(() => onUnlock(), 500);
                } else {
                    setLoginStatus('error');
                    setTimeout(() => setLoginStatus('idle'), 500);
                }
            }, 1000);
        }
    };

    // Handle Fullscreen Toggle
    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch((err) => {
                console.error(`Error attempting to enable fullscreen: ${err.message}`);
            });
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    };

    if (!isLocked) return null;

    return (
        <>
            {/* --- Boot Screen Overlay --- */}
            {bootState !== 'completed' && (
                <div
                    className={`fixed inset-0 z-[10000] min-h-screen w-full bg-black flex flex-col items-center justify-center cursor-none transition-opacity duration-1000 ease-in-out ${bootState === 'hiding' ? 'opacity-0' : 'opacity-100'}`}
                >
                    {/* Apple Logo */}
                    <div className="mb-16">
                        <FaApple className="text-white w-24 h-24" size={96} />
                    </div>
                    {/* Loading Bar */}
                    <div className="w-56 h-1.5 bg-[#333] rounded-full overflow-hidden">
                        <div
                            className="h-full bg-white rounded-full transition-all duration-[3000ms] ease-out"
                            style={{ width: `${bootProgress}%` }}
                        ></div>
                    </div>
                </div>
            )}

            {/* --- Main Lock Screen --- */}
            <div className={`fixed inset-0 z-[9999] min-h-screen w-full bg-[url('https://images.unsplash.com/photo-1621619856624-42fd193a0661?q=80&w=3840&auto=format&fit=crop')] bg-cover bg-center overflow-hidden relative font-sans select-none text-white transition-all duration-700 ${isLocked ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>

                {/* Notifications - Only show after boot/load to trigger entrance animations */}
                {(bootState !== 'booting' && isLoaded) && <Notification />}

                {/* Dynamic Background Blur - Only blurs when a user is selected */}
                <div className={`absolute inset-0 bg-black/10 transition-all duration-700 ease-in-out ${selectedUser ? 'backdrop-blur-[30px] bg-black/30' : 'backdrop-blur-none'}`}></div>

                {/* --- Top Status Bar (Minimal) --- */}
                <div className="absolute top-0 w-full h-8 flex justify-end items-center px-4 space-x-4 text-xs font-medium z-20 text-white/80">
                    <div className="flex items-center space-x-1">
                        <FaBatteryFull size={16} />
                    </div>
                    <FaWifi size={16} />
                    {/* Fullscreen Toggle */}
                    <button
                        onClick={toggleFullscreen}
                        className="hover:text-white hover:bg-white/10 p-1 rounded transition-colors"
                        title="Toggle Fullscreen"
                    >
                        <FaExpand size={14} />
                    </button>
                </div>

                {/* --- Main Content Area --- */}
                <div className="relative z-10 flex flex-col items-center h-screen w-full">

                    {/* BIG CLOCK (Fades out when user selected) */}
                    <div className={`mt-24 flex flex-col items-center transition-all duration-1000 ease-out ${selectedUser ? 'opacity-0 -translate-y-10 scale-95 pointer-events-none' : ((bootState !== 'booting' && isLoaded) ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-10 scale-95')}`}>
                        <div className="text-xl md:text-2xl font-semibold text-white/90 drop-shadow-md tracking-wide mb-[-5px]">
                            {dateString}
                        </div>
                        <div className="text-[6rem] md:text-[8rem] font-bold text-white leading-none drop-shadow-xl tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-white/70">
                            {timeString}
                        </div>
                    </div>

                    {/* User Grid Area (Pushed to bottom initially, centers when selected) */}
                    <div className={`flex-1 flex flex-col justify-center transition-all duration-700 ${selectedUser ? '-mt-20' : 'mt-20'}`}>
                        <div className={`flex items-start justify-center ${selectedUser ? '' : 'gap-12'}`}>
                            {users.map((user) => {
                                const isSelected = selectedUser?.id === user.id;
                                // If a user is selected, hide the others by fading them out and shrinking
                                const isOther = selectedUser && !isSelected;

                                return (
                                    <div
                                        key={user.id}
                                        className={`flex flex-col items-center transition-all duration-1000 cursor-pointer group relative
                    ${isOther ? 'opacity-0 scale-0 w-0 h-0 m-0 p-0 overflow-hidden' : ((bootState !== 'booting' && isLoaded) ? 'opacity-100 scale-100 w-auto' : 'opacity-0 scale-90 translate-y-10')}
                  `}
                                        onClick={() => handleUserClick(user)}
                                    >
                                        {/* Avatar */}
                                        <div className={`
                    rounded-full shadow-2xl mb-4 overflow-hidden border-2 border-white/20 relative transition-all duration-500
                    ${isSelected ? 'w-24 h-24 md:w-32 md:h-32 ring-4 ring-white/20' : 'w-20 h-20 md:w-24 md:h-24 hover:scale-105'}
                  `}>
                                            {user.id === 'guest' ? (
                                                <div className="w-full h-full bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-xl flex items-center justify-center shadow-inner">
                                                    <FaUser size={40} className="text-white/80 drop-shadow-md" />
                                                </div>
                                            ) : (
                                                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                                            )}
                                        </div>

                                        {/* Name */}
                                        <span className={`text-lg md:text-xl font-semibold text-white/90 drop-shadow-md mb-6 transition-all`}>
                                            {user.name}
                                        </span>

                                        {/* Login Controls (Only for selected) */}
                                        <div className={`
                    flex flex-col items-center space-y-3 transition-all duration-500 ease-out overflow-hidden
                    ${isSelected ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}
                  `}>

                                            {user.hasPassword ? (
                                                // --- Password Input ---
                                                <form onSubmit={handleLogin} className="flex flex-col items-center relative group/input">
                                                    <div className={`relative flex items-center ${loginStatus === 'error' ? 'animate-shake' : ''}`}>
                                                        <input
                                                            type="password"
                                                            value={password}
                                                            onChange={(e) => setPassword(e.target.value)}
                                                            placeholder="Enter Password"
                                                            className="w-48 bg-white/20 backdrop-blur-xl border border-white/10 rounded-full py-1.5 px-4 text-sm text-white placeholder-white/50 focus:outline-none focus:bg-white/30 focus:border-white/30 transition-all shadow-lg text-center"
                                                            autoFocus={isSelected}
                                                        />

                                                        {/* Right Arrow / Spinner */}
                                                        <div className="absolute right-1">
                                                            {loginStatus === 'verifying' ? (
                                                                <div className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin mr-1"></div>
                                                            ) : (
                                                                <button
                                                                    type="submit"
                                                                    disabled={!password}
                                                                    className={`p-1 rounded-full transition-all ${password ? 'text-white hover:bg-white/20' : 'text-transparent pointer-events-none'}`}
                                                                >
                                                                    <FaArrowRight size={12} />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Hint / Error Message */}
                                                    <div className="h-6 mt-2 text-xs font-medium text-white/80 flex items-center">
                                                        {loginStatus === 'error' && <span className="text-red-300 drop-shadow-md font-semibold">Incorrect password</span>}
                                                        {loginStatus === 'idle' && password.length === 0 && <span className="flex items-center gap-1 opacity-60"><FaQuestionCircle size={10} /> Enter Password</span>}
                                                    </div>
                                                </form>
                                            ) : (
                                                // --- Guest Login (No Password) ---
                                                <div className="flex flex-col items-center animate-in fade-in slide-in-from-top-2">
                                                    {loginStatus === 'verifying' || loginStatus === 'success' ? (
                                                        <div className="flex flex-col items-center space-y-2">
                                                            <div className="w-6 h-6 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>
                                                        </div>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleLogin()}
                                                            className="bg-white/20 hover:bg-white/30 text-white px-6 py-1.5 rounded-full text-xs font-medium border border-white/10 transition-colors backdrop-blur-md"
                                                        >
                                                            Log In
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Cancel Button (To deselect user) */}
                    {selectedUser && (
                        <div className="absolute bottom-24 w-full flex justify-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <button
                                onClick={() => setSelectedUser(null)}
                                className="flex flex-col items-center space-y-1 group"
                            >
                                <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/25 flex items-center justify-center transition-all border border-white/10 text-white/80 group-hover:text-white shadow-lg">
                                    <FaTimes size={16} />
                                </div>
                                <span className="text-[11px] font-medium text-white/60 group-hover:text-white/90 transition-colors mt-1">Cancel</span>
                            </button>
                        </div>
                    )}



                </div>

                <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.3s cubic-bezier(.36,.07,.19,.97) both;
        }
      `}</style>
            </div>
        </>
    );
};


