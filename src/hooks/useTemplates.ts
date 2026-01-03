import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CertificateTemplate, defaultTemplates, defaultTemplateElements } from "@/types/certificate";
import { useToast } from "@/hooks/use-toast";
import { Json } from "@/integrations/supabase/types";

interface DbTemplate {
  id: string;
  name: string;
  border_style: string;
  accent_color: string;
  background_color: string;
  background_image: string | null;
  elements: Json;
  is_default: boolean;
  is_system: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

function dbToTemplate(db: DbTemplate): CertificateTemplate {
  return {
    id: db.id,
    name: db.name,
    thumbnailUrl: "",
    backgroundColor: db.background_color,
    borderStyle: db.border_style as CertificateTemplate["borderStyle"],
    accentColor: db.accent_color,
    backgroundImage: db.background_image || undefined,
    showSeal: true,
    showQRCode: true,
    width: 800,
    height: 566,
    elements: Array.isArray(db.elements) ? (db.elements as unknown as CertificateTemplate["elements"]) : defaultTemplateElements,
  };
}

function templateToDb(template: CertificateTemplate, userId?: string) {
  return {
    name: template.name,
    border_style: template.borderStyle,
    accent_color: template.accentColor,
    background_color: template.backgroundColor,
    background_image: template.backgroundImage || null,
    elements: template.elements as unknown as Json,
    is_default: false,
    is_system: false,
    created_by: userId || null,
  };
}

export function useTemplates() {
  const { toast } = useToast();
  const [templates, setTemplates] = useState<CertificateTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    setIsLoading(true);
    
    const { data, error } = await supabase
      .from("certificate_templates")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (error) {
      console.error("Error fetching templates:", error);
      setTemplates([]);
    } else if (data && data.length > 0) {
      const dbTemplates = data.map(dbToTemplate);
      setTemplates(dbTemplates);
      // Set default selected template
      const defaultTemplate = data.find(t => t.is_default);
      if (defaultTemplate) {
        setSelectedTemplateId(defaultTemplate.id);
      } else if (dbTemplates.length > 0) {
        setSelectedTemplateId(dbTemplates[0].id);
      }
    } else {
      setTemplates([]);
    }
    
    setIsLoading(false);
  };

  const createTemplate = async (template: Omit<CertificateTemplate, "id">) => {
    const { data: userData } = await supabase.auth.getUser();
    
    const dbData = templateToDb(template as CertificateTemplate, userData.user?.id);
    
    const { data, error } = await supabase
      .from("certificate_templates")
      .insert(dbData)
      .select()
      .single();
    
    if (error) {
      console.error("Error creating template:", error);
      toast({
        title: "Error",
        description: "Failed to create template. Please try again.",
        variant: "destructive",
      });
      return null;
    }
    
    const newTemplate = dbToTemplate(data);
    setTemplates(prev => [...prev, newTemplate]);
    
    toast({
      title: "Template Created!",
      description: `${newTemplate.name} has been added.`,
    });
    
    return newTemplate;
  };

  const updateTemplate = async (template: CertificateTemplate) => {
    const { error } = await supabase
      .from("certificate_templates")
      .update({
        name: template.name,
        border_style: template.borderStyle,
        accent_color: template.accentColor,
        background_color: template.backgroundColor,
        background_image: template.backgroundImage || null,
        elements: template.elements as unknown as Json,
      })
      .eq("id", template.id);
    
    if (error) {
      console.error("Error updating template:", error);
      toast({
        title: "Error",
        description: "Failed to update template. Please try again.",
        variant: "destructive",
      });
      return null;
    }
    
    setTemplates(prev => prev.map(t => t.id === template.id ? template : t));
    
    return template;
  };

  const deleteTemplate = async (id: string) => {
    const template = templates.find(t => t.id === id);
    
    const { error } = await supabase
      .from("certificate_templates")
      .delete()
      .eq("id", id);
    
    if (error) {
      console.error("Error deleting template:", error);
      toast({
        title: "Error",
        description: "Failed to delete template. Please try again.",
        variant: "destructive",
      });
      return false;
    }
    
    setTemplates(prev => prev.filter(t => t.id !== id));
    
    if (selectedTemplateId === id) {
      const remaining = templates.filter(t => t.id !== id);
      setSelectedTemplateId(remaining[0]?.id || "");
    }
    
    toast({
      title: "Template Deleted",
      description: `${template?.name || "Template"} has been removed.`,
    });
    
    return true;
  };

  return {
    templates,
    isLoading,
    selectedTemplateId,
    setSelectedTemplateId,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    refreshTemplates: fetchTemplates,
  };
}
