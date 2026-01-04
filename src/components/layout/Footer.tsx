import { Link } from "react-router-dom";
import { Award, Mail, MapPin, Phone } from "lucide-react";
import { useTranslation } from "react-i18next";
import fibqLogo from "@/assets/fibq-logo.png";

export function Footer() {
  const { t } = useTranslation();

  const quickLinks = [
    { href: "/", labelKey: "nav.home" },
    { href: "/about", labelKey: "nav.about" },
    { href: "/verify", labelKey: "nav.verify" },
    { href: "/contact", labelKey: "nav.contact" },
  ];

  return (
    <footer className="border-t border-border bg-primary text-primary-foreground">
      <div className="container-page py-12 md:py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <img src={fibqLogo} alt="FIBQ Logo" className="h-12 w-auto" />
              <div className="flex flex-col">
                <span className="font-heading text-xl font-bold">FIBQ</span>
                <span className="text-xs text-primary-foreground/70">{t("footer.brandSubtitle")}</span>
              </div>
            </Link>
            <p className="text-sm text-primary-foreground/70 leading-relaxed">
              {t("footer.description")}
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-heading text-lg font-semibold">{t("footer.quickLinks")}</h4>
            <nav className="flex flex-col gap-2">
              {quickLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="text-sm text-primary-foreground/70 transition-colors hover:text-secondary"
                >
                  {t(link.labelKey)}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="font-heading text-lg font-semibold">{t("footer.contactUs")}</h4>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 text-sm text-primary-foreground/70">
                <Mail className="h-4 w-4 text-secondary" />
                <span>contact@fibq.org</span>
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
            <h4 className="font-heading text-lg font-semibold">{t("footer.trustedPlatform")}</h4>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3 rounded-lg border border-primary-foreground/20 bg-primary-foreground/5 p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary/20">
                  <Award className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <p className="text-sm font-medium">{t("footer.secure")}</p>
                  <p className="text-xs text-primary-foreground/60">{t("footer.verified")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-primary-foreground/10 pt-8 md:flex-row">
          <p className="text-sm text-primary-foreground/60">
            © {new Date().getFullYear()} FIBQ. {t("footer.rights")}
          </p>
          {/* <div className="flex gap-6">
            <Link to="#" className="text-sm text-primary-foreground/60 transition-colors hover:text-secondary">
              {t("footer.privacy")}
            </Link>
            <Link to="#" className="text-sm text-primary-foreground/60 transition-colors hover:text-secondary">
              {t("footer.terms")}
            </Link>
          </div> */}
        </div>
      </div>
    </footer>
  );
}
