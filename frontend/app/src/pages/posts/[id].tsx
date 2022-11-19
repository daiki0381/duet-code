import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import {
  withAuthUser,
  withAuthUserTokenSSR,
  useAuthUser,
  AuthAction,
} from 'next-firebase-auth'
import { dehydrate, QueryClient, useQuery } from '@tanstack/react-query'
import { userApi, reviewApi, notificationApi } from '@/api/custom-instance'
import PostLoginHeader from '@/components/organisms/PostLoginHeader'
import ReviewDetails from '@/components/templates/ReviewDetails'
import PostLoginFooter from '@/components/organisms/PostLoginFooter'

const Details: NextPage<any> = ({ avatar }) => {
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

  const { data: notifications } = useQuery(
    ['notifications'],
    async () => {
      const token = await AuthUser.getIdToken()
      if (token !== null) {
        const { data } =
          await await notificationApi.getCurrentUserNotifications({
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

  const currentUserId = userId !== undefined ? userId : 0
  const reviewNotifications = notifications !== undefined ? notifications : []
  const badgeContent = reviewNotifications.filter(
    (notification) => notification.checked === false,
  ).length

  return (
    <>
      {review !== undefined ? (
        <div className="flex min-h-screen flex-col">
          <PostLoginHeader
            avatar={avatar}
            userId={currentUserId}
            notifications={reviewNotifications}
            badgeContent={badgeContent}
          />
          <ReviewDetails
            review={review}
            authUser={AuthUser}
            userId={currentUserId}
          />
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
  const avatar = AuthUser.photoURL
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

    await queryClient.prefetchQuery(['notifications'], async () => {
      const { data } = await notificationApi.getCurrentUserNotifications({
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
      avatar,
    },
  }
})

export default withAuthUser({
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
})(Details)
