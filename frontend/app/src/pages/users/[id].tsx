import type { NextPage } from 'next'
import type { Review } from '@/openapi-generator/api'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { userApi } from '@/openapi-generator/custom-instance'

const Details: NextPage = () => {
  const router = useRouter()
  const { id } = router.query

  const [wantedReviews, setWantedReviews] = useState<Review[] | []>([])
  const [acceptedReviews, setAcceptedReviews] = useState<Review[] | []>([])
  const [thanksList, setThanksList] = useState<string[] | []>([])
  const [feedbackList, setFeedbackList] = useState<string[] | []>([])

  const getWantedReviews = async (userId: number): Promise<void> => {
    const response = await userApi.getUserWantedReviews(userId)
    const reviews = response.data
    setWantedReviews(reviews)
    const thanksList: any = reviews.map((review) => review.thanks)
    setThanksList(thanksList)
  }

  const getAcceptedReviews = async (userId: number): Promise<void> => {
    const response = await userApi.getUserAcceptedReviews(userId)
    const reviews = response.data
    setAcceptedReviews(reviews)
    const feedbackList: any = reviews.map((review) => review.feedback)
    setFeedbackList(feedbackList)
  }

  useEffect(() => {
    if (id !== undefined) {
      getWantedReviews(Number(id)).catch((error) => {
        console.error(error)
      })
      getAcceptedReviews(Number(id)).catch((error) => {
        console.error(error)
      })
    }
  }, [id])

  return (
    <div>
      <p>お礼</p>
      {thanksList.map((thanks) => (
        <p key={thanks}>{thanks}</p>
      ))}
      <p>フィードバック</p>
      {feedbackList.map((feedback) => (
        <p key={feedback}>{feedback}</p>
      ))}
      <p>募集したレビュー</p>
      {wantedReviews.map((review) => (
        <p key={review.id}>{review.title}</p>
      ))}
      <p>承諾したレビュー</p>
      {acceptedReviews.map((review) => (
        <p key={review.id}>{review.title}</p>
      ))}
    </div>
  )
}

export default Details
