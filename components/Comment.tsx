import React, { FC } from 'react'
import { CommentType } from '../lib/typings'

interface Props {
  comment: CommentType
}

const Comment: FC<Props> = ({ comment }) => {
  return (
    <div>
      <p>{comment.content}</p>
      <p>by {comment.user.name}</p>
    </div>
  )
}

export default Comment
