-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_label" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,
    "handle" TEXT NOT NULL,
    "destination" TEXT,
    "discountId" TEXT,
    "discountCode" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_label" ("destination", "discountCode", "discountId", "handle", "id", "productId", "title", "variantId") SELECT "destination", "discountCode", "discountId", "handle", "id", "productId", "title", "variantId" FROM "label";
DROP TABLE "label";
ALTER TABLE "new_label" RENAME TO "label";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
