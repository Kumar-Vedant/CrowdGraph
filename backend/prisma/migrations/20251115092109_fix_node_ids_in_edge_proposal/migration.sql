/*
  Warnings:

  - You are about to drop the column `kgSourceId` on the `EdgeProposal` table. All the data in the column will be lost.
  - You are about to drop the column `kgTargetId` on the `EdgeProposal` table. All the data in the column will be lost.
  - You are about to drop the column `sourceNodeId` on the `EdgeProposal` table. All the data in the column will be lost.
  - You are about to drop the column `targetNodeId` on the `EdgeProposal` table. All the data in the column will be lost.
  - Added the required column `sourceId` to the `EdgeProposal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `targetId` to the `EdgeProposal` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "EdgeProposal" DROP COLUMN "kgSourceId",
DROP COLUMN "kgTargetId",
DROP COLUMN "sourceNodeId",
DROP COLUMN "targetNodeId",
ADD COLUMN     "sourceId" TEXT NOT NULL,
ADD COLUMN     "targetId" TEXT NOT NULL;
