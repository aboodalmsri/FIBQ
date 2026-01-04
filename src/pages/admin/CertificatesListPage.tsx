import { motion } from "framer-motion";
import { Edit, Eye, Loader2, MoreHorizontal, Plus, Search, Trash2 } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCertificates } from "@/hooks/useCertificates";

export default function CertificatesListPage() {
  const { certificates, isLoading, deleteCertificate } = useCertificates();
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredCertificates = certificates.filter(
    (cert) =>
      cert.certificate_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.trainee_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.training_program.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    await deleteCertificate(id);
    setDeletingId(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "expired":
        return "bg-amber-100 text-amber-800";
      case "revoked":
        return "bg-red-100 text-red-800";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground">All Certificates</h1>
          <p className="mt-1 text-muted-foreground">
            Manage and view all issued certificates.
          </p>
        </div>
        <Button asChild variant="gold" size="lg">
          <Link to="/admin/certificates/new">
            <Plus className="mr-2 h-4 w-4" />
            Create Certificate
          </Link>
        </Button>
      </div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            variant="search"
            placeholder="Search by certificate number, holder, or program..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </motion.div>

      {/* Certificates Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card variant="default">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Certificates ({filteredCertificates.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="pb-3 text-sm font-medium text-muted-foreground">
                      Certificate #
                    </th>
                    <th className="pb-3 text-sm font-medium text-muted-foreground">Holder</th>
                    <th className="hidden pb-3 text-sm font-medium text-muted-foreground lg:table-cell">
                      Program
                    </th>
                    <th className="hidden pb-3 text-sm font-medium text-muted-foreground md:table-cell">
                      Center
                    </th>
                    <th className="hidden pb-3 text-sm font-medium text-muted-foreground sm:table-cell">
                      Date
                    </th>
                    <th className="pb-3 text-sm font-medium text-muted-foreground">Status</th>
                    <th className="pb-3 text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredCertificates.map((cert) => (
                    <tr key={cert.id} className="hover:bg-muted/50">
                      <td className="py-4">
                        <span className="font-mono text-sm font-medium text-foreground">
                          {cert.certificate_number}
                        </span>
                      </td>
                      <td className="py-4">
                        <span className="text-sm text-foreground">{cert.trainee_name}</span>
                      </td>
                      <td className="hidden py-4 lg:table-cell">
                        <span className="text-sm text-muted-foreground">{cert.training_program}</span>
                      </td>
                      <td className="hidden py-4 md:table-cell">
                        <span className="text-sm text-muted-foreground">{cert.training_center || "—"}</span>
                      </td>
                      <td className="hidden py-4 sm:table-cell">
                        <span className="text-sm text-muted-foreground">
                          {new Date(cert.issue_date).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="py-4">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${getStatusColor(
                            cert.status
                          )}`}
                        >
                          {cert.status}
                        </span>
                      </td>
                      <td className="py-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link
                                to={`/verify?number=${cert.certificate_number}`}
                                target="_blank"
                                className="flex items-center gap-2"
                              >
                                <Eye className="h-4 w-4" />
                                View
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild className="flex items-center gap-2">
                              <Link to={`/admin/certificates/${cert.id}/edit`}>
                                <Edit className="h-4 w-4" />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="flex items-center gap-2 text-destructive"
                              onClick={() => handleDelete(cert.id)}
                              disabled={deletingId === cert.id}
                            >
                              {deletingId === cert.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredCertificates.length === 0 && (
                <div className="py-12 text-center">
                  <p className="text-muted-foreground">
                    {certificates.length === 0 
                      ? "No certificates yet. Create your first certificate!"
                      : "No certificates found matching your search."
                    }
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
