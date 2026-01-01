import { motion } from "framer-motion";
import { Award, Calendar, Download, FileImage, ImagePlus, MapPin, Save, User, X } from "lucide-react";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { 
  CertificateData, 
  CertificateType,
  certificateTypeLabels,
  defaultCertificateData, 
  defaultTemplates,
  generateCertificateNumber,
  generateATCCode,
} from "@/types/certificate";

export default function CreateCertificatePage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const certificateRef = useRef<HTMLDivElement>(null);
  const { exportToPDF, exportToImage, isExporting } = useCertificateExport();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Partial<CertificateData>>({
    ...defaultCertificateData,
    certificateNumber: "",
    traineeName: "",
    trainingProgramName: "",
    atcCode: "",
    dateOfIssue: new Date().toISOString().split("T")[0],
    certificateType: "trainee",
  });

  const handleAutoGenerate = (field: "certificateNumber" | "atcCode") => {
    setFormData((prev) => ({
      ...prev,
      [field]: field === "certificateNumber" ? generateCertificateNumber() : generateATCCode(),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast({
      title: "Certificate Created!",
      description: `Certificate ${formData.certificateNumber} has been created successfully.`,
    });

    setIsSubmitting(false);
    navigate("/admin/certificates");
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

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-foreground">Create Certificate</h1>
        <p className="mt-1 text-muted-foreground">
          Design and generate a new certificate with all required fields.
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
              <CardTitle>Certificate Details</CardTitle>
              <CardDescription>
                Fill in all required information for the certificate.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="details" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="issuer">Issuer Info</TabsTrigger>
                  <TabsTrigger value="template">Template</TabsTrigger>
                </TabsList>

                <TabsContent value="details">
                  <form className="space-y-5">
                    {/* Certificate Type */}
                    <div className="space-y-2">
                      <Label>Certificate Type</Label>
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
                      <Label>Certificate Number</Label>
                      <div className="flex gap-3">
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
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={() => handleAutoGenerate("certificateNumber")}
                        >
                          Generate
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Format: FIBQ-XXXX-XXXX
                      </p>
                    </div>

                    {/* Trainee Name */}
                    <div className="space-y-2">
                      <Label>
                        <User className="mr-2 inline-block h-4 w-4" />
                        Trainee Full Name
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
                        Trainee Photo (Optional)
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
                        Training Program Name
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
                      <Label>Certificate Title / Description</Label>
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
                      <Label>ATC Code (Accredited Training Center)</Label>
                      <div className="flex gap-3">
                        <Input
                          name="atcCode"
                          placeholder="ATC-XXXX"
                          value={formData.atcCode}
                          onChange={handleChange}
                          className="font-mono"
                        />
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={() => handleAutoGenerate("atcCode")}
                        >
                          Generate
                        </Button>
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      {/* Date of Issue */}
                      <div className="space-y-2">
                        <Label>
                          <Calendar className="mr-2 inline-block h-4 w-4" />
                          Date of Issue
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
                          Place of Issue
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
                      <Label>Chairperson / Signatory Name</Label>
                      <Input
                        name="chairpersonName"
                        placeholder="e.g., Dr. Marie Laurent"
                        value={formData.chairpersonName}
                        onChange={handleChange}
                      />
                    </div>

                    {/* Chairperson Title */}
                    <div className="space-y-2">
                      <Label>Chairperson Title</Label>
                      <Input
                        name="chairpersonTitle"
                        placeholder="e.g., Chairperson of the Accreditation Board"
                        value={formData.chairpersonTitle}
                        onChange={handleChange}
                      />
                    </div>

                    {/* Legal Disclaimer */}
                    <div className="space-y-2">
                      <Label>Legal Disclaimer</Label>
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
                          <Label>Show Official Seal</Label>
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
                          <Label>Include QR Code</Label>
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
                      selectedTemplateId={formData.templateId || "classic-gold"}
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
                    "Creating..."
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Certificate
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => navigate("/admin/certificates")}
                >
                  Cancel
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
                <CardTitle className="text-lg">Live Preview</CardTitle>
                <CardDescription>Certificate updates as you type</CardDescription>
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
                  template={defaultTemplates.find((t) => t.id === formData.templateId)}
                  scale={0.6}
                />
              </div>
              <p className="mt-4 text-center text-xs text-muted-foreground">
                Export at full resolution for printing. Preview shown at 60% scale.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
