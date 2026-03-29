-- CreateTable
CREATE TABLE "ReminderAction" (
    "id" TEXT NOT NULL,
    "reminderId" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "metadata" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReminderAction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ReminderAction_reminderId_idx" ON "ReminderAction"("reminderId");

-- CreateIndex
CREATE INDEX "ReminderAction_taskId_idx" ON "ReminderAction"("taskId");

-- CreateIndex
CREATE INDEX "ReminderAction_action_idx" ON "ReminderAction"("action");

-- AddForeignKey
ALTER TABLE "ReminderAction" ADD CONSTRAINT "ReminderAction_reminderId_fkey" FOREIGN KEY ("reminderId") REFERENCES "Reminder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReminderAction" ADD CONSTRAINT "ReminderAction_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;
