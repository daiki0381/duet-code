import type { NextPage } from 'next'
import Login from '@/components/templates/Login'
import ReviewList from '@/components/templates/ReviewList'

const Home: NextPage = () => {
  return (
    <Login>
      <ReviewList />
    </Login>
  )
}

export default Home
