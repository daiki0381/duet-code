import type { NextPage } from 'next'
import type { Review, User } from '@/api/api'
import { useState } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import ReviewCard from '@/components/molecules/ReviewCard'
import ThanksOrFeedbackCard from '@/components/molecules/ThanksOrFeedbackCard'
import Avatar from '@mui/material/Avatar'
import GitHubIcon from '@mui/icons-material/GitHub'
import IconButton from '@mui/material/IconButton'

type Props = {
  wantedReviews: Review[]
  acceptedReviews: Review[]
  user: User
}

const UserDetails: NextPage<Props> = ({
  wantedReviews,
  acceptedReviews,
  user,
}) => {
  const router = useRouter()
  const [status, setStatus] = useState<string>('thanks')
  const thanksList = acceptedReviews
    .filter((review) => review.thanks)
    .map((review) => {
      return {
        id: review.id,
        name: review.reviewee?.name,
        avatar: review.reviewee?.avatar,
        message: review.thanks,
      }
    })
  const feedbackList = wantedReviews
    .filter((review) => review.feedback)
    .map((review) => {
      return {
        id: review.id,
        name: review.reviewer?.name,
        avatar: review.reviewer?.avatar,
        message: review.feedback,
      }
    })
  const clickThanks = (): void => {
    setStatus('thanks')
  }
  const clickFeedback = (): void => {
    setStatus('feedback')
  }
  const clickWanted = (): void => {
    setStatus('wanted')
  }
  const clickAccepted = (): void => {
    setStatus('accepted')
  }
  const goToPostsDetails = (id: number): void => {
    router.push(`/posts/${id}`).catch((error) => {
      console.error(error)
    })
  }

  return (
    <div className="flex-1 pt-[50px]">
      <div className="mb-[50px] flex flex-col items-center">
        <Avatar
          src={user.avatar}
          className="mb-5 h-[100px] w-[100px]"
          alt="アバター画像"
        />
        <h1 className="mb-5 text-2xl font-semibold">{user.name}</h1>
        <a
          href={`https://github.com/${user.name}`}
          target="_blank"
          rel="noreferrer"
        >
          <IconButton>
            <GitHubIcon className="h-[30px] w-[30px]" />
          </IconButton>
        </a>
      </div>
      <div className="mx-auto flex  px-4 sm:max-w-[640px] md:max-w-[768px] lg:max-w-[1024px] xl:max-w-[1280px]">
        <p
          onClick={clickThanks}
          className={
            status === 'thanks'
              ? 'mr-[10px] cursor-pointer border-b-2 border-blue pb-[10px] text-sm font-semibold text-blue hover:opacity-70 sm:mr-5 sm:text-lg'
              : 'mr-[10px] cursor-pointer text-sm text-black hover:opacity-70 sm:mr-5 sm:text-lg'
          }
        >
          お礼
        </p>
        <p
          onClick={clickFeedback}
          className={
            status === 'feedback'
              ? 'mr-[10px] cursor-pointer border-b-2 border-blue pb-[10px] text-sm font-semibold text-blue hover:opacity-70 sm:mr-5 sm:text-lg'
              : 'mr-[10px] cursor-pointer text-sm text-black hover:opacity-70 sm:mr-5 sm:text-lg'
          }
        >
          フィードバック
        </p>
        <p
          onClick={clickWanted}
          className={
            status === 'wanted'
              ? 'mr-[10px] cursor-pointer border-b-2 border-blue pb-[10px] text-sm font-semibold text-blue hover:opacity-70 sm:mr-5 sm:text-lg'
              : 'mr-[10px] cursor-pointer text-sm text-black hover:opacity-70 sm:mr-5 sm:text-lg'
          }
        >
          募集した一覧
        </p>
        <p
          onClick={clickAccepted}
          className={
            status === 'accepted'
              ? 'cursor-pointer border-b-2 border-blue pb-[10px] text-sm font-semibold text-blue hover:opacity-70 sm:text-lg'
              : 'cursor-pointer text-sm text-black hover:opacity-70 sm:text-lg'
          }
        >
          承諾した一覧
        </p>
      </div>
      <div className="bg-post-login-light-blue md:min-h-[615px] lg:min-h-[810px]">
        <div className="mx-auto px-4 sm:max-w-[640px] md:max-w-[768px] lg:max-w-[1024px] xl:max-w-[1280px]">
          {(() => {
            if (status === 'thanks' && thanksList.length === 0) {
              return (
                <div className="pt-[20px] pb-[50px] text-center">
                  <Image
                    src="/user-details-thanks.svg"
                    width={350}
                    height={350}
                    alt="お礼が無い場合のイラスト"
                  />
                  <p className="text-xl text-black">お礼はまだありません</p>
                </div>
              )
            } else if (status === 'feedback' && feedbackList.length === 0) {
              return (
                <div className="pt-[20px] pb-[50px] text-center">
                  <Image
                    src="/user-details-feedback.svg"
                    width={350}
                    height={350}
                    alt="フィードバックが無い場合のイラスト"
                  />
                  <p className="text-xl text-black">
                    フィードバックはまだありません
                  </p>
                </div>
              )
            } else if (status === 'wanted' && wantedReviews.length === 0) {
              return (
                <div className="pt-[20px] pb-[50px] text-center">
                  <Image
                    src="/user-details-wanted.svg"
                    width={350}
                    height={350}
                    alt="募集した一覧が無い場合のイラスト"
                  />
                  <p className="text-xl text-black">
                    募集した一覧はまだありません
                  </p>
                </div>
              )
            } else if (status === 'accepted' && acceptedReviews.length === 0) {
              return (
                <div className="pt-[20px] pb-[50px] text-center">
                  <Image
                    src="/user-details-accepted.svg"
                    width={350}
                    height={350}
                    alt="承諾した一覧が無い場合のイラスト"
                  />
                  <p className="text-xl text-black">
                    承諾した一覧はまだありません
                  </p>
                </div>
              )
            } else if (status === 'thanks' && thanksList.length !== 0) {
              return (
                <div className="pt-[50px]">
                  {thanksList.map((thanks: any) => {
                    return (
                      <div key={thanks.id} className="pb-[50px]">
                        <ThanksOrFeedbackCard
                          name={thanks.name}
                          avatar={thanks.avatar}
                          message={thanks.message}
                          onClick={() => goToPostsDetails(thanks.id)}
                        />
                      </div>
                    )
                  })}
                </div>
              )
            } else if (status === 'feedback' && feedbackList.length !== 0) {
              return (
                <div className="pt-[50px]">
                  {feedbackList.map((feedback: any) => {
                    return (
                      <div key={feedback.id} className="pb-[50px]">
                        <ThanksOrFeedbackCard
                          name={feedback.name}
                          avatar={feedback.avatar}
                          message={feedback.message}
                          onClick={() => goToPostsDetails(feedback.id)}
                        />
                      </div>
                    )
                  })}
                </div>
              )
            } else if (status === 'wanted' && wantedReviews.length !== 0) {
              return (
                <div className="pt-[50px]">
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
                <div className="pt-[50px]">
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
    </div>
  )
}

export default UserDetails
