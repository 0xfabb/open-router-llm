/*
  Warnings:

  - The primary key for the `APIKey` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "APIKey" DROP CONSTRAINT "APIKey_pkey",
ADD CONSTRAINT "APIKey_pkey" PRIMARY KEY ("userName");
