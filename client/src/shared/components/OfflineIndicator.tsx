import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { WifiOff } from 'lucide-react';

export function OfflineIndicator() {
  const { t } = useTranslation();
  const [isOnline, setIsOnline] = useState(true);
  const [showBanner, setShowBanner] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Set initial state
    setIsOnline(navigator.onLine);
    setShowBanner(!navigator.onLine);

    function handleOnline() {
      setIsOnline(true);
      setIsVisible(true);
      // Auto-dismiss after 2 seconds
      setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => setShowBanner(false), 300);
      }, 2000);
    }

    function handleOffline() {
      setIsOnline(false);
      setShowBanner(true);
      // Small delay before showing with animation
      requestAnimationFrame(() => {
        setIsVisible(true);
      });
    }

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!showBanner) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className={`
        fixed bottom-0 left-0 right-0 z-50
        flex items-center justify-center gap-2
        px-4 py-3
        bg-amber-100 border-t border-amber-300
        text-amber-800 text-sm font-medium
        transition-all duration-300 ease-out
        ${isVisible ? 'animate-slide-in-bottom' : 'translate-y-full opacity-0'}
      `}
    >
      <WifiOff className="size-4" />
      <span>{t('common.offline')}</span>
    </div>
  );
}
