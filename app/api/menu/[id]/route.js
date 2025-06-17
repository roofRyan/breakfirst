// app/api/menu/[id]/route.js

import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function PUT(request, { params }) {
    try {
        const { id } = params;
        const body = await request.json();

        // 驗證輸入
        if (!body.name || typeof body.name !== "string") {
            return NextResponse.json(
                { message: "name 是必填欄位" },
                { status: 400 }
            );
        }

        if (typeof body.price !== "number" || isNaN(body.price)) {
            return NextResponse.json(
                { message: "price 必須是數字" },
                { status: 400 }
            );
        }

        // 檢查是否存在
        const { data: existingItem, error: findError } = await supabase
            .from("MenuItem")
            .select("*")
            .eq("id", id)
            .single();

        if (findError) {
            return NextResponse.json(
                { message: "找不到菜單項目" },
                { status: 404 }
            );
        }

        // 執行更新
        const { data, error } = await supabase
            .from("MenuItem")
            .update({
                name: body.name,
                description: body.description || null,
                price: body.price,
                imageUrl: body.imageUrl || null,
                isAvailable:
                    typeof body.isAvailable === "boolean"
                        ? body.isAvailable
                        : true,
            })
            .eq("id", id)
            .select()
            .single();

        if (error) {
            return NextResponse.json(
                { message: "更新失敗", error: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error("後端錯誤:", error);
        return NextResponse.json(
            { message: "伺服器錯誤", error: String(error) },
            { status: 500 }
        );
    }
}
