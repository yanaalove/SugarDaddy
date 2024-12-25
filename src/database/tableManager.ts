import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function checkPrimaryTableSize(): Promise<string> {
  const count = await prisma.user.count();
  if (count >= 1000000) {
    console.log("Primary table is full.");
    return "Primary table is full.";
  } else {
    return "Primary table has space.";
  }
}

export async function checkSecondaryTableSize(): Promise<string> {
  const count = await prisma.secondaryUser.count();
  if (count >= 1000000) {
    console.log("Secondary table is full.");
    return "Secondary table is full.";
  } else {
    return "Secondary table has space.";
  }
}

export async function insertIntoSecondaryTable(
  user_id: string, // Changed from user_Id to user_id
  username: string,
  referralCode: string
): Promise<void> {
  await prisma.secondaryUser.create({
    data: {
      user_id, // Changed from user_Id to user_id
      username,
      referralCode,
      totalPoints: 0,
    },
  });
  console.log("Data inserted successfully into secondary table.");
}

export async function insertIntoTertiaryTable(
  user_id: string, // Changed from user_Id to user_id
  username: string,
  referralCode: string
): Promise<void> {
  await prisma.tertiaryUser.create({
    data: {
      user_id, // Changed from user_Id to user_id
      username,
      referralCode,
      totalPoints: 0,
    },
  });
  console.log("Data inserted successfully into tertiary table.");
}
