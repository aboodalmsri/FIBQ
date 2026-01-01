import { motion } from "framer-motion";
import { Check, Eye, Palette, Plus, Upload } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { CertificateTemplate, defaultTemplates } from "@/types/certificate";
import { cn } from "@/lib/utils";

export default function TemplatesPage() {
  const { toast } = useToast();
  const [templates, setTemplates] = useState<CertificateTemplate[]>(defaultTemplates);
  const [selectedTemplate, setSelectedTemplate] = useState<string>(defaultTemplates[0].id);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTemplate, setNewTemplate] = useState({
    name: "",
    accentColor: "#C9A227",
    backgroundColor: "#FFFEF7",
  });

  const handleCreateTemplate = () => {
    if (!newTemplate.name.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter a template name.",
        variant: "destructive",
      });
      return;
    }

    const template: CertificateTemplate = {
      id: `custom-${Date.now()}`,
      name: newTemplate.name,
      thumbnailUrl: "",
      backgroundColor: newTemplate.backgroundColor,
      borderStyle: "classic",
      accentColor: newTemplate.accentColor,
      showSeal: true,
      showQRCode: true,
    };

    setTemplates([...templates, template]);
    setIsDialogOpen(false);
    setNewTemplate({ name: "", accentColor: "#C9A227", backgroundColor: "#FFFEF7" });

    toast({
      title: "Template Created!",
      description: `${template.name} has been added to your templates.`,
    });
  };

  const handleSetDefault = (id: string) => {
    setSelectedTemplate(id);
    toast({
      title: "Default Template Set",
      description: "This template will be used for new certificates.",
    });
  };

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground">Certificate Templates</h1>
          <p className="mt-1 text-muted-foreground">
            Manage and customize your certificate designs.
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="gold" size="lg">
              <Plus className="mr-2 h-4 w-4" />
              New Template
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Template</DialogTitle>
              <DialogDescription>
                Customize your certificate design with colors and branding.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Template Name</Label>
                <Input
                  placeholder="e.g., Corporate Blue"
                  value={newTemplate.name}
                  onChange={(e) =>
                    setNewTemplate((prev) => ({ ...prev, name: e.target.value }))
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Accent Color</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={newTemplate.accentColor}
                      onChange={(e) =>
                        setNewTemplate((prev) => ({ ...prev, accentColor: e.target.value }))
                      }
                      className="h-10 w-14 p-1 cursor-pointer"
                    />
                    <Input
                      value={newTemplate.accentColor}
                      onChange={(e) =>
                        setNewTemplate((prev) => ({ ...prev, accentColor: e.target.value }))
                      }
                      className="font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Background Color</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={newTemplate.backgroundColor}
                      onChange={(e) =>
                        setNewTemplate((prev) => ({ ...prev, backgroundColor: e.target.value }))
                      }
                      className="h-10 w-14 p-1 cursor-pointer"
                    />
                    <Input
                      value={newTemplate.backgroundColor}
                      onChange={(e) =>
                        setNewTemplate((prev) => ({ ...prev, backgroundColor: e.target.value }))
                      }
                      className="font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Preview */}
              <div className="pt-4">
                <Label className="mb-2 block">Preview</Label>
                <div
                  className="h-24 rounded-lg border-4 border-double flex items-center justify-center"
                  style={{
                    backgroundColor: newTemplate.backgroundColor,
                    borderColor: newTemplate.accentColor,
                  }}
                >
                  <div className="text-center">
                    <p
                      className="font-heading text-lg font-bold"
                      style={{ color: newTemplate.accentColor }}
                    >
                      CERTIFICATE
                    </p>
                    <div
                      className="w-20 h-0.5 mx-auto mt-1"
                      style={{ backgroundColor: newTemplate.accentColor }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="gold" onClick={handleCreateTemplate}>
                Create Template
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Templates Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {templates.map((template, index) => (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card
              className={cn(
                "relative overflow-hidden transition-all hover:shadow-lg cursor-pointer",
                selectedTemplate === template.id && "ring-2 ring-secondary"
              )}
              onClick={() => handleSetDefault(template.id)}
            >
              {/* Template Preview */}
              <div
                className="h-40 relative"
                style={{ backgroundColor: template.backgroundColor }}
              >
                <div
                  className={cn(
                    "absolute inset-4",
                    template.borderStyle === "classic" && "border-4 border-double",
                    template.borderStyle === "modern" && "border-2 border-solid",
                    template.borderStyle === "minimal" && "border border-dashed",
                    template.borderStyle === "ornate" && "border-[6px] border-double"
                  )}
                  style={{ borderColor: template.accentColor }}
                >
                  <div className="flex flex-col items-center justify-center h-full">
                    <Palette
                      className="h-8 w-8 mb-2"
                      style={{ color: template.accentColor }}
                    />
                    <div
                      className="text-xs font-bold uppercase tracking-wider"
                      style={{ color: template.accentColor }}
                    >
                      Certificate
                    </div>
                    <div
                      className="w-16 h-0.5 mt-1"
                      style={{ backgroundColor: template.accentColor }}
                    />
                  </div>
                </div>

                {/* Default Badge */}
                {selectedTemplate === template.id && (
                  <div className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground">
                    <Check className="h-3 w-3" />
                    Default
                  </div>
                )}
              </div>

              <CardContent className="p-4">
                <h3 className="font-heading font-semibold text-foreground">
                  {template.name}
                </h3>
                <p className="text-xs text-muted-foreground capitalize mt-1">
                  {template.borderStyle} style
                </p>

                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      toast({
                        title: "Preview",
                        description: "Full template preview coming soon!",
                      });
                    }}
                  >
                    <Eye className="mr-1 h-3 w-3" />
                    Preview
                  </Button>
                  <Button
                    variant={selectedTemplate === template.id ? "secondary" : "ghost"}
                    size="sm"
                    className="flex-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSetDefault(template.id);
                    }}
                  >
                    {selectedTemplate === template.id ? "Default" : "Set Default"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}

        {/* Upload Custom Template Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: templates.length * 0.05 }}
        >
          <Card
            className="h-full border-dashed cursor-pointer hover:border-secondary hover:bg-muted/50 transition-all"
            onClick={() => setIsDialogOpen(true)}
          >
            <div className="flex flex-col items-center justify-center h-full min-h-[280px] p-6 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
                <Upload className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="font-heading font-semibold text-foreground mb-1">
                Add Custom Template
              </h3>
              <p className="text-sm text-muted-foreground">
                Create a new design with your brand colors
              </p>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Info Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-8"
      >
        <Card variant="feature">
          <CardHeader>
            <CardTitle className="text-lg">Template Field Mapping</CardTitle>
            <CardDescription>
              All templates automatically map these certificate fields:
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {[
                "Trainee Full Name",
                "Certificate Title / Description",
                "Training Program Name",
                "Certificate Number",
                "ATC Code",
                "Date of Issue",
                "Place of Issue",
                "Chairperson / Signature",
                "Legal Disclaimer",
                "Official Seal (optional)",
                "QR Code (optional)",
              ].map((field) => (
                <div
                  key={field}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <Check className="h-4 w-4 text-secondary shrink-0" />
                  {field}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
