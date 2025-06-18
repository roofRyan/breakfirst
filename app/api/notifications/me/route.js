import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// 取得目前使用者所有通知
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "未登入" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("Notification")
      .select("*")
      .eq("userId", session.user.id)
      .order("createdAt", { ascending: false });

    if (error) throw error;

    const formatted = data.map((n) => ({
      id: n.id,
      content: n.message,
      isRead: n.isRead,
      orderId: n.orderId,
      time: new Date(n.createdAt).toLocaleString("zh-TW", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }),
    }));

    return NextResponse.json(formatted);
  } catch (err) {
    console.error("取得通知錯誤:", err);
    return NextResponse.json({ message: "伺服器錯誤" }, { status: 500 });
  }
}

// 建立通知
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "未登入" }, { status: 401 });
    }

    const { orderId, message } = await request.json();

    if (!orderId || !message) {
      return NextResponse.json(
        { message: "缺少必要欄位：orderId 與 message" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("Notification")
      .insert([
        {
          userId: session.user.id,
          orderId,
          message,
          isRead: false,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    console.error("建立通知錯誤:", err);
    return NextResponse.json({ message: "伺服器錯誤" }, { status: 500 });
  }
}

// 批次標記通知為已讀
export async function PATCH(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "未登入" }, { status: 401 });
    }

    const { ids } = await request.json();

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { message: "需提供通知 ID 陣列" },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("Notification")
      .update({ isRead: true })
      .in("id", ids)
      .eq("userId", session.user.id);

    if (error) throw error;

    return NextResponse.json({ message: "已標記為已讀" });
  } catch (err) {
    console.error("標記通知為已讀失敗:", err);
    return NextResponse.json({ message: "伺服器錯誤" }, { status: 500 });
  }
}
