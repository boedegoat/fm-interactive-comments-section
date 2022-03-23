import { FC, useEffect, useState } from 'react'
import useComments from '../hooks/useComments'
import { CommentType } from '../lib/typings'
import data from '../data.json'

const currentUser = { ...data.currentUser, name: data.currentUser.username }

interface Props {
  comment: CommentType
}

const UpScoreButton: FC<Props> = ({ comment }) => {
  const [allowUpScore, setAllowUpScore] = useState(true)
  const [allowDownScore, setAllowDownScore] = useState(true)
  const { mutate } = useComments()

  const updateUpScoreOptimistic = (type: 'increment' | 'decrement') => {
    mutate((comments) => {
      if (!comments) return
      const newComments = [...comments]
      const upScoredIndex = newComments.findIndex(
        (_comment) => _comment.id === comment.id
      )
      if (upScoredIndex >= 0) {
        newComments.splice(upScoredIndex, 1, {
          ...comment,
          score: type == 'increment' ? comment.score! + 1 : comment.score! - 1,
        })
      } else {
        // if its a reply comment
        const parentCommentIndex = newComments.findIndex((newComment) =>
          newComment.replies.includes(comment)
        )
        const parentComment = newComments[parentCommentIndex]
        const newReplies = [...parentComment.replies]
        const replyIndex = newReplies.findIndex(
          (reply) => reply.id === comment.id
        )
        newReplies.splice(replyIndex, 1, {
          ...comment,
          score: type == 'increment' ? comment.score! + 1 : comment.score! - 1,
        })
        newComments.splice(parentCommentIndex, 1, {
          ...parentComment,
          replies: newReplies,
        })
      }

      return newComments
    }, false)
  }

  const upScoreComment = async (commentId: number) => {
    updateUpScoreOptimistic('increment')
    setAllowUpScore(false)
    setAllowDownScore(true)
    await fetch('/api/comment/up-score/' + commentId, {
      method: 'PATCH',
    })
    mutate()
  }

  const downScoreComment = async (commentId: number) => {
    updateUpScoreOptimistic('decrement')
    setAllowDownScore(false)
    setAllowUpScore(true)
    await fetch('/api/comment/down-score/' + commentId, {
      method: 'PATCH',
    })
    mutate()
  }

  useEffect(() => {
    const hasUpScored = comment.upScoredBy.find(
      (user) => user.id == currentUser.id
    )

    if (hasUpScored) {
      setAllowUpScore(false)
      setAllowDownScore(true)
    } else {
      setAllowUpScore(true)
      setAllowDownScore(false)
    }
  }, [])

  return (
    <div className="flex items-center rounded-2xl bg-gray-100 md:mr-5 md:min-w-[45px] md:flex-col md:justify-center">
      <button
        disabled={!allowUpScore}
        className="p-4"
        onClick={() => upScoreComment(comment.id)}
      >
        <img src="/icon/icon-plus.svg" alt="icon-plus" />
      </button>
      <div className="font-medium text-blue-moderate">{comment.score}</div>
      <button
        disabled={!allowDownScore}
        onClick={() => downScoreComment(comment.id)}
        className="p-4"
      >
        <img src="/icon/icon-minus.svg" alt="icon-minus" />
      </button>
    </div>
  )
}

export default UpScoreButton
