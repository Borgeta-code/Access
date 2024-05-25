/*
  Warnings:

  - You are about to drop the column `faceImage` on the `Client` table. All the data in the column will be lost.
  - Added the required column `faceImageName` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `faceImageUrl` to the `Client` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Client" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "faceImageUrl" TEXT NOT NULL,
    "faceImageName" TEXT NOT NULL,
    "isAllowed" BOOLEAN NOT NULL
);
INSERT INTO "new_Client" ("id", "isAllowed", "name") SELECT "id", "isAllowed", "name" FROM "Client";
DROP TABLE "Client";
ALTER TABLE "new_Client" RENAME TO "Client";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
