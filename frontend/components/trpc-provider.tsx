"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import React, { useState } from "react";
import { trpc } from "@/lib/trpc";

function getTrpcUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_TRPC_URL?.trim();

  if (configuredUrl) {
    return configuredUrl.endsWith("/trpc") ? configuredUrl : `${configuredUrl.replace(/\/$/, "")}/trpc`;
  }

  if (typeof window !== "undefined") {
    return `${window.location.origin.replace(/\/$/, "")}/trpc`;
  }

  return "http://127.0.0.1:3006/trpc";
}

export function TRPCProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: getTrpcUrl(),
          headers() {
            const token = localStorage.getItem('token');
            return token ? { Authorization: `Bearer ${token}` } : {};
          },
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
}
