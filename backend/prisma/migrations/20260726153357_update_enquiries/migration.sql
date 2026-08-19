/*
  Warnings:

  - You are about to drop the column `message` on the `Enquiry` table. All the data in the column will be lost.
  - You are about to drop the column `response` on the `Enquiry` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Enquiry" DROP COLUMN "message",
DROP COLUMN "response",
ADD COLUMN     "closedAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "EnquiryMessage" (
    "id" SERIAL NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "enquiryId" INTEGER NOT NULL,
    "senderId" INTEGER NOT NULL,

    CONSTRAINT "EnquiryMessage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "EnquiryMessage" ADD CONSTRAINT "EnquiryMessage_enquiryId_fkey" FOREIGN KEY ("enquiryId") REFERENCES "Enquiry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EnquiryMessage" ADD CONSTRAINT "EnquiryMessage_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
