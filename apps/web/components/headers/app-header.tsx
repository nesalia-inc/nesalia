"use client"

import Link from "next/link"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Bot, Workflow, Code, Terminal, GitFork, Zap, FileText, Newspaper } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AuthButtons } from "@/components/auth/auth-buttons"

export function AppHeader() {
  return (
    <header className="sticky top-0 z-50 h-14 w-full border-b bg-background backdrop-blur">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex h-14 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <img
                src="/transparent-icon.svg"
                alt="Nesalia"
                className="h-8 w-8"
              />
            </Link>

            {/* Desktop Navigation */}
            <NavigationMenu className="hidden md:flex">
              <NavigationMenuList>
                {/* Products Dropdown */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-muted-foreground">Products</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid gap-3 p-6 w-[600px] grid-cols-2">
                      <div className="grid gap-2">
                        <Link href="/agents" className="group">
                          <div className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted transition-colors">
                            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                              <Bot className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <div className="font-medium text-foreground">Agents</div>
                              <div className="text-sm text-muted-foreground">AI agents with memory</div>
                            </div>
                          </div>
                        </Link>
                        <Link href="/workflows" className="group">
                          <div className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted transition-colors">
                            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                              <Workflow className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <div className="font-medium text-foreground">Workflows</div>
                              <div className="text-sm text-muted-foreground">Automate any process</div>
                            </div>
                          </div>
                        </Link>
                      </div>
                      <div className="grid gap-2">
                        <Link href="/sdk" className="group">
                          <div className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted transition-colors">
                            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                              <Code className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <div className="font-medium text-foreground">SDK</div>
                              <div className="text-sm text-muted-foreground">Build with TypeScript</div>
                            </div>
                          </div>
                        </Link>
                        <Link href="/cli" className="group">
                          <div className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted transition-colors">
                            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                              <Terminal className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <div className="font-medium text-foreground">CLI</div>
                              <div className="text-sm text-muted-foreground">Control from terminal</div>
                            </div>
                          </div>
                        </Link>
                      </div>
                      <div className="col-span-2">
                        <div className="border-t border-border" />
                      </div>
                      <div className="grid gap-2">
                        <Link href="/marty" className="group">
                          <div className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted transition-colors">
                            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                              <GitFork className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <div className="font-medium text-foreground">Marty Bot</div>
                              <div className="text-sm text-muted-foreground">GitHub code reviewer</div>
                            </div>
                          </div>
                        </Link>
                      </div>
                      <div className="grid gap-2">
                        <Link href="/github-action" className="group">
                          <div className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted transition-colors">
                            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                              <Zap className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <div className="font-medium text-foreground">GitHub Action</div>
                              <div className="text-sm text-muted-foreground">CI/CD integration</div>
                            </div>
                          </div>
                        </Link>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Resources Dropdown */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-muted-foreground">Resources</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid gap-3 p-6 w-[500px] grid-cols-2">
                      <div className="grid gap-2">
                        <Link href="/docs" className="block p-3 rounded-lg border border-border hover:bg-muted transition-colors">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-primary" />
                            <div className="font-medium text-foreground">Documentation</div>
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">Get started in minutes</div>
                        </Link>
                        <Link href="/blog" className="block p-3 rounded-lg border border-border hover:bg-muted transition-colors">
                          <div className="flex items-center gap-2">
                            <Newspaper className="h-4 w-4 text-primary" />
                            <div className="font-medium text-foreground">Blog</div>
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">Tutorials and updates</div>
                        </Link>
                      </div>
                      <div className="grid gap-2">
                        <Link href="/changelog" className="block p-3 rounded-lg border border-border hover:bg-muted transition-colors">
                          <div className="font-medium text-foreground">Changelog</div>
                          <div className="text-sm text-muted-foreground mt-1">Product updates</div>
                        </Link>
                        <Link href="/deessejs" className="block p-3 rounded-lg border border-border hover:bg-muted transition-colors">
                          <div className="font-medium text-foreground">DeesseJS</div>
                          <div className="text-sm text-muted-foreground mt-1">Laravel for TypeScript</div>
                        </Link>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Solutions Dropdown */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-muted-foreground">Solutions</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid gap-2 p-6 w-[400px]">
                      <Link href="/solutions/github" className="block p-4 rounded-lg border border-border hover:bg-muted transition-colors">
                        <div className="font-medium text-foreground">GitHub Automation</div>
                        <div className="text-sm text-muted-foreground mt-1">
                          Automate code review and CI with AI agents.
                        </div>
                      </Link>
                      <Link href="/solutions/factory" className="block p-4 rounded-lg border border-border hover:bg-muted transition-colors">
                        <div className="font-medium text-foreground">Software Factory</div>
                        <div className="text-sm text-muted-foreground mt-1">
                          Full SDLC automated with AI.
                        </div>
                      </Link>
                      <Link href="/solutions/automation" className="block p-4 rounded-lg border border-border hover:bg-muted transition-colors">
                        <div className="font-medium text-foreground">Workflow Automation</div>
                        <div className="text-sm text-muted-foreground mt-1">
                          Business process automation with human-in-the-loop.
                        </div>
                      </Link>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Pricing */}
                <NavigationMenuItem>
                  <NavigationMenuLink
                    className={`${navigationMenuTriggerStyle()} text-muted-foreground`}
                    asChild
                  >
                    <Link href="/pricing">Pricing</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {/* Auth Buttons */}
            <div className="hidden md:flex">
              <AuthButtons />
            </div>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col gap-4 mt-8">
                  <div className="text-sm font-medium text-muted-foreground px-3">Products</div>
                  <Link href="/agents" className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted">
                    <Bot className="h-5 w-5 text-primary" />
                    <span>Agents</span>
                  </Link>
                  <Link href="/workflows" className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted">
                    <Workflow className="h-5 w-5 text-primary" />
                    <span>Workflows</span>
                  </Link>
                  <Link href="/sdk" className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted">
                    <Code className="h-5 w-5 text-primary" />
                    <span>SDK</span>
                  </Link>
                  <Link href="/cli" className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted">
                    <Terminal className="h-5 w-5 text-primary" />
                    <span>CLI</span>
                  </Link>
                  <Link href="/marty" className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted">
                    <GitFork className="h-5 w-5 text-primary" />
                    <span>Marty Bot</span>
                  </Link>
                  <Link href="/github-action" className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted">
                    <Zap className="h-5 w-5 text-primary" />
                    <span>GitHub Action</span>
                  </Link>

                  <div className="border-t border-border my-2" />
                  <div className="text-sm font-medium text-muted-foreground px-3">Resources</div>
                  <Link href="/docs" className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted">
                    <span>Documentation</span>
                  </Link>
                  <Link href="/blog" className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted">
                    <span>Blog</span>
                  </Link>
                  <Link href="/changelog" className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted">
                    <span>Changelog</span>
                  </Link>
                  <Link href="/deessejs" className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted">
                    <span>DeesseJS</span>
                  </Link>

                  <div className="border-t border-border my-2" />
                  <div className="text-sm font-medium text-muted-foreground px-3">Solutions</div>
                  <Link href="/solutions/github" className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted">
                    <span>GitHub Automation</span>
                  </Link>
                  <Link href="/solutions/factory" className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted">
                    <span>Software Factory</span>
                  </Link>
                  <Link href="/solutions/automation" className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted">
                    <span>Workflow Automation</span>
                  </Link>

                  <div className="border-t border-border my-2" />
                  <Link href="/pricing" className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted">
                    <span>Pricing</span>
                  </Link>

                  <div className="mt-auto pt-4 border-t border-border">
                    <div className="flex flex-col gap-2">
                      <Button variant="outline" className="w-full">Sign in</Button>
                      <Button className="w-full">Get Started</Button>
                    </div>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}