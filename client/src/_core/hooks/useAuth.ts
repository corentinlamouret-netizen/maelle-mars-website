import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { TRPCClientError } from "@trpc/client";
import { useCallback, useEffect, useMemo } from "react";

type UseAuthOptions = {
  redirectOnUnauthenticated?: boolean;
  redirectPath?: string;
};

export function useAuth(options?: UseAuthOptions) {
  const { redirectOnUnauthenticated = false, redirectPath = getLoginUrl() } =
    options ?? {};
  const utils = trpc.useUtils();

  const meQuery = trpc.auth.me.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
  });

  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => {
      utils.auth.me.setData(undefined, null);
    },
  });

  const logout = useCallback(async () => {
    try {
      // Clear cache immediately before logout
      utils.auth.me.setData(undefined, null);
      await utils.auth.me.invalidate();
      
      // Set logout flag in sessionStorage (survives page reload)
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('manus-logout-in-progress', 'true');
      }
      
      // Call logout endpoint
      await logoutMutation.mutateAsync();
    } catch (error: unknown) {
      if (
        error instanceof TRPCClientError &&
        error.data?.code === "UNAUTHORIZED"
      ) {
        // Already logged out
      } else {
        console.error('Logout error:', error);
      }
    } finally {
      // Redirect to home after logout
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('manus-logout-in-progress');
        // Force full page reload to clear all state
        window.location.href = '/?logout=true';
      }
    }
  }, [logoutMutation, utils]);

  const state = useMemo(() => {
    localStorage.setItem(
      "manus-runtime-user-info",
      JSON.stringify(meQuery.data)
    );
    return {
      user: meQuery.data ?? null,
      loading: meQuery.isLoading || logoutMutation.isPending,
      error: meQuery.error ?? logoutMutation.error ?? null,
      isAuthenticated: Boolean(meQuery.data),
    };
  }, [
    meQuery.data,
    meQuery.error,
    meQuery.isLoading,
    logoutMutation.error,
    logoutMutation.isPending,
  ]);

  useEffect(() => {
    if (!redirectOnUnauthenticated) return;
    if (meQuery.isLoading || logoutMutation.isPending) return;
    if (state.user) return;
    if (typeof window === "undefined") return;
    if (window.location.pathname === redirectPath) return;
    
    // Don't redirect if logout is in progress or if user just logged out
    const logoutInProgress = sessionStorage.getItem('manus-logout-in-progress');
    const urlParams = new URLSearchParams(window.location.search);
    const isLogoutPage = urlParams.get('logout') === 'true';
    
    if (logoutInProgress || isLogoutPage) {
      return;
    }

    window.location.href = redirectPath
  }, [
    redirectOnUnauthenticated,
    redirectPath,
    logoutMutation.isPending,
    meQuery.isLoading,
    state.user,
  ]);

  return {
    ...state,
    refresh: () => meQuery.refetch(),
    logout,
  };
}
