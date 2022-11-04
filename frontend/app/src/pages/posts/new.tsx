import type { NextPage } from 'next'
import ReviewCreateLogin from '@/components/templates/ReviewCreateLogin'
import ReviewCreate from '@/components/templates/ReviewCreate'

const New: NextPage = () => {
  return (
    <>
      <ReviewCreateLogin>
        <ReviewCreate />
      </ReviewCreateLogin>
    </>
  )
}

export default New
