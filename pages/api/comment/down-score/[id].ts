import apiHandler from '../../../../lib/apiHandler'
import { downScore } from '../../../../lib/comments'

export default apiHandler(async (req, res) => {
  // PATCH /api/comment/down-score[id]
  if (req.method == 'PATCH') {
    console.log('update')
    const { id } = req.query
    await downScore(Number(id))
    res.status(200).json({})
  }
})
