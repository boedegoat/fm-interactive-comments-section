import { FC, FormEventHandler, useState } from 'react'
import useComments from '../hooks/useComments'
import data from '../data.json'

const currentUser = { ...data.currentUser, name: data.currentUser.username }

interface Props {
  type: 'newComment' | 'reply'
}

const WriteComment: FC<Props> = ({ type }) => {
  const { mutate } = useComments()
  const [newComment, setNewComment] = useState('')
  const btnText = {
    reply: 'reply',
    newComment: 'send',
  }

  const writeComment: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()
    if (!newComment) return
    if (type === 'newComment') {
      // mutate temp comment to the UI immediately without fetching
      mutate((comments) => {
        if (!comments) return
        return [
          ...comments,
          {
            id: Date.now(),
            content: newComment,
            createdAt: new Date(),
            replies: [],
            replyingToId: null,
            score: 0,
            user: currentUser,
            userId: currentUser.id,
          },
        ]
      }, false)

      // reset comment field
      setNewComment('')

      // update comment in the db
      await fetch('/api/comment', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentUser,
          content: newComment,
        }),
      })

      // revalidate comments (runs GET fetcher)
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
          value={newComment}
          autoFocus
          onChange={(e) => setNewComment(e.target.value)}
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
