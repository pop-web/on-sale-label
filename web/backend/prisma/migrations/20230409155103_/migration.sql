/*
  Warnings:

  - You are about to drop the column `destination` on the `label` table. All the data in the column will be lost.
  - You are about to drop the column `discountCode` on the `label` table. All the data in the column will be lost.
  - You are about to drop the column `discountId` on the `label` table. All the data in the column will be lost.
  - You are about to drop the column `handle` on the `label` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `label` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `label` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_label" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "variantId" TEXT NOT NULL,
    "labelName" TEXT,
    "startAt" DATETIME,
    "endAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_label" ("createdAt", "id", "updatedAt", "variantId") SELECT "createdAt", "id", "updatedAt", "variantId" FROM "label";
DROP TABLE "label";
ALTER TABLE "new_label" RENAME TO "label";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
