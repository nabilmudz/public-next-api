-- CreateEnum
CREATE TYPE "ProgramCategory" AS ENUM ('PENELITIAN', 'PENGABDIAN');

-- CreateEnum
CREATE TYPE "FocusType" AS ENUM ('TEMATIK', 'RIRN');

-- CreateEnum
CREATE TYPE "ScopeLevel" AS ENUM ('LOKAL', 'REGIONAL', 'NASIONAL', 'INTERNASIONAL');

-- CreateEnum
CREATE TYPE "ProposalStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "Proposal" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" "ProgramCategory",
    "focusType" "FocusType",
    "focusValue" TEXT,
    "schemeGroup" TEXT,
    "scopeLevel" "ScopeLevel",
    "firstProposalYear" INTEGER,
    "durationMonths" INTEGER,
    "scientificFieldLevel1" TEXT,
    "scientificFieldLevel2" TEXT,
    "scientificFieldLevel3" TEXT,
    "status" "ProposalStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Proposal_pkey" PRIMARY KEY ("id")
);
