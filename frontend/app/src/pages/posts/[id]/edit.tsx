import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import {
  withAuthUser,
  withAuthUserTokenSSR,
  useAuthUser,
  AuthAction,
} from 'next-firebase-auth'
import { dehydrate, QueryClient, useQuery } from '@tanstack/react-query'
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

  const { data: userId } = useQuery(
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

  const { data: pulls, isLoading } = useQuery(
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

  const { data: review } = useQuery(
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
      {review !== undefined &&
      userId !== undefined &&
      review.reviewee?.id === userId ? (
        <div className="flex min-h-screen flex-col">
          <ReviewEditHeader />
          {isLoading ? (
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
  )
}

export const getServerSideProps = withAuthUserTokenSSR({
  whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
})(async ({ AuthUser, query }) => {
  const queryClient = new QueryClient()
  const token = await AuthUser.getIdToken()
  const { id } = query

  if (token !== null) {
    await queryClient.prefetchQuery(['userId'], async () => {
      const { data } = await userApi.getCurrentUserId({
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return data
    })

    await queryClient.prefetchQuery(['review'], async () => {
      if (typeof id === 'string') {
        const { data } = await reviewApi.getReview(id)
        return data
      }
    })
  }

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  }
})

export default withAuthUser({
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
})(Edit)
