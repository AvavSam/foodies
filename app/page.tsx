"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { DestinationForm } from "@/components/destinations/destination-form";
import { FilterBar } from "@/components/destinations/filter-bar";
import { StatsSummary } from "@/components/destinations/stats-summary";
import { LoginForm } from "@/components/auth/login-form";
import { SetupPasswordForm } from "@/components/auth/setup-password-form";
import { useAuthStore } from "@/store/auth-store";
import { toast } from "sonner";
import { Destination } from "@/generated/prisma/browser";
import { Header } from "@/components/layout/header";
import { DestinationList } from "@/components/destinations/destination-list";
import { VisitData } from "@/components/destinations/destination-card";
import { useDestinations } from "@/hooks/use-destinations";
import { useAuthCheck } from "@/hooks/use-auth-check";

export default function Home() {
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [initialFormData, setInitialFormData] = useState<Destination | null>(null);

  // Filters
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [visitedFilter, setVisitedFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");

  const { isAuthenticated, isSetup, logout, setIsAuthenticated } = useAuthStore();

  // Custom hooks
  useAuthCheck();
  const { destinations, stats, loading, fetchDestinations, createDestination, updateDestination, deleteDestination, toggleVisited } = useDestinations({
    isAuthenticated,
    search,
    typeFilter,
    visitedFilter,
    priorityFilter,
  });

  const handleCreate = async (formData: Partial<Destination> & { visitDate?: string | Date | null; rating?: number | string | null }) => {
    try {
      await createDestination(formData);
      setFormOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Gagal membuat tempat");
    }
  };

  const handleUpdate = async (formData: Partial<Destination> & { visitDate?: string | Date | null; rating?: number | string | null }) => {
    if (!initialFormData?.id) return;
    try {
      await updateDestination(initialFormData.id, formData);
      setFormOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Gagal mengupdate tempat");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDestination(id);
      toast.success("Tempat berhasil dihapus");
    } catch (error) {
      console.error(error);
      toast.error("Gagal menghapus tempat");
    }
  };

  const handleToggleVisited = async (id: string, visited: boolean, data?: VisitData | Partial<Destination>) => {
    try {
      await toggleVisited(id, visited, data);
    } catch (error) {
      console.error(error);
      toast.error("Gagal mengubah status dikunjungi");
    }
  };

  const handleEdit = (destination: Destination) => {
    setInitialFormData(destination);
    setFormMode("edit");
    setFormOpen(true);
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
      logout();
      setIsAuthenticated(false);
      toast.success("Berhasil logout");
    } catch (error) {
      toast.error("Gagal logout");
      console.error("Logout error:", error);
    }
  };

  const handleResetFilters = () => {
    setSearch("");
    setTypeFilter("ALL");
    setVisitedFilter("ALL");
    setPriorityFilter("ALL");
  };

  // Show setup form if password not set
  if (!isSetup) {
    return <SetupPasswordForm />;
  }

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return <LoginForm />;
  }

  // Main Dashboard
  return (
    <div className="min-h-screen bg-background">
      <Header onRefresh={fetchDestinations} onLogout={handleLogout} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 md:px-6 lg:px-8 pb-24">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Selamat datang! 👋</h2>
          <p className="text-muted-foreground">Kelola daftar tempat jalan-jalan favorit kamu</p>
        </div>

        {/* Stats Summary */}
        {stats && <StatsSummary stats={stats} />}

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          {/* Add Button */}
          <Button
            onClick={() => {
              setInitialFormData(null);
              setFormMode("create");
              setFormOpen(true);
            }}
            className="h-12 px-6 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 rounded-xl font-medium"
          >
            <Plus className="mr-2 h-5 w-5" />
            Tambah Tempat Baru
          </Button>
        </div>

        {/* Filters */}
        <FilterBar
          search={search}
          onSearchChange={setSearch}
          type={typeFilter}
          onTypeChange={setTypeFilter}
          visited={visitedFilter}
          onVisitedChange={setVisitedFilter}
          priority={priorityFilter}
          onPriorityChange={setPriorityFilter}
          onReset={handleResetFilters}
          totalCount={destinations.length}
        />

        {/* Destinations List */}
        <DestinationList
          destinations={destinations}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleVisited={handleToggleVisited}
          onCreate={() => {
            setInitialFormData(null);
            setFormMode("create");
            setFormOpen(true);
          }}
        />
      </main>

      {/* Form Modal */}
      <DestinationForm open={formOpen} onClose={() => setFormOpen(false)} onSubmit={formMode === "create" ? handleCreate : handleUpdate} initialData={initialFormData} mode={formMode} />
    </div>
  );
}
