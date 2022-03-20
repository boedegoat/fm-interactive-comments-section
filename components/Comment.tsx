import React, { FC, useEffect, useRef, useState } from 'react'
import { CommentType } from '../lib/typings'
import data from '../data.json'
import WriteComment from './WriteComment'

const currentUser = { ...data.currentUser, name: data.currentUser.username }

interface Props {
  comment: CommentType
}

const Comment: FC<Props> = ({ comment }) => {
  const isMe = currentUser.id == comment.userId
  const [replyMode, setReplyMode] = useState(false)
  const [editMode, setEditMode] = useState(false)

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
              <button className="flex items-center font-medium text-red-soft">
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
