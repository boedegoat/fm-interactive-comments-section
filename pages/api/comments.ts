import apiHandler from '../../lib/apiHandler'
import { getComments } from '../../lib/comments'

// GET /api/comments
export default apiHandler(async (req, res) => {
  if (req.method !== 'GET') return
  const comments = await getComments()
  res.status(200).json(comments)
})
