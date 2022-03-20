import { Comment, User } from '@prisma/client'

export type CommentType = Comment & {
  user: ExtendedUser
  replies: CommentType[]
}

interface ExtendedUser extends User {
  image: {
    png: string
    webp: string
  }
}
