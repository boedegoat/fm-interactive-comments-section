import apiHandler from '../../../../lib/apiHandler'
import { replyComment } from '../../../../lib/comments'

// POST /api/comment/reply/[id]
export default apiHandler(async (req, res) => {
  if (req.method == 'POST') {
    const { id } = req.query
    const { content, mentionToId } = req.body
    const comment = await replyComment(content, Number(id), mentionToId)
    res.status(201).json(comment)
  }
})
