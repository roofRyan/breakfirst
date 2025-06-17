// app/api/menu/route.js

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// GET 所有菜單
export async function GET() {
    const { data, error } = await supabase
        .from("MenuItem")
        .select("*")
        .order("id", { ascending: true });

    if (error) {
        console.error("Supabase 錯誤:", error.message);
        return NextResponse.json({ message: "伺服器錯誤" }, { status: 500 });
    }

    return NextResponse.json(data);
}

// POST 新增菜單
export async function POST(request) {
    try {
        const body = await request.json();

        if (!body.name || typeof body.name !== "string") {
            return NextResponse.json({ message: "name 是必填欄位" }, { status: 400 });
        }

        if (typeof body.price !== "number" || isNaN(body.price)) {
            return NextResponse.json({ message: "price 必須是數字" }, { status: 400 });
        }

        const { data, error } = await supabase.from("MenuItem").insert([
            {
                name: body.name,
                description: body.description || null,
                price: body.price,
                imageUrl: body.imageUrl || null,
                isAvailable:
                    typeof body.isAvailable === "boolean"
                        ? body.isAvailable
                        : true,
            },
        ]).select().single();

        if (error) {
            console.error("Supabase 插入錯誤:", error.message);
            return NextResponse.json({ message: "新增失敗", error: error.message }, { status: 500 });
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error("系統錯誤:", error);
        return NextResponse.json({ message: "伺服器錯誤", error: String(error) }, { status: 500 });
    }
}
