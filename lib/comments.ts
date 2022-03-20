import prisma from './prisma'

export async function getComments() {
  const comments = await prisma.comment.findMany({
    where: {
      replyingTo: null,
    },
    include: {
      user: true,
      replies: {
        include: {
          user: true,
        },
      },
    },
  })
  return comments
}
