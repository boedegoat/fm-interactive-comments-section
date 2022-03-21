import { FC, FormEventHandler, useState } from 'react'
import useComments from '../hooks/useComments'
import { CommentType } from '../lib/typings'
import data from '../data.json'

const currentUser = { ...data.currentUser, name: data.currentUser.username }

interface Props {
  type: 'newComment' | 'reply'
}

const WriteComment: FC<Props> = ({ type }) => {
  const { comments, mutate } = useComments()
  const [comment, setComment] = useState('')
  const btnText = {
    reply: 'reply',
    newComment: 'send',
  }

  const writeComment: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()
    if (!comment) return
    if (type === 'newComment') {
      // mutate new comment to the UI immediately without fetching
      const newComment: CommentType = {
        id: comments.length + 1,
        content: comment,
        createdAt: '',
        replies: [],
        replyingToId: null,
        score: 0,
        user: currentUser,
        userId: currentUser.id,
      }
      mutate((comments) => [...comments!, newComment], false)

      // reset comment field
      setComment('')

      // finally, write the comment and send it to cloud
      await fetch('/api/writeComment', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentUser,
          content: comment,
        }),
      })

      // revalidate (runs fetcher then update the data)
      mutate()
    }
  }

  return (
    <form onSubmit={writeComment}>
      <div className="mt-8 rounded-lg bg-white p-5 shadow-sm">
        <textarea
          className="comment-field"
          rows={3}
          placeholder="Add a comment..."
          value={comment}
          autoFocus
          onChange={(e) => setComment(e.target.value)}
        ></textarea>
        <div className="mt-4 flex items-center justify-between">
          <img
            className="h-7 w-7 object-cover"
            src={currentUser.image.png}
            alt={currentUser.name}
          />
          <button className="send-comment-btn" type="submit">
            {btnText[type]}
          </button>
        </div>
      </div>
    </form>
  )
}

export default WriteComment
