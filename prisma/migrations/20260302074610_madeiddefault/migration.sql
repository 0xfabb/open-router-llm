/*
  Warnings:

  - The primary key for the `APIKey` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Made the column `id` on table `APIKey` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "APIKey" DROP CONSTRAINT "APIKey_pkey",
ALTER COLUMN "id" SET NOT NULL,
ADD CONSTRAINT "APIKey_pkey" PRIMARY KEY ("id");
