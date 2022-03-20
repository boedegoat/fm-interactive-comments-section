import apiHandler from '../../../lib/apiHandler'
import prisma from '../../../lib/prisma'

// GET /api/comments
export default apiHandler(async (req, res) => {
  if (req.method === 'DELETE') {
    const { id } = req.query
    const deletedComment = await prisma.comment.delete({
      where: { id: Number(id) },
    })
    res.status(200).json(deletedComment)
  }
})
