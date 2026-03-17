/*
  Warnings:

  - Added the required column `leadName` to the `Proposal` table without a default value. This is not possible if the table is not empty.
  - Made the column `category` on table `Proposal` required. This step will fail if there are existing NULL values in that column.
  - Made the column `focusType` on table `Proposal` required. This step will fail if there are existing NULL values in that column.
  - Made the column `focusValue` on table `Proposal` required. This step will fail if there are existing NULL values in that column.
  - Made the column `schemeGroup` on table `Proposal` required. This step will fail if there are existing NULL values in that column.
  - Made the column `scopeLevel` on table `Proposal` required. This step will fail if there are existing NULL values in that column.
  - Made the column `firstProposalYear` on table `Proposal` required. This step will fail if there are existing NULL values in that column.
  - Made the column `durationMonths` on table `Proposal` required. This step will fail if there are existing NULL values in that column.
  - Made the column `scientificFieldLevel1` on table `Proposal` required. This step will fail if there are existing NULL values in that column.
  - Made the column `scientificFieldLevel2` on table `Proposal` required. This step will fail if there are existing NULL values in that column.
  - Made the column `scientificFieldLevel3` on table `Proposal` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Proposal" ADD COLUMN     "leadName" TEXT NOT NULL,
ALTER COLUMN "category" SET NOT NULL,
ALTER COLUMN "focusType" SET NOT NULL,
ALTER COLUMN "focusValue" SET NOT NULL,
ALTER COLUMN "schemeGroup" SET NOT NULL,
ALTER COLUMN "scopeLevel" SET NOT NULL,
ALTER COLUMN "firstProposalYear" SET NOT NULL,
ALTER COLUMN "durationMonths" SET NOT NULL,
ALTER COLUMN "scientificFieldLevel1" SET NOT NULL,
ALTER COLUMN "scientificFieldLevel2" SET NOT NULL,
ALTER COLUMN "scientificFieldLevel3" SET NOT NULL;

-- CreateTable
CREATE TABLE "ProposalServiceMember" (
    "id" TEXT NOT NULL,
    "proposalId" TEXT NOT NULL,
    "nidn" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "duty" TEXT NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "ProposalServiceMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProposalStudentMember" (
    "id" TEXT NOT NULL,
    "proposalId" TEXT NOT NULL,
    "memberType" TEXT NOT NULL,
    "identityNumber" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "duty" TEXT NOT NULL,

    CONSTRAINT "ProposalStudentMember_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProposalServiceMember" ADD CONSTRAINT "ProposalServiceMember_proposalId_fkey" FOREIGN KEY ("proposalId") REFERENCES "Proposal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProposalStudentMember" ADD CONSTRAINT "ProposalStudentMember_proposalId_fkey" FOREIGN KEY ("proposalId") REFERENCES "Proposal"("id") ON DELETE CASCADE ON UPDATE CASCADE;
