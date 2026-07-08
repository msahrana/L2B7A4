-- DropIndex
DROP INDEX "Payments_stripeSubscriptionId_key";

-- AlterTable
ALTER TABLE "Payments" ALTER COLUMN "stripeSubscriptionId" DROP NOT NULL;
