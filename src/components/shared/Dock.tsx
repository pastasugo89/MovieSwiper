  "use client";

import { Compass, Heart, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";


export function Dock() {
  const pathname = usePathname();

  const tabs = [
    { name: "Scopri", icon: Compass, path: "/" },
    { name: "Watchlist", icon: Heart, path: "/watchlist" },
    { name: "Info", icon: User, path: "/info" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 flex justify-center pointer-events-none">
        {/* Container constrained to max-w same as layout */}
      <div className="w-full max-w-[450px] pointer-events-auto">
        <nav 
            className="relative flex items-center justify-around rounded-t-3xl border-t border-white/10 bg-black/60 backdrop-blur-md px-2 pt-4 shadow-2xl ring-1 ring-white/5"
            style={{ paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom))' }}
        >
          {tabs.map((tab) => {
            const isActive = pathname === tab.path;
            const Icon = tab.icon;

            const content = (
                <div className={`relative flex flex-col items-center gap-1 p-2 transition-colors duration-200 ${
                  isActive ? "text-primary" : "text-zinc-500 hover:text-zinc-300"
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

            return (
              <Link
                key={tab.path}
                href={tab.path!}
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

