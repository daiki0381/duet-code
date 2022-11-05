import type { NextPage } from 'next'
import type { Review } from '@/api/api'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { useRecoilValue } from 'recoil'
import { useQuery, useMutation } from '@tanstack/react-query'
import { userApi, reviewApi, notificationApi } from '@/api/custom-instance'
import Feedback from '@/components/organisms/Feedback'
import Thanks from '@/components/organisms/Thanks'
import { isLoginState } from '@/stores/isLoginState'

const ReviewDetails: NextPage = () => {
  const isLogin = useRecoilValue(isLoginState)
  const router = useRouter()
  const { id } = router.query
  const [userId, setUserId] = useState<number | null>(null)
  const [review, setReview] = useState<Review | null>(null)

  const goToPostsEdit = (id: number): void => {
    router.push(`/posts/${id}/edit`).catch((error) => {
      console.error(error)
    })
  }

  useQuery(
    ['userId'],
    async (): Promise<number> => {
      const response = await userApi.getCurrentUserId()
      const userId = response.data
      return userId
    },
    {
      onSuccess: (data) => {
        setUserId(data)
      },
      enabled: isLogin,
    },
  )

  useQuery(
    ['review'],
    async (): Promise<Review> => {
      if (typeof id !== 'string') {
        throw new Error('id is not string')
      }
      const response = await reviewApi.getReview(id)
      const review = response.data
      return review
    },
    {
      onSuccess: (data) => {
        setReview(data)
      },
      enabled: id !== undefined,
    },
  )

  const { mutate: createAcceptedNotification } = useMutation(
    async (): Promise<void> => {
      if (typeof id === 'string') {
        await notificationApi.createAcceptedNotification(id)
      }
    },
  )

  const { mutate: acceptReview } = useMutation(async (): Promise<void> => {
    if (typeof id === 'string') {
      await reviewApi.acceptReview(id)
    }
    createAcceptedNotification()
  })

  const { mutate: deleteReview } = useMutation(
    async (): Promise<void> => {
      if (typeof id === 'string') {
        await reviewApi.deleteReview(id)
      }
    },
    {
      onSuccess: () => {
        router.push('/').catch((error) => {
          console.error(error)
        })
      },
    },
  )

  return (
    <div className="px-[100px] py-[50px]">
      {(() => {
        if (review?.accepted_at === null && review.reviewee?.id !== userId) {
          return <button onClick={() => acceptReview()}>承諾する</button>
        } else if (
          review?.reviewer?.id === userId &&
          review?.feedback === null
        ) {
          return <Feedback reviewId={Number(id)} />
        } else if (
          review?.reviewee?.id === userId &&
          review?.feedback !== null &&
          review?.thanks === null
        ) {
          return <Thanks reviewId={Number(id)} />
        } else if (review?.thanks !== null) {
          return <p>完了!</p>
        }
      })()}
      {review?.reviewee?.id === userId && (
        <button onClick={() => goToPostsEdit(Number(id))}>編集する</button>
      )}
      {review?.reviewee?.id === userId && review?.accepted_at === null && (
        <button onClick={() => deleteReview()}>削除する</button>
      )}
    </div>
  )
}

export default ReviewDetails
