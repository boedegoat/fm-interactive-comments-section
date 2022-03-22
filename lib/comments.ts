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
  return JSON.stringify(comments)
}

export async function createComment(currentUser: any, content: string) {
  const comment = await prisma.comment.create({
    data: { content, userId: currentUser.id },
    include: {
      user: true,
      replies: {
        include: {
          user: true,
        },
      },
    },
  })
  return comment
}
