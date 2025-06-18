import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function PATCH(request, { params }) {
  const { customerId, orderId } = params;

  if (!customerId || !orderId) {
    return NextResponse.json(
      { message: "缺少 customerId 或 orderId" },
      { status: 400 }
    );
  }

  const body = await request.json();
  const { status } = body;

  if (!status || typeof status !== "string") {
    return NextResponse.json(
      { message: "缺少有效的狀態" },
      { status: 400 }
    );
  }

  // 更新訂單狀態
  const { data, error } = await supabase
    .from("Order")
    .update({ status })
    .eq("id", orderId)
    .eq("customerId", customerId)
    .select()
    .single();

  if (error) {
    return NextResponse.json(
      { message: "更新訂單失敗", error: String(error) },
      { status: 500 }
    );
  }

  if (!data) {
    return NextResponse.json(
      { message: "找不到訂單" },
      { status: 404 }
    );
  }

  return NextResponse.json({ message: "更新成功", order: data });
}
