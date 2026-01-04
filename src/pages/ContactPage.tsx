import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function ContactPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const contactInfo = [
    {
      icon: Mail,
      titleKey: "contact.info.email.title",
      value: "support@fibq.org",
      descriptionKey: "contact.info.email.description",
    },
    {
      icon: Phone,
      titleKey: "contact.info.phone.title",
      value: "+1 (555) 123-4567",
      descriptionKey: "contact.info.phone.description",
    },
    {
      icon: MapPin,
      titleKey: "contact.info.address.title",
      value: "123 Certification Ave",
      descriptionKey: "contact.info.address.description",
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast({
      title: t("contact.form.successTitle"),
      description: t("contact.form.successMessage"),
    });

    setFormData({ name: "", email: "", subject: "", message: "" });
    setIsSubmitting(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-primary py-16 md:py-24">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute left-1/3 top-1/4 h-64 w-64 rounded-full bg-secondary blur-3xl" />
        </div>
        <div className="container-page relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-3xl text-center"
          >
            <h1 className="mb-6 font-heading text-4xl font-bold text-primary-foreground md:text-5xl">
              {t("contact.hero.title")} <span className="text-secondary">{t("contact.hero.highlight")}</span>
            </h1>
            <p className="text-lg text-primary-foreground/80 md:text-xl">
              {t("contact.hero.subtitle")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="section-padding bg-background">
        <div className="container-page">
          <div className="grid gap-12 lg:grid-cols-3">
            {/* Contact Info Cards */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="font-heading text-2xl font-bold text-foreground">
                {t("contact.info.title")}
              </h2>
              <p className="text-muted-foreground">
                {t("contact.info.subtitle")}
              </p>

              <div className="space-y-4">
                {contactInfo.map((item, index) => (
                  <motion.div
                    key={item.titleKey}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card variant="feature" className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-accent">
                          <item.icon className="h-6 w-6 text-secondary" />
                        </div>
                        <div>
                          <h3 className="font-heading font-semibold text-foreground">
                            {t(item.titleKey)}
                          </h3>
                          <p className="text-foreground">{item.value}</p>
                          <p className="text-sm text-muted-foreground">{t(item.descriptionKey)}</p>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-2"
            >
              <Card variant="elevated" className="p-6 md:p-8">
                <CardHeader className="p-0 pb-6">
                  <CardTitle className="text-2xl">{t("contact.form.title")}</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <label
                          htmlFor="name"
                          className="text-sm font-medium text-foreground"
                        >
                          {t("contact.form.name")}
                        </label>
                        <Input
                          id="name"
                          name="name"
                          placeholder={t("contact.form.namePlaceholder")}
                          value={formData.name}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="email"
                          className="text-sm font-medium text-foreground"
                        >
                          {t("contact.form.email")}
                        </label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder={t("contact.form.emailPlaceholder")}
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="subject"
                        className="text-sm font-medium text-foreground"
                      >
                        {t("contact.form.subject")}
                      </label>
                      <Input
                        id="subject"
                        name="subject"
                        placeholder={t("contact.form.subjectPlaceholder")}
                        value={formData.subject}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="message"
                        className="text-sm font-medium text-foreground"
                      >
                        {t("contact.form.message")}
                      </label>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder={t("contact.form.messagePlaceholder")}
                        rows={5}
                        value={formData.message}
                        onChange={handleChange}
                        required
                        className="resize-none"
                      />
                    </div>

                    <Button
                      type="submit"
                      variant="gold"
                      size="lg"
                      disabled={isSubmitting}
                      className="w-full md:w-auto"
                    >
                      {isSubmitting ? (
                        t("contact.form.sending")
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          {t("contact.form.send")}
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
