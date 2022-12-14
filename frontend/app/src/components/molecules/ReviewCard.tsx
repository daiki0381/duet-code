import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import Chip from '@mui/material/Chip'
import Avatar from '@mui/material/Avatar'

type Props = {
  reviewId: number
  title: string
  languages: string[]
  pullRequestDescription: string
  revieweeName: string
  revieweeAvatar: string
  createdAt: string
}

const ReviewCard: NextPage<Props> = ({
  reviewId,
  title,
  languages,
  pullRequestDescription,
  revieweeName,
  revieweeAvatar,
  createdAt,
}) => {
  const router = useRouter()

  const goToPostsDetails = (id: number): void => {
    router.push(`/posts/${id}`).catch((error) => {
      console.error(error)
    })
  }

  const formatCreatedAt = (createdAt: string): string => {
    const year = createdAt.slice(0, 4)
    const month = createdAt.slice(5, 7)
    const day = createdAt.slice(8, 10)
    return `${year}年${month}月${day}日`
  }

  return (
    <div
      className="mx-auto min-h-[320px] w-[320px] cursor-pointer rounded-lg bg-white shadow-[0_3px_10px_0_rgba(0,0,0,0.15)] hover:opacity-70 sm:min-h-[350px] sm:w-[350px]"
      onClick={() => goToPostsDetails(reviewId)}
    >
      <div className="h-[160px] rounded-t-lg bg-blue p-[15px] sm:h-[175px]">
        <div className="flex h-[130px] items-center justify-center rounded-lg bg-white p-5 sm:h-[145px]">
          <p className="break-all text-lg text-black line-clamp-2">{title}</p>
        </div>
      </div>
      <div className="py-5 px-[15px]">
        <div className="mb-5 line-clamp-2">
          {languages.map((language) => (
            <Chip
              key={language}
              variant="outlined"
              label={language}
              className="mr-[5px] mb-[5px] cursor-pointer"
            />
          ))}
        </div>
        <p className="mb-5 break-all text-sm text-black line-clamp-2">
          {pullRequestDescription}
        </p>
        <div className="flex items-center justify-end">
          <Avatar src={revieweeAvatar} alt="アバター画像" />
          <div className="ml-[10px] flex flex-col">
            <span className="w-[100px] overflow-hidden text-ellipsis text-sm text-gray">
              {revieweeName}
            </span>
            <span className="text-sm text-gray">
              {formatCreatedAt(createdAt)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReviewCard
