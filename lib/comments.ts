import prisma from './prisma'
import data from '../data.json'

const currentUser = { ...data.currentUser, name: data.currentUser.username }

export async function getComments() {
  const comments = await prisma.comment.findMany({
    where: {
      replyingTo: null,
    },
    include: {
      upScoredBy: true,
      user: true,
      mentionTo: true,
      replies: {
        include: {
          upScoredBy: true,
          user: true,
          mentionTo: true,
        },
        orderBy: { score: 'desc' },
      },
    },
    orderBy: {
      createdAt: 'asc',
    },
  })
  return JSON.stringify(comments)
}

export async function createComment(content: string) {
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

export async function replyComment(
  content: string,
  commentId: number,
  mentionToId: number
) {
  const comment = await prisma.comment.update({
    where: { id: commentId },
    data: {
      replies: {
        create: { content, userId: currentUser.id, mentionToId },
      },
    },
  })
  return comment
}

export async function upScore(commentId: number) {
  await prisma.comment.update({
    where: { id: commentId },
    data: {
      score: { increment: 1 },
      upScoredBy: { connect: { id: currentUser.id } },
    },
  })
}

export async function downScore(commentId: number) {
  await prisma.comment.update({
    where: { id: commentId },
    data: {
      score: { decrement: 1 },
      upScoredBy: { disconnect: { id: currentUser.id } },
    },
  })
}
