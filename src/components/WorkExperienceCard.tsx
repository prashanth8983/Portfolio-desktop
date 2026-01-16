import React, { useState, useRef } from 'react';
import { FaWifi } from 'react-icons/fa';
import { experienceCards, ExperienceCard } from '../data/portfolio';

// --- 3D Credit Card Component ---
const CreditCardItem = ({ data }: { data: ExperienceCard }) => {
   const cardRef = useRef<HTMLDivElement>(null);
   const [rotate, setRotate] = useState({ x: 0, y: 0 });
   const [isFlipped, setIsFlipped] = useState(false);
   const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });

   // ISO 7810 ID-1 Aspect Ratio
   const isPortrait = data.orientation === 'portrait';
   const widthClass = isPortrait ? 'w-[252px]' : 'w-[400px]';
   const heightClass = isPortrait ? 'h-[400px]' : 'h-[252px]';

   const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -18;
      const rotateY = ((x - centerX) / centerX) * 18;

      setRotate({ x: rotateX, y: rotateY });
      setGlare({ x: (x / rect.width) * 100, y: (y / rect.height) * 100, opacity: 1 });
   };

   const handleMouseLeave = () => {
      setRotate({ x: 0, y: 0 });
      setGlare(prev => ({ ...prev, opacity: 0 }));
   };

   // --- Themes & Branding ---
   const getThemeStyles = (theme: string) => {
      switch (theme) {
         case 'titanium': // NYU - Violet/White/Silver
            return {
               background: 'bg-gradient-to-br from-[#f0f0f0] via-[#e5e5e5] to-[#d1d1d1]',
               text: 'text-slate-800',
               label: 'text-slate-500',
               border: 'border-white/60',
               accent: 'text-[#57068c]', // NYU Violet
               shadow: 'shadow-lg shadow-slate-400/50'
            };
         case 'midnight': // Kampd - Dark Blue/Teal
            return {
               background: 'bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364]',
               text: 'text-blue-50',
               label: 'text-blue-300/60',
               border: 'border-white/10',
               accent: 'text-[#4facfe]',
               shadow: 'shadow-lg shadow-blue-900/50'
            };
         case 'obsidian': // Data Weave - Dark/Black/Orange Accent
            return {
               background: 'bg-gradient-to-br from-[#232526] via-[#414345] to-[#232526]',
               text: 'text-amber-50',
               label: 'text-amber-500/60',
               border: 'border-amber-500/20',
               accent: 'text-[#f09819]',
               shadow: 'shadow-lg shadow-orange-900/20'
            };
         default:
            return {
               background: 'bg-gray-200', text: 'text-black', label: 'text-gray-500', border: 'border-white', accent: 'text-blue-500', shadow: ''
            };
      }
   };

   const themeStyles = getThemeStyles(data.theme);
   const isDarkTheme = data.theme !== 'titanium';

   // Logo rendering
   const renderLogo = () => {
      if (data.company.includes('NEW YORK UNIVERSITY')) {
         return (
            <div className={`flex flex-col ${isPortrait ? 'items-center mt-2' : 'items-end'}`}>
               <img src="/nyu_seal.svg" alt="NYU" className="w-10 h-10 opacity-90 drop-shadow-md mb-1" />
               <div className={`font-serif text-[6px] font-bold tracking-widest ${themeStyles.accent}`}>NEW YORK UNIVERSITY</div>
            </div>
         );
      }
      // Text fallback for others with styled fonts
      return (
         <div className={`flex flex-col ${isPortrait ? 'items-center' : 'items-end'}`}>
            <div className={`font-black italic text-lg ${themeStyles.text} opacity-90 tracking-tighter uppercase whitespace-nowrap`}>
               {data.company.split(' ')[0]}
            </div>
            <span className={`text-[6px] uppercase tracking-[0.2em] ${themeStyles.label}`}>
               {data.role.split(' ')[0]} CARD
            </span>
         </div>
      );
   };

   return (
      <div className={`${widthClass} ${heightClass} cursor-pointer group relative select-none`} style={{ perspective: '1000px' }} onClick={() => setIsFlipped(!isFlipped)}>
         <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
               transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y + (isFlipped ? 180 : 0)}deg)`,
               transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
               transformStyle: 'preserve-3d',
            }}
            className="relative w-full h-full duration-200"
         >

            {/* ================= FRONT FACE ================= */}
            <div
               className={`absolute inset-0 rounded-[14px] shadow-2xl overflow-hidden ${themeStyles.background} ${themeStyles.border} border`}
               style={{ backfaceVisibility: 'hidden' }}
            >

               {/* Texture/Noise Overlay */}
               <div className="absolute inset-0 opacity-[0.12] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] mix-blend-overlay"></div>

               {/* Distinct Background Elements */}
               {data.theme === 'midnight' && (
                  <div className="absolute -bottom-24 -left-20 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
               )}
               {data.theme === 'obsidian' && (
                  <>
                     <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 mix-blend-overlay pointer-events-none"></div>
                     <div className="absolute -top-10 -right-10 w-60 h-60 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>
                  </>
               )}
               {data.theme === 'titanium' && (
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/40 to-transparent opacity-50 pointer-events-none"></div>
               )}

               <div className="relative z-10 p-6 h-full flex flex-col">

                  {/* Absolute Top Right: Contactless */}
                  <div className="absolute top-6 right-6">
                     <FaWifi size={24} className={`${themeStyles.text} opacity-60 rotate-90`} />
                  </div>

                  {/* Spacer/Positioning for Chip */}
                  <div className={`${isPortrait ? 'mt-16' : 'mt-10'}`}></div>

                  {/* Chip - Centered in Portrait, Left in Landscape */}
                  <div className={`w-12 h-9 bg-gradient-to-b from-[#ffedb8] to-[#eacda3] rounded-[6px] relative overflow-hidden shadow-md border border-[#d4af37]/40 mb-3 ${isPortrait ? 'self-center' : ''}`}>
                     <div className="absolute inset-0 border-[0.5px] border-[#b8860b]/30 grid grid-cols-2">
                        <div className="border-r border-[#b8860b]/30 rounded-l-[4px]"></div>
                        <div className="rounded-r-[4px]"></div>
                     </div>
                     <div className="absolute top-1/2 left-0 right-0 h-px bg-[#b8860b]/30"></div>
                     <div className="absolute top-2 bottom-2 left-1/2 w-px bg-[#b8860b]/30"></div>
                  </div>

                  {/* Card Number */}
                  <div className="mb-auto">
                     <div
                        className={`font-mono text-[21px] tracking-[0.11em] ${themeStyles.text} drop-shadow-md ${isPortrait ? 'text-center' : ''}`}
                        style={{ textShadow: isDarkTheme ? '1px 1px 1px rgba(0,0,0,0.5)' : '1px 1px 0px rgba(255,255,255,0.7)' }}
                     >
                        {isPortrait ? (
                           <div className="flex flex-col gap-2">
                              <span>{data.cardNumber.slice(0, 9)}</span>
                              <span>{data.cardNumber.slice(9)}</span>
                           </div>
                        ) : (
                           data.cardNumber
                        )}
                     </div>
                     {/* Tiny first 4 digits */}
                     {!isPortrait && (
                        <div className={`text-[7px] font-mono tracking-[0.2em] uppercase mt-1 opacity-60 ${themeStyles.text}`}>
                           {data.cardNumber.slice(0, 4)}
                        </div>
                     )}
                  </div>

                  {/* Bottom Details */}
                  <div className={`flex ${isPortrait ? 'flex-col gap-6 items-center text-center' : 'justify-between items-end'}`}>
                     <div>
                        <div className={`flex items-center gap-2 mb-1 ${isPortrait ? 'justify-center' : ''}`}>
                           <span className={`text-[5px] uppercase ${themeStyles.label} font-bold tracking-widest text-right`}>
                              VALID<br />THRU
                           </span>
                           <span
                              className={`font-mono text-xs ${themeStyles.text}`}
                              style={{ textShadow: isDarkTheme ? '1px 1px 1px rgba(0,0,0,0.5)' : '1px 1px 0px rgba(255,255,255,0.7)' }}
                           >
                              {data.periodEnd === 'PRESENT' ? '12/28' : data.periodEnd}
                           </span>
                        </div>
                        <div
                           className={`font-mono text-sm uppercase tracking-widest ${themeStyles.text}`}
                           style={{ textShadow: isDarkTheme ? '1px 1px 1px rgba(0,0,0,0.5)' : '1px 1px 0px rgba(255,255,255,0.7)' }}
                        >
                           PRASHANTH
                        </div>
                        <div className={`text-[8px] font-bold uppercase tracking-wide opacity-70 ${themeStyles.text} mt-0.5`}>
                           {data.role}
                        </div>
                     </div>

                     {/* Brand Logo */}
                     {renderLogo()}
                  </div>

               </div>

               {/* Glare */}
               <div
                  className="absolute inset-0 pointer-events-none mix-blend-soft-light z-20"
                  style={{
                     opacity: glare.opacity,
                     background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0) 50%)`
                  }}
               />
            </div>


            {/* ================= BACK FACE ================= */}
            <div
               className={`absolute inset-0 rounded-[14px] shadow-2xl overflow-hidden ${themeStyles.background} ${themeStyles.border} border`}
               style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden' }}
            >
               {/* Magnetic Stripe */}
               {isPortrait ? (
                  <div className="absolute right-4 top-0 bottom-0 w-12 bg-[#1a1a1a] flex flex-col justify-center overflow-hidden z-10">
                     <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/diagonal-stripes.png')]"></div>
                  </div>
               ) : (
                  <div className="w-full h-10 bg-[#1a1a1a] mt-6 relative z-10">
                     <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/diagonal-stripes.png')]"></div>
                  </div>
               )}

               {/* Portrait: Vertical Signature Strip (Rotated 270 deg) */}
               {isPortrait && (
                  <div
                     className="absolute right-16 top-1/2 -translate-y-1/2 flex items-center gap-2 origin-center rotate-[270deg] z-10"
                     style={{ width: 'max-content' }}
                  >
                     <div className="w-56 h-8 bg-white/90 relative flex items-center px-2 overflow-hidden rounded-sm">
                        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')]"></div>
                        <span className="text-black text-sm opacity-80 transform -rotate-1 relative z-10" style={{ fontFamily: "'Reenie Beanie', cursive" }}>
                           Prashanth.Dev
                        </span>
                     </div>
                     <div className="w-10 h-8 bg-white/90 flex items-center justify-center font-mono text-black text-sm font-bold italic rounded-sm border-l-2 border-red-500/20">
                        {data.cvv}
                     </div>
                  </div>
               )}

               {/* Landscape Signature */}
               {!isPortrait && (
                  <div className="px-5 mt-4 flex items-center space-x-3">
                     <div className="flex-1 h-8 bg-white/90 relative flex items-center px-2 overflow-hidden">
                        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')]"></div>
                        <span className="text-black text-sm opacity-80 transform -rotate-1 relative z-10" style={{ fontFamily: "'Reenie Beanie', cursive" }}>
                           Prashanth.Dev
                        </span>
                     </div>
                     <div className="w-10 h-8 bg-white/90 flex items-center justify-center font-mono text-black text-sm font-bold italic rounded-sm border-l-2 border-red-500/20">
                        {data.cvv}
                     </div>
                  </div>
               )}

               {/* Details - Added padding for portrait to clear strips */}
               <div className={`p-5 pt-4 ${isPortrait ? 'pr-28 h-full flex flex-col justify-center' : ''}`}>
                  <div className={`text-[8px] ${themeStyles.label} uppercase tracking-widest mb-2 font-bold`}>
                     SKILLS & EXPERTISE
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                     {data.skills.map(skill => (
                        <span key={skill} className={`text-[8px] uppercase px-1.5 py-0.5 rounded border font-semibold tracking-wide ${isDarkTheme ? 'border-white/20 bg-white/10 text-white' : 'border-black/10 bg-black/5 text-black'}`}>
                           {skill}
                        </span>
                     ))}
                  </div>

                  <div className={`text-[9px] ${themeStyles.text} leading-relaxed font-mono opacity-80 border-l-2 ${isDarkTheme ? 'border-white/20' : 'border-black/20'} pl-2`}>
                     "{data.description}"
                  </div>

                  <div className={`mt-auto ${isPortrait ? '' : 'absolute bottom-4'} w-full ${isPortrait ? 'text-left' : 'text-center'} text-[6px] ${themeStyles.label} uppercase tracking-widest ${isPortrait ? '' : 'pr-10'}`}>
                     Auth Code: {data.id}00-8X2 • Non-Transferable
                  </div>
               </div>

               {/* Back Glare */}
               <div
                  className="absolute inset-0 pointer-events-none mix-blend-overlay z-20"
                  style={{
                     background: `linear-gradient(115deg, rgba(255,255,255,0) 30%, rgba(255,255,255,0.1) 45%, rgba(255,255,255,0) 60%)`
                  }}
               />
            </div>

         </div>
      </div>
   );
};

// --- Main Work Experience Showcase Component ---
interface WorkExperienceShowcaseProps {
   experiences?: ExperienceCard[];
}

export const WorkExperienceShowcase: React.FC<WorkExperienceShowcaseProps> = ({
   experiences = experienceCards
}) => {
   const landscapeCards = experiences.filter(x => x.orientation !== 'portrait');
   const portraitCards = experiences.filter(x => x.orientation === 'portrait');

   return (
      <>
         {/* Cards Container - no background */}
         <div className="flex flex-col lg:flex-row gap-6 items-center justify-center p-6">
            {/* Left Column: Horizontal Cards */}
            <div className="flex flex-col gap-6">
               {landscapeCards.map(xp => (
                  <CreditCardItem key={xp.id} data={xp} />
               ))}
            </div>
            {/* Right Column: Vertical Card */}
            {portraitCards.length > 0 && (
               <div className="flex flex-col gap-6">
                  {portraitCards.map(xp => (
                     <CreditCardItem key={xp.id} data={xp} />
                  ))}
               </div>
            )}
         </div>

         {/* Google Fonts for handwriting */}
         <link href="https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Reenie+Beanie&display=swap" rel="stylesheet" />
      </>
   );
};

export default WorkExperienceShowcase;
