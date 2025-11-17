-- AlterTable
ALTER TABLE "Community" ADD COLUMN     "totalVotingPotential" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "UserCommunity" ADD COLUMN     "credits" INTEGER NOT NULL DEFAULT 0;
