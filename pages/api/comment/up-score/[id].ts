import apiHandler from '../../../../lib/apiHandler'
import { upScore } from '../../../../lib/comments'

export default apiHandler(async (req, res) => {
  // PATCH /api/comment/up-score/[id]
  if (req.method == 'PATCH') {
    console.log('update')
    const { id } = req.query
    await upScore(Number(id))
    res.status(200).json({})
  }
})
