import type { NextPage } from 'next'
import {
  withAuthUser,
  withAuthUserTokenSSR,
  useAuthUser,
  AuthAction,
} from 'next-firebase-auth'
import { dehydrate, QueryClient, useQuery } from '@tanstack/react-query'
import { userApi, reviewApi, notificationApi } from '@/api/custom-instance'
import PostLoginHeader from '@/components/organisms/PostLoginHeader'
import ReviewList from '@/components/templates/ReviewList'
import PostLoginFooter from '@/components/organisms/PostLoginFooter'

const Home: NextPage<any> = ({ avatar }) => {
  const AuthUser = useAuthUser()

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

  const { data: reviews } = useQuery(
    ['reviews'],
    async () => {
      const { data } = await reviewApi.getReviews()
      return data
    },
    {
      enabled: AuthUser.id !== null,
    },
  )

  const wantedReviews =
    reviews !== undefined
      ? reviews.filter((review) => review.accepted_at === null)
      : []
  const acceptedReviews =
    reviews !== undefined
      ? reviews.filter((review) => review.accepted_at !== null)
      : []
  const currentUserId = userId !== undefined ? userId : 0
  const reviewNotifications = notifications !== undefined ? notifications : []
  const badgeContent = reviewNotifications.filter(
    (notification) => notification.checked === false,
  ).length

  return (
    <div className="flex min-h-screen flex-col">
      <PostLoginHeader
        avatar={avatar}
        userId={currentUserId}
        notifications={reviewNotifications}
        badgeContent={badgeContent}
      />
      <ReviewList
        wantedReviews={wantedReviews}
        acceptedReviews={acceptedReviews}
      />
      <PostLoginFooter />
    </div>
  )
}

export const getServerSideProps = withAuthUserTokenSSR({
  whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
})(async ({ AuthUser }) => {
  const queryClient = new QueryClient()
  const token = await AuthUser.getIdToken()
  const avatar = AuthUser.photoURL

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

    await queryClient.prefetchQuery(['reviews'], async () => {
      const { data } = await reviewApi.getReviews()
      return data
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
})(Home)
