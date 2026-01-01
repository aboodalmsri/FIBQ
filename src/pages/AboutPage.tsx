import { motion } from "framer-motion";
import { Award, CheckCircle, Eye, Shield, Target, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const values = [
  {
    icon: Shield,
    title: "Integrity",
    description: "We maintain the highest standards of data security and certificate authenticity.",
  },
  {
    icon: Eye,
    title: "Transparency",
    description: "Every verification is traceable and our processes are fully transparent.",
  },
  {
    icon: Users,
    title: "Accessibility",
    description: "Free public access to certificate verification for everyone, anywhere.",
  },
  {
    icon: Target,
    title: "Accuracy",
    description: "99.9% verification accuracy backed by advanced validation systems.",
  },
];

const timeline = [
  {
    year: "2018",
    title: "Platform Launch",
    description: "Started as a small project to digitize academic certificates.",
  },
  {
    year: "2020",
    title: "QR Integration",
    description: "Introduced QR code scanning for instant mobile verification.",
  },
  {
    year: "2022",
    title: "100+ Partners",
    description: "Reached milestone of 100 institutional partnerships.",
  },
  {
    year: "2024",
    title: "Global Expansion",
    description: "Now serving institutions and individuals worldwide.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-primary py-16 md:py-24">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute right-1/4 top-1/3 h-64 w-64 rounded-full bg-secondary blur-3xl" />
        </div>
        <div className="container-page relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-3xl text-center"
          >
            <h1 className="mb-6 font-heading text-4xl font-bold text-primary-foreground md:text-5xl">
              About <span className="text-secondary">CertifyPro</span>
            </h1>
            <p className="text-lg text-primary-foreground/80 md:text-xl">
              We are dedicated to building trust through secure, transparent, and 
              accessible digital certificate verification.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="section-padding bg-background">
        <div className="container-page">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-foreground">
                <Award className="h-4 w-4" />
                Our Mission
              </div>
              <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
                Eliminating Certificate Fraud Worldwide
              </h2>
              <p className="text-lg leading-relaxed text-muted-foreground">
                Our mission is to create a world where every certificate can be instantly verified, 
                eliminating fraud and building trust between institutions and individuals. We believe 
                that authentic credentials should be easily verifiable by anyone, anywhere.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-secondary" />
                  <span className="text-foreground">Secure Verification</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-secondary" />
                  <span className="text-foreground">Instant Results</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-secondary" />
                  <span className="text-foreground">Free Access</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <Card variant="gold" className="overflow-hidden p-8">
                <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-secondary/10 blur-2xl" />
                <CardContent className="relative p-0 text-center">
                  <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-2xl bg-accent">
                    <Shield className="h-12 w-12 text-secondary" />
                  </div>
                  <h3 className="mb-2 font-heading text-2xl font-bold text-foreground">
                    Our Vision
                  </h3>
                  <p className="text-muted-foreground">
                    To become the global standard for digital certificate verification, 
                    trusted by institutions, employers, and individuals worldwide.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section-padding bg-muted">
        <div className="container-page">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto mb-12 max-w-2xl text-center"
          >
            <h2 className="mb-4 font-heading text-3xl font-bold text-foreground md:text-4xl">
              Our Core Values
            </h2>
            <p className="text-lg text-muted-foreground">
              These principles guide everything we do at CertifyPro.
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card variant="feature" className="h-full p-6 text-center">
                  <CardContent className="p-0">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary">
                      <value.icon className="h-7 w-7 text-primary-foreground" />
                    </div>
                    <h3 className="mb-2 font-heading text-xl font-semibold text-foreground">
                      {value.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="section-padding bg-background">
        <div className="container-page">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto mb-12 max-w-2xl text-center"
          >
            <h2 className="mb-4 font-heading text-3xl font-bold text-foreground md:text-4xl">
              Our Journey
            </h2>
            <p className="text-lg text-muted-foreground">
              From a small project to a global verification platform.
            </p>
          </motion.div>

          <div className="mx-auto max-w-3xl">
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-4 top-0 h-full w-0.5 bg-border md:left-1/2 md:-translate-x-1/2" />

              {timeline.map((item, index) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`relative mb-8 flex items-center gap-6 ${
                    index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  <div className="hidden md:block md:w-1/2" />
                  <div className="absolute left-4 z-10 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full bg-secondary text-xs font-bold text-secondary-foreground shadow-gold md:left-1/2">
                    {item.year.slice(2)}
                  </div>
                  <Card variant="default" className="ml-12 flex-1 p-6 md:ml-0">
                    <p className="text-sm font-medium text-secondary">{item.year}</p>
                    <h3 className="mb-1 font-heading text-lg font-semibold text-foreground">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
