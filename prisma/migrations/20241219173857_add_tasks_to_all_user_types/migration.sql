/*
  Warnings:

  - You are about to alter the column `userId` on the `Task` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Task" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "taskId" TEXT NOT NULL,
    "userId" INTEGER,
    "secondaryUserId" INTEGER,
    "tertiaryUserId" INTEGER,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Task_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Task_secondaryUserId_fkey" FOREIGN KEY ("secondaryUserId") REFERENCES "SecondaryUser" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Task_tertiaryUserId_fkey" FOREIGN KEY ("tertiaryUserId") REFERENCES "TertiaryUser" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Task" ("completed", "id", "taskId", "userId") SELECT "completed", "id", "taskId", "userId" FROM "Task";
DROP TABLE "Task";
ALTER TABLE "new_Task" RENAME TO "Task";
CREATE UNIQUE INDEX "Task_taskId_userId_secondaryUserId_tertiaryUserId_key" ON "Task"("taskId", "userId", "secondaryUserId", "tertiaryUserId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
