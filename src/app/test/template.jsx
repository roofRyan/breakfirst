"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function TestLayout({ children }) {
    const [count, setCount] = useState(0);
    const pathname = usePathname();

    return (
        <div>
            <div className="border-2 border-dashed bg-blue-300 p-4">
                <div className="flex mb-4">
                    Text Template 
                    <span className="px-4 font-bold text-red-600">{count}</span>{" "}
                </div>
                <Button
                    onClick={() => setCount(count + 1)}
                    className="bg-red-500 text-white mb-4 rounded-full"
                >
                    +1
                </Button>
            </div>
            {children}
        </div>
    );
}
