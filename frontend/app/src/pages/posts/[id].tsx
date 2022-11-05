import type { NextPage } from 'next'
import MainLogin from '@/components/templates/MainLogin'
import ReviewDetails from '@/components/templates/ReviewDetails'

const Details: NextPage = () => {
  return (
    <MainLogin>
      <ReviewDetails />
    </MainLogin>
  )
}

export default Details
