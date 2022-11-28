import type { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { withAuthUser, useAuthUser, AuthAction } from 'next-firebase-auth'
import { useQuery } from '@tanstack/react-query'
import { userApi, reviewApi } from '@/api/custom-instance'
import ReviewThanksHeader from '@/components/organisms/ReviewThanksHeader'
import ReviewThanks from '@/components/templates/ReviewThanks'
import PostLoginFooter from '@/components/organisms/PostLoginFooter'

const Thanks: NextPage<any> = () => {
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
      <Head>
        <title>Duet Code | お礼</title>
      </Head>
      {userIdIsLoading || reviewIsLoading ? (
        <></>
      ) : (
        <>
          {(() => {
            if (
              review !== undefined &&
              userId !== undefined &&
              review.reviewee?.id === userId &&
              review.feedback !== null &&
              review.thanks === null
            ) {
              return (
                <div className="flex min-h-screen flex-col">
                  <ReviewThanksHeader />
                  <ReviewThanks />
                  <PostLoginFooter />
                </div>
              )
            } else if (
              review !== undefined &&
              userId !== undefined &&
              review.thanks !== null
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
})(Thanks)
