import type { NextPage } from 'next'
import { withAuthUser, useAuthUser, AuthAction } from 'next-firebase-auth'
import { useQuery } from '@tanstack/react-query'
import { gitHubApi } from '@/api/custom-instance'
import ReviewCreateHeader from '@/components/organisms/ReviewCreateHeader'
import ReviewCreate from '@/components/templates/ReviewCreate'
import PostLoginFooter from '@/components/organisms/PostLoginFooter'
import CircularProgress from '@mui/material/CircularProgress'

const New: NextPage<any> = () => {
  const AuthUser = useAuthUser()

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

  const reviewPulls = pulls !== undefined ? pulls : []

  return (
    <div className="flex min-h-screen flex-col">
      <ReviewCreateHeader />
      {isLoading ? (
        <div className="flex flex-1 items-center justify-center">
          <CircularProgress className="text-blue" />
        </div>
      ) : (
        <ReviewCreate pulls={reviewPulls} authUser={AuthUser} />
      )}
      <PostLoginFooter />
    </div>
  )
}

export default withAuthUser({
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
})(New)
