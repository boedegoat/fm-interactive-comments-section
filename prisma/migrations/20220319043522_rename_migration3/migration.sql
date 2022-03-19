/*
 Warnings:
 
 - You are about to drop the column `replyToId` on the `Comment` table. All the data in the column will be lost.
 
 */
-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_replyToId_fkey";
-- AlterTable
ALTER TABLE "Comment"
  RENAME COLUMN "replyToId" TO "replyingToId";
-- AddForeignKey
ALTER TABLE "Comment"
ADD CONSTRAINT "Comment_replyingToId_fkey" FOREIGN KEY ("replyingToId") REFERENCES "Comment"("id") ON DELETE
SET NULL ON UPDATE CASCADE;