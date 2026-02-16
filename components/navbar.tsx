"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Menu, Info, BookOpen, Users, Search, MapPin } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet"

export function Navbar() {
  const [isScrolled, setIsScrolled] = React.useState(false)
  const [activeSection, setActiveSection] = React.useState("")

  React.useEffect(() => {
    const handleHashChange = () => {
      setActiveSection(window.location.hash)
    }

    handleHashChange()
    window.addEventListener("hashchange", handleHashChange)
    return () => window.removeEventListener("hashchange", handleHashChange)
  }, [])

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    const targetId = href.replace("/", "")
    const element = document.querySelector(targetId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
      window.history.pushState(null, "", href)
      setActiveSection(targetId)
    }
  }
  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])
  
  const navItems = [
    { name: "About ICONIK", href: "/#about", icon: Info },
    { name: "Speakers", href: "/#speakers", icon: Users },
    { name: "Topics", href: "/#topics", icon: BookOpen },
    { name: "Location", href: "/#venue", icon: MapPin },
    { name: "Committee", href: "/#committee", icon: Users },
  ]

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-200",
      isScrolled && "h-14 shadow-sm"
    )}>
      <div className={cn(
        "container flex items-center max-w-7xl mx-auto px-4 transition-all duration-200",
        isScrolled ? "h-14" : "h-16"
      )}>
        <div className="flex md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="mr-2">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <SheetTitle className="text-lg font-semibold">ICONIK 2026</SheetTitle>
              <nav className="flex flex-col mt-6">
              <div className="flex items-center px-3 py-2 mb-4 border rounded-md bg-muted/50">
                <Search className="w-4 h-4 mr-2 opacity-50" />
                <span className="text-sm text-muted-foreground">
                  Menu
                </span>
              </div>
                <div className="space-y-1">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "block px-3 py-2 hover:bg-accent hover:text-accent-foreground rounded-md transition-colors",
                activeSection === item.href.replace("/", "") ? "text-foreground font-medium bg-accent/50" : "text-foreground/60"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className="h-5 w-5" />
                        <span className="text-base font-medium">{item.name}</span>
                      </div>
                    </Link>
                  ))}
                  <div className="my-4 px-3">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                      </div>
                    </div>
                  </div>
                  <Link href="/register-event" className="block px-3">
                    <Button className="w-full bg-primary hover:bg-primary/90 h-10">
                      Register Event
                    </Button>
                  </Link>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
        <div className="mr-8 hidden md:flex items-center gap-4 max-w-xs">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/perpika.png"
              alt="ICONIK 2026"
              width={40}
              height={40}
              className={cn(
                "object-contain transition-all duration-200",
                isScrolled && "w-8 h-8"
              )}
            />
            <div className="flex flex-col">
              <span className={cn(
                "font-semibold transition-all duration-200",
                isScrolled ? "text-base" : "text-lg"
              )}>ICONIK 2026</span>
              <span className={cn(
                "text-muted-foreground transition-all duration-200",
                isScrolled ? "text-[10px]" : "text-xs"
              )}>International Conference by Indonesian Students in Korea</span>
            </div>
          </Link>
        </div>
        {/* Mobile Logo */}
        <div className="md:hidden flex items-center gap-3 mx-auto">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/perpika.png"
              alt="ICONIK 2026"
              width={32}
              height={32}
              className="object-contain"
            />
            <span className="text-lg font-semibold">ICONIK 2026</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center justify-center space-x-8 text-sm font-medium max-w-xl mx-auto">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={(e) => handleNavClick(e, item.href)}
              className={cn(
                "relative transition-all duration-200 hover:text-foreground flex items-center gap-2 py-1.5",
                activeSection === item.href.replace("/", "") 
                  ? "text-foreground after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:bg-foreground after:transition-all" 
                  : "text-foreground/60 after:absolute after:left-1/2 after:bottom-0 after:h-[2px] after:w-0 after:bg-foreground/60 hover:after:left-0 hover:after:w-full after:transition-all"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="ml-auto hidden md:flex items-center space-x-4">
          <Link href="https://docs.google.com/document/d/1myiduKBTdzymtHJ4Cb922xtFxXomxTiI/edit?usp=sharing&ouid=109284380288306681099&rtpof=true&sd=true"
            target="_blank"
            rel="noopener noreferrer">
            <Button variant="outline" className="transition-all duration-200 font-medium">
            Abstract Template
            </Button>
          </Link>
          <Link href="/login">
            <Button className="bg-primary hover:bg-primary/90 transition-all duration-200 font-medium">
              Login
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
