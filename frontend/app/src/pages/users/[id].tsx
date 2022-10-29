import type { NextPage } from 'next'
import type { Review } from '@/openapi-generator/api'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { useQuery } from '@tanstack/react-query'
import { userApi } from '@/openapi-generator/custom-instance'

const Details: NextPage = () => {
  const router = useRouter()
  const { id } = router.query

  const [wantedReviews, setWantedReviews] = useState<Review[] | []>([])
  const [acceptedReviews, setAcceptedReviews] = useState<Review[] | []>([])
  const [thanksList, setThanksList] = useState<string[] | []>([])
  const [feedbackList, setFeedbackList] = useState<string[] | []>([])

  useQuery(
    ['wantedReviews'],
    async (): Promise<Review[]> => {
      const userId = Number(id)
      const response = await userApi.getUserWantedReviews(userId)
      return response.data
    },
    {
      onSuccess: (data) => {
        setWantedReviews(data)
        const thanksList: any = data.map((review) => review.thanks)
        setThanksList(thanksList)
      },
      enabled: id !== undefined,
    },
  )

  useQuery(
    ['acceptedReviews'],
    async (): Promise<Review[]> => {
      const userId = Number(id)
      const response = await userApi.getUserAcceptedReviews(userId)
      return response.data
    },
    {
      onSuccess: (data) => {
        setAcceptedReviews(data)
        const feedbackList: any = data.map((review) => review.feedback)
        setFeedbackList(feedbackList)
      },
      enabled: id !== undefined,
    },
  )

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
