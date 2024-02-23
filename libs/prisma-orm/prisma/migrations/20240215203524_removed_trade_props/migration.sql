/*
  Warnings:

  - You are about to drop the column `endedAt` on the `Trade` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Trade` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Trade" DROP COLUMN "endedAt",
DROP COLUMN "status";
