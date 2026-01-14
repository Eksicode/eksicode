-- CreateTable
CREATE TABLE "telegram_verifications" (
    "id" SERIAL NOT NULL,
    "userId" BIGINT NOT NULL,
    "chatId" BIGINT NOT NULL,
    "messageId" INTEGER NOT NULL,
    "firstName" VARCHAR(255),
    "lastName" VARCHAR(255),
    "username" VARCHAR(255),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "telegram_verifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "telegram_verifications_userId_key" ON "telegram_verifications"("userId");

-- CreateIndex
CREATE INDEX "telegram_verifications_userId_idx" ON "telegram_verifications"("userId");

-- CreateIndex
CREATE INDEX "telegram_verifications_chatId_idx" ON "telegram_verifications"("chatId");

-- CreateIndex
CREATE INDEX "telegram_verifications_expiresAt_idx" ON "telegram_verifications"("expiresAt");
