/*
  Warnings:

  - You are about to drop the column `stripeSubscriptionId` on the `Payments` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Payments_stripeCustomerId_key";

-- DropIndex
DROP INDEX "Payments_userId_key";

-- AlterTable
ALTER TABLE "Payments" DROP COLUMN "stripeSubscriptionId";
