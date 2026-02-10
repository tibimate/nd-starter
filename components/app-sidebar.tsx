"use client"
import * as React from "react"
import {
  LayoutDashboardIcon,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { NavMain } from "@/components/nav/nav-main"
import { NavUser } from "@/components/nav/nav-user"
import { NavHeader } from "./nav/nav-header"



export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

  const data = {
    navMain: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboardIcon,
        isActive: true,
      },
      
    ],
  }
  
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <NavHeader />
        <NavMain items={data.navMain} />
      </SidebarHeader>
      <SidebarContent>
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
