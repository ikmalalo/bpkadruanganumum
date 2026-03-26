import React, { useEffect, useState } from 'react';
import logo from '../assets/images/logo.png';

const LoadingScreen: React.FC = () => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return prev + 1;
            });
        }, 25); // 100 * 25ms = 2500ms (approx 2.5s for progress bar)

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white text-gray-900 font-poppins select-none transition-opacity duration-1000">
            {/* Top Information */}
            <div className="absolute top-8 left-8 flex flex-col gap-1">
                <span className="text-[10px] tracking-[0.2em] text-gray-400 uppercase font-medium">AUTHORITY</span>
                <span className="text-[12px] font-semibold text-gray-600">BPKAD Samarinda</span>
            </div>
            
            <div className="absolute top-8 right-8 flex flex-col items-end gap-1">
                <span className="text-[10px] tracking-[0.2em] text-gray-400 uppercase font-medium">SECURITY</span>
                <span className="text-[12px] font-semibold text-gray-600 italic">SSL Encrypted</span>
            </div>

            {/* Center Content */}
            <div className="flex flex-col items-center gap-12 max-w-sm w-full px-8">
                {/* Logo Box */}
                <div className="relative group">
                    {/* Glowing effect background - subtle for light mode */}
                    <div className="absolute -inset-4 bg-orange-500/10 rounded-full blur-3xl opacity-30 animate-pulse"></div>
                    
                    <div className="relative w-48 h-48 bg-[#0a0c10] border border-gray-100 rounded-2xl flex items-center justify-center shadow-2xl overflow-hidden">
                        <img 
                            src={logo} 
                            alt="Logo BPKAD" 
                            className="w-32 h-32 object-contain filter drop-shadow-[0_0_15px_rgba(251,146,60,0.3)]"
                        />
                    </div>
                </div>

                {/* Progress Section */}
                <div className="w-full space-y-6">
                    {/* Progress Bar Container */}
                    <div className="relative h-[2px] w-full bg-gray-100 rounded-full overflow-hidden">
                        <div 
                            className="absolute inset-y-0 left-0 bg-gradient-to-r from-orange-400 to-orange-600 transition-all duration-300 ease-out"
                            style={{ width: `${progress}%` }}
                        >
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-orange-500 rounded-full blur-md opacity-30"></div>
                        </div>
                    </div>

                    {/* Loading Text */}
                    <div className="flex flex-col items-center gap-2">
                        <h2 className="text-lg font-medium tracking-wide text-gray-800 animate-pulse">
                            Menyiapkan Portal Layanan...
                        </h2>
                        <p className="text-[10px] tracking-[0.4em] text-gray-400 uppercase font-light">
                            SISTEM INFORMASI TERPADU SAMARINDA
                        </p>
                    </div>
                </div>
            </div>

            {/* Bottom Dots */}
            <div className="absolute bottom-12 flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-orange-500/60 animate-loading-dot" style={{ animationDelay: '0s' }}></div>
                <div className="w-1.5 h-1.5 rounded-full bg-orange-500/60 animate-loading-dot" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-1.5 h-1.5 rounded-full bg-orange-500/60 animate-loading-dot" style={{ animationDelay: '0.4s' }}></div>
            </div>
        </div>
    );
};

export default LoadingScreen;
