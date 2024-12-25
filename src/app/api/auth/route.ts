import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../lip/prisma";

// تحديد نوع المعامل 'user_id' كـ string أو number حسب قاعدة البيانات
async function findUser(user_id: string): Promise<{ user: any; table: string } | null> {
  try {
    const user = await prisma.user.findUnique({ where: { user_id } });
    if (user) return { user, table: "User" };

    return null;
  } catch {
    return null;
  }
}

// تحديد نوع المعامل 'req' كـ NextRequest
export async function POST(req: NextRequest) {
  try {
    const { user_id, username, referralCode } = await req.json();
    if (!user_id) return new NextResponse(null, { status: 400 });

    const existingUser = await findUser(user_id);

    if (existingUser) {
      const { username: existingUsername } = existingUser.user;

      // Only update if username changed
      if (username && username !== existingUsername) {
        await prisma.user.update({
          where: { user_id },
          data: { username },
        });
      }
      return new NextResponse(null, { status: 204 });
    }

    // Create new user
    await prisma.user.create({
      data: { user_id, username, referralCode },
    });

    return new NextResponse(null, { status: 204 });
  } catch {
    return new NextResponse(null, { status: 500 });
  }
}
