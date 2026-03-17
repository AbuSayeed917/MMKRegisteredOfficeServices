import { Separator } from "@/components/ui/separator";
import { Mail, Phone, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const FooterSection = () => {
  return (
    <footer id="footer" className="text-white/70" style={{ backgroundColor: '#033d5c' }}>
      <div className="container py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-x-12 gap-y-10">
          {/* Logo & Description */}
          <div className="col-span-full xl:col-span-2">
            <Link href="/" className="flex items-center mb-4">
              <Image src="/images/mmk-logo.png" alt="MMK Accountants" width={140} height={85} className="h-12 w-auto brightness-0 invert" />
            </Link>
            <p className="text-sm leading-relaxed mb-6 max-w-xs">
              Professional registered office address service for businesses across
              the United Kingdom. Trusted since 2012.
            </p>
            <div className="space-y-3">
              <a href="mailto:info@mmkaccountants.co.uk" className="flex items-center gap-2 text-sm hover:text-white transition-colors">
                <Mail className="size-4 text-[#0ea5e9]" />
                info@mmkaccountants.co.uk
              </a>
              <a href="tel:+441234567890" className="flex items-center gap-2 text-sm hover:text-white transition-colors">
                <Phone className="size-4 text-[#0ea5e9]" />
                Contact Us
              </a>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="size-4 text-[#0ea5e9]" />
                Luton, United Kingdom
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="flex flex-col gap-3">
            <h3 className="font-semibold text-white text-sm mb-1">Services</h3>
            <Link href="/" className="text-sm hover:text-white transition-colors">Home</Link>
            <Link href="/pricing" className="text-sm hover:text-white transition-colors">Pricing</Link>
            <Link href="/register" className="text-sm hover:text-white transition-colors">Register</Link>
            <Link href="/#services" className="text-sm hover:text-white transition-colors">Our Services</Link>
          </div>

          {/* Account */}
          <div className="flex flex-col gap-3">
            <h3 className="font-semibold text-white text-sm mb-1">Account</h3>
            <Link href="/login" className="text-sm hover:text-white transition-colors">Sign In</Link>
            <Link href="/dashboard" className="text-sm hover:text-white transition-colors">Dashboard</Link>
            <Link href="/forgot-password" className="text-sm hover:text-white transition-colors">Reset Password</Link>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-3">
            <h3 className="font-semibold text-white text-sm mb-1">Quick Links</h3>
            <Link href="/#benefits" className="text-sm hover:text-white transition-colors">Why Choose Us</Link>
            <Link href="/#how-it-works" className="text-sm hover:text-white transition-colors">How It Works</Link>
            <Link href="/#faq" className="text-sm hover:text-white transition-colors">FAQ</Link>
            <Link href="/#contact" className="text-sm hover:text-white transition-colors">Contact</Link>
          </div>

          {/* Legal */}
          <div className="flex flex-col gap-3">
            <h3 className="font-semibold text-white text-sm mb-1">Legal</h3>
            <Link href="/terms" className="text-sm hover:text-white transition-colors">Terms & Conditions</Link>
            <Link href="/privacy" className="text-sm hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/cookies" className="text-sm hover:text-white transition-colors">Cookie Policy</Link>
          </div>
        </div>

        <Separator className="my-8 bg-[#0891c8]/30" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs">
            &copy; {new Date().getFullYear()} MMK Accountants. All rights reserved.
          </p>
          <p className="text-xs">
            Registered in England and Wales.
          </p>
        </div>
      </div>
    </footer>
  );
};
