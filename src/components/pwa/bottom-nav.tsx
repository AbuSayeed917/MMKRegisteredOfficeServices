"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";

export interface BottomNavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  /** Use exact match instead of startsWith */
  exact?: boolean;
}

interface BottomNavProps {
  items: BottomNavItem[];
  basePath: string;
}

export function BottomNav({ items, basePath }: BottomNavProps) {
  const pathname = usePathname();

  const isActive = (item: BottomNavItem) => {
    if (item.exact || item.href === basePath) {
      return pathname === item.href;
    }
    return pathname.startsWith(item.href);
  };

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-[#0c2d42] border-t border-[#dbeaf2] dark:border-white/10 safe-area-bottom">
      <div className="flex items-center justify-around h-16 px-2">
        {items.map((item) => {
          const Icon = item.icon;
          const active = isActive(item);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex flex-col items-center justify-center gap-0.5 flex-1 py-1.5 rounded-xl transition-colors ${
                active
                  ? "text-[#0ea5e9]"
                  : "text-[#3d6478] dark:text-white/50"
              }`}
            >
              <Icon className="size-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
              {active && (
                <div className="absolute bottom-1 w-5 h-0.5 rounded-full bg-[#0ea5e9]" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
