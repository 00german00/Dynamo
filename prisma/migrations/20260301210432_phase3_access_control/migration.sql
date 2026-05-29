-- AlterTable
ALTER TABLE "Event" ADD COLUMN "viewerEmail" TEXT;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Portal" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "companyName" TEXT,
    "personas" JSONB,
    "accessMode" TEXT NOT NULL DEFAULT 'open',
    "allowedEmails" JSONB,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Portal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Portal" ("companyName", "createdAt", "description", "id", "personas", "slug", "title", "updatedAt", "userId") SELECT "companyName", "createdAt", "description", "id", "personas", "slug", "title", "updatedAt", "userId" FROM "Portal";
DROP TABLE "Portal";
ALTER TABLE "new_Portal" RENAME TO "Portal";
CREATE UNIQUE INDEX "Portal_slug_key" ON "Portal"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
