import useComments from '../hooks/useComments'
import Comment from './Comment'

const Comments = () => {
  const { comments, loading } = useComments()
  console.log(comments, loading)

  return (
    <div className="wrapper mb-8 space-y-8">
      {comments.map((comment) => (
        <div className="" key={comment.id}>
          <Comment comment={comment} />

          {/* comment replies */}
          <div className="mt-8 space-y-8 border-l-2 border-blue-dark-grayish/20 pl-5">
            {comment.replies.map((reply) => (
              <Comment key={reply.id} comment={reply} />
            ))}
          </div>
        </div>
      ))}
      {loading && (
        <div className="text-sm font-medium text-blue-moderate">
          Syncing comments...
        </div>
      )}
    </div>
  )
}

export default Comments
