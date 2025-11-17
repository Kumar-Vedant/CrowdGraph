/*
  Warnings:

  - You are about to drop the column `metadata` on the `NodeProposal` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "NodeProposal" DROP COLUMN "metadata",
ADD COLUMN     "labels" TEXT[],
ADD COLUMN     "properties" JSONB;
