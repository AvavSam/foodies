import { useState, useEffect, useCallback } from "react";
import { Destination } from "@/generated/prisma/browser";
import { VisitData } from "@/components/destinations/destination-card";
import { toast } from "sonner";

interface Stats {
  total: number;
  visited: number;
  unvisited: number;
  byType: {
    kuliner: number;
    hiburan: number;
    lainnya: number;
  };
}

interface UseDestinationsProps {
  isAuthenticated: boolean;
  search: string;
  typeFilter: string;
  visitedFilter: string;
  priorityFilter: string;
}

export function useDestinations({
  isAuthenticated,
  search,
  typeFilter,
  visitedFilter,
  priorityFilter,
}: UseDestinationsProps) {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDestinations = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (typeFilter !== "ALL") params.append("type", typeFilter);
      if (visitedFilter !== "ALL") params.append("visited", visitedFilter);
      if (priorityFilter !== "ALL") params.append("priority", priorityFilter);

      const response = await fetch(`/api/destinations?${params}`);
      if (response.ok) {
        const data = await response.json();
        setDestinations(data.data);
      }
    } catch (error) {
      console.error("Fetch destinations error:", error);
      toast.error("Gagal memuat data");
    } finally {
      setLoading(false);
    }
  }, [search, typeFilter, visitedFilter, priorityFilter]);

  const fetchStats = useCallback(async () => {
    try {
      const response = await fetch("/api/destinations/stats");
      if (response.ok) {
        const data = await response.json();
        setStats(data.data);
      }
    } catch (error) {
      console.error("Fetch stats error:", error);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchDestinations();
      fetchStats();
    }
  }, [isAuthenticated, fetchDestinations, fetchStats]);

  const createDestination = async (formData: Partial<Destination>) => {
    const response = await fetch("/api/destinations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
      credentials: "include",
    });

    if (!response.ok) throw new Error("Failed to create destination");

    await fetchDestinations();
    await fetchStats();
  };

  const updateDestination = async (id: string, formData: Partial<Destination>) => {
    const response = await fetch(`/api/destinations/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
      credentials: "include",
    });

    if (!response.ok) throw new Error("Failed to update destination");

    await fetchDestinations();
    await fetchStats();
  };

  const deleteDestination = async (id: string) => {
    const response = await fetch(`/api/destinations/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!response.ok) throw new Error("Failed to delete destination");

    await fetchDestinations();
    await fetchStats();
  };

  const toggleVisited = async (id: string, visited: boolean, data?: VisitData | Partial<Destination>) => {
    const response = await fetch(`/api/destinations/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visited, ...data }),
      credentials: "include",
    });

    if (!response.ok) throw new Error("Failed to toggle visited status");

    await fetchDestinations();
    await fetchStats();
  };

  return {
    destinations,
    stats,
    loading,
    fetchDestinations,
    fetchStats,
    createDestination,
    updateDestination,
    deleteDestination,
    toggleVisited,
  };
}
