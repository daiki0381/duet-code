import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import NormalButton from '@/components/atoms/NormalButton'

const ReviewEditHeader: NextPage = () => {
  const router = useRouter()
  const { id } = router.query

  const goToPostsDetails = (): void => {
    if (window.confirm('保存せずに終了しますか？') && typeof id === 'string') {
      router.push(`/posts/${id}`).catch((error) => {
        console.error(error)
      })
    }
  }

  return (
    <div className="sticky top-0 z-50 flex h-[73px] items-center justify-between border-b border-border bg-white px-4 py-3">
      <div
        onClick={goToPostsDetails}
        className="flex cursor-pointer items-center hover:opacity-70"
      >
        <ArrowBackIosNewIcon className="mr-[5px] h-[20px] w-[20px]" />
        <p className="text-sm text-black">編集終了</p>
      </div>
      <div>
        <NormalButton form="review_edit_form">保存する</NormalButton>
      </div>
    </div>
  )
}

export default ReviewEditHeader
