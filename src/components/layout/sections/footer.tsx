import { Separator } from "@/components/ui/separator";
import { Mail, Phone, MapPin } from "lucide-react";
import Link from "next/link";

export const FooterSection = () => {
  return (
    <footer id="footer" className="bg-[#071a28] text-[#7a9eb5]">
      <div className="container py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-x-12 gap-y-10">
          {/* Logo & Description */}
          <div className="col-span-full xl:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0ea5e9] to-[#38bdf8] flex items-center justify-center text-[#0c2d42] font-bold text-lg">
                M
              </div>
              <div>
                <span className="font-bold text-white text-lg">MMK Accountants</span>
              </div>
            </Link>
            <p className="text-sm leading-relaxed mb-6 max-w-xs">
              Professional registered office address service for businesses across
              the United Kingdom. Trusted since 2012.
            </p>
            <div className="space-y-3">
              <a href="mailto:info@mmkaccountants.co.uk" className="flex items-center gap-2 text-sm hover:text-[#38bdf8] transition-colors">
                <Mail className="size-4 text-[#0ea5e9]" />
                info@mmkaccountants.co.uk
              </a>
              <a href="tel:+441234567890" className="flex items-center gap-2 text-sm hover:text-[#38bdf8] transition-colors">
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
            <Link href="/" className="text-sm hover:text-[#38bdf8] transition-colors">Home</Link>
            <Link href="/pricing" className="text-sm hover:text-[#38bdf8] transition-colors">Pricing</Link>
            <Link href="/register" className="text-sm hover:text-[#38bdf8] transition-colors">Register</Link>
            <Link href="#services" className="text-sm hover:text-[#38bdf8] transition-colors">Our Services</Link>
          </div>

          {/* Account */}
          <div className="flex flex-col gap-3">
            <h3 className="font-semibold text-white text-sm mb-1">Account</h3>
            <Link href="/login" className="text-sm hover:text-[#38bdf8] transition-colors">Sign In</Link>
            <Link href="/dashboard" className="text-sm hover:text-[#38bdf8] transition-colors">Dashboard</Link>
            <Link href="/forgot-password" className="text-sm hover:text-[#38bdf8] transition-colors">Reset Password</Link>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-3">
            <h3 className="font-semibold text-white text-sm mb-1">Quick Links</h3>
            <Link href="#benefits" className="text-sm hover:text-[#38bdf8] transition-colors">Why Choose Us</Link>
            <Link href="#how-it-works" className="text-sm hover:text-[#38bdf8] transition-colors">How It Works</Link>
            <Link href="#faq" className="text-sm hover:text-[#38bdf8] transition-colors">FAQ</Link>
            <Link href="#contact" className="text-sm hover:text-[#38bdf8] transition-colors">Contact</Link>
          </div>

          {/* Legal */}
          <div className="flex flex-col gap-3">
            <h3 className="font-semibold text-white text-sm mb-1">Legal</h3>
            <Link href="/terms" className="text-sm hover:text-[#38bdf8] transition-colors">Terms & Conditions</Link>
            <Link href="/privacy" className="text-sm hover:text-[#38bdf8] transition-colors">Privacy Policy</Link>
            <Link href="/cookies" className="text-sm hover:text-[#38bdf8] transition-colors">Cookie Policy</Link>
          </div>
        </div>

        <Separator className="my-8 bg-[#1a6d8e]/30" />

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
