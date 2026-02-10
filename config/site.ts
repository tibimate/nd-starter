import { SiteConfig } from "@/types"

import { env } from "@/env.mjs"

export const siteConfig: SiteConfig = {
  name: "ND Starter",
  author: "tibimate",
  description:
    "Next.js 16+ starter template with app router, shadcn/ui, typesafe env, icons and configs setup, next-auth for authentication and Django with DRF for the backend.",
  keywords: ["Next.js", "React", "Tailwind CSS", "Radix UI", "shadcn/ui", "Django", "DRF", "TypeScript", "Python"],
  url: {
    base: env.NEXT_PUBLIC_APP_URL,
    author: "https://tibi-projects.com",
  },
  links: {
    github: "https://github.com/tibimate/nd-starter",
  },
  ogImage: `${env.NEXT_PUBLIC_APP_URL}/og.jpg`,
}