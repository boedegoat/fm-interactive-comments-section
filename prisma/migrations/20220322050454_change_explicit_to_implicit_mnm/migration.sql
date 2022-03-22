/*
  Warnings:

  - You are about to drop the `UsersUpscoreComments` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UsersUpscoreComments" DROP CONSTRAINT "UsersUpscoreComments_commentId_fkey";

-- DropForeignKey
ALTER TABLE "UsersUpscoreComments" DROP CONSTRAINT "UsersUpscoreComments_userId_fkey";

-- DropTable
DROP TABLE "UsersUpscoreComments";

-- CreateTable
CREATE TABLE "_UsersUpscoreComments" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_UsersUpscoreComments_AB_unique" ON "_UsersUpscoreComments"("A", "B");

-- CreateIndex
CREATE INDEX "_UsersUpscoreComments_B_index" ON "_UsersUpscoreComments"("B");

-- AddForeignKey
ALTER TABLE "_UsersUpscoreComments" ADD FOREIGN KEY ("A") REFERENCES "Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UsersUpscoreComments" ADD FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
