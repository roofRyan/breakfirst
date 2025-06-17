import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("users") // 查 supabase 的 users 表
      .select("id, email, role, name, createdAt")
      .order("createdAt", { ascending: false });

    if (error) {
      console.error("❌ Supabase 查詢錯誤:", error);
      return NextResponse.json(
        { message: "Supabase 查詢錯誤", error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("❌ API 錯誤:", err);
    return NextResponse.json(
      { message: "伺服器錯誤", error: err.message },
      { status: 500 }
    );
  }
}
