/*
  Warnings:

  - You are about to drop the `UserCommunityReputation` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserCommunityReputation" DROP CONSTRAINT "UserCommunityReputation_communityId_fkey";

-- DropForeignKey
ALTER TABLE "UserCommunityReputation" DROP CONSTRAINT "UserCommunityReputation_userId_fkey";

-- AlterTable
ALTER TABLE "UserCommunity" ADD COLUMN     "reputation" INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE "UserCommunityReputation";
