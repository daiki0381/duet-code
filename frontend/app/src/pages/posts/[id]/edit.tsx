import type { NextPage } from 'next'
import ReviewEditLogin from '@/components/templates/ReviewEditLogin'
import ReviewEdit from '@/components/templates/ReviewEdit'

const Edit: NextPage = () => {
  return (
    <>
      <ReviewEditLogin>
        <ReviewEdit />
      </ReviewEditLogin>
    </>
  )
}

export default Edit
