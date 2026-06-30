-- AlterTable
ALTER TABLE "users" ADD COLUMN "emailVerified" BOOLEAN NOT NULL DEFAULT false,
                    ADD COLUMN "emailVerifyToken" TEXT,
                    ADD COLUMN "emailVerifyExpires" TIMESTAMP(3);
