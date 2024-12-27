-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "languageCode" TEXT,
    "isPremium" BOOLEAN NOT NULL DEFAULT false,
    "walletAddress" TEXT,
    "purchasedLevel" INTEGER NOT NULL DEFAULT 0,
    "referralCode" TEXT NOT NULL,
    "totalPoints" REAL NOT NULL DEFAULT 0,
    "lastTransactionAmount" REAL,
    "lastTransactionLevel" INTEGER,
    "miningStartTime" DATETIME,
    "endTime" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'inactive'
);

-- CreateTable
CREATE TABLE "SecondaryUser" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "referralCode" TEXT NOT NULL,
    "totalPoints" REAL NOT NULL DEFAULT 0,
    "lastTransactionAmount" REAL,
    "lastTransactionLevel" INTEGER,
    "miningStartTime" DATETIME,
    "endTime" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'inactive'
);

-- CreateTable
CREATE TABLE "TertiaryUser" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "referralCode" TEXT NOT NULL,
    "totalPoints" REAL NOT NULL DEFAULT 0,
    "lastTransactionAmount" REAL,
    "lastTransactionLevel" INTEGER,
    "miningStartTime" DATETIME,
    "endTime" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'inactive'
);

-- CreateIndex
CREATE UNIQUE INDEX "User_user_id_key" ON "User"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "SecondaryUser_user_id_key" ON "SecondaryUser"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "TertiaryUser_user_id_key" ON "TertiaryUser"("user_id");
