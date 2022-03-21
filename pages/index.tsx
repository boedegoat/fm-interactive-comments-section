import { GetServerSideProps, NextPage } from 'next'
import { SWRConfig } from 'swr'
import Comments from '../components/Comments'
import ModalProvider from '../components/ModalProvider'
import WriteComment from '../components/WriteComment'
import { getComments } from '../lib/comments'

interface Props {
  comments: string
}

const Home: NextPage<Props> = ({ comments }) => {
  const fallback = {
    '/api/comment': JSON.parse(comments),
  }

  return (
    <SWRConfig value={{ fallback }}>
      <ModalProvider>
        <main className="min-h-screen bg-gray-200 py-8">
          <Comments />
          <div className="wrapper">
            <WriteComment type="newComment" />
          </div>
        </main>
      </ModalProvider>
    </SWRConfig>
  )
}

export default Home

// get initial comments
export const getServerSideProps: GetServerSideProps = async () => {
  const comments = await getComments()

  return {
    props: {
      comments,
    },
  }
}
