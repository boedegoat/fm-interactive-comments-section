import useSWR from 'swr'
import { CommentType } from '../lib/typings'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const useComments = () => {
  const { data, error, mutate } = useSWR<CommentType[]>(
    '/api/comments',
    fetcher,
    { refreshInterval: 1000 }
  )
  return { comments: data!, error, mutate }
}

export default useComments
