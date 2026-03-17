-- AlterTable
ALTER TABLE "Proposal" ADD COLUMN     "ownerId" TEXT;

-- CreateIndex
CREATE INDEX "Proposal_ownerId_idx" ON "Proposal"("ownerId");

-- AddForeignKey
ALTER TABLE "Proposal" ADD CONSTRAINT "Proposal_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
