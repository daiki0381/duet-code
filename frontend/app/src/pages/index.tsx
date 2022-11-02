import type { NextPage } from 'next'
import type { Review } from '@/api/api'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useRecoilValue } from 'recoil'
import { reviewApi } from '@/api/custom-instance'
import Login from '@/components/templates/Login'
import { isLoginState } from '@/stores/isLoginState'
import ReviewCard from '@/components/molecules/ReviewCard'

const Home: NextPage = () => {
  const isLogin = useRecoilValue(isLoginState)
  const [wantedReviews, setWantedReviews] = useState<Review[] | []>([])
  const [acceptedReviews, setAcceptedReviews] = useState<Review[] | []>([])

  useQuery(
    ['reviews'],
    async (): Promise<Review[]> => {
      const response = await reviewApi.getReviews()
      const reviews = response.data
      return reviews
    },
    {
      onSuccess: (data) => {
        const wantedReviews = data.filter((review) => {
          return review.accepted_at === null
        })
        const acceptedReviews = data.filter((review) => {
          return review.accepted_at !== null
        })
        setWantedReviews(wantedReviews)
        setAcceptedReviews(acceptedReviews)
      },
      enabled: isLogin,
    },
  )

  return (
    <Login>
      <div>
        <div className="m-auto mt-[50px] flex w-[1200px] justify-between">
          {acceptedReviews.map((review: any) => {
            return (
              <ReviewCard
                key={review.id}
                reviewId={review.id}
                title={review.title}
                languages={review.languages}
                revieweeName={review.reviewee.name}
                revieweeAvatar={review.reviewee.avatar}
                createdAt={review.created_at}
              />
            )
          })}
          {wantedReviews.map((review: any) => {
            return (
              <ReviewCard
                key={review.id}
                reviewId={review.id}
                title={review.title}
                languages={review.languages}
                revieweeName={review.reviewee.name}
                revieweeAvatar={review.reviewee.avatar}
                createdAt={review.created_at}
              />
            )
          })}
        </div>
      </div>
    </Login>
  )
}

export default Home
