import { NextResponse } from 'next/server';
import prisma from "../../../lip/prisma";

// Utility function to check user across all tables
async function findUser(user_id: string) {
  try {
    const user = await prisma.user.findUnique({ where: { user_id } });
    if (user) return { user, table: "User" };

    const secondaryUser = await prisma.secondaryUser.findUnique({
      where: { user_id },
    });
    if (secondaryUser) return { user: secondaryUser, table: "SecondaryUser" };

    const tertiaryUser = await prisma.tertiaryUser.findUnique({
      where: { user_id },
    });
    if (tertiaryUser) return { user: tertiaryUser, table: "TertiaryUser" };

    return null;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const user_id = url.searchParams.get('user_id');

    if (!user_id) {
      return NextResponse.json(
        { error: "Missing user ID" },
        { status: 400 }
      );
    }

    // Check the user across all tables
    const userData = await findUser(user_id);

    if (!userData) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      purchasedLevel: userData.user.purchasedLevel,
      table: userData.table,
    });
  } catch (error) {
    console.error("Error fetching purchase level:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
