"use client"
import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
} from "lucide-react"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { signOut, useSession } from "next-auth/react"
import axiosInstance from "@/lib/axiosInstance"
import { ModeToggle } from "../mode-toggle"
import Link from "next/link"
export function NavUser() {
  
  const { isMobile } = useSidebar()
  const { data: session } = useSession()
  
  const logout = async () => {
    if (!session) return;

    await axiosInstance.post(`/logout/`, {refresh: session.user.refresh}).then((response) => {
      console.log(response)
    }).catch((error) => {
      console.log("error", error)
    }).finally(() => {
      signOut({ callbackUrl: "/auth/login" })
    })
      
  }
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={session?.user?.profile.avatar_thumbnails?.small || "https://avatars.githubusercontent.com/u/1?v=4"} alt={session?.user?.profile.user.username} />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{session?.user?.profile.user.username || "John Doe"}</span>
                <span className="truncate text-xs">{session?.user?.profile.user.email || "john.doe@example.com"}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={session?.user?.profile.avatar_thumbnails?.small || "https://avatars.githubusercontent.com/u/1?v=4"} alt={session?.user?.profile.user.username} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{session?.user?.profile.user.username || "John Doe"}</span>
                  <span className="truncate text-xs">{session?.user?.profile.user.email || "john.doe@example.com"}</span>
                </div>
                <ModeToggle />
              </div>
            </DropdownMenuLabel>
            
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Link href={"/account"} className="flex items-center gap-2 w-full h-full">
                <BadgeCheck />
                Account
                </Link>
              </DropdownMenuItem>
              
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}