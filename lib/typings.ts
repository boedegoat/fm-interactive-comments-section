import { Comment, User } from '@prisma/client'

export type CommentType = Comment & {
  user: ExtendedUser
  mentionTo: ExtendedUser | null
  replies: CommentType[]
  upScoredBy: ExtendedUser[]
}

interface ExtendedUser extends User {
  image: {
    png: string
    webp: string
  }
}

export type ShowModal = ({
  title,
  description,
  cancelBtn,
  confirmBtn,
}: ModalOptions) => void

export interface ModalOptions {
  title: string
  description: string
  cancelBtn?: string
  confirmBtn?: string
  onCancel?: () => void
  onConfirm?: () => void
}
