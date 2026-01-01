export type CertificateType = "trainee" | "accredited-center" | "trainer";

export interface TemplateElement {
  id: string;
  type: "text" | "image" | "qrcode" | "seal" | "line" | "logo";
  x: number; // percentage from left
  y: number; // percentage from top
  width: number; // percentage
  height: number; // percentage for images/seal
  content?: string; // for text elements or placeholder name
  placeholder?: string; // data field to map (e.g., "traineeName", "certificateNumber")
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: "normal" | "bold" | "semibold";
  fontStyle?: "normal" | "italic";
  textAlign?: "left" | "center" | "right";
  color?: string;
  visible?: boolean;
}

export interface CertificateTemplate {
  id: string;
  name: string;
  thumbnailUrl: string;
  backgroundColor: string;
  backgroundImage?: string;
  borderStyle: "classic" | "modern" | "minimal" | "ornate" | "none";
  accentColor: string;
  showSeal: boolean;
  showQRCode: boolean;
  fontFamily?: string;
  certificateType?: CertificateType;
  width: number; // in pixels
  height: number; // in pixels
  elements: TemplateElement[];
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
  // Additional fields for different certificate types
  centerName?: string;
  centerLogo?: string;
  trainerName?: string;
  trainerPhoto?: string;
}

export const certificateTypeLabels: Record<CertificateType, string> = {
  trainee: "Trainee Certificate",
  "accredited-center": "Accredited Center Certificate",
  trainer: "Trainer Accreditation Certificate",
};

// Available placeholders that can be mapped to template elements
export const availablePlaceholders = [
  { key: "traineeName", label: "Trainee/Trainer Name" },
  { key: "certificateTitle", label: "Certificate Title" },
  { key: "trainingProgramName", label: "Training Program Name" },
  { key: "certificateNumber", label: "Certificate Number" },
  { key: "atcCode", label: "ATC Code" },
  { key: "dateOfIssue", label: "Date of Issue" },
  { key: "placeOfIssue", label: "Place of Issue" },
  { key: "chairpersonName", label: "Chairperson Name" },
  { key: "chairpersonTitle", label: "Chairperson Title" },
  { key: "legalDisclaimer", label: "Legal Disclaimer" },
  { key: "centerName", label: "Center Name" },
  { key: "certificateTypeLabel", label: "Certificate Type Label" },
];

// Default elements for a new template
export const defaultTemplateElements: TemplateElement[] = [
  {
    id: "header",
    type: "text",
    x: 50,
    y: 8,
    width: 80,
    height: 5,
    content: "CERTIFICATE",
    fontSize: 36,
    fontFamily: "Playfair Display",
    fontWeight: "bold",
    textAlign: "center",
    color: "#C9A227",
  },
  {
    id: "subtitle",
    type: "text",
    x: 50,
    y: 14,
    width: 80,
    height: 3,
    placeholder: "certificateTypeLabel",
    fontSize: 12,
    fontFamily: "Inter",
    fontWeight: "normal",
    textAlign: "center",
    color: "#666666",
  },
  {
    id: "photo",
    type: "image",
    x: 50,
    y: 24,
    width: 12,
    height: 15,
    placeholder: "traineePhoto",
  },
  {
    id: "description",
    type: "text",
    x: 50,
    y: 42,
    width: 70,
    height: 5,
    placeholder: "certificateTitle",
    fontSize: 14,
    fontFamily: "Inter",
    fontWeight: "normal",
    fontStyle: "italic",
    textAlign: "center",
    color: "#555555",
  },
  {
    id: "name",
    type: "text",
    x: 50,
    y: 52,
    width: 80,
    height: 6,
    placeholder: "traineeName",
    fontSize: 32,
    fontFamily: "Playfair Display",
    fontWeight: "bold",
    textAlign: "center",
    color: "#C9A227",
  },
  {
    id: "divider",
    type: "line",
    x: 50,
    y: 60,
    width: 30,
    height: 1,
    color: "#C9A227",
  },
  {
    id: "program-label",
    type: "text",
    x: 50,
    y: 64,
    width: 50,
    height: 3,
    content: "for completing",
    fontSize: 12,
    fontFamily: "Inter",
    textAlign: "center",
    color: "#666666",
  },
  {
    id: "program",
    type: "text",
    x: 50,
    y: 69,
    width: 70,
    height: 5,
    placeholder: "trainingProgramName",
    fontSize: 20,
    fontFamily: "Playfair Display",
    fontWeight: "semibold",
    textAlign: "center",
    color: "#C9A227",
  },
  {
    id: "cert-number",
    type: "text",
    x: 20,
    y: 78,
    width: 25,
    height: 5,
    placeholder: "certificateNumber",
    fontSize: 12,
    fontFamily: "monospace",
    fontWeight: "semibold",
    textAlign: "center",
    color: "#333333",
  },
  {
    id: "atc-code",
    type: "text",
    x: 50,
    y: 78,
    width: 25,
    height: 5,
    placeholder: "atcCode",
    fontSize: 12,
    fontFamily: "monospace",
    fontWeight: "semibold",
    textAlign: "center",
    color: "#333333",
  },
  {
    id: "date",
    type: "text",
    x: 80,
    y: 78,
    width: 25,
    height: 5,
    placeholder: "dateOfIssue",
    fontSize: 12,
    fontFamily: "Inter",
    fontWeight: "semibold",
    textAlign: "center",
    color: "#333333",
  },
  {
    id: "qrcode",
    type: "qrcode",
    x: 12,
    y: 88,
    width: 10,
    height: 12,
  },
  {
    id: "signature",
    type: "text",
    x: 50,
    y: 88,
    width: 30,
    height: 8,
    placeholder: "chairpersonName",
    fontSize: 14,
    fontFamily: "Inter",
    fontWeight: "semibold",
    textAlign: "center",
    color: "#333333",
  },
  {
    id: "signature-title",
    type: "text",
    x: 50,
    y: 94,
    width: 35,
    height: 3,
    placeholder: "chairpersonTitle",
    fontSize: 10,
    fontFamily: "Inter",
    textAlign: "center",
    color: "#666666",
  },
  {
    id: "seal",
    type: "seal",
    x: 88,
    y: 86,
    width: 12,
    height: 14,
  },
  {
    id: "disclaimer",
    type: "text",
    x: 50,
    y: 98,
    width: 80,
    height: 2,
    placeholder: "legalDisclaimer",
    fontSize: 8,
    fontFamily: "Inter",
    fontStyle: "italic",
    textAlign: "center",
    color: "#888888",
  },
];

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
    width: 800,
    height: 566,
    elements: defaultTemplateElements,
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
    width: 800,
    height: 566,
    elements: defaultTemplateElements.map(el => ({
      ...el,
      color: el.color?.replace("#C9A227", "#1E3A5F"),
    })),
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
    width: 800,
    height: 566,
    elements: defaultTemplateElements.map(el => ({
      ...el,
      color: el.color?.replace("#C9A227", "#2D3748"),
    })),
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
    width: 800,
    height: 566,
    elements: defaultTemplateElements.map(el => ({
      ...el,
      color: el.color?.replace("#C9A227", "#8B4513"),
    })),
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
