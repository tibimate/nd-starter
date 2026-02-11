"use client"
import * as React from "react"
import {
  BarChart2Icon,
  ChartAreaIcon,
  LayoutDashboardIcon,
  LineChartIcon,
  Table2Icon,
  TableCellsMergeIcon,
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
import { NavCharts } from "./nav/nav-charts"
import { usePathname } from 'next/navigation'
import { title } from "process"
import { NavTables } from "./nav/nav-tables"


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

  const currentPage = usePathname()
  const data = {
    navMain: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboardIcon,
        isActive: currentPage === "/dashboard",
      },
    ],
    navCharts: [
      {
        title: "Area Chart",
        url: "/charts/area",
        icon: ChartAreaIcon,
        isActive: currentPage === "/charts/area",
      },
      {
        title: "Bar Chart",
        url: "/charts/bar",
        icon: BarChart2Icon,
        isActive: currentPage === "/charts/bar",
      },
      {
        title: "Line Chart",
        url: "/charts/line",
        icon: LineChartIcon,
        isActive: currentPage === "/charts/line",
      },
    ],
    navTables: [
      {
        title: "Data Tables",
        url: "/tables/data-tables",
        icon: TableCellsMergeIcon,
        isActive: currentPage === "/tables/data-tables",
      },
      {
        title: "Tables",
        url: "/tables/tables",
        icon: Table2Icon,
        isActive: currentPage === "/tables/tables",
      }
    ],
  }
  
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <NavHeader />
        <NavMain items={data.navMain} />
      </SidebarHeader>
      <SidebarContent>
        <NavCharts items={data.navCharts} />
        <NavTables items={data.navTables} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
