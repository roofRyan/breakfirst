import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// POST /api/notifications/users/:customerId
export async function POST(req, { params }) {
  const { customerId } = params;

  try {
    const { orderId, message } = await req.json();

    if (!orderId || !message) {
      return NextResponse.json(
        { message: "缺少必要欄位 (orderId, message)" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("Notification")
      .insert([
        {
          userId: customerId,
          orderId,
          message,
          isread: false,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("新增通知失敗:", error);
      return NextResponse.json(
        { message: "無法新增通知", error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("通知 API 錯誤:", err);
    return NextResponse.json({ message: "伺服器錯誤" }, { status: 500 });
  }
}
