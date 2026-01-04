import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { 
  Edit, 
  Loader2, 
  MoreHorizontal, 
  Plus, 
  Shield, 
  ShieldOff, 
  Trash2, 
  UserCog,
  Eye,
  EyeOff,
  Users,
  UserCheck,
  UserX
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

interface AdminUser {
  id: string;
  user_id: string;
  email: string;
  full_name: string | null;
  status: string;
  created_at: string;
  is_super_admin: boolean;
}

const createAdminSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  fullName: z.string().min(1, "Full name is required"),
});

export default function AdminManagementPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<AdminUser | null>(null);
  const [deleteConfirmAdmin, setDeleteConfirmAdmin] = useState<AdminUser | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const fetchAdmins = useCallback(async () => {
    setIsLoading(true);
    
    // Get all users with admin role
    const { data: roles, error: rolesError } = await supabase
      .from("user_roles")
      .select("user_id, created_at")
      .eq("role", "admin");
    
    if (rolesError) {
      console.error("Error fetching admin roles:", rolesError);
      setIsLoading(false);
      return;
    }

    if (!roles || roles.length === 0) {
      setAdmins([]);
      setIsLoading(false);
      return;
    }

    // Get profiles for these users
    const userIds = roles.map(r => r.user_id);
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("*")
      .in("user_id", userIds);

    if (profilesError) {
      console.error("Error fetching profiles:", profilesError);
      setIsLoading(false);
      return;
    }

    // Find the earliest admin (super admin)
    const earliestRole = roles.reduce((earliest, current) => 
      new Date(current.created_at) < new Date(earliest.created_at) ? current : earliest
    );

    // Combine data
    const adminList: AdminUser[] = roles.map(role => {
      const profile = profiles?.find(p => p.user_id === role.user_id);
      return {
        id: profile?.id || role.user_id,
        user_id: role.user_id,
        email: profile?.full_name ? `${profile.full_name.toLowerCase().replace(/\s+/g, '.')}@admin` : "Unknown",
        full_name: profile?.full_name || "Unknown",
        status: profile?.status || "active",
        created_at: role.created_at,
        is_super_admin: role.user_id === earliestRole.user_id,
      };
    });

    // Check if current user is super admin
    if (user) {
      setIsSuperAdmin(earliestRole.user_id === user.id);
    }

    // Get actual emails from auth (we need to use a different approach)
    // For now, we'll just use the profile data
    setAdmins(adminList.sort((a, b) => 
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    ));
    setIsLoading(false);
  }, [user]);

  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  const validateForm = () => {
    try {
      createAdminSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleCreateAdmin = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);

    // Create the user via Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        emailRedirectTo: `${window.location.origin}/admin/login`,
        data: {
          full_name: formData.fullName,
        },
      },
    });

    if (authError || !authData.user) {
      toast({
        title: "Error",
        description: authError?.message || "Failed to create admin account.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    // Ensure profile exists (in case trigger didn't fire)
    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("id")
      .eq("user_id", authData.user.id)
      .single();

    if (!existingProfile) {
      const { error: profileError } = await supabase
        .from("profiles")
        .insert({
          user_id: authData.user.id,
          full_name: formData.fullName,
          status: "active",
        });

      if (profileError) {
        console.error("Error creating profile:", profileError);
      }
    } else {
      // Update existing profile with full name
      await supabase
        .from("profiles")
        .update({ full_name: formData.fullName })
        .eq("user_id", authData.user.id);
    }

    // Add admin role
    const { error: roleError } = await supabase
      .from("user_roles")
      .insert({
        user_id: authData.user.id,
        role: "admin",
      });

    if (roleError) {
      toast({
        title: "Error",
        description: "Failed to assign admin role.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    toast({
      title: "Admin Created",
      description: `${formData.fullName} has been added as an administrator.`,
    });

    setFormData({ email: "", password: "", fullName: "" });
    setIsCreateDialogOpen(false);
    setIsSubmitting(false);
    fetchAdmins();
  };

  const handleUpdateAdmin = async () => {
    if (!editingAdmin) return;
    
    setIsSubmitting(true);

    // First check if profile exists
    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("id")
      .eq("user_id", editingAdmin.user_id)
      .single();

    let error;
    if (!existingProfile) {
      // Create profile if it doesn't exist
      const result = await supabase
        .from("profiles")
        .insert({
          user_id: editingAdmin.user_id,
          full_name: formData.fullName,
          status: "active",
        });
      error = result.error;
    } else {
      // Update existing profile
      const result = await supabase
        .from("profiles")
        .update({ full_name: formData.fullName })
        .eq("user_id", editingAdmin.user_id);
      error = result.error;
    }

    if (error) {
      console.error("Error updating admin:", error);
      toast({
        title: "Error",
        description: "Failed to update admin.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    toast({
      title: "Admin Updated",
      description: "Administrator details have been updated.",
    });

    setIsEditDialogOpen(false);
    setEditingAdmin(null);
    setIsSubmitting(false);
    fetchAdmins();
  };

  const handleToggleStatus = async (admin: AdminUser) => {
    const newStatus = admin.status === "active" ? "suspended" : "active";
    
    // First check if profile exists
    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("id")
      .eq("user_id", admin.user_id)
      .single();

    let error;
    if (!existingProfile) {
      // Create profile if it doesn't exist
      const result = await supabase
        .from("profiles")
        .insert({
          user_id: admin.user_id,
          full_name: admin.full_name || "Admin",
          status: newStatus,
        });
      error = result.error;
    } else {
      // Update existing profile
      const result = await supabase
        .from("profiles")
        .update({ status: newStatus })
        .eq("user_id", admin.user_id);
      error = result.error;
    }

    if (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Error",
        description: "Failed to update admin status.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: newStatus === "active" ? "Admin Activated" : "Admin Suspended",
      description: `${admin.full_name} has been ${newStatus === "active" ? "activated" : "suspended"}.`,
    });

    fetchAdmins();
  };

  const handleDeleteAdmin = async () => {
    if (!deleteConfirmAdmin) return;

    // Remove admin role
    const { error } = await supabase
      .from("user_roles")
      .delete()
      .eq("user_id", deleteConfirmAdmin.user_id)
      .eq("role", "admin");

    if (error) {
      toast({
        title: "Error",
        description: "Failed to remove admin.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Admin Removed",
      description: `${deleteConfirmAdmin.full_name} is no longer an administrator.`,
    });

    setDeleteConfirmAdmin(null);
    fetchAdmins();
  };

  const openEditDialog = (admin: AdminUser) => {
    setEditingAdmin(admin);
    setFormData({
      email: "",
      password: "",
      fullName: admin.full_name || "",
    });
    setIsEditDialogOpen(true);
  };

  const activeAdmins = admins.filter(a => a.status === "active").length;
  const suspendedAdmins = admins.filter(a => a.status === "suspended").length;

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground">Admin Management</h1>
          <p className="mt-1 text-muted-foreground">
            Manage administrator accounts and permissions
          </p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="gold" size="lg">
              <Plus className="mr-2 h-4 w-4" />
              Add Admin
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Admin</DialogTitle>
              <DialogDescription>
                Add a new administrator to the system
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input
                  placeholder="Enter full name"
                  value={formData.fullName}
                  onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                  className={errors.fullName ? "border-destructive" : ""}
                />
                {errors.fullName && <p className="text-xs text-destructive">{errors.fullName}</p>}
              </div>

              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className={errors.email ? "border-destructive" : ""}
                />
                {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label>Password</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    className={`pr-10 ${errors.password ? "border-destructive" : ""}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="gold" onClick={handleCreateAdmin} disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Create Admin
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Admins</p>
                <p className="text-2xl font-bold">{admins.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/10">
                <UserCheck className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold">{activeAdmins}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-destructive/10">
                <UserX className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Suspended</p>
                <p className="text-2xl font-bold">{suspendedAdmins}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Admins Table */}
      <Card>
        <CardHeader>
          <CardTitle>Administrators</CardTitle>
          <CardDescription>
            All users with administrative access
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : admins.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No administrators found. Add your first admin to get started.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Added</TableHead>
                  <TableHead className="w-[70px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {admins.map((admin, index) => (
                  <motion.tr
                    key={admin.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                          {admin.full_name?.charAt(0) || "?"}
                        </div>
                        <div>
                          <p className="font-medium">{admin.full_name || "Unknown"}</p>
                          {admin.is_super_admin && (
                            <p className="text-xs text-muted-foreground">Super Admin</p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={admin.status === "active" ? "default" : "destructive"}
                        className={admin.status === "active" ? "bg-green-500/10 text-green-600 hover:bg-green-500/20" : ""}
                      >
                        {admin.status === "active" ? "Active" : "Suspended"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Shield className="h-4 w-4 text-secondary" />
                        <span>Admin</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(admin.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {!admin.is_super_admin && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openEditDialog(admin)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleToggleStatus(admin)}>
                              {admin.status === "active" ? (
                                <>
                                  <ShieldOff className="mr-2 h-4 w-4" />
                                  Suspend
                                </>
                              ) : (
                                <>
                                  <Shield className="mr-2 h-4 w-4" />
                                  Activate
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => setDeleteConfirmAdmin(admin)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Remove
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Admin</DialogTitle>
            <DialogDescription>
              Update administrator details
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input
                placeholder="Enter full name"
                value={formData.fullName}
                onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
              />
            </div>
          </div>

          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="gold" onClick={handleUpdateAdmin} disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteConfirmAdmin} onOpenChange={() => setDeleteConfirmAdmin(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Administrator?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove admin privileges from {deleteConfirmAdmin?.full_name}. 
              They will no longer be able to access the admin dashboard.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAdmin}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remove Admin
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
