  "use client";

import { Compass, Heart, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

import { WatchlistDrawer } from "@/components/features/WatchlistDrawer";

export function Dock() {
  const pathname = usePathname();

  const tabs = [
    { name: "Scopri", icon: Compass, path: "/" },
    { name: "Watchlist", icon: Heart, path: null }, // path null triggers drawer
    { name: "Info", icon: User, path: "/info" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-100 flex justify-center">
        {/* Container constrained to max-w same as layout */}
      <div className="w-full max-w-[450px]">
        <nav className="relative flex items-center justify-around rounded-t-3xl border-t border-white/10 bg-black/60 backdrop-blur-md px-2 pb-6 pt-4 shadow-2xl ring-1 ring-white/5">
          {tabs.map((tab) => {
            const isActive = pathname === tab.path;
            const Icon = tab.icon;

            const content = (
                <div className={`relative flex flex-col items-center gap-1 p-2 transition-colors duration-200 ${
                  isActive || (!tab.path && false) ? "text-primary" : "text-zinc-500 hover:text-zinc-300"
                }`}>
                    {isActive && (
                      <motion.div
                        layoutId="dock-active"
                        className="absolute inset-0 rounded-xl bg-primary/10"
                        initial={false}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                    <Icon size={26} strokeWidth={isActive ? 2.5 : 2} className="relative z-10" />
                    <span className="text-[10px] font-medium relative z-10">{tab.name}</span>
                </div>
            );

            if (!tab.path) {
                return (
                    <WatchlistDrawer key={tab.name}>
                        {content}
                    </WatchlistDrawer>
                )
            }

            return (
              <Link
                key={tab.path}
                href={tab.path}
              >
                {content}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

