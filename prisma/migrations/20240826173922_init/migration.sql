-- CreateEnum
CREATE TYPE "AccountOperationType" AS ENUM ('DEPOSIT', 'WITHDRAW');

-- CreateTable
CREATE TABLE "account_holders" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_holders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "digital_accounts" (
    "id" UUID NOT NULL,
    "holderId" UUID NOT NULL,
    "agency" CHAR(4) NOT NULL,
    "accountNumber" CHAR(9) NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL,
    "isBlocked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "digital_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account_operations" (
    "id" UUID NOT NULL,
    "digitalAccountId" UUID NOT NULL,
    "type" "AccountOperationType" NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "balanceBefore" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_operations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "account_holders_cpf_key" ON "account_holders"("cpf");

-- CreateIndex
CREATE INDEX "account_holders_cpf_idx" ON "account_holders"("cpf");

-- CreateIndex
CREATE INDEX "digital_accounts_deletedAt_idx" ON "digital_accounts"("deletedAt");

-- CreateIndex
CREATE INDEX "digital_accounts_accountNumber_idx" ON "digital_accounts"("accountNumber");

-- CreateIndex
CREATE INDEX "account_operations_digitalAccountId_idx" ON "account_operations"("digitalAccountId");

-- AddForeignKey
ALTER TABLE "digital_accounts" ADD CONSTRAINT "digital_accounts_holderId_fkey" FOREIGN KEY ("holderId") REFERENCES "account_holders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account_operations" ADD CONSTRAINT "account_operations_digitalAccountId_fkey" FOREIGN KEY ("digitalAccountId") REFERENCES "digital_accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
