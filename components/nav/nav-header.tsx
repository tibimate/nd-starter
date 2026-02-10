"use client"
import { AudioWaveformIcon } from "lucide-react"
import {
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import clsx from "clsx"
import { siteConfig } from "@/config/site"

export function NavHeader() {

   const { state } = useSidebar()

  return (
    <SidebarMenu className="flex justify-center h-12">
      <SidebarMenuItem>
            <button className="flex items-center gap-2">
              <AudioWaveformIcon className="" />
              <span className={clsx(state !== "expanded" ? "hidden" : "visible")}>{siteConfig.name}</span>
            </button>
        </SidebarMenuItem>
    </SidebarMenu>
  )
}