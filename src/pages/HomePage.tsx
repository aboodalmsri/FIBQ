import { motion } from "framer-motion";
import { Award, CheckCircle, QrCode, Search, Shield, Zap } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import logo from "@/assets/fibq-logo.png";

export default function HomePage() {
  const { t } = useTranslation();
  const [certificateNumber, setCertificateNumber] = useState("");
  const navigate = useNavigate();

  const features = [
    {
      icon: Shield,
      titleKey: "home.features.secure.title",
      descriptionKey: "home.features.secure.description",
    },
    {
      icon: Zap,
      titleKey: "home.features.instant.title",
      descriptionKey: "home.features.instant.description",
    },
    {
      icon: QrCode,
      titleKey: "home.features.qrCode.title",
      descriptionKey: "home.features.qrCode.description",
    },
    {
      icon: CheckCircle,
      titleKey: "home.features.official.title",
      descriptionKey: "home.features.official.description",
    },
  ];

  const stats = [
    { value: "50K+", labelKey: "home.stats.certificatesIssued" },
    { value: "99.9%", labelKey: "home.stats.verificationAccuracy" },
    { value: "24/7", labelKey: "home.stats.availableAnytime" },
    { value: "100+", labelKey: "home.stats.partnerInstitutions" },
  ];

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (certificateNumber.trim()) {
      navigate(`/verify?number=${encodeURIComponent(certificateNumber.trim())}`);
    }
  };

  return (
    <>
    {/* Organization Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50 py-20 md:py-28">
        {/* Decorative Elements */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute left-10 top-20 h-72 w-72 rounded-full bg-secondary/20 blur-3xl" />
          <div className="absolute bottom-20 right-10 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        </div>

        <div className="container-page relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-4xl text-center"
          >
            {/* Logo */}
            <div className="mb-8 flex justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="relative"
              >
                <div className="absolute inset-0 rounded-3xl bg-secondary/10 blur-xl" />
                <div className="relative overflow-hidden rounded-3xl bg-white p-6 shadow-2xl ring-1 ring-black/5">
                <img
                  src={logo}
                  alt="FIBQ Logo"
                  className="h-28 w-28 object-contain md:h-32 md:w-32"
                />
                </div>
              </motion.div>
            </div>

            {/* Organization Name */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-6"
            >
              <h2 className="font-heading text-3xl font-bold text-slate-900 md:text-4xl">
                {t("home.organization.name")}
              </h2>
              <p className="mt-3 text-xl font-semibold text-secondary md:text-2xl">
                {t("home.organization.subtitle")}
              </p>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mx-auto max-w-3xl text-lg leading-relaxed text-slate-600 md:text-xl"
            >
              {t("home.organization.description")}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-primary py-20 md:py-32">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute left-1/4 top-1/4 h-64 w-64 rounded-full bg-secondary blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-secondary/50 blur-3xl" />
        </div>

        <div className="container-page relative">
          <div className="mx-auto max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-6"
            >
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-secondary shadow-gold">
                <Award className="h-10 w-10 text-secondary-foreground" />
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-6 font-heading text-4xl font-bold tracking-tight text-primary-foreground md:text-5xl lg:text-6xl"
            >
              {t("home.hero.title")}
              <span className="block text-secondary">{t("home.hero.subtitle")}</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mx-auto mb-10 max-w-2xl text-lg text-primary-foreground/80 md:text-xl"
            >
              {t("home.hero.description")}
            </motion.p>

            {/* Search Form */}
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              onSubmit={handleVerify}
              className="mx-auto max-w-xl"
            >
              <Card variant="hero" className="p-2">
                <div className="flex flex-col gap-3 sm:flex-row">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-primary-foreground/50" />
                    <Input
                      variant="hero"
                      inputSize="lg"
                      placeholder={t("home.hero.placeholder")}
                      value={certificateNumber}
                      onChange={(e) => setCertificateNumber(e.target.value)}
                      className="pl-12"
                    />
                  </div>
                  <Button type="submit" variant="hero" size="lg" className="shrink-0">
                    {t("home.hero.verifyNow")}
                  </Button>
                </div>
              </Card>
            </motion.form>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-6 text-sm text-primary-foreground/60"
            >
              <QrCode className="mr-2 inline-block h-4 w-4" />
              {t("home.hero.qrHint")}
            </motion.p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-b border-border bg-card py-12">
        <div className="container-page">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.labelKey}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <p className="font-heading text-3xl font-bold text-secondary md:text-4xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{t(stat.labelKey)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-background">
        <div className="container-page">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto mb-12 max-w-2xl text-center"
          >
            <h2 className="mb-4 font-heading text-3xl font-bold text-foreground md:text-4xl">
              {t("home.features.title")}
            </h2>
            <p className="text-lg text-muted-foreground">
              {t("home.features.description")}
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <motion.div
                key={feature.titleKey}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card variant="feature" className="h-full p-6">
                  <CardContent className="p-0">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-accent">
                      <feature.icon className="h-7 w-7 text-secondary" />
                    </div>
                    <h3 className="mb-2 font-heading text-xl font-semibold text-foreground">
                      {t(feature.titleKey)}
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {t(feature.descriptionKey)}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-muted">
        <div className="container-page">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="mx-auto max-w-3xl"
          >
            <Card variant="gold" className="overflow-hidden">
              <div className="relative p-8 md:p-12">
                <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-secondary/10 blur-2xl" />
                <div className="relative text-center">
                  <h2 className="mb-4 font-heading text-2xl font-bold text-foreground md:text-3xl">
                    {t("home.cta.title")}
                  </h2>
                  <p className="mb-8 text-muted-foreground">
                    {t("home.cta.description")}
                  </p>
                  <div className="flex flex-col justify-center gap-4 sm:flex-row">
                    <Button asChild variant="gold" size="lg">
                      <a href="/verify">{t("home.cta.verifyButton")}</a>
                    </Button>
                    <Button asChild variant="outline" size="lg">
                      <a href="/about">{t("home.cta.learnMore")}</a>
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>
    </>
  );
}
