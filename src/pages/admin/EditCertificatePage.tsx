import { motion } from "framer-motion";
import { Award, Calendar, Download, FileImage, ImagePlus, Loader2, MapPin, Save, User, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { CertificatePreview } from "@/components/certificate/CertificatePreview";
import { TemplateSelector } from "@/components/certificate/TemplateSelector";
import { useCertificateExport } from "@/hooks/useCertificateExport";
import { useTemplates } from "@/hooks/useTemplates";
import { supabase } from "@/integrations/supabase/client";
import {
  CertificateData, 
  CertificateType,
  certificateTypeLabels,
  defaultCertificateData, 
} from "@/types/certificate";
import { useTranslation } from "react-i18next";

interface CertificateMetadata {
  certificateTitle?: string;
  atcCode?: string;
  chairpersonName?: string;
  chairpersonTitle?: string;
  legalDisclaimer?: string;
  showSeal?: boolean;
  showQRCode?: boolean;
  traineePhoto?: string;
  certificateType?: CertificateType;
}

export default function EditCertificatePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();
  const certificateRef = useRef<HTMLDivElement>(null);
  const { exportToPDF, exportToImage, isExporting } = useCertificateExport();
  const { templates } = useTemplates();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Partial<CertificateData>>({
    ...defaultCertificateData,
  });

  useEffect(() => {
    if (id) {
      fetchCertificate();
    }
  }, [id]);

  const fetchCertificate = async () => {
    setIsLoading(true);
    
    const { data, error } = await supabase
      .from("certificates")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      toast({
        title: "Error",
        description: "Certificate not found.",
        variant: "destructive",
      });
      navigate("/admin/certificates");
      return;
    }

    const metadata = (data.metadata || {}) as CertificateMetadata;

    setFormData({
      certificateNumber: data.certificate_number,
      traineeName: data.trainee_name,
      trainingProgramName: data.training_program,
      placeOfIssue: data.training_center || "",
      templateId: data.template_id || undefined,
      dateOfIssue: data.issue_date,
      certificateTitle: metadata.certificateTitle || defaultCertificateData.certificateTitle,
      atcCode: metadata.atcCode || "",
      chairpersonName: metadata.chairpersonName || defaultCertificateData.chairpersonName,
      chairpersonTitle: metadata.chairpersonTitle || defaultCertificateData.chairpersonTitle,
      legalDisclaimer: metadata.legalDisclaimer || defaultCertificateData.legalDisclaimer,
      showSeal: metadata.showSeal ?? defaultCertificateData.showSeal,
      showQRCode: metadata.showQRCode ?? defaultCertificateData.showQRCode,
      traineePhoto: metadata.traineePhoto,
      certificateType: metadata.certificateType || "trainee",
    });

    setIsLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const selectedTemplate = templates.find(t => t.id === formData.templateId);
      
      const { error } = await supabase
        .from("certificates")
        .update({
          certificate_number: formData.certificateNumber || "",
          trainee_name: formData.traineeName || "",
          training_program: formData.trainingProgramName || "",
          training_center: formData.placeOfIssue || null,
          template_id: selectedTemplate ? selectedTemplate.id : null,
          issue_date: formData.dateOfIssue || new Date().toISOString().split("T")[0],
          metadata: {
            certificateTitle: formData.certificateTitle,
            atcCode: formData.atcCode,
            chairpersonName: formData.chairpersonName,
            chairpersonTitle: formData.chairpersonTitle,
            legalDisclaimer: formData.legalDisclaimer,
            showSeal: formData.showSeal,
            showQRCode: formData.showQRCode,
            traineePhoto: formData.traineePhoto,
            certificateType: formData.certificateType,
          },
        })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: t("admin.createCertificate.updateCertificate"),
        description: `Certificate ${formData.certificateNumber} has been updated.`,
      });

      navigate("/admin/certificates");
    } catch (error) {
      console.error("Error updating certificate:", error);
      toast({
        title: "Error",
        description: "Failed to update certificate. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData((prev) => ({
          ...prev,
          traineePhoto: event.target?.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setFormData((prev) => ({
      ...prev,
      traineePhoto: undefined,
    }));
  };

  const handleExportPDF = () => {
    const element = certificateRef.current?.querySelector(".certificate-preview > div") as HTMLElement;
    exportToPDF(element, `certificate-${formData.certificateNumber || "preview"}`);
  };

  const handleExportImage = () => {
    const element = certificateRef.current?.querySelector(".certificate-preview > div") as HTMLElement;
    exportToImage(element, `certificate-${formData.certificateNumber || "preview"}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-foreground">
          {t("admin.createCertificate.editTitle")}
        </h1>
        <p className="mt-1 text-muted-foreground">
          {t("admin.createCertificate.editSubtitle")}
        </p>
      </div>

      <div className="grid gap-8 xl:grid-cols-2">
        {/* Form Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>{t("admin.certificates.edit")}</CardTitle>
              <CardDescription>
                {t("admin.createCertificate.editSubtitle")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="details" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="details">{t("admin.createCertificate.tabs.details")}</TabsTrigger>
                  <TabsTrigger value="issuer">{t("admin.createCertificate.tabs.issuer")}</TabsTrigger>
                  <TabsTrigger value="template">{t("admin.createCertificate.tabs.template")}</TabsTrigger>
                </TabsList>

                <TabsContent value="details">
                  <form className="space-y-5">
                    {/* Certificate Type */}
                    <div className="space-y-2">
                      <Label>{t("admin.createCertificate.fields.certificateType")}</Label>
                      <Select
                        value={formData.certificateType}
                        onValueChange={(value: CertificateType) =>
                          setFormData((prev) => ({ ...prev, certificateType: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select certificate type" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(certificateTypeLabels).map(([value, label]) => (
                            <SelectItem key={value} value={value}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Certificate Number */}
                    <div className="space-y-2">
                      <Label>{t("admin.createCertificate.fields.certificateNumber")}</Label>
                      <Input
                        name="certificateNumber"
                        placeholder="FIBQ-XXXX-XXXX"
                        value={formData.certificateNumber}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          certificateNumber: e.target.value.toUpperCase() 
                        }))}
                        className="font-mono"
                      />
                    </div>

                    {/* Trainee Name */}
                    <div className="space-y-2">
                      <Label>
                        <User className="mr-2 inline-block h-4 w-4" />
                        {t("admin.createCertificate.fields.traineeName")}
                      </Label>
                      <Input
                        name="traineeName"
                        placeholder="e.g., Greta Mae Evans"
                        value={formData.traineeName}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    {/* Trainee Photo */}
                    <div className="space-y-2">
                      <Label>
                        <ImagePlus className="mr-2 inline-block h-4 w-4" />
                        {t("admin.createCertificate.fields.traineePhoto")}
                      </Label>
                      {formData.traineePhoto ? (
                        <div className="flex items-center gap-4">
                          <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-border">
                            <img
                              src={formData.traineePhoto}
                              alt="Trainee"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={removePhoto}
                          >
                            <X className="mr-2 h-4 w-4" />
                            Remove
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-4">
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoUpload}
                            className="max-w-xs"
                          />
                        </div>
                      )}
                    </div>

                    {/* Training Program */}
                    <div className="space-y-2">
                      <Label>
                        <Award className="mr-2 inline-block h-4 w-4" />
                        {t("admin.createCertificate.fields.trainingProgram")}
                      </Label>
                      <Input
                        name="trainingProgramName"
                        placeholder="e.g., Quality Management Systems (ISO 9001)"
                        value={formData.trainingProgramName}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    {/* Certificate Title/Description */}
                    <div className="space-y-2">
                      <Label>{t("admin.createCertificate.fields.certificateTitle")}</Label>
                      <Textarea
                        name="certificateTitle"
                        placeholder="This certificate is proudly presented to..."
                        value={formData.certificateTitle}
                        onChange={handleChange}
                        rows={3}
                        className="resize-none"
                      />
                    </div>

                    {/* ATC Code */}
                    <div className="space-y-2">
                      <Label>{t("admin.createCertificate.fields.atcCode")}</Label>
                      <Input
                        name="atcCode"
                        placeholder="ATC-XXXX"
                        value={formData.atcCode}
                        onChange={handleChange}
                        className="font-mono"
                      />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      {/* Date of Issue */}
                      <div className="space-y-2">
                        <Label>
                          <Calendar className="mr-2 inline-block h-4 w-4" />
                          {t("admin.createCertificate.fields.dateOfIssue")}
                        </Label>
                        <Input
                          name="dateOfIssue"
                          type="date"
                          value={formData.dateOfIssue}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      {/* Place of Issue */}
                      <div className="space-y-2">
                        <Label>
                          <MapPin className="mr-2 inline-block h-4 w-4" />
                          {t("admin.createCertificate.fields.placeOfIssue")}
                        </Label>
                        <Input
                          name="placeOfIssue"
                          placeholder="e.g., French Republic"
                          value={formData.placeOfIssue}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </form>
                </TabsContent>

                <TabsContent value="issuer">
                  <form className="space-y-5">
                    {/* Chairperson Name */}
                    <div className="space-y-2">
                      <Label>{t("admin.createCertificate.fields.chairpersonName")}</Label>
                      <Input
                        name="chairpersonName"
                        placeholder="e.g., Dr. Marie Laurent"
                        value={formData.chairpersonName}
                        onChange={handleChange}
                      />
                    </div>

                    {/* Chairperson Title */}
                    <div className="space-y-2">
                      <Label>{t("admin.createCertificate.fields.chairpersonTitle")}</Label>
                      <Input
                        name="chairpersonTitle"
                        placeholder="e.g., Chairperson of the Accreditation Board"
                        value={formData.chairpersonTitle}
                        onChange={handleChange}
                      />
                    </div>

                    {/* Legal Disclaimer */}
                    <div className="space-y-2">
                      <Label>{t("admin.createCertificate.fields.legalDisclaimer")}</Label>
                      <Textarea
                        name="legalDisclaimer"
                        placeholder="Issued by a private accreditation body..."
                        value={formData.legalDisclaimer}
                        onChange={handleChange}
                        rows={3}
                        className="resize-none"
                      />
                    </div>

                    {/* Options */}
                    <div className="space-y-4 pt-4 border-t border-border">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>{t("admin.createCertificate.fields.showSeal")}</Label>
                          <p className="text-xs text-muted-foreground">
                            Display embossed seal on certificate
                          </p>
                        </div>
                        <Switch
                          checked={formData.showSeal}
                          onCheckedChange={(checked) =>
                            setFormData((prev) => ({ ...prev, showSeal: checked }))
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>{t("admin.createCertificate.fields.showQRCode")}</Label>
                          <p className="text-xs text-muted-foreground">
                            QR code for online verification
                          </p>
                        </div>
                        <Switch
                          checked={formData.showQRCode}
                          onCheckedChange={(checked) =>
                            setFormData((prev) => ({ ...prev, showQRCode: checked }))
                          }
                        />
                      </div>
                    </div>
                  </form>
                </TabsContent>

                <TabsContent value="template">
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Choose a template design for your certificate.
                    </p>
                    <TemplateSelector
                      selectedTemplateId={formData.templateId || (templates.length > 0 ? templates[0].id : "")}
                      onSelect={(template) =>
                        setFormData((prev) => ({ ...prev, templateId: template.id }))
                      }
                    />
                  </div>
                </TabsContent>
              </Tabs>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-6 mt-6 border-t border-border">
                <Button
                  onClick={handleSubmit}
                  variant="gold"
                  size="lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    t("admin.createCertificate.updating")
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      {t("admin.createCertificate.updateCertificate")}
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => navigate("/admin/certificates")}
                >
                  {t("common.cancel")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Preview Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          <Card variant="default" className="sticky top-4">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div>
                <CardTitle className="text-lg">{t("admin.createCertificate.preview.title")}</CardTitle>
                <CardDescription>{t("admin.createCertificate.preview.subtitle")}</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportImage}
                  disabled={isExporting}
                >
                  <FileImage className="mr-2 h-4 w-4" />
                  PNG
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleExportPDF}
                  disabled={isExporting}
                >
                  <Download className="mr-2 h-4 w-4" />
                  PDF
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div
                ref={certificateRef}
                className="overflow-auto rounded-lg border border-border bg-muted/30 p-4"
                style={{ maxHeight: "70vh" }}
              >
                <CertificatePreview
                  data={formData}
                  template={templates.find((t) => t.id === formData.templateId)}
                  scale={0.6}
                />
              </div>
              <p className="mt-4 text-center text-xs text-muted-foreground">
                {t("admin.createCertificate.preview.exportNote")}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
