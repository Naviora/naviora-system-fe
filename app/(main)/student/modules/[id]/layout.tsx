'use client'

import { ModuleDetailSidebar } from "@/components/student/modules/module-detail-sidebar";

export default function ModuleDetailLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <ModuleDetailSidebar />
      <main className="flex-grow p-6">
        {children}
      </main>
    </div>
  );
}
