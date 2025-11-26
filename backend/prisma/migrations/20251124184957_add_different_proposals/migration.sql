-- CreateEnum
CREATE TYPE "ProposalType" AS ENUM ('CREATE', 'UPDATE', 'DELETE');

-- AlterTable
ALTER TABLE "EdgeProposal" ADD COLUMN     "proposalType" "ProposalType" NOT NULL DEFAULT 'CREATE';

-- AlterTable
ALTER TABLE "NodeProposal" ADD COLUMN     "proposalType" "ProposalType" NOT NULL DEFAULT 'CREATE';
