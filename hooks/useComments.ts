import useSWR from 'swr'
import { CommentType } from '../lib/typings'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const useComments = () => {
  const { data, error, mutate } = useSWR<CommentType[]>(
    '/api/comment',
    fetcher,
    {
      refreshInterval: 1000,
    }
  )
  const loading = !data && !error
  return { comments: data!, error, loading, mutate }
}

export default useComments
