"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavLink({ href, children }) {
  const pathname = usePathname();

  return (
    <Link
      href={href}
      className={`${
        pathname === href
          ? "bg-slate-700 text-white font-semibold"
          : "bg-slate-300 text-black hover:text-yellow-300"
      } block px-4 py-2 rounded-md hover:bg-yellow-200 hover:text-black transition-colors`}
    >
      {children}
    </Link>
  );
}
