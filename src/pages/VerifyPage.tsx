import { motion } from "framer-motion";
import { AlertCircle, Award, Calendar, CheckCircle, QrCode, Search, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QRCodeSVG } from "qrcode.react";

// Mock certificate data for demonstration
const mockCertificates: Record<string, {
  id: string;
  holderName: string;
  title: string;
  grade?: string;
  issueDate: string;
  status: "valid" | "revoked" | "expired";
  issuingAuthority: string;
}> = {
  "CERT-2024-001": {
    id: "CERT-2024-001",
    holderName: "John Michael Smith",
    title: "Advanced Web Development",
    grade: "Distinction",
    issueDate: "2024-06-15",
    status: "valid",
    issuingAuthority: "CertifyPro Academy",
  },
  "CERT-2024-002": {
    id: "CERT-2024-002",
    holderName: "Sarah Jane Williams",
    title: "Digital Marketing Fundamentals",
    grade: "Merit",
    issueDate: "2024-08-20",
    status: "valid",
    issuingAuthority: "CertifyPro Academy",
  },
  "CERT-2023-150": {
    id: "CERT-2023-150",
    holderName: "Robert Brown",
    title: "Project Management Professional",
    issueDate: "2023-03-10",
    status: "expired",
    issuingAuthority: "CertifyPro Academy",
  },
};

