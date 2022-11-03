import type { NextPage } from 'next'
import ReviewCreationLogin from '@/components/templates/ReviewCreationLogin'
import ReviewCreation from '@/components/templates/ReviewCreation'

const New: NextPage = () => {
  return (
    <>
      <ReviewCreationLogin>
        <ReviewCreation />
      </ReviewCreationLogin>
    </>
  )
}

export default New
