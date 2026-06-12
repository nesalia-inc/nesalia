'use client'

import * as React from "react"
import Link from "next/link"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

import { Check, ChevronsUpDown, Building2, Plus, Home } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { authClient } from "@/lib/auth-client"

interface Organization {
  id: string
  name: string
  slug: string
  createdAt: Date
  logo?: string | null
  metadata?: unknown
  role?: string
}

function OrgSwitcher({ currentSlug }: { currentSlug?: string }) {
  const [organizations, setOrganizations] = React.useState<Organization[]>([])
  const [loading, setLoading] = React.useState(true)
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    authClient.organization.list()
      .then((response) => {
        if (response?.data) {
          setOrganizations(response.data)
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const currentOrg = organizations.find((o) => o.slug === currentSlug) ?? organizations[0]

  if (loading) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" disabled>
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <Building2 className="size-4" />
            </div>
            <div className="flex flex-col gap-0.5 leading-none">
              <span className="font-medium">Loading...</span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    )
  }

  if (organizations.length === 0) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" asChild>
            <Link href="/home">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <Building2 className="size-4" />
              </div>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-medium">No Organizations</span>
              </div>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    )
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <Building2 className="size-4" />
              </div>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-medium truncate max-w-[140px]">
                  {currentOrg?.name ?? "Organization"}
                </span>
                {currentOrg && (
                  <span className="text-xs text-muted-foreground capitalize">
                    {currentOrg.role}
                  </span>
                )}
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width)"
            align="start"
          >
            {organizations.map((org) => (
              <DropdownMenuItem key={org.id} asChild>
                <Link
                  href={`/${org.slug}`}
                  onClick={() => setOpen(false)}
                  className={org.slug === currentSlug ? "font-medium" : ""}
                > 
                  <Building2 className="mr-2 h-4 w-4" />
                  <span className="truncate">{org.name}</span>
                  {org.slug === currentSlug && <Check className="ml-auto" />}
                </Link>
              </DropdownMenuItem>
            ))}
            <DropdownMenuItem
              onSelect={() => {
                setOpen(false)
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              <span>Create Organization</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

export function AppSidebar({ orgSlug, ...props }: React.ComponentProps<typeof Sidebar> & { orgSlug: string }) {
  return (
    <Sidebar {...props} collapsible="icon">
      <SidebarHeader className="border-b border-border h-14 bg-background">
        <OrgSwitcher currentSlug={orgSlug} />
      </SidebarHeader>
      <SidebarContent className="bg-background">
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href={`/${orgSlug}`}>
                    <Home className="mr-2 h-4 w-4" />
                    <span>Home</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
