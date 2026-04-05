
'use client';
import Image from 'next/image';

const LoadingScreen = () => {
  return (
    <div id="loading-screen" className="fixed inset-0 z-[100] flex items-center justify-center bg-background transition-opacity duration-500">
      <div className="relative w-24 h-24">
        <Image src="/logo.png" alt="ESystemLk Logo" width={64} height={64} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute inset-0 animate-spin-slow">
          <div className="w-full h-full border-2 border-primary/50 rounded-full"></div>
        </div>
        <div className="absolute inset-0 animate-spin-slow" style={{ animationDelay: '0.2s', animationDirection: 'reverse' }}>
          <div className="w-full h-full border-2 border-dashed border-primary/50 rounded-full opacity-50"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
