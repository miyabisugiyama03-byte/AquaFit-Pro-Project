-- AlterTable
ALTER TABLE "Block" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;
