import { Link } from "react-router-dom";
import { Award, Mail, MapPin, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-primary text-primary-foreground">
      <div className="container-page py-12 md:py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary shadow-gold">
                <Award className="h-5 w-5 text-secondary-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="font-heading text-xl font-bold">CertifyPro</span>
                <span className="text-xs text-primary-foreground/70">Digital Verification</span>
              </div>
            </Link>
            <p className="text-sm text-primary-foreground/70 leading-relaxed">
              Secure, reliable, and instant certificate verification for institutions and individuals worldwide.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-heading text-lg font-semibold">Quick Links</h4>
            <nav className="flex flex-col gap-2">
              {[
                { href: "/", label: "Home" },
                { href: "/about", label: "About Us" },
                { href: "/verify", label: "Verify Certificate" },
                { href: "/contact", label: "Contact" },
              ].map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="text-sm text-primary-foreground/70 transition-colors hover:text-secondary"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="font-heading text-lg font-semibold">Contact Us</h4>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 text-sm text-primary-foreground/70">
                <Mail className="h-4 w-4 text-secondary" />
                <span>support@certifypro.com</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-primary-foreground/70">
                <Phone className="h-4 w-4 text-secondary" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-start gap-3 text-sm text-primary-foreground/70">
                <MapPin className="h-4 w-4 text-secondary mt-0.5" />
                <span>123 Certification Ave<br />New York, NY 10001</span>
              </div>
            </div>
          </div>

          {/* Trust Badge */}
          <div className="space-y-4">
            <h4 className="font-heading text-lg font-semibold">Trusted Platform</h4>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3 rounded-lg border border-primary-foreground/20 bg-primary-foreground/5 p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary/20">
                  <Award className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <p className="text-sm font-medium">100% Secure</p>
                  <p className="text-xs text-primary-foreground/60">Verified & Protected</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-primary-foreground/10 pt-8 md:flex-row">
          <p className="text-sm text-primary-foreground/60">
            © {new Date().getFullYear()} CertifyPro. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link to="#" className="text-sm text-primary-foreground/60 transition-colors hover:text-secondary">
              Privacy Policy
            </Link>
            <Link to="#" className="text-sm text-primary-foreground/60 transition-colors hover:text-secondary">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
