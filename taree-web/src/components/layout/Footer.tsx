import { Link } from "react-router-dom";
import { Globe, Mail } from "lucide-react";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="bg-surface-container-lowest border-t border-outline-variant/30 py-section">
      <div className="max-w-container mx-auto px-margin">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter">
          {/* Brand Column */}
          <div className="space-y-8">
            <Link to="/">
              <img
                src="/images/logo.png"
                alt="TAREÉ"
                className="h-20 w-auto object-contain"
              />
            </Link>
            <p className="text-on-surface-variant font-body-md opacity-80 leading-relaxed">
              Defining African luxury through handcrafted elegance and timeless storytelling.
            </p>
            <div className="flex gap-4">
              <a
                href="https://www.facebook.com/107164898967936/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center hover:bg-primary hover:text-white transition-all"
                aria-label="Facebook"
              >
                <Globe className="w-4 h-4" />
              </a>
              <a
                href="https://www.instagram.com/tareejewelryofficial?igsh=MTZqdmFhN3A5emEzdQ=="
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center hover:bg-primary hover:text-white transition-all"
                aria-label="Instagram"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href="mailto:terryj861@gmail.com"
                className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center hover:bg-primary hover:text-white transition-all"
                aria-label="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Shop Column */}
          <div>
            <h4 className="text-label-caps text-primary mb-8 tracking-widest">Shop</h4>
            <ul className="space-y-4 font-body-md text-on-surface-variant">
              <li>
                <Link to="/products?new=true" className="hover:text-secondary transition-colors">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-secondary transition-colors">
                  Fine Jewelry
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-secondary transition-colors">
                  Bridal Collection
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-secondary transition-colors">
                  Gifts
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care Column */}
          <div>
            <h4 className="text-label-caps text-primary mb-8 tracking-widest">Customer Care</h4>
            <ul className="space-y-4 font-body-md text-on-surface-variant">
              <li>
                <Link to="#" className="hover:text-secondary transition-colors">
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-secondary transition-colors">
                  Size Guide
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-secondary transition-colors">
                  Jewelry Care
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-secondary transition-colors">
                  FAQs
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect Column */}
          <div>
            <h4 className="text-label-caps text-primary mb-8 tracking-widest">Connect</h4>
            <ul className="space-y-4 font-body-md text-on-surface-variant">
              <li>
                <Link to="/our-story" className="hover:text-secondary transition-colors">
                  Our Story
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-secondary transition-colors">
                  Stockists
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-secondary transition-colors">
                  Journal
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-secondary transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <a href="tel:+2347064937315" className="hover:text-secondary transition-colors">
                  +234 706 493 7315
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-20 pt-8 border-t border-outline-variant/10 text-center">
          <p className="text-[10px] tracking-widest text-on-surface-variant opacity-60 uppercase font-body">
            © 2024 TAREÉ JEWELRY. Made with love in Nigeria.
          </p>
        </div>
      </div>
    </footer>
  );
}
