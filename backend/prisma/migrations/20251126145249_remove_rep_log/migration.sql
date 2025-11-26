/*
  Warnings:

  - You are about to drop the `ReputationLog` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ReputationLog" DROP CONSTRAINT "ReputationLog_communityId_fkey";

-- DropForeignKey
ALTER TABLE "ReputationLog" DROP CONSTRAINT "ReputationLog_userId_fkey";

-- DropTable
DROP TABLE "ReputationLog";
