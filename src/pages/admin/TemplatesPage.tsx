import { motion } from "framer-motion";
import { Check, Edit, Eye, Plus, Trash2, Upload, Palette, Layout } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { CertificateTemplate, defaultTemplates, defaultTemplateElements } from "@/types/certificate";
import { TemplateEditor } from "@/components/certificate/TemplateEditor";
import { cn } from "@/lib/utils";

export default function TemplatesPage() {
  const { toast } = useToast();
  const [templates, setTemplates] = useState<CertificateTemplate[]>(defaultTemplates);
  const [selectedTemplate, setSelectedTemplate] = useState<string>(defaultTemplates[0].id);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<CertificateTemplate | null>(null);
  const [newTemplate, setNewTemplate] = useState({
    name: "",
    accentColor: "#C9A227",
    backgroundColor: "#FFFEF7",
    borderStyle: "classic" as CertificateTemplate["borderStyle"],
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
      borderStyle: newTemplate.borderStyle,
      accentColor: newTemplate.accentColor,
      showSeal: true,
      showQRCode: true,
      width: 800,
      height: 566,
      elements: defaultTemplateElements.map(el => ({
        ...el,
        id: `${el.id}-${Date.now()}`,
        color: el.color?.includes("#C9A227") ? newTemplate.accentColor : el.color,
      })),
    };

    setTemplates([...templates, template]);
    setIsCreateDialogOpen(false);
    setNewTemplate({ 
      name: "", 
      accentColor: "#C9A227", 
      backgroundColor: "#FFFEF7",
      borderStyle: "classic",
    });

    toast({
      title: "Template Created!",
      description: `${template.name} has been added. Click Edit to customize the layout.`,
    });
  };

  const handleUpdateTemplate = (updatedTemplate: CertificateTemplate) => {
    setTemplates(templates.map(t => 
      t.id === updatedTemplate.id ? updatedTemplate : t
    ));
    setEditingTemplate(updatedTemplate);
  };

  const handleSaveTemplate = () => {
    if (editingTemplate) {
      setTemplates(templates.map(t => 
        t.id === editingTemplate.id ? editingTemplate : t
      ));
    }
    setEditingTemplate(null);
    toast({
      title: "Template Saved!",
      description: "Your changes have been saved.",
    });
  };

  const handleDeleteTemplate = (id: string) => {
    const template = templates.find(t => t.id === id);
    if (!template) return;

    if (defaultTemplates.some(t => t.id === id)) {
      toast({
        title: "Cannot Delete",
        description: "Default templates cannot be deleted.",
        variant: "destructive",
      });
      return;
    }

    setTemplates(templates.filter(t => t.id !== id));
    if (selectedTemplate === id) {
      setSelectedTemplate(templates[0]?.id || "");
    }

    toast({
      title: "Template Deleted",
      description: `${template.name} has been removed.`,
    });
  };

  const handleSetDefault = (id: string) => {
    setSelectedTemplate(id);
    toast({
      title: "Default Template Set",
      description: "This template will be used for new certificates.",
    });
  };

  // If editing, show the full template editor
  if (editingTemplate) {
    return (
      <div className="p-6 md:p-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="font-heading text-2xl font-bold text-foreground">
              Edit Template: {editingTemplate.name}
            </h1>
            <p className="mt-1 text-muted-foreground">
              Customize layout, text elements, and design
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setEditingTemplate(null)}>
              Cancel
            </Button>
            <Button variant="gold" onClick={handleSaveTemplate}>
              Save Template
            </Button>
          </div>
        </div>

        <TemplateEditor
          template={editingTemplate}
          onUpdate={handleUpdateTemplate}
        />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground">Certificate Templates</h1>
          <p className="mt-1 text-muted-foreground">
            Manage certificate designs with full layout control
          </p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="gold" size="lg">
              <Plus className="mr-2 h-4 w-4" />
              New Template
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Template</DialogTitle>
              <DialogDescription>
                Start with base colors, then customize the full layout
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

              <div className="space-y-2">
                <Label>Border Style</Label>
                <Select
                  value={newTemplate.borderStyle}
                  onValueChange={(value: CertificateTemplate["borderStyle"]) =>
                    setNewTemplate((prev) => ({ ...prev, borderStyle: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="classic">Classic (Double Border)</SelectItem>
                    <SelectItem value="modern">Modern (Solid Border)</SelectItem>
                    <SelectItem value="minimal">Minimal (Thin Border)</SelectItem>
                    <SelectItem value="ornate">Ornate (Thick Double)</SelectItem>
                  </SelectContent>
                </Select>
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
                  className={cn(
                    "h-24 rounded-lg flex items-center justify-center",
                    newTemplate.borderStyle === "classic" && "border-4 border-double",
                    newTemplate.borderStyle === "modern" && "border-2 border-solid",
                    newTemplate.borderStyle === "minimal" && "border border-solid",
                    newTemplate.borderStyle === "ornate" && "border-[6px] border-double",
                    newTemplate.borderStyle === "none" && ""
                  )}
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
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
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
                style={{ 
                  backgroundColor: template.backgroundColor,
                  backgroundImage: template.backgroundImage ? `url(${template.backgroundImage})` : undefined,
                  backgroundSize: "cover",
                }}
              >
                <div
                  className={cn(
                    "absolute inset-4",
                    template.borderStyle === "classic" && "border-4 border-double",
                    template.borderStyle === "modern" && "border-2 border-solid",
                    template.borderStyle === "minimal" && "border border-dashed",
                    template.borderStyle === "ornate" && "border-[6px] border-double",
                    template.borderStyle === "none" && ""
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
                  {template.borderStyle === "none" ? "No border" : `${template.borderStyle} style`} • {template.elements.length} elements
                </p>

                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingTemplate({ ...template });
                    }}
                  >
                    <Layout className="mr-1 h-3 w-3" />
                    Edit Layout
                  </Button>
                  
                  {!defaultTemplates.some(t => t.id === template.id) && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Template?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete "{template.name}". This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteTemplate(template.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
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
            onClick={() => setIsCreateDialogOpen(true)}
          >
            <div className="flex flex-col items-center justify-center h-full min-h-[280px] p-6 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
                <Upload className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="font-heading font-semibold text-foreground mb-1">
                Add Custom Template
              </h3>
              <p className="text-sm text-muted-foreground">
                Create a fully customizable design
              </p>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Instructions */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-lg">How to Use Templates</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>1. <strong>Create a template</strong> - Start with base colors and border style</p>
          <p>2. <strong>Edit layout</strong> - Click "Edit Layout" to drag and position all elements</p>
          <p>3. <strong>Map data fields</strong> - Assign placeholders like name, date, certificate number to text elements</p>
          <p>4. <strong>Add images</strong> - Include spaces for trainee photos or center logos</p>
          <p>5. <strong>Set as default</strong> - Click a template to use it for new certificates</p>
        </CardContent>
      </Card>
    </div>
  );
}
