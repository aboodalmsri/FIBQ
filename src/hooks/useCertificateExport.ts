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
        const canvas = await html2canvas(element, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: null,
        });

        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF({
          orientation: "landscape",
          unit: "px",
          format: [canvas.width / 2, canvas.height / 2],
        });

        pdf.addImage(imgData, "PNG", 0, 0, canvas.width / 2, canvas.height / 2);
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
        const canvas = await html2canvas(element, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: null,
        });

        const link = document.createElement("a");
        link.download = `${fileName}.png`;
        link.href = canvas.toDataURL("image/png");
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
