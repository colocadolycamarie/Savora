import { useEffect, useState } from 'react';

const STORAGE_KEY = 'savora:cookie-consent';

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (!stored) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  const respond = (choice: 'accepted' | 'declined') => {
    try {
      window.localStorage.setItem(STORAGE_KEY, choice);
    } catch {
      // If storage isn't available, just hide the banner for this session.
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="region"
      aria-label="Cookie consent"
      className="fixed bottom-0 inset-x-0 z-40 border-t border-white/10 bg-background/95 backdrop-blur-sm"
    >
      <div className="container mx-auto px-6 md:px-12 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-foreground/70 font-light text-center sm:text-left">
          We use cookies to remember your preferences and understand how guests use our
          site. See our{' '}
          <a href="/privacy" className="underline underline-offset-2 hover:text-foreground">
            Privacy Policy
          </a>
          .
        </p>
        <div className="flex gap-3 shrink-0">
          <button
            type="button"
            onClick={() => respond('declined')}
            className="text-xs uppercase tracking-widest border border-white/20 px-4 py-2.5 hover:bg-white/5 transition-colors"
          >
            Decline
          </button>
          <button
            type="button"
            onClick={() => respond('accepted')}
            className="text-xs uppercase tracking-widest bg-primary text-primary-foreground px-4 py-2.5 hover:bg-primary/90 transition-colors"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
