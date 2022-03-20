import { GetStaticProps, NextPage } from 'next'
import { SWRConfig } from 'swr'
import Comments from '../components/Comments'
import WriteComment from '../components/WriteComment'
import { getComments } from '../lib/comments'

interface Props {
  fallback: any
}

const Home: NextPage<Props> = ({ fallback }) => {
  return (
    <SWRConfig value={{ fallback }}>
      <main className="min-h-screen bg-gray-200">
        <Comments />
        <WriteComment type="newComment" />
      </main>
    </SWRConfig>
  )
}

export default Home

// get initial comments
export const getStaticProps: GetStaticProps = async () => {
  const comments = await getComments()

  return {
    props: {
      fallback: {
        '/api/comments': comments,
      },
    },
    revalidate: 30,
  }
}
