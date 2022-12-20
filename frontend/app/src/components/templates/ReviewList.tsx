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
    <div className="relative flex-1 bg-post-login-light-blue pt-[50px]">
      <div className="mx-auto px-4 sm:max-w-[640px] md:max-w-[768px] lg:max-w-[1024px] xl:max-w-[1280px]">
        <div className="flex lg:ml-[75px] xl:ml-[35px]">
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
              <div className="absolute left-1/2 top-1/2 mt-5 -translate-y-2/4 -translate-x-2/4 text-center">
                <Image
                  src="/review-list-wanted-reviews.svg"
                  width={380}
                  height={380}
                  alt="レビュー募集が無い場合のイラスト"
                />
                <p className="text-xl text-black">
                  レビュー募集はまだありません
                </p>
              </div>
            )
          } else if (status === 'accepted' && acceptedReviews.length === 0) {
            return (
              <div className="absolute left-1/2 top-1/2 mt-5 -translate-y-2/4 -translate-x-2/4 text-center">
                <Image
                  src="/review-list-accepted-reviews.svg"
                  width={380}
                  height={380}
                  alt="レビュー募集終了が無い場合のイラスト"
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
                      <div
                        key={wantedReview.id}
                        className="mb-[50px] w-full lg:w-1/2  xl:w-1/3"
                      >
                        <ReviewCard
                          reviewId={wantedReview.id}
                          title={wantedReview.title}
                          languages={wantedReview.languages}
                          pullRequestDescription={
                            wantedReview.pull_request_description
                          }
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
                        className="mb-[50px] w-full lg:w-1/2  xl:w-1/3"
                      >
                        <ReviewCard
                          reviewId={acceptedReview.id}
                          title={acceptedReview.title}
                          languages={acceptedReview.languages}
                          pullRequestDescription={
                            acceptedReview.pull_request_description
                          }
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
    </div>
  )
}

export default ReviewList
