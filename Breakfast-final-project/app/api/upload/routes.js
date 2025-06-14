import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Buffer } from "buffer"; 

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function POST(req) {
    const supabase = createClient(supabaseUrl, supabaseKey);

    try {
        const formData = await req.formData();
        const file = formData.get("file");

        if (!file || typeof file === "string") {
            return NextResponse.json(
                { success: false, error: "未提供有效檔案" },
                { status: 400 }
            );
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const fileName = `${Date.now()}_${file.name}`;

        const { data, error } = await supabase.storage
            .from("image")
            .upload(fileName, buffer, {
                contentType: file.type,
                upsert: true,
            });

        if (error) {
            console.error("Supabase 上傳錯誤:", error);
            return NextResponse.json(
                { success: false, error: error.message },
                { status: 500 }
            );
        }

        const { data: publicData } = supabase
            .storage
            .from("image")
            .getPublicUrl(data.path);

        const publicUrl = publicData?.publicUrl;

        return NextResponse.json({
            success: true,
            url: publicUrl,
        });
    } catch (err) {
        console.error("處理上傳錯誤:", err);
        return NextResponse.json(
            { success: false, error: "伺服器內部錯誤" },
            { status: 500 }
        );
    }
}
