import { motion } from "framer-motion";
import { Award, Calendar, FileText, Plus, TrendingUp, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCertificates } from "@/hooks/useCertificates";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { certificates, isLoading, stats } = useCertificates();

  const recentCertificates = certificates.slice(0, 5);

  const statsData = [
    {
      title: "Total Certificates",
      value: stats.total.toString(),
      change: "",
      icon: FileText,
      color: "bg-primary",
    },
    {
      title: "This Month",
      value: stats.thisMonth.toString(),
      change: "",
      icon: Calendar,
      color: "bg-secondary",
    },
    {
      title: "Verifications Today",
      value: "—",
      change: "",
      icon: TrendingUp,
      color: "bg-green-600",
    },
    {
      title: "Active Templates",
      value: stats.activeTemplates.toString(),
      change: "",
      icon: Award,
      color: "bg-purple-600",
    },
  ];

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
          <h1 className="font-heading text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="mt-1 text-muted-foreground">
            Welcome back! Here's an overview of your certificates.
          </p>
        </div>
        <Button asChild variant="gold" size="lg">
          <Link to="/admin/certificates/new">
            <Plus className="mr-2 h-4 w-4" />
            Create Certificate
          </Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statsData.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card variant="elevated" className="relative overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="mt-2 font-heading text-3xl font-bold text-foreground">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`rounded-xl p-3 ${stat.color}`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Recent Certificates */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card variant="default">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Certificates</CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link to="/admin/certificates">View All</Link>
            </Button>
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
                    <th className="hidden pb-3 text-sm font-medium text-muted-foreground md:table-cell">
                      Program
                    </th>
                    <th className="hidden pb-3 text-sm font-medium text-muted-foreground sm:table-cell">
                      Date
                    </th>
                    <th className="pb-3 text-sm font-medium text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {recentCertificates.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-muted-foreground">
                        No certificates yet. Create your first certificate!
                      </td>
                    </tr>
                  ) : (
                    recentCertificates.map((cert) => (
                      <tr key={cert.id} className="hover:bg-muted/50">
                        <td className="py-4">
                          <span className="font-mono text-sm font-medium text-foreground">
                            {cert.certificate_number}
                          </span>
                        </td>
                        <td className="py-4">
                          <span className="text-sm text-foreground">{cert.trainee_name}</span>
                        </td>
                        <td className="hidden py-4 md:table-cell">
                          <span className="text-sm text-muted-foreground">{cert.training_program}</span>
                        </td>
                        <td className="hidden py-4 sm:table-cell">
                          <span className="text-sm text-muted-foreground">
                            {new Date(cert.issue_date).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="py-4">
                          <span className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${
                            cert.status === "active" 
                              ? "bg-green-100 text-green-800" 
                              : cert.status === "expired"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-red-100 text-red-800"
                          }`}>
                            {cert.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8 grid gap-4 sm:grid-cols-3"
      >
        <Card
          variant="feature"
          className="cursor-pointer p-6 transition-shadow hover:shadow-lg"
          onClick={() => navigate("/admin/certificates/new")}
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
              <Plus className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-heading font-semibold text-foreground">New Certificate</h3>
              <p className="text-sm text-muted-foreground">Create and issue</p>
            </div>
          </div>
        </Card>

        <Card
          variant="feature"
          className="cursor-pointer p-6 transition-shadow hover:shadow-lg"
          onClick={() => navigate("/admin/certificates")}
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary">
              <FileText className="h-6 w-6 text-secondary-foreground" />
            </div>
            <div>
              <h3 className="font-heading font-semibold text-foreground">View All</h3>
              <p className="text-sm text-muted-foreground">Manage certificates</p>
            </div>
          </div>
        </Card>

        <Card
          variant="feature"
          className="cursor-pointer p-6 transition-shadow hover:shadow-lg"
          onClick={() => navigate("/admin/templates")}
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-600">
              <Award className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-heading font-semibold text-foreground">Templates</h3>
              <p className="text-sm text-muted-foreground">Manage designs</p>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
