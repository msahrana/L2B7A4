/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `Payments` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Payments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Payments" ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Payments_userId_key" ON "Payments"("userId");

-- AddForeignKey
ALTER TABLE "Payments" ADD CONSTRAINT "Payments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
