import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// POST /api/orders
export async function POST(request) {
  try {
    const body = await request.json();
    const { customerId, orderItems } = body;

    if (!customerId || typeof customerId !== "string") {
      return NextResponse.json(
        { message: "customerId 是必填欄位，且需為字串" },
        { status: 400 }
      );
    }

    if (!Array.isArray(orderItems) || orderItems.length === 0) {
      return NextResponse.json(
        { message: "orderItems 為必填欄位，且需為非空陣列" },
        { status: 400 }
      );
    }

    // 取得 menuItem 價格
    const menuItemIds = orderItems.map((item) => item.menuItemId);
    const { data: menuItems, error: menuError } = await supabase
      .from("MenuItem")
      .select("id, price")
      .in("id", menuItemIds);

    if (menuError) throw menuError;
    if (menuItems.length !== orderItems.length) {
      return NextResponse.json(
        { message: "有無效的 menuItemId" },
        { status: 400 }
      );
    }

    const priceMap = Object.fromEntries(
      menuItems.map((item) => [item.id, item.price])
    );

    let totalAmount = 0;
    for (const item of orderItems) {
      if (
        typeof item.menuItemId !== "string" ||
        typeof item.quantity !== "number"
      ) {
        return NextResponse.json(
          {
            message:
              "每個項目需包含 menuItemId（字串）與 quantity（數字）",
          },
          { status: 400 }
        );
      }
      totalAmount += priceMap[item.menuItemId] * item.quantity;
    }

    // 建立訂單
    const { data: orderData, error: orderError } = await supabase
      .from("Order")
      .insert([{ customerId, totalAmount }])
      .select()
      .single();

    if (orderError) throw orderError;

    const orderId = orderData.id;

    // 建立訂單項目
    const orderItemRows = orderItems.map((item) => ({
      orderId,
      menuItemId: item.menuItemId,
      quantity: item.quantity,
      specialRequest: item.specialRequest || "",
      createdAt: new Date().toISOString(),
    }));

    const { error: itemError } = await supabase
      .from("OrderItem")
      .insert(orderItemRows);

    if (itemError) throw itemError;

    return NextResponse.json(orderData, { status: 200 });
  } catch (error) {
    console.error("建立訂單錯誤:", error);
    return NextResponse.json(
      { message: "伺服器錯誤", error: String(error) },
      { status: 500 }
    );
  }
}
