/*
  Warnings:

  - You are about to drop the column `replyToId` on the `Comment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "replyToId",
ADD COLUMN     "replyCommentId" INTEGER;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_replyCommentId_fkey" FOREIGN KEY ("replyCommentId") REFERENCES "Comment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
