import { motion } from "framer-motion";
import { Award, Calendar, Save, User } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { QRCodeSVG } from "qrcode.react";

export default function CreateCertificatePage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    holderName: "",
    certificateTitle: "",
    grade: "",
    issueDate: new Date().toISOString().split("T")[0],
    certificateNumber: "",
  });

  const generateCertificateNumber = () => {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0");
    return `CERT-${year}-${random}`;
  };

  const handleAutoGenerate = () => {
    setFormData((prev) => ({
      ...prev,
      certificateNumber: generateCertificateNumber(),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast({
      title: "Certificate Created!",
      description: `Certificate ${formData.certificateNumber || "auto-generated"} has been created successfully.`,
    });

    setIsSubmitting(false);
    navigate("/admin/certificates");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const previewCertNumber = formData.certificateNumber || "CERT-XXXX-XXX";

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-foreground">Create Certificate</h1>
        <p className="mt-1 text-muted-foreground">
          Fill in the details to create a new certificate.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2"
        >
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Certificate Details</CardTitle>
              <CardDescription>
                Enter the information for the new certificate.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Certificate Number */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Certificate Number
                  </label>
                  <div className="flex gap-3">
                    <Input
                      name="certificateNumber"
                      placeholder="CERT-2024-001"
                      value={formData.certificateNumber}
                      onChange={handleChange}
                      className="font-mono"
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={handleAutoGenerate}
                    >
                      Auto-Generate
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Leave empty to auto-generate or enter a custom number.
                  </p>
                </div>

                {/* Holder Name */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    <User className="mr-2 inline-block h-4 w-4" />
                    Full Name of Certificate Holder
                  </label>
                  <Input
                    name="holderName"
                    placeholder="John Michael Smith"
                    value={formData.holderName}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Certificate Title */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    <Award className="mr-2 inline-block h-4 w-4" />
                    Certificate Title / Course Name
                  </label>
                  <Input
                    name="certificateTitle"
                    placeholder="Advanced Web Development"
                    value={formData.certificateTitle}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  {/* Grade */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Grade / Result
                    </label>
                    <Select
                      value={formData.grade}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, grade: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select grade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="distinction">Distinction</SelectItem>
                        <SelectItem value="merit">Merit</SelectItem>
                        <SelectItem value="pass">Pass</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Issue Date */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      <Calendar className="mr-2 inline-block h-4 w-4" />
                      Issue Date
                    </label>
                    <Input
                      name="issueDate"
                      type="date"
                      value={formData.issueDate}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    type="submit"
                    variant="gold"
                    size="lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      "Creating..."
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Create Certificate
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
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Preview */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card variant="gold" className="sticky top-24">
            <CardHeader>
              <CardTitle className="text-lg">Live Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-border bg-card p-6 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent">
                  <Award className="h-8 w-8 text-secondary" />
                </div>
                <p className="font-mono text-xs text-muted-foreground">
                  {previewCertNumber}
                </p>
                <h3 className="mt-2 font-heading text-lg font-bold text-foreground">
                  {formData.holderName || "Certificate Holder Name"}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {formData.certificateTitle || "Certificate Title"}
                </p>
                {formData.grade && (
                  <p className="mt-2 text-sm font-medium capitalize text-secondary">
                    {formData.grade}
                  </p>
                )}
                <p className="mt-2 text-xs text-muted-foreground">
                  {formData.issueDate
                    ? new Date(formData.issueDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "Issue Date"}
                </p>

                {/* QR Code */}
                <div className="mx-auto mt-6 flex h-24 w-24 items-center justify-center rounded-lg bg-card">
                  <QRCodeSVG
                    value={`${window.location.origin}/verify?number=${previewCertNumber}`}
                    size={80}
                    level="M"
                  />
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Scan to verify
                </p>
              </div>

              <p className="mt-4 text-center text-xs text-muted-foreground">
                This is a simplified preview. The final certificate will use your 
                selected template design.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
