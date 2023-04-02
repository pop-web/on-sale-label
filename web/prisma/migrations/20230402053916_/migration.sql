/*
  Warnings:

  - Added the required column `handle` to the `label` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productId` to the `label` table without a default value. This is not possible if the table is not empty.
  - Added the required column `variantId` to the `label` table without a default value. This is not possible if the table is not empty.

*/
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
    "discountCode" TEXT
);
INSERT INTO "new_label" ("id", "title") SELECT "id", "title" FROM "label";
DROP TABLE "label";
ALTER TABLE "new_label" RENAME TO "label";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
