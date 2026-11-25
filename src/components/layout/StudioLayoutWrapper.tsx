"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileTabBar } from "@/components/layout/MobileTabBar";
import { CreateContentModal } from "@/components/modals/CreateContentModal";
import { useAuth } from "@/context/AuthContext";
import { StudioAuthGate } from "@/components/auth/StudioAuthGate";

export function StudioLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();

  // If this is the public landing page (root `/`), render completely standalone
  const isPublicPage = pathname === "/";

  if (isPublicPage) {
    return <main className="min-h-screen bg-[#07070A] text-white">{children}</main>;
  }

  // If user is accessing studio but is not authenticated, show secure login gate
  if (!isAuthenticated) {
    return <StudioAuthGate />;
  }

  // Authenticated Studio Experience
  return (
    <>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 ml-0 md:ml-[256px] min-w-0 transition-all pb-28 md:pb-6">
          {children}
        </div>
      </div>
      <MobileTabBar />
      <CreateContentModal />
    </>
  );
}
