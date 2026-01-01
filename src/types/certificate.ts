export interface CertificateTemplate {
  id: string;
  name: string;
  thumbnailUrl: string;
  backgroundColor: string;
  borderStyle: "classic" | "modern" | "minimal" | "ornate";
  accentColor: string;
  showSeal: boolean;
  showQRCode: boolean;
}

export interface CertificateData {
  id?: string;
  certificateNumber: string;
  traineeName: string;
  certificateTitle: string;
  trainingProgramName: string;
  atcCode: string;
  dateOfIssue: string;
  placeOfIssue: string;
  chairpersonName: string;
  chairpersonTitle: string;
  legalDisclaimer: string;
  showSeal: boolean;
  showQRCode: boolean;
  templateId: string;
  status: "valid" | "revoked" | "expired";
  createdAt?: string;
}

export const defaultTemplates: CertificateTemplate[] = [
  {
    id: "classic-gold",
    name: "Classic Gold",
    thumbnailUrl: "",
    backgroundColor: "#FFFEF7",
    borderStyle: "classic",
    accentColor: "#C9A227",
    showSeal: true,
    showQRCode: true,
  },
  {
    id: "modern-navy",
    name: "Modern Navy",
    thumbnailUrl: "",
    backgroundColor: "#F8FAFC",
    borderStyle: "modern",
    accentColor: "#1E3A5F",
    showSeal: true,
    showQRCode: true,
  },
  {
    id: "minimal-elegant",
    name: "Minimal Elegant",
    thumbnailUrl: "",
    backgroundColor: "#FFFFFF",
    borderStyle: "minimal",
    accentColor: "#2D3748",
    showSeal: false,
    showQRCode: true,
  },
  {
    id: "ornate-traditional",
    name: "Ornate Traditional",
    thumbnailUrl: "",
    backgroundColor: "#FDF8F3",
    borderStyle: "ornate",
    accentColor: "#8B4513",
    showSeal: true,
    showQRCode: true,
  },
];

export const defaultCertificateData: Partial<CertificateData> = {
  certificateTitle: "This certificate is proudly presented for successfully completing the accredited training program",
  chairpersonName: "Dr. Marie Laurent",
  chairpersonTitle: "Chairperson of the Accreditation Board",
  legalDisclaimer: "Issued by a private accreditation body. Validity subject to official verification.",
  placeOfIssue: "French Republic",
  showSeal: true,
  showQRCode: true,
  templateId: "classic-gold",
  status: "valid",
};
