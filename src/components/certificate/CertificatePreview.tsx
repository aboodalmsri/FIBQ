import { forwardRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Award } from "lucide-react";
import { CertificateData, CertificateTemplate, certificateTypeLabels, defaultTemplates } from "@/types/certificate";
import { cn } from "@/lib/utils";

interface CertificatePreviewProps {
  data: Partial<CertificateData>;
  template?: CertificateTemplate;
  scale?: number;
  showForExport?: boolean;
}

export const CertificatePreview = forwardRef<HTMLDivElement, CertificatePreviewProps>(
  ({ data, template, scale = 1, showForExport = false }, ref) => {
    const selectedTemplate = template || defaultTemplates.find((t) => t.id === data.templateId) || defaultTemplates[0];

    const getBorderStyle = () => {
      switch (selectedTemplate.borderStyle) {
        case "classic":
          return "border-[12px] border-double";
        case "modern":
          return "border-4 border-solid";
        case "minimal":
          return "border border-solid";
        case "ornate":
          return "border-[16px] border-double";
        case "none":
          return "";
        default:
          return "border-4 border-double";
      }
    };

    const formatDate = (dateStr?: string) => {
      if (!dateStr) return "DD / MM / YYYY";
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).replace(/\//g, " / ");
    };

    // Get value for a placeholder
    const getPlaceholderValue = (placeholder: string): string => {
      switch (placeholder) {
        case "traineeName":
          return data.traineeName || data.trainerName || data.centerName || "Name";
        case "certificateTitle":
          return data.certificateTitle || "Certificate Title";
        case "trainingProgramName":
          return data.trainingProgramName || "Training Program";
        case "certificateNumber":
          return data.certificateNumber || "FIBQ-XXXX-XXXX";
        case "atcCode":
          return data.atcCode || "ATC-XXXX";
        case "dateOfIssue":
          return formatDate(data.dateOfIssue);
        case "placeOfIssue":
          return data.placeOfIssue || "Place of Issue";
        case "chairpersonName":
          return data.chairpersonName || "Chairperson Name";
        case "chairpersonTitle":
          return data.chairpersonTitle || "Chairperson Title";
        case "legalDisclaimer":
          return data.legalDisclaimer || "Legal Disclaimer";
        case "centerName":
          return data.centerName || "Center Name";
        case "certificateTypeLabel":
          return data.certificateType ? certificateTypeLabels[data.certificateType] : "Certificate";
        default:
          return placeholder;
      }
    };

    // Get image URL for a placeholder
    const getImageValue = (placeholder?: string): string | undefined => {
      switch (placeholder) {
        case "traineePhoto":
          return data.traineePhoto || data.trainerPhoto;
        case "centerLogo":
          return data.centerLogo;
        default:
          return undefined;
      }
    };

    const exportStyles = showForExport ? {
      fontSmoothing: 'antialiased' as const,
      WebkitFontSmoothing: 'antialiased' as const,
    } : {};

    // Render elements from template
    const renderElement = (element: typeof selectedTemplate.elements[0]) => {
      const baseStyle: React.CSSProperties = {
        position: "absolute",
        left: `${element.x}%`,
        top: `${element.y}%`,
        transform: "translate(-50%, -50%)",
        width: `${element.width}%`,
      };

      switch (element.type) {
        case "text": {
          const value = element.placeholder 
            ? getPlaceholderValue(element.placeholder)
            : element.content || "";
          
          return (
            <div
              key={element.id}
              style={{
                ...baseStyle,
                fontSize: showForExport ? `${element.fontSize}px` : `${(element.fontSize || 16) * 0.9}px`,
                fontFamily: element.fontFamily === "monospace" ? "monospace" : 
                           element.fontFamily === "Playfair Display" ? "'Playfair Display', serif" : 
                           "'Inter', sans-serif",
                fontWeight: element.fontWeight === "bold" ? 700 : element.fontWeight === "semibold" ? 600 : 400,
                fontStyle: element.fontStyle,
                textAlign: element.textAlign,
                color: element.color,
                lineHeight: 1.3,
                wordBreak: "break-word",
              }}
            >
              {value}
            </div>
          );
        }

        case "image": {
          const imageUrl = getImageValue(element.placeholder);
          if (!imageUrl) return null;
          
          return (
            <div
              key={element.id}
              style={{
                ...baseStyle,
                height: `${element.height}%`,
              }}
              className="flex items-center justify-center"
            >
              <img
                src={imageUrl}
                alt=""
                className="max-w-full max-h-full object-contain rounded-lg"
                style={{
                  border: `3px solid ${selectedTemplate.accentColor}`,
                }}
              />
            </div>
          );
        }

        case "qrcode": {
          if (data.showQRCode === false) return null;
          
          return (
            <div
              key={element.id}
              style={{
                ...baseStyle,
                height: `${element.height}%`,
              }}
              className="flex flex-col items-center justify-center"
            >
              <QRCodeSVG
                value={`${typeof window !== 'undefined' ? window.location.origin : ''}/verify?number=${data.certificateNumber || 'PREVIEW'}`}
                size={showForExport ? 80 : 60}
                level="M"
                className="rounded"
              />
              <p className="text-[8px] mt-1" style={{ color: "#888888" }}>Scan to verify</p>
            </div>
          );
        }

        case "seal": {
          if (data.showSeal === false) return null;
          
          return (
            <div
              key={element.id}
              style={{
                ...baseStyle,
                height: `${element.height}%`,
              }}
              className="flex items-center justify-center"
            >
              <div
                className="w-full h-full max-w-[80px] max-h-[80px] rounded-full border-4 flex items-center justify-center"
                style={{
                  borderColor: selectedTemplate.accentColor,
                  backgroundColor: `${selectedTemplate.accentColor}10`,
                }}
              >
                <div className="text-center">
                  <Award
                    className="h-5 w-5 mx-auto"
                    style={{ color: selectedTemplate.accentColor }}
                  />
                  <p
                    className="text-[7px] font-bold uppercase mt-0.5"
                    style={{ color: selectedTemplate.accentColor }}
                  >
                    Official
                  </p>
                </div>
              </div>
            </div>
          );
        }

        case "line": {
          return (
            <div
              key={element.id}
              style={{
                ...baseStyle,
                height: "2px",
                backgroundColor: element.color || selectedTemplate.accentColor,
              }}
            />
          );
        }

        case "logo": {
          const logoUrl = data.centerLogo;
          if (!logoUrl) return null;
          
          return (
            <div
              key={element.id}
              style={{
                ...baseStyle,
                height: `${element.height}%`,
              }}
              className="flex items-center justify-center"
            >
              <img
                src={logoUrl}
                alt="Logo"
                className="max-w-full max-h-full object-contain"
              />
            </div>
          );
        }

        default:
          return null;
      }
    };

    return (
      <div
        ref={ref}
        className="certificate-preview"
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          ...exportStyles,
        }}
      >
        <div
          className={cn(
            "relative",
            getBorderStyle()
          )}
          style={{
            width: `${selectedTemplate.width}px`,
            height: `${selectedTemplate.height}px`,
            backgroundColor: selectedTemplate.backgroundColor,
            borderColor: selectedTemplate.accentColor,
            backgroundImage: selectedTemplate.backgroundImage ? `url(${selectedTemplate.backgroundImage})` : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Ornate Corner Decorations for classic/ornate styles */}
          {(selectedTemplate.borderStyle === "classic" || selectedTemplate.borderStyle === "ornate") && (
            <>
              <div
                className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2"
                style={{ borderColor: selectedTemplate.accentColor }}
              />
              <div
                className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2"
                style={{ borderColor: selectedTemplate.accentColor }}
              />
              <div
                className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2"
                style={{ borderColor: selectedTemplate.accentColor }}
              />
              <div
                className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2"
                style={{ borderColor: selectedTemplate.accentColor }}
              />
            </>
          )}

          {/* Render all elements from template */}
          {selectedTemplate.elements.map(renderElement)}
        </div>
      </div>
    );
  }
);

CertificatePreview.displayName = "CertificatePreview";
