-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SMSToekn" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "token" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "SMSToekn_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_SMSToekn" ("created_at", "id", "token", "updated_at", "userId") SELECT "created_at", "id", "token", "updated_at", "userId" FROM "SMSToekn";
DROP TABLE "SMSToekn";
ALTER TABLE "new_SMSToekn" RENAME TO "SMSToekn";
CREATE UNIQUE INDEX "SMSToekn_token_key" ON "SMSToekn"("token");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
