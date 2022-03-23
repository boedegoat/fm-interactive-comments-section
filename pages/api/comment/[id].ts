import apiHandler from '../../../lib/apiHandler'
import prisma from '../../../lib/prisma'

export default apiHandler(async (req, res) => {
  // DELETE /api/comment/[id]
  if (req.method == 'DELETE') {
    const { id } = req.query
    const deletedComment = await prisma.comment.delete({
      where: { id: Number(id) },
    })
    res.status(200).json(deletedComment)
  }

  // PATCH /api/comment/[id]
  if (req.method == 'PATCH') {
    const { id } = req.query
    const { content } = req.body
    const editedComment = await prisma.comment.update({
      where: { id: Number(id) },
      data: {
        content,
      },
    })
    console.log(editedComment)
    res.status(200).json(editedComment)
  }
})
