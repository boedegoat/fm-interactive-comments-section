import { NextApiRequest, NextApiResponse } from 'next'

const apiHandler = (
  handler: (req: NextApiRequest, res: NextApiResponse) => any
) => {
  return (req: NextApiRequest, res: NextApiResponse) => {
    try {
      handler(req, res)
    } catch (err) {
      res.status(500).json({ status: 500 })
    }
  }
}

export default apiHandler
