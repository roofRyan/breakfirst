import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "Missing userId query parameter" },
        { status: 400 }
      );
    }

    // 查詢 user 資料來驗證角色
    const { data: user, error: userError } = await supabase
      .from("User")
      .select("role")
      .eq("id", userId)
      .single();

    if (userError || !user) {
      return NextResponse.json(
        { error: "User not found or failed to fetch" },
        { status: 404 }
      );
    }

    if (user.role !== "STAFF") {
      return NextResponse.json(
        { error: "Access denied: Only staff can access this API" },
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
        items (
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
      { error: "Failed to fetch pending orders" },
      { status: 500 }
    );
  }
}
