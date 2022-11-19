import type { NextPage } from 'next'
import type { Review } from '@/api/api'
import { useState } from 'react'
import Image from 'next/image'
import ReviewCard from '@/components/molecules/ReviewCard'

type Props = {
  wantedReviews: Review[]
  acceptedReviews: Review[]
}

const ReviewList: NextPage<Props> = ({ wantedReviews, acceptedReviews }) => {
  const [status, setStatus] = useState<string>('wanted')
  const clickWanted = (): void => {
    setStatus('wanted')
  }

  const clickAccepted = (): void => {
    setStatus('accepted')
  }

  return (
    <div className="flex-1 bg-[#F1F5F9] px-[120px] pt-[50px]">
      <div className="flex">
        <p
          onClick={clickWanted}
          className={
            status === 'wanted'
              ? 'mr-5 cursor-pointer border-b-2 border-blue pb-[10px] text-lg font-semibold text-blue hover:opacity-70'
              : 'mr-5 cursor-pointer text-lg text-black hover:opacity-70'
          }
        >
          レビュー募集中
        </p>
        <p
          onClick={clickAccepted}
          className={
            status === 'accepted'
              ? 'cursor-pointer border-b-2 border-blue pb-[10px] text-lg font-semibold text-blue hover:opacity-70'
              : 'cursor-pointer text-lg text-black hover:opacity-70'
          }
        >
          レビュー募集終了
        </p>
      </div>
      {(() => {
        if (status === 'wanted' && wantedReviews.length === 0) {
          return (
            <div className="mt-[20px] mb-[50px] text-center">
              <Image
                src="/review-list-wanted-reviews.svg"
                width={350}
                height={350}
              />
              <p className="text-xl text-black">レビュー募集はまだありません</p>
            </div>
          )
        } else if (status === 'accepted' && acceptedReviews.length === 0) {
          return (
            <div className="mt-[20px]  mb-[50px] text-center">
              <Image
                src="/review-list-accepted-reviews.svg"
                width={350}
                height={350}
              />
              <p className="text-xl text-black">
                レビュー募集終了はまだありません
              </p>
            </div>
          )
        } else if (status === 'wanted' && wantedReviews.length !== 0) {
          return (
            <div className="mt-[50px]">
              <div className="flex flex-wrap">
                {wantedReviews.map((wantedReview: any) => {
                  return (
                    <div key={wantedReview.id} className="mb-[50px] w-[33.3%]">
                      <ReviewCard
                        reviewId={wantedReview.id}
                        title={wantedReview.title}
                        languages={wantedReview.languages}
                        revieweeName={wantedReview.reviewee.name}
                        revieweeAvatar={wantedReview.reviewee.avatar}
                        createdAt={wantedReview.created_at}
                      />
                    </div>
                  )
                })}
              </div>
            </div>
          )
        } else if (status === 'accepted' && acceptedReviews.length !== 0) {
          return (
            <div className="mt-[50px]">
              <div className="flex flex-wrap">
                {acceptedReviews.map((acceptedReview: any) => {
                  return (
                    <div
                      key={acceptedReview.id}
                      className="mb-[50px] w-[33.3%]"
                    >
                      <ReviewCard
                        reviewId={acceptedReview.id}
                        title={acceptedReview.title}
                        languages={acceptedReview.languages}
                        revieweeName={acceptedReview.reviewee.name}
                        revieweeAvatar={acceptedReview.reviewee.avatar}
                        createdAt={acceptedReview.created_at}
                      />
                    </div>
                  )
                })}
              </div>
            </div>
          )
        }
      })()}
    </div>
  )
}

export default ReviewList
