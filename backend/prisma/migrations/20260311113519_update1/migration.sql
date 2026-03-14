-- DropIndex
DROP INDEX "VoiceInput_userId_idx";

-- AlterTable
ALTER TABLE "VoiceInput" ALTER COLUMN "language" DROP NOT NULL,
ALTER COLUMN "language" DROP DEFAULT,
ALTER COLUMN "status" DROP DEFAULT;

-- CreateIndex
CREATE INDEX "VoiceInput_status_idx" ON "VoiceInput"("status");
