"use client";

import { type ReactNode } from "react";
import { QueryProvider } from "./query-provider";
import { Toaster } from "@/components/ui/sonner";

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  return (
    <QueryProvider>
      {children}
      <Toaster
        position='top-right'
        richColors
        closeButton
        expand={false}
        visibleToasts={5}
      />
    </QueryProvider>
  );
}
