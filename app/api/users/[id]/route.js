import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function PATCH(req, { params }) {
  const { id } = params;
  const { role } = await req.json();

  if (!role) {
    return NextResponse.json({ message: "缺少角色資料" }, { status: 400 });
  }

  try {
    const { data, error } = await supabase
      .from("users")
      .update({ role })
      .eq("id", id)
      .select()
      .single(); // 取得更新後的資料

    if (error) {
      console.error("🔴 更新角色錯誤:", error);
      return NextResponse.json(
        { message: "Supabase 更新失敗", error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("❌ API 執行錯誤:", err);
    return NextResponse.json(
      { message: "伺服器錯誤", error: err.message },
      { status: 500 }
    );
  }
}
