import { ClipboardMinus, Home, Inbox, Minus, Search, Settings } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import Image from "next/image";
import { Separator } from "@radix-ui/react-separator";
import { useSession } from "next-auth/react";

// Menu items.
const items = [
  {
    title: "Home",
    url: "/home",
    icon: Home,
  },
  {
    title: "Project",
    url: "/project",
    icon: Inbox,
  },
  {
    title: "Reports",
    url: "/reports",
    icon: ClipboardMinus,
  },
];

export function AppSidebar() {
  const { data: session } = useSession();
  return (
    <Sidebar>
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(/assets/pattern/configPattern.svg)`,
          backgroundRepeat: "repeat",
          backgroundSize: "8rem 8rem",
          opacity: 0.05, // Sesuaikan opacity sesuai kebutuhan
          zIndex: 0,
        }}
      />
      <SidebarContent>
        <SidebarGroup>
          <div className="py-4">
            <div className="flex justify-center">
              <Image
                src="/assets/storySet/profil.svg"
                alt="Logo"
                width={0}
                height={0}
                className="mb-4 w-[5rem] h-[5rem] rounded-full object-cover ring-2 ring-[#10375C]"
              />
            </div>
            <h1 className="font-bold text-center">
              Welcome, {session?.user?.name}{" "}
            </h1>
          </div>
          <SidebarSeparator />
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
