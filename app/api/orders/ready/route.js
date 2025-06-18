import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);

  const userRole = session?.user?.role ?? [];

  const isAuthorized =
    userRole.includes("KITCHEN") || userRole.includes("OWNER");

  if (!isAuthorized) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const orders = await prisma.order.findMany({
      where: { status: "READY" },
      include: {
        customer: { select: { id: true, name: true } },
        items: {
          include: {
            menuItem: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("取得 READY 訂單失敗:", error);
    return new NextResponse("Server Error", { status: 500 });
  }
}
