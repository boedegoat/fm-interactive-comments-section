import React, { FC, useState } from 'react'
import { CommentType } from '../lib/typings'
import WriteComment from './WriteComment'
import useComments from '../hooks/useComments'
import TimeAgo from 'timeago-react'
import UpScoreButton from './UpScoreButton'
import useMe from '../hooks/useMe'
import CommentMenu from './CommentMenu'

interface Props {
  comment: CommentType
}

const Comment: FC<Props> = ({ comment }) => {
  const isMe = useMe(comment.userId)
  const [replyMode, setReplyMode] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const { mutate } = useComments()

  const [editContent, setEditContent] = useState<string>()

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

  return (
    <>
      <div className="rounded-lg bg-white p-4 text-blue-dark-grayish shadow-sm md:flex">
        <div className="hidden md:block">
          <UpScoreButton comment={comment} />
        </div>
        <div className="flex-grow space-y-4">
          {/* comment author */}
          <div className="flex w-full items-center">
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
            <div className="ml-auto hidden md:block">
              <CommentMenu
                {...{ comment, editMode, replyMode, setEditMode, setReplyMode }}
              />
            </div>
          </div>

          {/* comment content */}
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

          <div className="flex items-center justify-between md:hidden">
            <UpScoreButton comment={comment} />
            <CommentMenu
              {...{ comment, editMode, replyMode, setEditMode, setReplyMode }}
            />
          </div>
        </div>
      </div>
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
