import type { NextPage } from 'next'
import TopLogin from '@/components/templates/TopLogin'
import ReviewList from '@/components/templates/ReviewList'

const Home: NextPage = () => {
  return (
    <TopLogin>
      <ReviewList />
    </TopLogin>
  )
}

export default Home
