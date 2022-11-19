import type { NextPage } from 'next'
import {
  withAuthUser,
  withAuthUserTokenSSR,
  useAuthUser,
  AuthAction,
} from 'next-firebase-auth'
import { dehydrate, QueryClient, useQuery } from '@tanstack/react-query'
import { gitHubApi } from '@/api/custom-instance'
import ReviewCreateHeader from '@/components/organisms/ReviewCreateHeader'
import ReviewCreate from '@/components/templates/ReviewCreate'
import PostLoginFooter from '@/components/organisms/PostLoginFooter'

const New: NextPage<any> = () => {
  const AuthUser = useAuthUser()

  const { data: pulls } = useQuery(
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

  const reviewPulls = pulls !== undefined ? pulls : []

  return (
    <div className="flex min-h-screen flex-col">
      <ReviewCreateHeader />
      <ReviewCreate pulls={reviewPulls} authUser={AuthUser} />
      <PostLoginFooter />
    </div>
  )
}

export const getServerSideProps = withAuthUserTokenSSR({
  whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
})(async ({ AuthUser }) => {
  const queryClient = new QueryClient()
  const token = await AuthUser.getIdToken()

  if (token !== null) {
    await queryClient.prefetchQuery(['pulls'], async () => {
      const { data } = await gitHubApi.getCurrentUserPulls({
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return data
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
})(New)
