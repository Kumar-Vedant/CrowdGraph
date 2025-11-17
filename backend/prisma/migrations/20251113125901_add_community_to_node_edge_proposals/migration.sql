/*
  Warnings:

  - You are about to drop the column `description` on the `EdgeProposal` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `NodeProposal` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `NodeProposal` table. All the data in the column will be lost.
  - Added the required column `communityId` to the `EdgeProposal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `communityId` to the `NodeProposal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `NodeProposal` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "EdgeProposal" DROP COLUMN "description",
ADD COLUMN     "communityId" TEXT NOT NULL,
ADD COLUMN     "properties" JSONB;

-- AlterTable
ALTER TABLE "NodeProposal" DROP COLUMN "description",
DROP COLUMN "title",
ADD COLUMN     "communityId" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "NodeProposal" ADD CONSTRAINT "NodeProposal_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "Community"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EdgeProposal" ADD CONSTRAINT "EdgeProposal_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "Community"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
