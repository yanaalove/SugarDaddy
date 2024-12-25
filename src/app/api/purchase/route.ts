import { NextResponse, NextRequest } from "next/server";
import prisma from "../../../lip/prisma";

export async function POST(req: NextRequest) {
  try {
    const { user_id, level } = await req.json();

    // التأكد من وجود user_id و level
    if (!user_id || level == null) {
      return NextResponse.json({ error: "Missing required data" }, { status: 400 });
    }

    // البحث عن المستخدم في الجداول المختلفة
    let existingUser = await prisma.user.findUnique({
      where: { user_id },
      select: { purchasedLevel: true, user_id: true }, // إضافة user_id إلى الاستعلام
    });

    if (!existingUser) {
      // إذا لم يتم العثور عليه في جدول User، تحقق في جدول SecondaryUser
      existingUser = await prisma.secondaryUser.findUnique({
        where: { user_id },
        select: { purchasedLevel: true, user_id: true }, // إضافة user_id إلى الاستعلام
      });
    }

    if (!existingUser) {
      // إذا لم يتم العثور عليه في SecondaryUser، تحقق في جدول TertiaryUser
      existingUser = await prisma.tertiaryUser.findUnique({
        where: { user_id },
        select: { purchasedLevel: true, user_id: true }, // إضافة user_id إلى الاستعلام
      });
    }

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // تحقق إذا كان المستوى قد تم شراؤه بالفعل
    if (level <= existingUser.purchasedLevel) {
      return NextResponse.json({
        message: "Level already purchased",
        purchasedLevel: existingUser.purchasedLevel,
      });
    }

    // تحديث مستوى المشتري إذا لم يتم شراءه بعد
    let updatedUser;
    if (existingUser.user_id) { // الآن يمكننا الوصول إلى user_id بشكل صحيح
      updatedUser = await prisma.user.update({
        where: { user_id },
        data: { purchasedLevel: level },
      });
    } else if (existingUser.user_id) { // إضافة شرط مشابه للـ SecondaryUser و TertiaryUser
      updatedUser = await prisma.secondaryUser.update({
        where: { user_id },
        data: { purchasedLevel: level },
      });
    } else {
      updatedUser = await prisma.tertiaryUser.update({
        where: { user_id },
        data: { purchasedLevel: level },
      });
    }

    return NextResponse.json({
      message: "Purchase successful",
      level: updatedUser.purchasedLevel,
    });
  } catch (error) {
    console.error("Purchase API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
