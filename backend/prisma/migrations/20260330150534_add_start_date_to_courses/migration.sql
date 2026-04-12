/*
  Warnings:

  - You are about to drop the column `failedLoginAttempts` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `lockedUntil` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `passwordResetExpiresAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `passwordResetTokenHash` on the `User` table. All the data in the column will be lost.
  - Added the required column `startDate` to the `Course` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "failedLoginAttempts",
DROP COLUMN "lockedUntil",
DROP COLUMN "passwordResetExpiresAt",
DROP COLUMN "passwordResetTokenHash";
