import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import Image from 'next/image'
import Chip from '@mui/material/Chip'
import Avatar from '@mui/material/Avatar'

type Props = {
  reviewId: number
  title: string
  languages: string[]
  revieweeName: string
  revieweeAvatar: string
  createdAt: string
}

const ReviewCard: NextPage<Props> = ({
  reviewId,
  title,
  languages,
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
      className="min-h-[350px] w-[350px] cursor-pointer rounded-lg bg-white shadow-[0_3px_10px_0_rgba(0,0,0,0.15)] hover:opacity-70"
      onClick={() => goToPostsDetails(reviewId)}
    >
      <div className="h-[175px] rounded-t-lg bg-blue p-[15px]">
        <div className="h-[145px] rounded-lg bg-white p-5">
          <div className="flex h-[65px] items-center  justify-center">
            <p className="font-serif  text-lg font-semibold text-black line-clamp-2">
              {title}
            </p>
          </div>
          <div className="flex items-end justify-end">
            <Image
              src="/header-logo.png"
              width={100}
              height={40}
              alt="Duet Code"
            />
          </div>
        </div>
      </div>
      <div className="p-[15px]">
        <div className="mb-[15px] line-clamp-2">
          {languages.map((language) => (
            <Chip
              key={language}
              variant="outlined"
              label={language}
              className="mr-[5px] mb-[5px] cursor-pointer font-serif"
            />
          ))}
        </div>
        <div className="mb-[15px] h-[56px] font-serif text-xl text-black line-clamp-2">
          {title}
        </div>
        <div className="flex items-center justify-end">
          <Avatar src={revieweeAvatar} />
          <div className="ml-[10px] flex flex-col overflow-scroll">
            <span className=" font-serif text-sm text-gray">
              {revieweeName}
            </span>
            <span className="font-serif text-sm text-gray">
              {formatCreatedAt(createdAt)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReviewCard
