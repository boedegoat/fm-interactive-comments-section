import { FC, FormEventHandler, useState } from 'react'
import useComments from '../hooks/useComments'
import data from '../data.json'
import { CommentType } from '../lib/typings'

const currentUser = { ...data.currentUser, name: data.currentUser.username }

interface Props {
  type: 'newComment' | 'reply'
  comment?: CommentType
  setReplyMode?: React.Dispatch<React.SetStateAction<boolean>>
}

const WriteComment: FC<Props> = ({ type, comment, setReplyMode }) => {
  const { mutate } = useComments()
  const [newComment, setNewComment] = useState('')
  const btnText = {
    reply: 'reply',
    newComment: 'send',
  }

  const writeComment: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()
    if (!newComment) return

    // reset comment field
    setNewComment('')

    const tempComment = {
      id: Date.now(),
      content: newComment,
      createdAt: new Date(),
      replies: [],
      upScoredBy: [],
      replyingToId: null,
      score: 0,
      user: currentUser,
      userId: currentUser.id,
      mentionToId: null,
      mentionTo: null,
    } as CommentType

    if (type === 'newComment') {
      // mutate temp comment to the UI immediately without fetching
      mutate((comments) => {
        if (!comments) return
        return [...comments, tempComment]
      }, false)

      // update comment in the db
      await fetch('/api/comment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: newComment }),
      })

      // revalidate comments (runs GET fetcher)
      mutate()
    }
    if (type === 'reply') {
      mutate((comments) => {
        if (!comments) return
        const newComments = [...comments]
        const parentCommentIndex = newComments.findIndex((_comment) => {
          if (comment!.replyingToId) {
            return _comment.id === comment!.replyingToId
          }
          return _comment.id === comment!.id
        })
        const parentComment = newComments[parentCommentIndex]

        newComments.splice(parentCommentIndex, 1, {
          ...parentComment,
          replies: [
            ...parentComment.replies,
            {
              ...tempComment,
              mentionTo: comment!.user,
              mentionToId: comment!.userId,
            },
          ],
        })
        return newComments
      }, false)

      setReplyMode!(false)

      const id = comment!.replyingToId ?? comment!.id

      // update comment in the db
      await fetch('/api/comment/reply/' + id, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newComment,
          mentionToId: comment!.userId,
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
