"use client";

import { Menu, Phone, Mail } from "lucide-react";
import Image from "next/image";
import React from "react";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Separator } from "../ui/separator";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "../ui/navigation-menu";
import { Button } from "../ui/button";
import Link from "next/link";

interface RouteProps {
  href: string;
  label: string;
}

const routeList: RouteProps[] = [
  { href: "/#benefits", label: "Why Us" },
  { href: "/#services", label: "Services" },
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/#testimonials", label: "Testimonials" },
  { href: "/#contact", label: "Contact" },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Top Contact Bar — hidden on mobile, visible on dark hero */}
      <div className="hidden md:block text-white font-bold text-xs py-2" style={{ backgroundColor: '#033d5c' }}>
        <div className="container flex items-center justify-between">
          <div className="flex items-center gap-6">
            <a href="tel:+441234567890" className="flex items-center gap-1.5 hover:text-white transition-colors">
              <Phone className="size-3" />
              <span>Contact Us</span>
            </a>
            <a href="mailto:info@mmkaccountants.co.uk" className="flex items-center gap-1.5 hover:text-white transition-colors">
              <Mail className="size-3" />
              <span>info@mmkaccountants.co.uk</span>
            </a>
          </div>
          <div className="flex items-center gap-4">
            <span>Mon – Fri: 9:00 AM – 5:30 PM</span>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-500 ease-out ${
          scrolled
            ? "bg-card/95 glass shadow-md border-b border-border/50"
            : "bg-transparent"
        }`}
      >
        <div className="container flex items-center justify-between h-[72px]">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <Image src="/images/mmk-logo.png" alt="MMK Accountants" width={120} height={73} className="h-10 w-auto" priority />
          </Link>

          {/* Mobile Menu */}
          <div className="flex items-center gap-2 lg:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-foreground">
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>

              <SheetContent
                side="left"
                className="flex flex-col justify-between bg-card border-border"
              >
                <div>
                  <SheetHeader className="mb-6 ml-4">
                    <SheetTitle className="flex items-center">
                      <Link href="/" className="flex items-center gap-3">
                        <Image src="/images/mmk-logo.png" alt="MMK Accountants" width={120} height={73} className="h-9 w-auto" />
                      </Link>
                    </SheetTitle>
                  </SheetHeader>

                  <div className="flex flex-col gap-1">
                    {routeList.map(({ href, label }) => (
                      <Button
                        key={href}
                        onClick={() => setIsOpen(false)}
                        asChild
                        variant="ghost"
                        className="justify-start text-base font-medium"
                      >
                        <Link href={href}>{label}</Link>
                      </Button>
                    ))}

                    <Separator className="my-3" />

                    <Button
                      onClick={() => setIsOpen(false)}
                      asChild
                      variant="ghost"
                      className="justify-start text-base"
                    >
                      <Link href="/login">Sign In</Link>
                    </Button>

                    <Button
                      onClick={() => setIsOpen(false)}
                      asChild
                      className="justify-start text-base rounded-full bg-gradient-to-r from-[#0ea5e9] to-[#38bdf8] text-white font-bold hover:shadow-lg"
                    >
                      <Link href="/register">Get Started</Link>
                    </Button>
                  </div>
                </div>

                <SheetFooter className="flex-col sm:flex-col justify-start items-start">
                  <Separator className="mb-2" />
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Mail className="size-3" />
                    info@mmkaccountants.co.uk
                  </div>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden lg:block">
            <NavigationMenuList className="gap-1">
              {routeList.map(({ href, label }) => (
                <NavigationMenuItem key={href}>
                  <NavigationMenuLink asChild>
                    <Link
                      href={href}
                      className="text-sm font-bold text-foreground hover:text-foreground transition-colors px-3 py-2 rounded-lg hover:bg-accent/10"
                    >
                      {label}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-3">
            <Button asChild variant="ghost" size="sm" className="text-sm font-bold text-foreground">
              <Link href="/login">Sign In</Link>
            </Button>

            <Button
              asChild
              size="sm"
              className="rounded-full bg-gradient-to-r from-[#0ea5e9] to-[#38bdf8] text-white font-bold px-6 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
            >
              <Link href="/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>
    </>
  );
};
