import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth"; // 你的 next-auth 設定檔路徑

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function GET(request) {
  try {
    // 取得 session
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "未登入" }, { status: 401 });
    }

    // 假設 role 放在 session.user.role
    const userRole = session.user.role;

    if (userRole !== "STAFF" && userRole !== "OWNER") {
      return NextResponse.json(
        { error: "權限不足" },
        { status: 403 }
      );
    }

    // 查詢所有 PENDING 訂單
    const { data: orders, error: orderError } = await supabase
      .from("Order")
      .select(`
        id,
        status,
        paymentStatus,
        totalAmount,
        createdAt,
        customer:customerId (
          name
        ),
        OrderItem (
          id,
          quantity,
          specialRequest,
          menuItem:menuItemId (
            name,
            price
          )
        )
      `)
      .eq("status", "PENDING")
      .order("createdAt", { ascending: false });

    if (orderError) {
      throw orderError;
    }

    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    console.error("Failed to get pending orders:", error);
    return NextResponse.json(
      { error: "取得待處理訂單失敗" },
      { status: 500 }
    );
  }
}
