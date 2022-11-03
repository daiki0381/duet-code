import type { NextPage } from 'next'
import type { Review } from '@/api/api'
import { useState } from 'react'
import Image from 'next/image'
import { useQuery } from '@tanstack/react-query'
import { useRecoilValue } from 'recoil'
import { reviewApi } from '@/api/custom-instance'
import ReviewCard from '@/components/molecules/ReviewCard'
import { isLoginState } from '@/stores/isLoginState'
import CircularProgress from '@mui/material/CircularProgress'
import Pagination from '@mui/material/Pagination'

const ReviewList: NextPage = () => {
  const isLogin = useRecoilValue(isLoginState)
  const [initialReviewsLoading, setInitialReviewsLoading] =
    useState<boolean>(true)
  const [status, setStatus] = useState<string>('wanted')
  const [wantedReviews, setWantedReviews] = useState<Review[] | []>([])
  const [acceptedReviews, setAcceptedReviews] = useState<Review[] | []>([])
  const [splittedWantedReviews, setSplittedWantedReviews] = useState<
    Review[][] | []
  >([])
  const [splittedAcceptedReviews, setSplittedAcceptedReviews] = useState<
    Review[][] | []
  >([])
  const [wantedReviewsPageCount, setWantedReviewsPageCount] =
    useState<number>(1)
  const [acceptedReviewsPageCount, setAcceptedReviewsPageCount] =
    useState<number>(1)
  const [wantedReviewsPage, setWantedReviewsPage] = useState<number>(1)
  const [acceptedReviewsPage, setAcceptedReviewsPage] = useState<number>(1)
  const SPLITTED_COUNT = 15

  const clickWanted = (): void => {
    setStatus('wanted')
  }

  const clickAccepted = (): void => {
    setStatus('accepted')
  }

  const countPage = (reviews: Review[]): number => {
    return Math.ceil(reviews.length / SPLITTED_COUNT) === 0
      ? 1
      : Math.ceil(reviews.length / SPLITTED_COUNT)
  }

  const splitReviews = (reviews: Review[]): Review[][] => {
    const splittedReviews: Review[][] = []
    for (let i = 0; i < countPage(reviews); i++) {
      splittedReviews.push(
        reviews.slice(i * SPLITTED_COUNT, (i + 1) * SPLITTED_COUNT),
      )
    }
    return splittedReviews
  }

  const { isLoading } = useQuery(
    ['reviews'],
    async (): Promise<Review[]> => {
      const { data } = await reviewApi.getReviews()
      return data
    },
    {
      onSuccess: (data) => {
        const wantedReviews = data.filter((review) => {
          return review.accepted_at === null
        })
        const acceptedReviews = data.filter((review) => {
          return review.accepted_at !== null
        })
        const wantedReviewsPageCount = countPage(wantedReviews)
        const acceptedReviewsPageCount = countPage(acceptedReviews)
        const splittedWantedReviews = splitReviews(wantedReviews)
        const splittedAcceptedReviews = splitReviews(acceptedReviews)
        setWantedReviews(wantedReviews)
        setAcceptedReviews(acceptedReviews)
        setWantedReviewsPageCount(wantedReviewsPageCount)
        setAcceptedReviewsPageCount(acceptedReviewsPageCount)
        setSplittedWantedReviews(splittedWantedReviews)
        setSplittedAcceptedReviews(splittedAcceptedReviews)
        setInitialReviewsLoading(false)
      },
      enabled: isLogin,
    },
  )

  return (
    <div className="px-[120px] py-[50px]">
      <div className="mb-[50px] flex">
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
        if (initialReviewsLoading || isLoading) {
          return <CircularProgress />
        } else if (status === 'wanted' && wantedReviews.length === 0) {
          return (
            <div className="text-center">
              <Image
                src="/review-list-wanted-reviews.svg"
                width={400}
                height={400}
              />
              <p className="text-xl text-black">レビュー募集はまだありません</p>
            </div>
          )
        } else if (status === 'accepted' && acceptedReviews.length === 0) {
          return (
            <div className="text-center">
              <Image
                src="/review-list-accepted-reviews.svg"
                width={400}
                height={400}
              />
              <p className="text-xl text-black">
                レビュー募集終了はまだありません
              </p>
            </div>
          )
        } else if (status === 'wanted' && wantedReviews.length !== 0) {
          return (
            <div>
              <div className="flex flex-wrap">
                {splittedWantedReviews[wantedReviewsPage - 1].map(
                  (wantedReview: any) => {
                    return (
                      <div
                        key={wantedReview.id}
                        className="mr-[50px] mb-[50px]"
                      >
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
                  },
                )}
              </div>
              <div className="flex items-center justify-center">
                {wantedReviewsPageCount > 1 && (
                  <Pagination
                    count={wantedReviewsPageCount}
                    page={wantedReviewsPage}
                    onChange={(e, page) => setWantedReviewsPage(page)}
                  />
                )}
              </div>
            </div>
          )
        } else if (status === 'accepted' && acceptedReviews.length !== 0) {
          return (
            <div>
              <div className="flex flex-wrap">
                {splittedAcceptedReviews[acceptedReviewsPage - 1].map(
                  (acceptedReview: any) => {
                    return (
                      <div
                        key={acceptedReview.id}
                        className="mr-[50px] mb-[50px]"
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
                  },
                )}
              </div>
              <div className="flex items-center justify-center">
                {acceptedReviewsPageCount > 1 && (
                  <Pagination
                    count={acceptedReviewsPageCount}
                    page={acceptedReviewsPage}
                    onChange={(e, page) => setAcceptedReviewsPage(page)}
                  />
                )}
              </div>
            </div>
          )
        }
      })()}
    </div>
  )
}

export default ReviewList
