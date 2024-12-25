-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SecondaryUser" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "purchasedLevel" INTEGER NOT NULL DEFAULT 0,
    "referralCode" TEXT NOT NULL,
    "totalPoints" REAL NOT NULL DEFAULT 0,
    "lastTransactionAmount" REAL,
    "lastTransactionLevel" INTEGER,
    "miningStartTime" DATETIME,
    "endTime" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'inactive'
);
INSERT INTO "new_SecondaryUser" ("endTime", "id", "lastTransactionAmount", "lastTransactionLevel", "miningStartTime", "referralCode", "status", "totalPoints", "user_id", "username") SELECT "endTime", "id", "lastTransactionAmount", "lastTransactionLevel", "miningStartTime", "referralCode", "status", "totalPoints", "user_id", "username" FROM "SecondaryUser";
DROP TABLE "SecondaryUser";
ALTER TABLE "new_SecondaryUser" RENAME TO "SecondaryUser";
CREATE UNIQUE INDEX "SecondaryUser_user_id_key" ON "SecondaryUser"("user_id");
CREATE TABLE "new_TertiaryUser" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "purchasedLevel" INTEGER NOT NULL DEFAULT 0,
    "referralCode" TEXT NOT NULL,
    "totalPoints" REAL NOT NULL DEFAULT 0,
    "lastTransactionAmount" REAL,
    "lastTransactionLevel" INTEGER,
    "miningStartTime" DATETIME,
    "endTime" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'inactive'
);
INSERT INTO "new_TertiaryUser" ("endTime", "id", "lastTransactionAmount", "lastTransactionLevel", "miningStartTime", "referralCode", "status", "totalPoints", "user_id", "username") SELECT "endTime", "id", "lastTransactionAmount", "lastTransactionLevel", "miningStartTime", "referralCode", "status", "totalPoints", "user_id", "username" FROM "TertiaryUser";
DROP TABLE "TertiaryUser";
ALTER TABLE "new_TertiaryUser" RENAME TO "TertiaryUser";
CREATE UNIQUE INDEX "TertiaryUser_user_id_key" ON "TertiaryUser"("user_id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
