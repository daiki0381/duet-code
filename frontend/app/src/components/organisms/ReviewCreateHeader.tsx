import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import NormalButton from '@/components/atoms/NormalButton'

const ReviewCreateHeader: NextPage = () => {
  const router = useRouter()

  const goToHome = (): void => {
    if (window.confirm('保存せずに終了しますか？')) {
      router.push('/').catch((error) => {
        console.error(error)
      })
    }
  }

  return (
    <div className="sticky top-0 z-50 flex h-[73px] items-center justify-between border-b border-border bg-white px-4 py-3">
      <div
        onClick={goToHome}
        className="flex cursor-pointer items-center hover:opacity-70"
      >
        <ArrowBackIosNewIcon className="mr-[5px] h-[20px] w-[20px]" />
        <p className="text-sm text-black">編集終了</p>
      </div>
      <div>
        <NormalButton form="review_create_form">保存する</NormalButton>
      </div>
    </div>
  )
}

export default ReviewCreateHeader
