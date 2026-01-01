import { motion } from "framer-motion";
import { Award, Calendar, FileText, Plus, TrendingUp, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const stats = [
  {
    title: "Total Certificates",
    value: "1,234",
    change: "+12%",
    icon: FileText,
    color: "bg-primary",
  },
  {
    title: "This Month",
    value: "56",
    change: "+8%",
    icon: Calendar,
    color: "bg-secondary",
  },
  {
    title: "Verifications Today",
    value: "89",
    change: "+23%",
    icon: TrendingUp,
    color: "bg-green-600",
  },
  {
    title: "Active Templates",
    value: "5",
    change: "0%",
    icon: Award,
    color: "bg-purple-600",
  },
];

const recentCertificates = [
  {
    id: "CERT-2024-003",
    holder: "Emily Johnson",
    title: "Data Science Fundamentals",
    date: "2024-12-28",
    status: "valid",
  },
  {
    id: "CERT-2024-002",
    holder: "Sarah Jane Williams",
    title: "Digital Marketing Fundamentals",
    date: "2024-08-20",
    status: "valid",
  },
  {
    id: "CERT-2024-001",
    holder: "John Michael Smith",
    title: "Advanced Web Development",
    date: "2024-06-15",
    status: "valid",
  },
];

export default function AdminDashboard() {
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
        {stats.map((stat, index) => (
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
                    <p className="mt-1 text-sm text-green-600">{stat.change} from last month</p>
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
                      Title
                    </th>
                    <th className="hidden pb-3 text-sm font-medium text-muted-foreground sm:table-cell">
                      Date
                    </th>
                    <th className="pb-3 text-sm font-medium text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {recentCertificates.map((cert) => (
                    <tr key={cert.id} className="hover:bg-muted/50">
                      <td className="py-4">
                        <span className="font-mono text-sm font-medium text-foreground">
                          {cert.id}
                        </span>
                      </td>
                      <td className="py-4">
                        <span className="text-sm text-foreground">{cert.holder}</span>
                      </td>
                      <td className="hidden py-4 md:table-cell">
                        <span className="text-sm text-muted-foreground">{cert.title}</span>
                      </td>
                      <td className="hidden py-4 sm:table-cell">
                        <span className="text-sm text-muted-foreground">
                          {new Date(cert.date).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="py-4">
                        <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium capitalize text-green-800">
                          {cert.status}
                        </span>
                      </td>
                    </tr>
                  ))}
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
          onClick={() => {}}
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
          onClick={() => {}}
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
          onClick={() => {}}
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-600">
              <Users className="h-6 w-6 text-white" />
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
