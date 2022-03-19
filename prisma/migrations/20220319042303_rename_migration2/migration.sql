/*
 Warnings:
 
 - You are about to drop the column `replyCommentId` on the `Comment` table. All the data in the column will be lost.
 
 */
-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_replyCommentId_fkey";
-- AlterTable
ALTER TABLE "Comment"
  RENAME COLUMN "replyCommentId" TO "replyToId";
-- AddForeignKey
ALTER TABLE "Comment"
ADD CONSTRAINT "Comment_replyToId_fkey" FOREIGN KEY ("replyToId") REFERENCES "Comment"("id") ON DELETE
SET NULL ON UPDATE CASCADE;