import { useNavigate } from '@tanstack/react-router';
import { Phone, Mail, MapPin, Clock, Heart } from 'lucide-react';

export default function Footer() {
  const navigate = useNavigate();
  const year = new Date().getFullYear();
  const appId = encodeURIComponent(window.location.hostname || 'gs-medical');

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img
                src="/assets/generated/gs-medical-logo.dim_400x400.png"
                alt="G&S Medical"
                className="h-10 w-10 rounded-full object-cover"
              />
              <div>
                <div className="font-bold text-white text-lg">G&S Medical</div>
                <div className="text-xs text-gray-400">Your Health Partner</div>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Providing quality medicines and healthcare products to our community since years.
              Your health is our priority.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { label: 'Home', path: '/' },
                { label: 'Products', path: '/products' },
                { label: 'About Us', path: '/about' },
                { label: 'Contact', path: '/contact' },
              ].map(link => (
                <li key={link.path}>
                  <button
                    onClick={() => navigate({ to: link.path })}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-white mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                <span className="text-sm text-gray-400">
                  G&S Medical Store, Pune, Maharashtra, India
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                <a
                  href="mailto:gsmedical@gmail.com"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  gsmedical@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="text-sm text-gray-400">Mon–Sat: 8AM – 9PM</span>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h3 className="font-semibold text-white mb-4">Customer Care</h3>
            <div className="bg-gray-800 rounded-lg p-4 space-y-2">
              <p className="text-xs text-gray-400 mb-3">Call us for assistance:</p>
              <a
                href="tel:+919270556455"
                className="flex items-center gap-2 text-sm text-green-400 hover:text-green-300 transition-colors"
              >
                <Phone className="h-4 w-4" />
                +91 92705 56455
              </a>
              <a
                href="tel:+919766343454"
                className="flex items-center gap-2 text-sm text-green-400 hover:text-green-300 transition-colors"
              >
                <Phone className="h-4 w-4" />
                +91 97663 43454
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            © {year} G&S Medical. All rights reserved.
          </p>
          <p className="text-sm text-gray-500 flex items-center gap-1">
            Built with <Heart className="h-3 w-3 text-red-400 fill-red-400" /> using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
