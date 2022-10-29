/* eslint-disable @typescript-eslint/promise-function-async */
/* eslint-disable @typescript-eslint/no-misused-promises */
import type { NextPage } from 'next'
import type { Review } from '@/openapi-generator/api'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { reviewApi } from '@/openapi-generator/review'
import { userApi } from '@/openapi-generator/user'
import { notificationApi } from '@/openapi-generator/notification'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '@/firebase'
import Feedback from '@/components/react-hook-form/Feedback'
import Thanks from '@/components/react-hook-form/Thanks'

const Details: NextPage = () => {
  const [user, loading] = useAuthState(auth)
  const router = useRouter()
  const { id } = router.query
  const [userId, setUserId] = useState<number | null>(null)
  const [review, setReview] = useState<Review | null>(null)

  const getUserId = async (): Promise<void> => {
    const response = await userApi.getCurrentUserId()
    const userId = response.data
    setUserId(userId)
  }

  const getReview = async (reviewId: number): Promise<void> => {
    const response = await reviewApi.getReview(reviewId)
    const review = response.data
    setReview(review)
  }

  const createAcceptedNotification = async (
    reviewId: number,
  ): Promise<void> => {
    await notificationApi.createAcceptedNotification(reviewId)
  }

  const acceptReview = async (reviewId: number): Promise<void> => {
    await reviewApi.acceptReview(reviewId)
    createAcceptedNotification(reviewId).catch((error) => console.error(error))
  }

  const deleteReview = async (reviewId: number): Promise<void> => {
    await reviewApi.deleteReview(reviewId)
    router.push('/').catch((error) => {
      console.error(error)
    })
  }

  const goToPostsEdit = (id: number): void => {
    router.push(`/posts/${id}/edit`).catch((error) => {
      console.error(error)
    })
  }

  useEffect(() => {
    if (user !== null) {
      getUserId().catch((error) => {
        console.error(error)
      })
    }
  }, [user])

  useEffect(() => {
    if (id !== undefined) {
      getReview(Number(id)).catch((error) => {
        console.error(error)
      })
    }
  }, [id])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <p>{review?.title}</p>
      {(() => {
        if (review?.accepted_at === null && review.reviewee_id !== userId) {
          return (
            <button onClick={() => acceptReview(Number(id))}>承諾する</button>
          )
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
        <button onClick={() => deleteReview(Number(id))}>削除する</button>
      )}
    </div>
  )
}

export default Details
