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
})
