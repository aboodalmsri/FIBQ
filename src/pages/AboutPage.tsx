import { motion } from "framer-motion";
import { Award, CheckCircle, Eye, Shield, Target, Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
export default function AboutPage() {
<<<<<<< HEAD
  const { t } = useTranslation();

  const values = [
    {
      icon: Shield,
      titleKey: "about.values.integrity.title",
      descriptionKey: "about.values.integrity.description",
    },
    {
      icon: Eye,
      titleKey: "about.values.transparency.title",
      descriptionKey: "about.values.transparency.description",
    },
    {
      icon: Users,
      titleKey: "about.values.accessibility.title",
      descriptionKey: "about.values.accessibility.description",
    },
    {
      icon: Target,
      titleKey: "about.values.accuracy.title",
      descriptionKey: "about.values.accuracy.description",
    },
  ];

  const timeline = [
    {
      year: "1",
      titleKey: "about.timeline.2018.title",
      descriptionKey: "about.timeline.2018.description",
    },
    {
      year: "2",
      titleKey: "about.timeline.2020.title",
      descriptionKey: "about.timeline.2020.description",
    },
    {
      year: "3",
      titleKey: "about.timeline.2022.title",
      descriptionKey: "about.timeline.2022.description",
    },
    {
      year: "4",
      titleKey: "about.timeline.2024.title",
      descriptionKey: "about.timeline.2024.description",
    },
  ];

  return (
    <>
=======
  const {
    t
  } = useTranslation();
  const values = [{
    icon: Shield,
    titleKey: "about.values.integrity.title",
    descriptionKey: "about.values.integrity.description"
  }, {
    icon: Eye,
    titleKey: "about.values.transparency.title",
    descriptionKey: "about.values.transparency.description"
  }, {
    icon: Users,
    titleKey: "about.values.accessibility.title",
    descriptionKey: "about.values.accessibility.description"
  }, {
    icon: Target,
    titleKey: "about.values.accuracy.title",
    descriptionKey: "about.values.accuracy.description"
  }];
  const timeline = [{
    year: "2018",
    titleKey: "about.timeline.2018.title",
    descriptionKey: "about.timeline.2018.description"
  }, {
    year: "2020",
    titleKey: "about.timeline.2020.title",
    descriptionKey: "about.timeline.2020.description"
  }, {
    year: "2022",
    titleKey: "about.timeline.2022.title",
    descriptionKey: "about.timeline.2022.description"
  }, {
    year: "2024",
    titleKey: "about.timeline.2024.title",
    descriptionKey: "about.timeline.2024.description"
  }];
  return <>
>>>>>>> a5f22002503fa3052b37322ea540112dc7ebca6b
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-primary py-16 md:py-24">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute right-1/4 top-1/3 h-64 w-64 rounded-full bg-secondary blur-3xl" />
        </div>
        <div className="container-page relative">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6
        }} className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 font-heading text-4xl font-bold text-primary-foreground md:text-5xl">
              {t("about.hero.title")} <span className="text-secondary">French International Board for Quality</span>
            </h1>
            <p className="text-lg text-primary-foreground/80 md:text-xl">
              {t("about.hero.subtitle")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="section-padding bg-background">
        <div className="container-page">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <motion.div initial={{
            opacity: 0,
            x: -20
          }} whileInView={{
            opacity: 1,
            x: 0
          }} viewport={{
            once: true
          }} className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-foreground">
                <Award className="h-4 w-4" />
                {t("about.mission.label")}
              </div>
              <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
                {t("about.mission.title")}
              </h2>
              <p className="text-lg leading-relaxed text-muted-foreground">
                {t("about.mission.description")}
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-secondary" />
                  <span className="text-foreground">{t("about.mission.point1")}</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-secondary" />
                  <span className="text-foreground">{t("about.mission.point2")}</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-secondary" />
                  <span className="text-foreground">{t("about.mission.point3")}</span>
                </div>
              </div>
            </motion.div>

            <motion.div initial={{
            opacity: 0,
            x: 20
          }} whileInView={{
            opacity: 1,
            x: 0
          }} viewport={{
            once: true
          }} className="relative">
              <Card variant="gold" className="overflow-hidden p-8">
                <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-secondary/10 blur-2xl" />
                <CardContent className="relative p-0 text-center">
                  <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-2xl bg-accent">
                    <Shield className="h-12 w-12 text-secondary" />
                  </div>
                  <h3 className="mb-2 font-heading text-2xl font-bold text-foreground">
                    {t("about.vision.title")}
                  </h3>
                  <p className="text-muted-foreground">
                    {t("about.vision.description")}
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
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="mb-4 font-heading text-3xl font-bold text-foreground md:text-4xl">
              {t("about.values.title")}
            </h2>
            <p className="text-lg text-muted-foreground">
              {t("about.values.subtitle")}
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {values.map((value, index) => <motion.div key={value.titleKey} initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.5,
            delay: index * 0.1
          }}>
                <Card variant="feature" className="h-full p-6 text-center">
                  <CardContent className="p-0">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary">
                      <value.icon className="h-7 w-7 text-primary-foreground" />
                    </div>
                    <h3 className="mb-2 font-heading text-xl font-semibold text-foreground">
                      {t(value.titleKey)}
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {t(value.descriptionKey)}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>)}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="section-padding bg-background">
        <div className="container-page">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="mb-4 font-heading text-3xl font-bold text-foreground md:text-4xl">
              {t("about.journey.title")}
            </h2>
            <p className="text-lg text-muted-foreground">
              {t("about.journey.subtitle")}
            </p>
          </motion.div>

          <div className="mx-auto max-w-3xl">
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-4 top-0 h-full w-0.5 bg-border md:left-1/2 md:-translate-x-1/2" />

              {timeline.map((item, index) => <motion.div key={item.year} initial={{
              opacity: 0,
              y: 20
            }} whileInView={{
              opacity: 1,
              y: 0
            }} viewport={{
              once: true
            }} transition={{
              duration: 0.5,
              delay: index * 0.1
            }} className={`relative mb-8 flex items-center gap-6 ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
                  <div className="hidden md:block md:w-1/2" />
                  <div className="absolute left-4 z-10 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full bg-secondary text-xs font-bold text-secondary-foreground shadow-gold md:left-1/2">
                    {item.year.slice(2)}
                  </div>
                  <Card variant="default" className="ml-12 flex-1 p-6 md:ml-0">
                    <p className="text-sm font-medium text-secondary">{item.year}</p>
                    <h3 className="mb-1 font-heading text-lg font-semibold text-foreground">
                      {t(item.titleKey)}
                    </h3>
                    <p className="text-sm text-muted-foreground">{t(item.descriptionKey)}</p>
                  </Card>
                </motion.div>)}
            </div>
          </div>
        </div>
      </section>
    </>;
}