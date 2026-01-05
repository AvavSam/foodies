import { useEffect } from "react";
import { useAuthStore } from "@/store/auth-store";

export function useAuthCheck() {
  const { setIsSetup, setIsAuthenticated } = useAuthStore();

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await fetch("/api/auth/check-setup");
        const data = await response.json();
        setIsSetup(data.isSetup);

        // Simple auth check by trying to fetch destinations
        const destResponse = await fetch("/api/destinations");
        if (destResponse.ok) {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Auth check error:", error);
      }
    };

    checkAuthStatus();
  }, [setIsSetup, setIsAuthenticated]);
}
