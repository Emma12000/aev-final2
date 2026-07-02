-- DropIndex
DROP INDEX "users_resetPasswordToken_idx";

-- AlterTable
ALTER TABLE "documents" ADD COLUMN     "downloadCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "pageCount" INTEGER,
ADD COLUMN     "viewCount" INTEGER NOT NULL DEFAULT 0;
