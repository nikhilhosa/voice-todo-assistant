/*
  Warnings:

  - Made the column `language` on table `VoiceInput` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "VoiceInput" ALTER COLUMN "language" SET NOT NULL,
ALTER COLUMN "language" SET DEFAULT 'en',
ALTER COLUMN "status" SET DEFAULT 'pending';

-- CreateIndex
CREATE INDEX "VoiceInput_userId_idx" ON "VoiceInput"("userId");
