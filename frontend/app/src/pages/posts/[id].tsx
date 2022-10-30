import type { NextPage } from 'next'
import type { Review } from '@/api/api'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { useQuery, useMutation } from '@tanstack/react-query'
import { userApi, reviewApi, notificationApi } from '@/api/custom-instance'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '@/firebase'
import Feedback from '@/components/organisms/Feedback'
import Thanks from '@/components/organisms/Thanks'

const Details: NextPage = () => {
  const [user, loading] = useAuthState(auth)
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
      enabled: user !== null,
    },
  )

  useQuery(
    ['review'],
    async (): Promise<Review> => {
      const reviewId = Number(id)
      const response = await reviewApi.getReview(reviewId)
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
      const reviewId = Number(id)
      await notificationApi.createAcceptedNotification(reviewId)
    },
  )

  const { mutate: acceptReview } = useMutation(async (): Promise<void> => {
    const reviewId = Number(id)
    await reviewApi.acceptReview(reviewId)
    createAcceptedNotification()
  })

  const { mutate: deleteReview } = useMutation(
    async (): Promise<void> => {
      const reviewId = Number(id)
      await reviewApi.deleteReview(reviewId)
    },
    {
      onSuccess: () => {
        router.push('/').catch((error) => {
          console.error(error)
        })
      },
    },
  )

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <p>{review?.title}</p>
      {(() => {
        if (review?.accepted_at === null && review.reviewee_id !== userId) {
          return <button onClick={() => acceptReview()}>承諾する</button>
        } else if (
          review?.reviewer_id === userId &&
          review?.feedback === null
        ) {
          return <Feedback reviewId={Number(id)} />
        } else if (
          review?.reviewee_id === userId &&
          review?.feedback !== null &&
          review?.thanks === null
        ) {
          return <Thanks reviewId={Number(id)} />
        } else if (review?.thanks !== null) {
          return <p>完了!</p>
        }
      })()}
      {review?.reviewee_id === userId && (
        <button onClick={() => goToPostsEdit(Number(id))}>編集する</button>
      )}
      {review?.reviewee_id === userId && review?.accepted_at === null && (
        <button onClick={() => deleteReview()}>削除する</button>
      )}
    </div>
  )
}

export default Details
