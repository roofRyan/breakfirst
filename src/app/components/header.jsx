"use client";

import { Button } from "@/components/ui/button";
import { Utensils } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const linkSet = [
  { href: "/home2/performance", text: "Performance" },
  { href: "/home2/reliability", text: "Reliability" },
  { href: "/home2/scale", text: "Scale" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <div className="flex flex-wrap justify-between items-center mx-auto my-0 px-4 py-2">
      <div>
        <Button asChild className="bg-blue-700">
          <Link href="/home2" className="flex items-center gap-2">
            <Utensils color="gold" size={20} />
            <span className="text-2xl font-bold text-white">Home</span>
          </Link>
        </Button>
      </div>

      <div className="flex flex-wrap gap-3">
        {linkSet.map((link) => (
          <div key={link.href} className="flex items-center gap-1">
            <Utensils color="yellow" size={16} />
            <Link
              href={link.href}
              className={`p-2 rounded-md transition-colors duration-200 ${
                pathname === link.href
                  ? "bg-slate-700 text-white"
                  : "bg-slate-300 text-blue-700 hover:bg-yellow-300 hover:text-blue-700"
              }`}
            >
              {link.text}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
