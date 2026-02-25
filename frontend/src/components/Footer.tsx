import React from 'react';
import { Phone, Mail, MapPin, Clock, Heart } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';

export default function Footer() {
  const navigate = useNavigate();
  const year = new Date().getFullYear();
  const appId = encodeURIComponent(window.location.hostname || 'gs-medical');

  return (
    <footer className="relative mt-auto overflow-hidden">
      {/* Wave top edge */}
      <div className="relative h-16 overflow-hidden">
        <svg
          viewBox="0 0 1440 64"
          preserveAspectRatio="none"
          className="absolute bottom-0 w-full h-full"
          style={{ fill: 'oklch(0.18 0.06 145)' }}
        >
          <path d="M0,32 C240,64 480,0 720,32 C960,64 1200,0 1440,32 L1440,64 L0,64 Z" />
        </svg>
      </div>

      <div
        style={{
          background: 'linear-gradient(180deg, oklch(0.18 0.06 145) 0%, oklch(0.13 0.04 145) 100%)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <img
                  src="/assets/generated/gs-medical-logo.dim_400x400.png"
                  alt="G&S Medical"
                  className="w-10 h-10 rounded-xl object-cover"
                />
                <span className="font-display font-bold text-xl text-white">G&S Medical</span>
              </div>
              <p className="text-white/60 text-sm leading-relaxed mb-4">
                Your trusted partner for genuine medicines and healthcare products. Licensed and verified.
              </p>
              <div className="flex items-center gap-2 bg-white/10 rounded-xl p-3 border border-white/15">
                <Phone className="w-4 h-4 text-green-400 flex-shrink-0" />
                <div className="text-xs text-white/80">
                  <a href="tel:+919270556455" className="block hover:text-white transition-colors">+91 9270556455</a>
                  <a href="tel:+919766343454" className="block hover:text-white transition-colors">+91 9766343454</a>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-display font-semibold text-white mb-4">Quick Links</h3>
              <ul className="space-y-2">
                {[
                  { label: 'Home', path: '/' },
                  { label: 'Products', path: '/products' },
                  { label: 'About Us', path: '/about' },
                  { label: 'Contact', path: '/contact' },
                  { label: 'Seller Portal', path: '/seller/login' },
                ].map((link) => (
                  <li key={link.path}>
                    <button
                      onClick={() => navigate({ to: link.path })}
                      className="text-white/60 hover:text-white text-sm transition-colors duration-200 hover:translate-x-1 inline-block"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-display font-semibold text-white mb-4">Contact Us</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2 text-white/60 text-sm">
                  <MapPin className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>G&S Medical Store, Maharashtra, India</span>
                </li>
                <li className="flex items-center gap-2 text-white/60 text-sm">
                  <Mail className="w-4 h-4 text-green-400 flex-shrink-0" />
                  <a href="mailto:gauravsaswade2009@gmail.com" className="hover:text-white transition-colors">
                    gauravsaswade2009@gmail.com
                  </a>
                </li>
                <li className="flex items-center gap-2 text-white/60 text-sm">
                  <Clock className="w-4 h-4 text-green-400 flex-shrink-0" />
                  <span>Mon–Sat: 8AM – 9PM</span>
                </li>
              </ul>
            </div>

            {/* Customer Care */}
            <div>
              <h3 className="font-display font-semibold text-white mb-4">Customer Care</h3>
              <div className="bg-white/10 rounded-xl p-4 border border-white/15">
                <p className="text-white/70 text-sm mb-3">Need help? Call us anytime:</p>
                <a
                  href="tel:+919270556455"
                  className="flex items-center gap-2 text-green-400 font-semibold hover:text-green-300 transition-colors mb-2"
                >
                  <Phone className="w-4 h-4" />
                  +91 9270556455
                </a>
                <a
                  href="tel:+919766343454"
                  className="flex items-center gap-2 text-green-400 font-semibold hover:text-green-300 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  +91 9766343454
                </a>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-white/40 text-sm">
              © {year} G&S Medical. All rights reserved.
            </p>
            <p className="text-white/40 text-sm flex items-center gap-1">
              Built with <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400" /> using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-400 hover:text-green-300 transition-colors"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
