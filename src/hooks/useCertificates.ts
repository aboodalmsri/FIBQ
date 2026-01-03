import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

import { Json } from "@/integrations/supabase/types";

interface Certificate {
  id: string;
  certificate_number: string;
  trainee_name: string;
  training_program: string;
  training_center: string | null;
  issue_date: string;
  expiry_date: string | null;
  status: string;
  template_id: string | null;
  metadata: Json | null;
  created_at: string;
  updated_at: string;
}

interface CertificateStats {
  total: number;
  thisMonth: number;
  activeTemplates: number;
}

export function useCertificates() {
  const { toast } = useToast();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<CertificateStats>({
    total: 0,
    thisMonth: 0,
    activeTemplates: 0,
  });

  useEffect(() => {
    fetchCertificates();
    fetchStats();
  }, []);

  const fetchCertificates = async () => {
    setIsLoading(true);
    
    const { data, error } = await supabase
      .from("certificates")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (error) {
      console.error("Error fetching certificates:", error);
      setCertificates([]);
    } else {
      setCertificates(data || []);
    }
    
    setIsLoading(false);
  };

  const fetchStats = async () => {
    // Get total certificates
    const { count: totalCount } = await supabase
      .from("certificates")
      .select("*", { count: "exact", head: true });

    // Get this month's certificates
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    const { count: monthCount } = await supabase
      .from("certificates")
      .select("*", { count: "exact", head: true })
      .gte("created_at", startOfMonth.toISOString());

    // Get active templates count
    const { count: templatesCount } = await supabase
      .from("certificate_templates")
      .select("*", { count: "exact", head: true });

    setStats({
      total: totalCount || 0,
      thisMonth: monthCount || 0,
      activeTemplates: (templatesCount || 0) + 4, // +4 for default system templates
    });
  };

  const deleteCertificate = async (id: string) => {
    const certificate = certificates.find(c => c.id === id);
    
    const { error } = await supabase
      .from("certificates")
      .delete()
      .eq("id", id);
    
    if (error) {
      console.error("Error deleting certificate:", error);
      toast({
        title: "Error",
        description: "Failed to delete certificate. Please try again.",
        variant: "destructive",
      });
      return false;
    }
    
    setCertificates(prev => prev.filter(c => c.id !== id));
    
    toast({
      title: "Certificate Deleted",
      description: `Certificate ${certificate?.certificate_number || id} has been removed.`,
    });
    
    return true;
  };

  const updateCertificateStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from("certificates")
      .update({ status })
      .eq("id", id);
    
    if (error) {
      console.error("Error updating certificate:", error);
      toast({
        title: "Error",
        description: "Failed to update certificate. Please try again.",
        variant: "destructive",
      });
      return false;
    }
    
    setCertificates(prev => 
      prev.map(c => c.id === id ? { ...c, status } : c)
    );
    
    return true;
  };

  return {
    certificates,
    isLoading,
    stats,
    deleteCertificate,
    updateCertificateStatus,
    refreshCertificates: fetchCertificates,
  };
}
