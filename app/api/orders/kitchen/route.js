import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("Order")
      .select(`
        id,
        customerId,
        status,
        paymentStatus,
        totalAmount,
        createdAt,
        completedAt,
        items (
          id,
          quantity,
          specialRequest,
          menuItem:menuItemId (
            id,
            name,
            price,
            imageUrl
          )
        )
      `)
      .eq("status", "PREPARING")
      .order("createdAt", { ascending: true });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (err) {
    console.error("取得 PREPARING 訂單失敗:", err);
    return NextResponse.json({ message: "伺服器錯誤" }, { status: 500 });
  }
}
