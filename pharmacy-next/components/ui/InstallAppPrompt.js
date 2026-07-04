"use client";

import { useState, useEffect } from "react";
import { Download, X } from "lucide-react";
import Image from "next/image";
import { toast } from "react-hot-toast";

export default function InstallAppPrompt({ type = "banner", className }) {
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showBanner, setShowBanner] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);

  useEffect(() => {
    // Check if device is iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIOSDevice);

    // Check if app is already installed/standalone
    const isAppInstalled = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone;
    setIsStandalone(isAppInstalled);

    if (!isAppInstalled) {
      // Delay banner slightly for better UX
      setTimeout(() => setShowBanner(true), 2000);
    }

    // Listen for Android beforeinstallprompt
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSModal(true);
      return;
    }

    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setDeferredPrompt(null);
        setShowBanner(false);
      }
    } else {
      // Fallback for Android/Desktop if prompt is not available
      toast("App is already installed! Check your home screen or apps menu.", {
        icon: '✅',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });
    }
  };

  if (isStandalone) return null;

  if (type === "button") {
    return (
      <>
        <button
          onClick={handleInstallClick}
          className={className || "flex items-center gap-2 bg-primary/10 text-primary hover:bg-primary hover:text-white px-3 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer"}
        >
          <Download size={16} />
          <span>Install App</span>
        </button>
        {isIOS && showIOSModal && <IOSModal onClose={() => setShowIOSModal(false)} />}
      </>
    );
  }

  if (type === "floating") {
    // Determine bottom position based on current path to match other floating buttons
    const isActionBarPage = typeof window !== 'undefined' && (window.location.pathname === '/cart' || window.location.pathname === '/checkout');
    
    return (
      <>
        <button
          onClick={handleInstallClick}
          className={`md:hidden fixed ${isActionBarPage ? 'bottom-[210px]' : 'bottom-[215px]'} right-6 z-[99] flex items-center bg-transparent rounded-full hover:translate-y-[-4px] transition-all group active:scale-95 animate-fade-in`}
        >
          <div className="w-14 h-14 bg-accent rounded-full flex items-center justify-center text-white shadow-xl group-hover:rotate-12 transition-transform border-[3px] border-white">
            <Download className="w-6 h-6" />
          </div>
        </button>
        {isIOS && showIOSModal && <IOSModal onClose={() => setShowIOSModal(false)} />}
      </>
    );
  }

  if (type === "banner" && showBanner) {
    return (
      <>
        {/* Adjusted bottom position to bottom-20 for mobile to prevent overlapping with bottom navigation */}
        <div className="fixed bottom-20 left-4 right-4 md:bottom-6 md:left-1/2 md:-translate-x-1/2 md:w-[400px] bg-white border border-border shadow-hover rounded-xl p-4 z-50 animate-fade-up flex items-center gap-4">
          <div className="w-12 h-12 relative flex-shrink-0 bg-primary/5 rounded-lg p-1">
            <Image src="/icons/icon-192x192.png" alt="Hope Pharmacy" fill className="object-contain" />
          </div>
          <div className="flex-grow">
            <h4 className="text-sm font-bold text-secondary m-0">Hope Pharmacy App</h4>
            <p className="text-xs text-text-secondary m-0">Fast, reliable, and always with you.</p>
          </div>
          <button
            onClick={handleInstallClick}
            className="bg-primary text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors whitespace-nowrap"
          >
            GET
          </button>
          <button onClick={() => setShowBanner(false)} className="text-gray-400 hover:text-gray-600 p-1">
            <X size={20} />
          </button>
        </div>
        {isIOS && showIOSModal && <IOSModal onClose={() => setShowIOSModal(false)} />}
      </>
    );
  }

  return null;
}

function IOSModal({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black/60 z-[99999] flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full relative text-center animate-scale-in" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X size={24} />
        </button>
        
        <div className="w-20 h-20 bg-primary/10 rounded-full mx-auto flex items-center justify-center mb-4">
          <div className="w-12 h-12 relative">
            <Image src="/icons/icon-192x192.png" alt="Hope Pharmacy" fill className="object-contain" />
          </div>
        </div>
        
        <h3 className="text-xl font-bold text-secondary mb-2">iOS App Coming Soon!</h3>
        <p className="text-text-secondary text-sm mb-6">
          We are working hard to bring the native Hope Pharmacy experience to your iPhone and iPad. Stay tuned for updates!
        </p>
        
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 text-left">
          <p className="text-xs text-secondary font-medium mb-1 flex items-center gap-2">
            💡 <strong>Pro Tip for iOS:</strong>
          </p>
          <p className="text-xs text-text-secondary m-0 leading-relaxed">
            You can tap the <strong>Share</strong> icon at the bottom of Safari and select <strong>Add to Home Screen</strong> for a quick app-like experience now.
          </p>
        </div>

        <button 
          onClick={onClose}
          className="w-full mt-6 bg-primary text-white font-bold py-3 rounded-xl hover:bg-primary-dark transition-colors"
        >
          Got It
        </button>
      </div>
    </div>
  );
}
