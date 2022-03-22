-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "mentionToId" INTEGER;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_mentionToId_fkey" FOREIGN KEY ("mentionToId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
