import useComments from '../hooks/useComments'
import Comment from './Comment'

const Comments = () => {
  const { comments } = useComments()
  console.log(comments)

  return (
    <div className="container space-y-8 py-3">
      {comments!.map((comment) => (
        <div className="" key={comment.id}>
          <Comment comment={comment} />
          {/* comment replies */}
          <div className="mt-8 space-y-8">
            {comment.replies.map((reply) => (
              <Comment key={reply.id} comment={reply} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default Comments
