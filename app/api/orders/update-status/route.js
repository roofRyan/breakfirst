import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function POST(req) {
  try {
    const { orderId, status } = await req.json();

    if (!orderId || typeof status !== "string") {
      return NextResponse.json(
        { message: "缺少 orderId 或 status 參數" },
        { status: 400 }
      );
    }

    const validStatuses = [
      "PENDING",
      "PREPARING",
      "READY",
      "COMPLETED",
      "CANCELLED",
    ];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { message: "無效的訂單狀態" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("Order")
      .update({ status })
      .eq("id", orderId)
      .select()
      .single();

    if (error) {
      console.error("更新失敗:", error);
      return NextResponse.json(
        { message: "訂單更新失敗", error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("更新訂單狀態失敗:", err);
    return NextResponse.json({ message: "伺服器錯誤" }, { status: 500 });
  }
}
