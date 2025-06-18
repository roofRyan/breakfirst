export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const customerId = searchParams.get("customerId");

  if (!customerId) {
    return NextResponse.json(
      { message: "缺少 customerId" },
      { status: 400 }
    );
  }

  const { data: orders, error } = await supabase
    .from("Order")
    .select(
      `id, customerId, totalAmount, status, createdAt,
      OrderItem (
        id, quantity, specialRequest, menuItemId,
        MenuItem ( id, name, price )
      )`
    )
    .eq("customerId", customerId)
    .order("createdAt", { ascending: false });

  if (error) {
    return NextResponse.json(
      { message: "查詢訂單失敗", error: String(error) },
      { status: 500 }
    );
  }

  if (!orders) {
    return NextResponse.json([], { status: 200 });
  }

  const formatted = orders.map((order) => ({
    id: order.id,
    customerId: order.customerId,
    totalAmount: order.totalAmount,
    status: order.status,
    createdAt: order.createdAt,
    items: (order.OrderItem || []).map((item) => ({
      id: item.id,
      quantity: item.quantity,
      specialRequest: item.specialRequest,
      menuItem: {
        id: item.MenuItem?.id || null,
        name: item.MenuItem?.name || "",
        price: item.MenuItem?.price || 0,
      },
    })),
  }));

  return NextResponse.json(formatted);
}
