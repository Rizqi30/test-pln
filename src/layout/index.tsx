import MyAlertDialog from "@/components/Alert";
import { AppSidebar } from "@/components/AppSidebar";
import Navbar from "@/components/Navbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import _ from "lodash";
import { useSession } from "next-auth/react";
import React, { useEffect } from "react";

interface LayoutInterface {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutInterface> = ({ children }) => {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (_.isEmpty(session) && status !== "loading") {
      window.location.href = "/"; // Redirect ke halaman login jika tidak ada sesi
    }
  }, [session, status]);

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full min-h-screen bg-slate-200 p-4 flex flex-col gap-4">
        <div className="relative">
          <Navbar />
        </div>
        {/* <SidebarTrigger /> */}
        {children}
      </main>
      <MyAlertDialog />
    </SidebarProvider>
  );
};

export default Layout;
