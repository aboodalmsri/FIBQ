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

    const certificateTypeLabel = data.certificateType 
      ? certificateTypeLabels[data.certificateType] 
      : "Certificate of Achievement";

    // Styles optimized for export to prevent overlapping
    const exportStyles = showForExport ? {
      fontSmoothing: 'antialiased' as const,
      WebkitFontSmoothing: 'antialiased' as const,
    } : {};

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
            "relative w-[800px] p-8",
            getBorderStyle()
          )}
          style={{
            backgroundColor: selectedTemplate.backgroundColor,
            borderColor: selectedTemplate.accentColor,
            minHeight: "566px",
          }}
        >
          {/* Ornate Corner Decorations for classic/ornate styles */}
          {(selectedTemplate.borderStyle === "classic" || selectedTemplate.borderStyle === "ornate") && (
            <>
              <div
                className="absolute top-4 left-4 w-16 h-16 border-t-2 border-l-2"
                style={{ borderColor: selectedTemplate.accentColor }}
              />
              <div
                className="absolute top-4 right-4 w-16 h-16 border-t-2 border-r-2"
                style={{ borderColor: selectedTemplate.accentColor }}
              />
              <div
                className="absolute bottom-4 left-4 w-16 h-16 border-b-2 border-l-2"
                style={{ borderColor: selectedTemplate.accentColor }}
              />
              <div
                className="absolute bottom-4 right-4 w-16 h-16 border-b-2 border-r-2"
                style={{ borderColor: selectedTemplate.accentColor }}
              />
            </>
          )}

          {/* Header */}
          <div className="text-center mb-4" style={{ marginTop: "8px" }}>
            <div className="flex items-center justify-center gap-3 mb-2">
              <Award
                className="h-10 w-10 flex-shrink-0"
                style={{ color: selectedTemplate.accentColor }}
              />
              <h1
                className="font-heading text-3xl font-bold tracking-wide whitespace-nowrap"
                style={{ color: selectedTemplate.accentColor }}
              >
                CERTIFICATE
              </h1>
              <Award
                className="h-10 w-10 flex-shrink-0"
                style={{ color: selectedTemplate.accentColor }}
              />
            </div>
            <p 
              className="text-xs uppercase tracking-widest"
              style={{ color: "#666666" }}
            >
              {certificateTypeLabel}
            </p>
          </div>

          {/* Photo (if provided) */}
          {data.traineePhoto && (
            <div className="flex justify-center mb-4">
              <div
                className="w-20 h-20 rounded-full border-4 overflow-hidden"
                style={{ borderColor: selectedTemplate.accentColor }}
              >
                <img
                  src={data.traineePhoto}
                  alt={data.traineeName || "Trainee"}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

          {/* Certificate Title/Description */}
          <div className="text-center mb-4 px-12">
            <p 
              className="text-sm leading-relaxed italic"
              style={{ color: "#555555" }}
            >
              {data.certificateTitle || "This certificate is proudly presented for successfully completing the accredited training program"}
            </p>
          </div>

          {/* Trainee Name */}
          <div className="text-center mb-4">
            <p
              className="font-heading text-3xl font-bold"
              style={{ 
                color: selectedTemplate.accentColor,
                lineHeight: "1.2",
                wordBreak: "break-word",
              }}
            >
              {data.traineeName || "Trainee Full Name"}
            </p>
            <div
              className="mt-2 mx-auto w-64 h-0.5"
              style={{ backgroundColor: selectedTemplate.accentColor }}
            />
          </div>

          {/* Training Program */}
          <div className="text-center mb-4">
            <p className="text-sm mb-1" style={{ color: "#666666" }}>for completing</p>
            <p
              className="font-heading text-xl font-semibold px-4"
              style={{ 
                color: selectedTemplate.accentColor,
                lineHeight: "1.3",
                wordBreak: "break-word",
              }}
            >
              {data.trainingProgramName || "Training Program Name"}
            </p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-3 gap-4 mb-4 text-center">
            <div>
              <p 
                className="text-xs uppercase tracking-wide mb-1"
                style={{ color: "#888888" }}
              >
                Certificate No.
              </p>
              <p 
                className="font-mono font-semibold text-sm"
                style={{ color: "#333333" }}
              >
                {data.certificateNumber || "FIBQ-XXXX-XXXX"}
              </p>
            </div>
            <div>
              <p 
                className="text-xs uppercase tracking-wide mb-1"
                style={{ color: "#888888" }}
              >
                ATC Code
              </p>
              <p 
                className="font-mono font-semibold text-sm"
                style={{ color: "#333333" }}
              >
                {data.atcCode || "ATC-XXXX"}
              </p>
            </div>
            <div>
              <p 
                className="text-xs uppercase tracking-wide mb-1"
                style={{ color: "#888888" }}
              >
                Date of Issue
              </p>
              <p 
                className="font-semibold text-sm"
                style={{ color: "#333333" }}
              >
                {formatDate(data.dateOfIssue)}
              </p>
            </div>
          </div>

          {/* Place of Issue */}
          <div className="text-center mb-4">
            <p 
              className="text-xs uppercase tracking-wide mb-1"
              style={{ color: "#888888" }}
            >
              Place of Issue
            </p>
            <p 
              className="font-semibold text-sm"
              style={{ color: "#333333" }}
            >
              {data.placeOfIssue || "Place of Issue"}
            </p>
          </div>

          {/* Signature and Seal Section */}
          <div className="flex items-end justify-between px-8 mb-4">
            {/* QR Code */}
            <div className="flex flex-col items-center w-24">
              {(data.showQRCode !== false) && (
                <>
                  <QRCodeSVG
                    value={`${typeof window !== 'undefined' ? window.location.origin : ''}/verify?number=${data.certificateNumber || 'PREVIEW'}`}
                    size={70}
                    level="M"
                    className="rounded"
                  />
                  <p className="text-[10px] mt-1" style={{ color: "#888888" }}>Scan to verify</p>
                </>
              )}
            </div>

            {/* Signature */}
            <div className="text-center flex-1 px-4">
              <div 
                className="w-48 mx-auto mb-2"
                style={{ borderBottom: "1px solid #999999" }}
              />
              <p 
                className="font-semibold text-sm"
                style={{ color: "#333333" }}
              >
                {data.chairpersonName || "Chairperson Name"}
              </p>
              <p 
                className="text-xs"
                style={{ color: "#666666" }}
              >
                {data.chairpersonTitle || "Chairperson Title"}
              </p>
            </div>

            {/* Seal */}
            <div className="flex flex-col items-center w-24">
              {(data.showSeal !== false) && (
                <div
                  className="w-20 h-20 rounded-full border-4 flex items-center justify-center"
                  style={{
                    borderColor: selectedTemplate.accentColor,
                    backgroundColor: `${selectedTemplate.accentColor}10`,
                  }}
                >
                  <div className="text-center">
                    <Award
                      className="h-6 w-6 mx-auto"
                      style={{ color: selectedTemplate.accentColor }}
                    />
                    <p
                      className="text-[8px] font-bold uppercase mt-1"
                      style={{ color: selectedTemplate.accentColor }}
                    >
                      Official
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Legal Disclaimer */}
          <div className="text-center px-12">
            <p 
              className="text-[10px] italic"
              style={{ color: "#888888" }}
            >
              {data.legalDisclaimer || "Issued by a private accreditation body. Validity subject to official verification."}
            </p>
          </div>
        </div>
      </div>
    );
  }
);

CertificatePreview.displayName = "CertificatePreview";
