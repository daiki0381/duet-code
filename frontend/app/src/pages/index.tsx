import type { NextPage } from 'next'
import type { Review } from '@/api/api'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { useQuery } from '@tanstack/react-query'
import { useRecoilValue } from 'recoil'
import { reviewApi } from '@/api/custom-instance'
import Login from '@/components/templates/Login'
import { isLoginState } from '@/stores/isLoginState'
import AvatarWithMenu from '@/components/molecules/AvatarWithMenu'
import NotificationWithMenu from '@/components/molecules/NotificationWithMenu'

const Home: NextPage = () => {
  const router = useRouter()
  const isLogin = useRecoilValue(isLoginState)
  const [wantedReviews, setWantedReviews] = useState<Review[] | []>([])
  const [acceptedReviews, setAcceptedReviews] = useState<Review[] | []>([])

  const goToPostsNew = (): void => {
    router.push('/posts/new').catch((error) => {
      console.error(error)
    })
  }

  const goToPostsDetails = (id: number): void => {
    router.push(`/posts/${id}`).catch((error) => {
      console.error(error)
    })
  }

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
        <AvatarWithMenu />
        <NotificationWithMenu />
        <button onClick={goToPostsNew}>レビュー募集</button>
        <div>レビュー募集中</div>
        {wantedReviews.map((review) => {
          return (
            <div
              key={review.id}
              onClick={() => {
                if (review.id !== undefined) {
                  goToPostsDetails(review.id)
                }
              }}
            >
              <p>タイトル: {review.title}</p>
            </div>
          )
        })}
        <div>レビュー募集終了</div>
        {acceptedReviews.map((review) => {
          return (
            <div
              key={review.id}
              onClick={() => {
                if (review.id !== undefined) {
                  goToPostsDetails(review.id)
                }
              }}
            >
              <p>タイトル: {review.title}</p>
            </div>
          )
        })}
      </div>
    </Login>
  )
}

export default Home
