"use client"

import { EllipsisIcon, TrendingUp, type LucideIcon } from "lucide-react"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"

export function NavCharts({
  items,
}: {
  items: {
    title: string
    url: string
    icon: LucideIcon
    isActive?: boolean
  }[]
}) {
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Charts</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton asChild isActive={item.isActive}>
              <Link href={item.url}>
                <item.icon />
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
        <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a href="https://ui.shadcn.com/charts" target="_blank" rel="noopener noreferrer">
                <EllipsisIcon />
                <span className="text-zinc-600">More</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  )
}