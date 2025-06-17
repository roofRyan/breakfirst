import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function POST(request) {
  try {
    const body = await request.json();
    const { orderId } = body;

    if (!orderId || typeof orderId !== "string") {
      return NextResponse.json(
        { message: "請提供有效的 orderId" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("Order")
      .update({ paymentStatus: true })
      .eq("id", orderId)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error("確認付款失敗:", error);
    return NextResponse.json(
      { message: "伺服器錯誤", error: String(error) },
      { status: 500 }
    );
  }
}
