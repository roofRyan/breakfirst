"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

const linkSet = [
    { href: "/test/test1", text: "Test1" }, 
    { href: "/test/test2", text: "Test2" } 
];

export default function TestLayout({ children }) {
    const [count, setCount] = useState(0);
    const pathname = usePathname(); 

    return (
            <div className="border-2 border-dashed bg-blue-300 p-4">
                <div className="flex gap-4 font-bold text-lg mb-4 text-purple-600">
                    {linkSet.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="text-white bg-slate-800 hover:bg-gray-300 px-4 py-2 rounded-md"
                        >
                            {link.text}
                        </Link>
                    ))}
                </div>
            
            <div className="flex">
                Text Layout 
                <span className="p-4">{count}</span>
                pathname: <span>{pathname}</span>
            </div>
            <Button
                onClick={() => setCount(count + 1)}
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
            >
                +1
            </Button>
            {children}
        </div>
    );
}
