import { useCallback, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useToast } from "@/hooks/use-toast";

export function useCertificateExport() {
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);

  const exportToPDF = useCallback(
    async (element: HTMLElement | null, fileName: string = "certificate") => {
      if (!element) {
        toast({
          title: "Export Failed",
          description: "Certificate preview not found.",
          variant: "destructive",
        });
        return;
      }

      setIsExporting(true);

      try {
        // Create a clone for export to avoid visual artifacts
        const clone = element.cloneNode(true) as HTMLElement;
        clone.style.transform = "none";
        clone.style.position = "absolute";
        clone.style.left = "-9999px";
        clone.style.top = "0";
        document.body.appendChild(clone);

        const canvas = await html2canvas(clone, {
          scale: 3, // Higher scale for better quality
          useCORS: true,
          allowTaint: true,
          backgroundColor: null,
          logging: false,
          imageTimeout: 0,
          onclone: (clonedDoc) => {
            // Ensure fonts are loaded in clone
            const clonedElement = clonedDoc.body.querySelector('.certificate-preview > div');
            if (clonedElement) {
              (clonedElement as HTMLElement).style.transform = 'none';
            }
          }
        });

        document.body.removeChild(clone);

        const imgData = canvas.toDataURL("image/png", 1.0);
        
        // A4 landscape dimensions in mm
        const pdfWidth = 297;
        const pdfHeight = 210;
        
        const pdf = new jsPDF({
          orientation: "landscape",
          unit: "mm",
          format: "a4",
        });

        // Calculate dimensions to fit the certificate centered on A4
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight) * 0.9;
        
        const finalWidth = imgWidth * ratio;
        const finalHeight = imgHeight * ratio;
        const x = (pdfWidth - finalWidth) / 2;
        const y = (pdfHeight - finalHeight) / 2;

        pdf.addImage(imgData, "PNG", x, y, finalWidth, finalHeight);
        pdf.save(`${fileName}.pdf`);

        toast({
          title: "PDF Exported!",
          description: "Your certificate has been downloaded.",
        });
      } catch (error) {
        console.error("Export error:", error);
        toast({
          title: "Export Failed",
          description: "There was an error exporting the certificate.",
          variant: "destructive",
        });
      } finally {
        setIsExporting(false);
      }
    },
    [toast]
  );

  const exportToImage = useCallback(
    async (element: HTMLElement | null, fileName: string = "certificate") => {
      if (!element) {
        toast({
          title: "Export Failed",
          description: "Certificate preview not found.",
          variant: "destructive",
        });
        return;
      }

      setIsExporting(true);

      try {
        // Create a clone for export
        const clone = element.cloneNode(true) as HTMLElement;
        clone.style.transform = "none";
        clone.style.position = "absolute";
        clone.style.left = "-9999px";
        clone.style.top = "0";
        document.body.appendChild(clone);

        const canvas = await html2canvas(clone, {
          scale: 3, // Higher scale for better quality
          useCORS: true,
          allowTaint: true,
          backgroundColor: null,
          logging: false,
          imageTimeout: 0,
        });

        document.body.removeChild(clone);

        const link = document.createElement("a");
        link.download = `${fileName}.png`;
        link.href = canvas.toDataURL("image/png", 1.0);
        link.click();

        toast({
          title: "Image Exported!",
          description: "Your certificate image has been downloaded.",
        });
      } catch (error) {
        console.error("Export error:", error);
        toast({
          title: "Export Failed",
          description: "There was an error exporting the certificate.",
          variant: "destructive",
        });
      } finally {
        setIsExporting(false);
      }
    },
    [toast]
  );

  return {
    exportToPDF,
    exportToImage,
    isExporting,
  };
}
