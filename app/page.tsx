"use client"

import Link from "next/link"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { ModeToggle } from "@/components/mode-toggle"
import { useSession, signOut } from "next-auth/react"
import axiosInstance from "@/lib/axiosInstance"

export default function Home() {
  const { data: session } = useSession();

  const logout = async () => {
    if (!session) return;

    await axiosInstance.post(`/logout/`, {refresh: session.user.refresh}).then(() => {
    }).catch((error) => {
      console.log("error", error)
    }).finally(() => {
      signOut({ callbackUrl: "/auth/login" })
    })
      
  }

  return (
    <main className="flex min-h-svh w-full items-center justify-center bg-background text-foreground">
      <section className="pointer-events-auto fixed top-0 z-50 flex h-16 items-center justify-center bg-background w-full">
        <div className="container">
          <div className="flex items-center justify-between gap-8">
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center gap-2">
                <Icons.logo className="h-6 w-6" />
                <span className="hidden font-bold sm:inline-block">
                  {siteConfig.name}
                </span>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <ModeToggle />
              {session ? (
                <>
                  <Link href="/dashboard" className={cn(buttonVariants({ variant: 'secondary' }))}>
                    Dashboard
                  </Link>
                  <button onClick={logout} className={cn(buttonVariants({ variant: 'ghost' }))}>
                    Logout
                  </button>
                </>
              ) : (
                <Link href="/auth/login" className={cn(buttonVariants({ variant: "outline" }))}>
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>
      <div className="container relative pt-32">
        <div className="mx-auto flex w-full flex-col items-center gap-6 text-center">
          <Icons.logo className="h-12 w-12" />
          <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
            Welcome to {siteConfig.name}
          </h1>
          <p className="max-w-xl text-lg text-muted-foreground">
            {siteConfig.description}
          </p>
          <div className="flex items-center gap-4">
            <Link href={session ? "/dashboard" : "/auth/login"} className={cn(buttonVariants())}>
              Get Started
            </Link>
            <a href="https://github.com/tibimate/nd-starter" className={cn(buttonVariants({ variant: "outline" }))} target="_black">
              View on GitHub
            </a>
          </div>
        </div>
      </div>

    </main>
  )
}