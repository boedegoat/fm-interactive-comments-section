import React, { FC, useEffect, useState } from 'react'
import { CommentType } from '../lib/typings'
import data from '../data.json'
import WriteComment from './WriteComment'
import useComments from '../hooks/useComments'
import { useModal } from './ModalProvider'
import TimeAgo from 'timeago-react'

const currentUser = { ...data.currentUser, name: data.currentUser.username }

interface Props {
  comment: CommentType
}

const Comment: FC<Props> = ({ comment }) => {
  const isMe = currentUser.id == comment.userId
  const [replyMode, setReplyMode] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const { mutate } = useComments()
  const { showModal } = useModal()

  const [allowUpScore, setAllowUpScore] = useState(true)
  const [allowDownScore, setAllowDownScore] = useState(true)

  const [editContent, setEditContent] = useState<string>()

  const confirmDelete = async (commentId: number) => {
    showModal({
      title: 'Delete Comment',
      description:
        "Are you sure want to delete this comment? This will remove the comment and can't be undone.",
      cancelBtn: 'no, cancel',
      confirmBtn: 'yes, delete',
      onConfirm: () => deleteComment(commentId),
    })
  }

  const deleteComment = async (commentId: number) => {
    // mutate new comments immediately without fetching
    mutate(
      (comments) => comments?.filter((comment) => comment.id !== commentId),
      false
    )

    // delete comment in the actual cloud db
    await fetch('/api/comment/' + commentId, {
      method: 'DELETE',
    })

    // revalidate (runs GET fetcher then update the data)
    mutate()
  }

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

  const editComment = async () => {
    if (!editContent) {
      setEditContent(undefined)
      setEditMode(false)
      return
    }
    mutate((comments) => {
      if (!comments) return
      const newComments = [...comments]
      const index = newComments.findIndex(
        (newComment) => newComment.id == (comment.replyingToId || comment.id)
      )
      let newComment = newComments[index]
      if (comment.replyingToId) {
        const index = newComment.replies.findIndex(
          (newComment) => newComment.id == comment.id
        )
        newComment.replies = [
          ...newComment.replies.slice(0, index),
          { ...newComment.replies[index], content: editContent },
          ...newComment.replies.slice(index + 1),
        ]
      } else {
        newComment.content = editContent
      }

      return [
        ...newComments.slice(0, index),
        newComment,
        ...newComments.slice(index + 1),
      ]
    }, false)

    setEditContent(undefined)
    setEditMode(false)
    await fetch('/api/comment/' + comment.id, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: editContent,
      }),
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
    <>
      <div className="space-y-4 rounded-lg bg-white p-4 text-blue-dark-grayish shadow-sm">
        {/* comment author */}
        <div className="flex items-center space-x-4">
          <img
            className="h-7 w-7 object-cover"
            src={comment.user.image.png}
            alt={comment.user.name}
          />
          <h3 className="font-medium text-blue-dark">
            {comment.user.name}{' '}
            {isMe && (
              <span className="ml-1 rounded-sm bg-blue-moderate p-[1px] px-[3px] text-sm text-white">
                you
              </span>
            )}
          </h3>
          <TimeAgo
            className="text-sm font-light"
            datetime={comment.createdAt}
          />
        </div>

        <div>
          {editMode ? (
            <div className="flex flex-col justify-between">
              <textarea
                className="w-full rounded-md border px-3 py-2 focus:border-blue-moderate focus:outline-none"
                rows={4}
                value={editContent ?? comment.content}
                onChange={(e) => setEditContent(e.target.value)}
                autoFocus
              ></textarea>
              <button
                onClick={() => editComment()}
                className="send-comment-btn mt-4 ml-auto"
              >
                update
              </button>
            </div>
          ) : (
            <p>
              {' '}
              {comment.mentionTo && (
                <span className="mr-1 font-medium text-blue-moderate">
                  @{comment.mentionTo.name}
                </span>
              )}
              {comment.content}
            </p>
          )}
        </div>

        {/* bottom menu */}
        <div className="flex items-center justify-between">
          {/* upvote btn */}
          <div className="flex items-center rounded-2xl bg-gray-100">
            <button
              disabled={!allowUpScore}
              className="p-4"
              onClick={() => upScoreComment(comment.id)}
            >
              <img src="/icon/icon-plus.svg" alt="icon-plus" />
            </button>
            <div className="font-medium text-blue-moderate">
              {comment.score}
            </div>
            <button
              disabled={!allowDownScore}
              onClick={() => downScoreComment(comment.id)}
              className="p-4"
            >
              <img src="/icon/icon-minus.svg" alt="icon-minus" />
            </button>
          </div>

          {isMe ? (
            // edit and delete btn
            <div className="flex items-center space-x-4">
              <button
                onClick={() => confirmDelete(comment.id)}
                className="flex items-center font-medium text-red-soft"
              >
                <img
                  src="/icon/icon-delete.svg"
                  alt="icon-delete"
                  className="mr-1"
                />{' '}
                Delete
              </button>
              <button
                onClick={() => setEditMode(!editMode)}
                className="flex items-center font-medium text-blue-moderate"
              >
                <img
                  src="/icon/icon-edit.svg"
                  alt="icon-edit"
                  className="mr-1"
                />{' '}
                Edit
              </button>
            </div>
          ) : (
            // reply btn
            <button
              onClick={() => setReplyMode(!replyMode)}
              className="flex items-center font-medium text-blue-moderate"
            >
              <img
                src="/icon/icon-reply.svg"
                alt="icon-reply"
                className="mr-1"
              />{' '}
              Reply
            </button>
          )}
        </div>
      </div>
      {/* reply comment field */}
      {replyMode && (
        <WriteComment
          setReplyMode={setReplyMode}
          comment={comment}
          type="reply"
        />
      )}
    </>
  )
}

export default Comment
