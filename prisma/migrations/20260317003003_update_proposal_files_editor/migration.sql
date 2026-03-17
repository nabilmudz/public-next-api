/*
  Warnings:

  - Added the required column `inputMode` to the `Proposal` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ProposalInputMode" AS ENUM ('EDITOR', 'UPLOAD');

-- AlterTable
ALTER TABLE "Proposal" ADD COLUMN     "editorContent" TEXT,
ADD COLUMN     "fileMimeType" TEXT,
ADD COLUMN     "fileName" TEXT,
ADD COLUMN     "fileSize" INTEGER,
ADD COLUMN     "fileUrl" TEXT,
ADD COLUMN     "inputMode" "ProposalInputMode" NOT NULL;
