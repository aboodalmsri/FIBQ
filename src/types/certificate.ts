export type CertificateType = "trainee" | "accredited-center" | "trainer";

export interface CertificateTemplate {
  id: string;
  name: string;
  thumbnailUrl: string;
  backgroundColor: string;
  borderStyle: "classic" | "modern" | "minimal" | "ornate";
  accentColor: string;
  showSeal: boolean;
  showQRCode: boolean;
  fontFamily?: string;
  certificateType?: CertificateType;
}

export interface CertificateData {
  id?: string;
  certificateNumber: string;
  traineeName: string;
  traineePhoto?: string;
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
  certificateType: CertificateType;
}

export const certificateTypeLabels: Record<CertificateType, string> = {
  trainee: "Trainee Certificate",
  "accredited-center": "Accredited Center Certificate",
  trainer: "Trainer Accreditation Certificate",
};

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
  certificateType: "trainee",
};

// Generate certificate number in FIBQ-XXXX-XXXX format
export function generateCertificateNumber(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const part1 = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  const part2 = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  return `FIBQ-${part1}-${part2}`;
}

// Validate certificate number format
export function isValidCertificateNumber(number: string): boolean {
  return /^FIBQ-[A-Z0-9]{4}-[A-Z0-9]{4}$/i.test(number);
}

// Generate ATC code
export function generateATCCode(): string {
  const num = Math.floor(Math.random() * 9000) + 1000;
  return `ATC-${num}`;
}
