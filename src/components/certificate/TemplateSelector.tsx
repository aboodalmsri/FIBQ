import { Check } from "lucide-react";
import { CertificateTemplate, defaultTemplates } from "@/types/certificate";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

interface TemplateSelectorProps {
  selectedTemplateId: string;
  onSelect: (template: CertificateTemplate) => void;
}

export function TemplateSelector({ selectedTemplateId, onSelect }: TemplateSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {defaultTemplates.map((template) => (
        <Card
          key={template.id}
          className={cn(
            "relative cursor-pointer overflow-hidden transition-all hover:shadow-lg",
            selectedTemplateId === template.id
              ? "ring-2 ring-secondary shadow-gold"
              : "hover:ring-1 hover:ring-border"
          )}
          onClick={() => onSelect(template)}
        >
          {/* Template Preview */}
          <div
            className="h-24 relative"
            style={{ backgroundColor: template.backgroundColor }}
          >
            {/* Mini border preview */}
            <div
              className={cn(
                "absolute inset-2",
                template.borderStyle === "classic" && "border-2 border-double",
                template.borderStyle === "modern" && "border border-solid",
                template.borderStyle === "minimal" && "border border-dashed",
                template.borderStyle === "ornate" && "border-4 border-double"
              )}
              style={{ borderColor: template.accentColor }}
            >
              <div className="flex flex-col items-center justify-center h-full">
                <div
                  className="text-[8px] font-bold uppercase tracking-wider"
                  style={{ color: template.accentColor }}
                >
                  Certificate
                </div>
                <div
                  className="w-12 h-0.5 mt-1"
                  style={{ backgroundColor: template.accentColor }}
                />
              </div>
            </div>

            {/* Selected checkmark */}
            {selectedTemplateId === template.id && (
              <div className="absolute top-2 right-2 h-5 w-5 rounded-full bg-secondary flex items-center justify-center">
                <Check className="h-3 w-3 text-secondary-foreground" />
              </div>
            )}
          </div>

          {/* Template Name */}
          <div className="p-3 border-t border-border">
            <p className="text-sm font-medium text-foreground">{template.name}</p>
            <p className="text-xs text-muted-foreground capitalize">
              {template.borderStyle} style
            </p>
          </div>
        </Card>
      ))}
    </div>
  );
}
