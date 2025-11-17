/*
  Warnings:

  - You are about to drop the column `proposalId` on the `Vote` table. All the data in the column will be lost.
  - You are about to drop the column `proposalType` on the `Vote` table. All the data in the column will be lost.
  - Added the required column `targetId` to the `Vote` table without a default value. This is not possible if the table is not empty.
  - Added the required column `targetType` to the `Vote` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TargetType" AS ENUM ('NODE_PROPOSAL', 'EDGE_PROPOSAL', 'POST', 'COMMENT');

-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "voteCount" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "EdgeProposal" ADD COLUMN     "downvotes" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "upvotes" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "NodeProposal" ADD COLUMN     "downvotes" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "upvotes" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "voteCount" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Vote" DROP COLUMN "proposalId",
DROP COLUMN "proposalType",
ADD COLUMN     "targetId" TEXT NOT NULL,
ADD COLUMN     "targetType" "TargetType" NOT NULL;

-- DropEnum
DROP TYPE "ProposalType";
