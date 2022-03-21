import React, { FC, useState } from 'react'
import { CommentType } from '../lib/typings'
import data from '../data.json'
import WriteComment from './WriteComment'
import useComments from '../hooks/useComments'
import { useModal } from './ModalProvider'

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
      (comments) => comments!.filter((comment) => comment.id !== commentId),
      false
    )

    // delete comment in the actual cloud db
    await fetch('/api/comment/' + commentId, {
      method: 'DELETE',
    })

    // revalidate (runs fetcher then update the data)
    mutate()
  }

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
          <h3 className="font-medium text-blue-dark">{comment.user.name}</h3>
          <p className="text-sm font-light">{comment.createdAt}</p>
        </div>
        <p>{comment.content}</p>
        {/* bottom menu */}
        <div className="flex items-center justify-between">
          {/* upvote btn */}
          <div className="flex items-center rounded-2xl bg-gray-100">
            <button className="p-4">
              <img src="/icon/icon-plus.svg" alt="icon-plus" />
            </button>
            <div className="font-medium text-blue-moderate">
              {comment.score}
            </div>
            <button className="p-4">
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
      {replyMode && <WriteComment type="reply" />}
    </>
  )
}

export default Comment
