import { Comment, User } from '@prisma/client'

export type CommentType = Comment & {
  user: User
  replies: CommentType[]
}
