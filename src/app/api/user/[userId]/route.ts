import { NextResponse } from "next/server";
import prisma from "../../../../lip/prisma";

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = params.userId;

    const user = await prisma.user.findUnique({
      where: { user_id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      username: user.username,
      referralCode: user.referralCode,
      totalPoints: user.totalPoints,
      purchasedLevel: user.purchasedLevel,
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

