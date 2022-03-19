-- CreateTable
CREATE TABLE "User" (
  "id" SERIAL NOT NULL,
  "name" TEXT NOT NULL,
  "image" JSONB NOT NULL,
  CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "Comment" (
  "id" SERIAL NOT NULL,
  "content" TEXT NOT NULL,
  "score" INTEGER DEFAULT 0,
  "userId" INTEGER NOT NULL,
  "createdAt" TEXT NOT NULL,
  "replyCommentId" INTEGER,
  CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);
-- AddForeignKey
ALTER TABLE "Comment"
ADD CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "Comment"
ADD CONSTRAINT "Comment_replyCommentId_fkey" FOREIGN KEY ("replyCommentId") REFERENCES "Comment"("id") ON DELETE
SET NULL ON UPDATE CASCADE;
ALTER TABLE "Comment" DROP COLUMN "replyCommentId",
  ADD COLUMN "replyToId" TEXT NOT NULL;