export default function VerifyPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchNumber, setSearchNumber] = useState(searchParams.get("number") || "");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<{
    found: boolean;
    certificate?: typeof mockCertificates["CERT-2024-001"];
  } | null>(null);

  useEffect(() => {
    const number = searchParams.get("number");
    if (number) {
      handleSearch(number);
    }
  }, []);

  const handleSearch = async (number?: string) => {
    const certNumber = number || searchNumber;
    if (!certNumber.trim()) return;

    setIsSearching(true);
    setSearchResult(null);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const certificate = mockCertificates[certNumber.trim().toUpperCase()];
    setSearchResult({
      found: !!certificate,
      certificate,
    });

    setSearchParams({ number: certNumber.trim() });
    setIsSearching(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "valid":
        return "bg-green-100 text-green-800 border-green-200";
      case "expired":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "revoked":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-primary py-16 md:py-24">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute right-1/3 top-1/3 h-64 w-64 rounded-full bg-secondary blur-3xl" />
        </div>
        <div className="container-page relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-3xl text-center"
          >
            <h1 className="mb-6 font-heading text-4xl font-bold text-primary-foreground md:text-5xl">
              Verify <span className="text-secondary">Certificate</span>
            </h1>
            <p className="mb-8 text-lg text-primary-foreground/80 md:text-xl">
              Enter your certificate number below or scan the QR code on your certificate
              for instant verification.
            </p>

            {/* Search Form */}
            <form onSubmit={handleSubmit} className="mx-auto max-w-xl">
              <Card variant="hero" className="p-2">
                <div className="flex flex-col gap-3 sm:flex-row">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-primary-foreground/50" />
                    <Input
                      variant="hero"
                      inputSize="lg"
                      placeholder="Enter certificate number (e.g., CERT-2024-001)"
                      value={searchNumber}
                      onChange={(e) => setSearchNumber(e.target.value)}
                      className="pl-12"
                    />
                  </div>
                  <Button
                    type="submit"
                    variant="hero"
                    size="lg"
                    disabled={isSearching}
                    className="shrink-0"
                  >
                    {isSearching ? "Searching..." : "Verify"}
                  </Button>
                </div>
              </Card>
            </form>

            <p className="mt-6 text-sm text-primary-foreground/60">
              <QrCode className="mr-2 inline-block h-4 w-4" />
              You can also scan the QR code printed on the certificate
            </p>
          </motion.div>
        </div>
      </section>

      {/* Results Section */}
      <section className="section-padding bg-background">
        <div className="container-page">
          {isSearching && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mx-auto max-w-2xl text-center"
            >
              <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-muted border-t-secondary" />
              <p className="mt-4 text-muted-foreground">Searching for certificate...</p>
            </motion.div>
          )}

          {searchResult && !isSearching && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mx-auto max-w-3xl"
            >
              {searchResult.found && searchResult.certificate ? (
                <Card variant="gold" className="overflow-hidden">
                  <CardHeader className="border-b border-border bg-muted/50 p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-green-100">
                          <CheckCircle className="h-8 w-8 text-green-600" />
                        </div>
                        <div>
                          <CardTitle className="text-xl text-foreground">
                            Certificate Verified
                          </CardTitle>
                          <p className="text-sm text-muted-foreground">
                            This certificate is authentic and officially issued.
                          </p>
                        </div>
                      </div>
                      <span
                        className={`rounded-full border px-4 py-1.5 text-sm font-medium capitalize ${getStatusColor(
                          searchResult.certificate.status
                        )}`}
                      >
                        {searchResult.certificate.status}
                      </span>
                    </div>
                  </CardHeader>

                  <CardContent className="p-6">
                    <div className="grid gap-8 md:grid-cols-3">
                      {/* Certificate Details */}
                      <div className="space-y-6 md:col-span-2">
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <User className="h-4 w-4" />
                              Certificate Holder
                            </div>
                            <p className="font-heading text-lg font-semibold text-foreground">
                              {searchResult.certificate.holderName}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Award className="h-4 w-4" />
                              Certificate Title
                            </div>
                            <p className="font-heading text-lg font-semibold text-foreground">
                              {searchResult.certificate.title}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Calendar className="h-4 w-4" />
                              Issue Date
                            </div>
                            <p className="font-medium text-foreground">
                              {new Date(
                                searchResult.certificate.issueDate
                              ).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </p>
                          </div>
                          {searchResult.certificate.grade && (
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <CheckCircle className="h-4 w-4" />
                                Grade/Result
                              </div>
                              <p className="font-medium text-foreground">
                                {searchResult.certificate.grade}
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="rounded-lg border border-border bg-muted/30 p-4">
                          <p className="text-sm text-muted-foreground">
                            <strong className="text-foreground">Certificate Number:</strong>{" "}
                            {searchResult.certificate.id}
                          </p>
                          <p className="mt-1 text-sm text-muted-foreground">
                            <strong className="text-foreground">Issuing Authority:</strong>{" "}
                            {searchResult.certificate.issuingAuthority}
                          </p>
                        </div>
                      </div>

                      {/* QR Code */}
                      <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-card p-6">
                        <QRCodeSVG
                          value={`${window.location.origin}/verify?number=${searchResult.certificate.id}`}
                          size={140}
                          level="H"
                          includeMargin
                          className="rounded-lg"
                        />
                        <p className="mt-3 text-center text-xs text-muted-foreground">
                          Scan to verify
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card variant="default" className="border-destructive/20">
                  <CardHeader className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-destructive/10">
                        <AlertCircle className="h-8 w-8 text-destructive" />
                      </div>
                      <div>
                        <CardTitle className="text-xl text-foreground">
                          Certificate Not Found
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          We couldn't find a certificate with the number you provided.
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 pt-0">
                    <div className="rounded-lg bg-muted p-4">
                      <p className="text-sm text-muted-foreground">
                        <strong className="text-foreground">Tips:</strong>
                      </p>
                      <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-muted-foreground">
                        <li>Check that you've entered the certificate number correctly</li>
                        <li>Certificate numbers are case-sensitive</li>
                        <li>Try scanning the QR code on the physical certificate</li>
                        <li>Contact support if you believe this is an error</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          )}

          {/* Demo Info */}
          {!searchResult && !isSearching && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mx-auto max-w-2xl"
            >
              <Card variant="feature" className="p-6">
                <div className="text-center">
                  <QrCode className="mx-auto mb-4 h-12 w-12 text-secondary" />
                  <h3 className="mb-2 font-heading text-xl font-semibold text-foreground">
                    How to Verify
                  </h3>
                  <p className="mb-6 text-muted-foreground">
                    Enter your certificate number in the search field above or scan the QR code
                    printed on your certificate.
                  </p>
                  <div className="rounded-lg bg-muted p-4 text-left">
                    <p className="text-sm font-medium text-foreground">
                      Demo Certificate Numbers:
                    </p>
                    <ul className="mt-2 space-y-1 font-mono text-sm text-muted-foreground">
                      <li>• CERT-2024-001 (Valid)</li>
                      <li>• CERT-2024-002 (Valid)</li>
                      <li>• CERT-2023-150 (Expired)</li>
                    </ul>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </div>
      </section>
    </>
  );
}
