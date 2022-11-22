import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { withAuthUser, useAuthUser, AuthAction } from 'next-firebase-auth'
import { useQuery } from '@tanstack/react-query'
import { userApi, reviewApi } from '@/api/custom-instance'
import ReviewFeedbackHeader from '@/components/organisms/ReviewFeedbackHeader'
import ReviewFeedback from '@/components/templates/ReviewFeedback'
import PostLoginFooter from '@/components/organisms/PostLoginFooter'

const Feedback: NextPage<any> = () => {
  const AuthUser = useAuthUser()
  const router = useRouter()
  const { id } = router.query
  const goToHome = (): void => {
    if (process.browser) {
      router.replace('/').catch((error) => {
        console.error(error)
      })
    }
  }
  const goToPostsDetails = (): void => {
    router.push(`/posts/${id}`).catch((error) => {
      console.error(error)
    })
  }

  const { data: userId, isLoading: userIdIsLoading } = useQuery(
    ['userId'],
    async () => {
      const token = await AuthUser.getIdToken()
      if (token !== null) {
        const { data } = await userApi.getCurrentUserId({
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        return data
      }
    },
    {
      enabled: AuthUser.id !== null,
    },
  )

  const { data: review, isLoading: reviewIsLoading } = useQuery(
    ['review'],
    async () => {
      if (typeof id === 'string') {
        const { data } = await reviewApi.getReview(id)
        return data
      }
    },
    {
      enabled: AuthUser.id !== null,
      retry: false,
    },
  )

  return (
    <>
      {userIdIsLoading || reviewIsLoading ? (
        <></>
      ) : (
        <>
          {(() => {
            if (
              review !== undefined &&
              userId !== undefined &&
              review.reviewer?.id === userId &&
              review.feedback === null
            ) {
              return (
                <div className="flex min-h-screen flex-col">
                  <ReviewFeedbackHeader />
                  <ReviewFeedback />
                  <PostLoginFooter />
                </div>
              )
            } else if (
              review !== undefined &&
              userId !== undefined &&
              review.feedback !== null
            ) {
              return goToPostsDetails()
            } else {
              return goToHome()
            }
          })()}
        </>
      )}
    </>
  )
}

export default withAuthUser({
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
})(Feedback)
