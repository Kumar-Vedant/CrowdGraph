/*
  Warnings:

  - A unique constraint covering the columns `[targetId,userId]` on the table `Vote` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Vote_targetId_userId_key" ON "Vote"("targetId", "userId");
