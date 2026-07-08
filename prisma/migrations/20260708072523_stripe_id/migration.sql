/*
  Warnings:

  - A unique constraint covering the columns `[stripeCustomerId]` on the table `Payments` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[stripeSubscriptionId]` on the table `Payments` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `stripeCustomerId` to the `Payments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stripeSubscriptionId` to the `Payments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Payments" ADD COLUMN     "stripeCustomerId" TEXT NOT NULL,
ADD COLUMN     "stripeSubscriptionId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Payments_stripeCustomerId_key" ON "Payments"("stripeCustomerId");

-- CreateIndex
CREATE UNIQUE INDEX "Payments_stripeSubscriptionId_key" ON "Payments"("stripeSubscriptionId");
