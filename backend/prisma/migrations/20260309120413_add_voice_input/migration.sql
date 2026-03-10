-- CreateTable
CREATE TABLE "VoiceInput" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "language" TEXT NOT NULL DEFAULT 'en',
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VoiceInput_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "VoiceInput_userId_idx" ON "VoiceInput"("userId");

-- AddForeignKey
ALTER TABLE "VoiceInput" ADD CONSTRAINT "VoiceInput_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
