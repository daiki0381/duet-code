/* eslint-disable @typescript-eslint/restrict-template-expressions */
import type { NextPage } from 'next'
import type { Review } from '@/api/api'
import { useState } from 'react'
import { useDidUpdateEffect } from '@/hooks/useDidUpdateEffect'
import { useRouter } from 'next/router'
import { useRecoilValue } from 'recoil'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import {
  userApi,
  reviewApi,
  notificationApi,
  gitHubApi,
} from '@/api/custom-instance'
import { isLoginState } from '@/stores/isLoginState'
import CircularProgress from '@mui/material/CircularProgress'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import Avatar from '@mui/material/Avatar'
import ItemTitle from '@/components/atoms/ItemTitle'
import Chip from '@mui/material/Chip'
import AlertWithActionButton from '@/components/molecules/AlertWithActionButton'
import NotFound from '@/components/templates/NotFound'
import DeleteButton from '@/components/atoms/DeleteButton'
import EditButton from '@/components/atoms/EditButton'
import FeedbackModal from '@/components/organisms/FeedbackModal'
import ThanksModal from '@/components/organisms/ThanksModal'

const ReviewDetails: NextPage = () => {
  const isLogin = useRecoilValue(isLoginState)
  const router = useRouter()
  const { id } = router.query
  const queryClient = useQueryClient()
  const [userId, setUserId] = useState<number | null>(null)
  const [review, setReview] = useState<Review | null>(null)
  const [initialReviewLoading, setInitialReviewLoading] = useState(true)
  const [activeStep, setActiveStep] = useState(0)
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false)
  const handleFeedbackModalOpen = (): void => setFeedbackModalOpen(true)
  const handleFeedbackModalClose = (): void => setFeedbackModalOpen(false)
  const [thanksModalOpen, setThanksModalOpen] = useState(false)
  const handleThanksModalOpen = (): void => setThanksModalOpen(true)
  const handleThanksModalClose = (): void => setThanksModalOpen(false)
  const steps = ['レビューの承諾', 'レビュー&フィードバック', 'お礼', '完了']

  useDidUpdateEffect(() => {
    if (review !== null) {
      if (review.accepted_at === null) {
        setActiveStep(0)
      } else if (review.accepted_at !== null && review?.feedback === null) {
        setActiveStep(1)
      } else if (review.feedback !== null && review?.thanks === null) {
        setActiveStep(2)
      } else if (review.thanks !== null) {
        setActiveStep(3)
      }
    }
  }, [review])

  const goToPostsEdit = (): void => {
    if (typeof id === 'string') {
      router.push(`/posts/${id}/edit`).catch((error) => {
        console.error(error)
      })
    }
  }

  const formatCreatedAt = (createdAt: string): string => {
    const year = createdAt.slice(0, 4)
    const month = createdAt.slice(5, 7)
    const day = createdAt.slice(8, 10)
    return `${year}年${month}月${day}日`
  }

  const { isLoading: userIdLoading } = useQuery(
    ['userId'],
    async (): Promise<number> => {
      const { data } = await userApi.getCurrentUserId()
      return data
    },
    {
      onSuccess: (data) => {
        setUserId(data)
      },
      enabled: isLogin,
    },
  )

  const { isLoading: reviewLoading, isError } = useQuery(
    ['review'],
    async (): Promise<Review> => {
      if (typeof id !== 'string') {
        throw new Error('id is not string')
      }
      const { data } = await reviewApi.getReview(id)
      return data
    },
    {
      onSuccess: (data) => {
        setReview(data)
        setInitialReviewLoading(false)
      },
      enabled: isLogin && id !== undefined,
      retry: false,
    },
  )

  const { mutate: acceptReview } = useMutation(
    async (): Promise<void> => {
      if (typeof id === 'string') {
        await reviewApi.acceptReview(id)
        await notificationApi.createAcceptedNotification(id)
      }
    },
    {
      onSuccess: async () => {
        queryClient.invalidateQueries(['review']).catch((error) => {
          console.error(error)
        })
        if (typeof id === 'string') {
          await gitHubApi.requestReview(id)
        }
      },
    },
  )

  const { mutate: deleteReview } = useMutation(async (): Promise<void> => {
    if (typeof id === 'string' && confirm('本当に削除しますか？')) {
      await reviewApi.deleteReview(id)
      queryClient.invalidateQueries(['reviews']).catch((error) => {
        console.error(error)
      })
      router.push('/').catch((error) => {
        console.error(error)
      })
      toast.success('レビューを削除しました')
    }
  })

  return (
    <>
      {isError ? (
        <NotFound />
      ) : (
        <>
          {userIdLoading || reviewLoading || initialReviewLoading ? (
            <div className="flex flex-1 items-center justify-center">
              <CircularProgress />
            </div>
          ) : (
            <div className="px-[100px] py-[50px]">
              <div className="mb-[50px]">
                <Stepper activeStep={activeStep} alternativeLabel>
                  {steps.map((label) => (
                    <Step key={label}>
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>
              </div>
              <div className="mb-[50px]">
                {(() => {
                  if (
                    review?.accepted_at === null &&
                    review.reviewee?.id !== userId
                  ) {
                    return (
                      <AlertWithActionButton
                        message={`${review.reviewee?.name}さんがレビューを募集しています。レビューを承諾する場合、承諾するをクリックしてください。承諾するをクリックすると、自動でリポジトリのコラボレーターに追加され、レビューリクエストが届きます。1度承諾するをクリックすると取り消すことができないのでご注意ください。`}
                        buttonText="承諾する"
                        onClick={acceptReview}
                      />
                    )
                  } else if (
                    review?.accepted_at === null &&
                    review.reviewee?.id === userId
                  ) {
                    return (
                      <AlertWithActionButton message="レビュアーを募集しています。レビュアーが見つかるまで、しばらくお待ちください。レビュアーがレビューを承諾すると、自動でリポジトリのコラボレーターに追加され、レビュアーにレビューリクエストが届きます。" />
                    )
                  } else if (
                    review?.reviewer?.id === userId &&
                    review?.feedback === null
                  ) {
                    return (
                      <>
                        <AlertWithActionButton
                          message="からレビューリクエストが届いています。プルリクエストをApproveしたら、フィードバックするをクリックして、レビューのフィードバックをしてください。送信したフィードバックはレビュー相手のマイページから閲覧できます。"
                          buttonText="フィードバックする"
                          onClick={handleFeedbackModalOpen}
                          url={review?.pull_request_url}
                        />
                        <FeedbackModal
                          open={feedbackModalOpen}
                          handleClose={handleFeedbackModalClose}
                        />
                      </>
                    )
                  } else if (
                    review?.reviewee?.id === userId &&
                    review?.feedback === null
                  ) {
                    return (
                      <AlertWithActionButton
                        message={`${review?.reviewer?.name}さんがレビューを承諾しました。プルリクエストにコメントがありましたら、返信をお願いします。`}
                      />
                    )
                  } else if (
                    review?.reviewer?.id === userId &&
                    review?.feedback !== null &&
                    review?.thanks === null
                  ) {
                    return (
                      <AlertWithActionButton
                        message={`${review?.reviewee?.name}さんがレビューに対するお礼を入力しています。`}
                      />
                    )
                  } else if (
                    review?.reviewee?.id === userId &&
                    review?.feedback !== null &&
                    review?.thanks === null
                  ) {
                    return (
                      <>
                        <AlertWithActionButton
                          message={`${review?.reviewee?.name}さんがレビューに対するフィードバックを送信しました。お礼するをクリックして、レビューに対するお礼をしてください。送信したお礼はレビュー相手のマイページから閲覧できます。`}
                          buttonText="お礼する"
                          onClick={handleThanksModalOpen}
                        />
                        <ThanksModal
                          open={thanksModalOpen}
                          handleClose={handleThanksModalClose}
                        />
                      </>
                    )
                  }
                })()}
              </div>
              <div className="mb-[50px]">
                {(() => {
                  if (
                    review?.reviewee?.id === userId &&
                    review?.accepted_at === null
                  ) {
                    return (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Avatar src={review?.reviewee?.avatar} />
                          <div className="ml-[10px] flex flex-col">
                            <span className="text-sm text-black">
                              {review?.reviewee?.name}
                            </span>
                            <span className="text-sm text-gray">
                              {review?.created_at !== undefined &&
                                formatCreatedAt(review.created_at)}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div className="mr-5">
                            <EditButton onClick={goToPostsEdit} />
                          </div>
                          <div>
                            <DeleteButton onClick={deleteReview} />
                          </div>
                        </div>
                      </div>
                    )
                  } else if (
                    review?.reviewee?.id === userId &&
                    review?.accepted_at !== null &&
                    review?.thanks === null
                  ) {
                    return (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Avatar src={review?.reviewee?.avatar} />
                          <div className="ml-[10px] flex flex-col">
                            <span className="text-sm text-black">
                              {review?.reviewee?.name}
                            </span>
                            <span className="text-sm text-gray">
                              {review?.created_at !== undefined &&
                                formatCreatedAt(review.created_at)}
                            </span>
                          </div>
                        </div>
                        <div>
                          <EditButton onClick={goToPostsEdit} />
                        </div>
                      </div>
                    )
                  } else if (
                    (review?.reviewee?.id === userId &&
                      review?.thanks !== null) ||
                    review?.reviewer?.id === userId
                  ) {
                    return (
                      <div className="flex items-center">
                        <Avatar src={review?.reviewee?.avatar} />
                        <div className="ml-[10px] flex flex-col">
                          <span className="text-sm text-black">
                            {review?.reviewee?.name}
                          </span>
                          <span className="text-sm text-gray">
                            {review?.created_at !== undefined &&
                              formatCreatedAt(review.created_at)}
                          </span>
                        </div>
                      </div>
                    )
                  }
                })()}
              </div>
              <div className="mb-[50px] text-3xl text-black">
                {review?.title}
              </div>
              <div className="mb-[50px]">
                <div className="mb-[30px]">
                  <ItemTitle>プルリクエスト</ItemTitle>
                </div>
                <a
                  href={review?.pull_request_url}
                  className="text-sm text-blue"
                  target="_blank"
                  rel="noreferrer"
                >
                  {review?.pull_request_url}
                </a>
              </div>
              <div className="mb-[50px]">
                <div className="mb-[30px]">
                  <ItemTitle>使用言語</ItemTitle>
                </div>
                <div className="flex flex-wrap">
                  {review?.languages?.map((language) => (
                    <Chip
                      key={language}
                      variant="outlined"
                      label={language}
                      className="mr-[5px] mb-[5px]"
                    />
                  ))}
                </div>
              </div>
              <div className="mb-[50px]">
                <div className="mb-[30px]">
                  <ItemTitle>プルリクエストの説明</ItemTitle>
                </div>
                <p className="text-sm text-black">
                  {review?.pull_request_description}
                </p>
              </div>
              <div>
                <div className="mb-[30px]">
                  <ItemTitle>レビューしてほしい点</ItemTitle>
                </div>
                <p className="text-sm text-black">{review?.review_point}</p>
              </div>
            </div>
          )}
        </>
      )}
    </>
  )
}

export default ReviewDetails
