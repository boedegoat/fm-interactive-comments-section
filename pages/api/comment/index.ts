import apiHandler from '../../../lib/apiHandler'
import { createComment, getComments } from '../../../lib/comments'

// GET /api/comment
export default apiHandler(async (req, res) => {
  if (req.method == 'GET') {
    const comments = await getComments()
    res.status(200).json(comments)
  }
  if (req.method == 'POST') {
    const { content } = req.body
    const comment = await createComment(content)
    res.status(201).json(comment)
  }
})
