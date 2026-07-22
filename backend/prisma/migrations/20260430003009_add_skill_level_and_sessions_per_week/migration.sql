-- CreateEnum
CREATE TYPE "SkillLevel" AS ENUM ('BEGINNER', 'IMPROVER', 'DEVELOPMENT', 'ADVANCED');

-- CreateEnum
CREATE TYPE "SessionsPerWeek" AS ENUM ('ONE', 'TWO');

-- AlterTable
ALTER TABLE "Block" ADD COLUMN     "sessionsPerWeek" "SessionsPerWeek" NOT NULL DEFAULT 'ONE',
ADD COLUMN     "skillLevel" "SkillLevel" NOT NULL DEFAULT 'BEGINNER';
