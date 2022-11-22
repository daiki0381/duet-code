import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { withAuthUser, useAuthUser, AuthAction } from 'next-firebase-auth'
import { useQuery } from '@tanstack/react-query'
import { userApi, reviewApi, gitHubApi } from '@/api/custom-instance'
import ReviewEditHeader from '@/components/organisms/ReviewEditHeader'
import ReviewEdit from '@/components/templates/ReviewEdit'
import PostLoginFooter from '@/components/organisms/PostLoginFooter'
import CircularProgress from '@mui/material/CircularProgress'

const Edit: NextPage<any> = () => {
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

  const { data: pulls, isLoading: pullsIsLoading } = useQuery(
    ['pulls'],
    async () => {
      const token = await AuthUser.getIdToken()
      if (token !== null) {
        const { data } = await gitHubApi.getCurrentUserPulls({
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

  const reviewPulls = pulls !== undefined ? pulls : []

  return (
    <>
      {userIdIsLoading || reviewIsLoading ? (
        <></>
      ) : (
        <>
          {review !== undefined &&
          userId !== undefined &&
          review.reviewee?.id === userId ? (
            <div className="flex min-h-screen flex-col">
              <ReviewEditHeader />
              {pullsIsLoading ? (
                <div className="flex flex-1 items-center justify-center">
                  <CircularProgress className="text-blue" />
                </div>
              ) : (
                <ReviewEdit review={review} pulls={reviewPulls} />
              )}
              <PostLoginFooter />
            </div>
          ) : (
            goToHome()
          )}
        </>
      )}
    </>
  )
}

export default withAuthUser({
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
})(Edit)
