import React from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

const ANNOUNCEMENTS = [
  '🚚 Free delivery on orders above ₹500',
  '💊 Genuine medicines guaranteed',
  '📞 24/7 customer support',
  '🏥 Trusted by 10,000+ customers',
  '✅ Licensed pharmacy — all products verified',
  '🔒 Secure & safe online ordering',
  '⚡ Same-day dispatch available',
];

export default function AnnouncementTicker() {
  const prefersReducedMotion = useReducedMotion();
  const items = [...ANNOUNCEMENTS, ...ANNOUNCEMENTS];

  return (
    <div className="bg-primary text-primary-foreground py-2 overflow-hidden">
      <div
        className={`flex whitespace-nowrap ${!prefersReducedMotion ? 'animate-marquee' : ''}`}
        style={prefersReducedMotion ? {} : { width: 'max-content' }}
      >
        {items.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-2 px-8 text-sm font-medium">
            {item}
            <span className="text-primary-foreground/50 mx-2">•</span>
          </span>
        ))}
      </div>
    </div>
  );
}
