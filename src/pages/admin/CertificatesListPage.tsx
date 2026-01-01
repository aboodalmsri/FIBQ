import { motion } from "framer-motion";
import { Edit, Eye, MoreHorizontal, Plus, Search, Trash2 } from "lucide-react";
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
import { useToast } from "@/hooks/use-toast";

const mockCertificates = [
  {
    id: "CERT-2024-003",
    holder: "Emily Johnson",
    title: "Data Science Fundamentals",
    grade: "Distinction",
    date: "2024-12-28",
    status: "valid",
  },
  {
    id: "CERT-2024-002",
    holder: "Sarah Jane Williams",
    title: "Digital Marketing Fundamentals",
    grade: "Merit",
    date: "2024-08-20",
    status: "valid",
  },
  {
    id: "CERT-2024-001",
    holder: "John Michael Smith",
    title: "Advanced Web Development",
    grade: "Distinction",
    date: "2024-06-15",
    status: "valid",
  },
  {
    id: "CERT-2023-150",
    holder: "Robert Brown",
    title: "Project Management Professional",
    grade: "Pass",
    date: "2023-03-10",
    status: "expired",
  },
  {
    id: "CERT-2023-089",
    holder: "Alice Chen",
    title: "Cloud Computing Essentials",
    grade: "Merit",
    date: "2023-01-15",
    status: "valid",
  },
];

export default function CertificatesListPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [certificates, setCertificates] = useState(mockCertificates);

  const filteredCertificates = certificates.filter(
    (cert) =>
      cert.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.holder.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (id: string) => {
    setCertificates(certificates.filter((cert) => cert.id !== id));
    toast({
      title: "Certificate Deleted",
      description: `Certificate ${id} has been removed.`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "valid":
        return "bg-green-100 text-green-800";
      case "expired":
        return "bg-amber-100 text-amber-800";
      case "revoked":
        return "bg-red-100 text-red-800";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

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
            placeholder="Search by certificate number, holder, or title..."
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
                      Title
                    </th>
                    <th className="hidden pb-3 text-sm font-medium text-muted-foreground md:table-cell">
                      Grade
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
                          {cert.id}
                        </span>
                      </td>
                      <td className="py-4">
                        <span className="text-sm text-foreground">{cert.holder}</span>
                      </td>
                      <td className="hidden py-4 lg:table-cell">
                        <span className="text-sm text-muted-foreground">{cert.title}</span>
                      </td>
                      <td className="hidden py-4 md:table-cell">
                        <span className="text-sm text-muted-foreground">{cert.grade}</span>
                      </td>
                      <td className="hidden py-4 sm:table-cell">
                        <span className="text-sm text-muted-foreground">
                          {new Date(cert.date).toLocaleDateString()}
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
                                to={`/verify?number=${cert.id}`}
                                target="_blank"
                                className="flex items-center gap-2"
                              >
                                <Eye className="h-4 w-4" />
                                View
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex items-center gap-2">
                              <Edit className="h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="flex items-center gap-2 text-destructive"
                              onClick={() => handleDelete(cert.id)}
                            >
                              <Trash2 className="h-4 w-4" />
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
                  <p className="text-muted-foreground">No certificates found.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
