import { FC } from 'react'
import { CommentType } from '../lib/typings'
import UpScoreButton from './UpScoreButton'
import { useModal } from './ModalProvider'
import useComments from '../hooks/useComments'
import useMe from '../hooks/useMe'

interface Props {
  comment: CommentType
  editMode: boolean
  setEditMode: React.Dispatch<React.SetStateAction<boolean>>
  replyMode: boolean
  setReplyMode: React.Dispatch<React.SetStateAction<boolean>>
}

const CommentMenu: FC<Props> = ({
  comment,
  editMode,
  setEditMode,
  replyMode,
  setReplyMode,
}) => {
  const isMe = useMe(comment.userId)
  const { showModal } = useModal()
  const { mutate } = useComments()

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

  return (
    <div className="flex items-center justify-between">
      {isMe ? (
        // edit and delete btn
        <div className="flex items-center space-x-4">
          <button
            onClick={() => confirmDelete(comment.id)}
            className="flex items-center font-medium text-red-soft hover:opacity-50"
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
            className="flex items-center font-medium text-blue-moderate hover:opacity-50"
          >
            <img src="/icon/icon-edit.svg" alt="icon-edit" className="mr-1" />{' '}
            Edit
          </button>
        </div>
      ) : (
        // reply btn
        <button
          onClick={() => setReplyMode(!replyMode)}
          className="flex items-center font-medium text-blue-moderate hover:opacity-50"
        >
          <img src="/icon/icon-reply.svg" alt="icon-reply" className="mr-1" />{' '}
          Reply
        </button>
      )}
    </div>
  )
}

export default CommentMenu
