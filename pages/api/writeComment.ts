import apiHandler from '../../lib/apiHandler'
import prisma from '../../lib/prisma'

// PATCH /api/writeComment
export default apiHandler(async (req, res) => {
  if (req.method !== 'PATCH') return
  const { currentUser, content } = req.body

  const comment = await prisma.comment.create({
    data: { content, createdAt: '', userId: currentUser.id },
    include: {
      user: true,
      replies: {
        include: {
          user: true,
        },
      },
    },
  })

  res.status(201).json(comment)
})
