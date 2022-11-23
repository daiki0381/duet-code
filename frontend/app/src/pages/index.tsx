import type { NextPage } from 'next'
import { withAuthUser, useAuthUser, AuthAction } from 'next-firebase-auth'
import { useQuery } from '@tanstack/react-query'
import { userApi, reviewApi, notificationApi } from '@/api/custom-instance'
import PostLoginHeader from '@/components/organisms/PostLoginHeader'
import ReviewList from '@/components/templates/ReviewList'
import PostLoginFooter from '@/components/organisms/PostLoginFooter'
import CircularProgress from '@mui/material/CircularProgress'

const Home: NextPage<any> = () => {
  const AuthUser = useAuthUser()
  const avatar = AuthUser.photoURL

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

  const { data: reviews, isLoading } = useQuery(
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
  const currentAvatar = avatar !== null ? avatar : ''
  const currentUserId = userId !== undefined ? userId : 0
  const reviewNotifications = notifications !== undefined ? notifications : []
  const badgeContent = reviewNotifications.filter(
    (notification) => notification.checked === false,
  ).length

  return (
    <div className="flex min-h-screen flex-col">
      <PostLoginHeader
        avatar={currentAvatar}
        userId={currentUserId}
        notifications={reviewNotifications}
        badgeContent={badgeContent}
      />
      {isLoading ? (
        <div className="flex flex-1 items-center justify-center bg-post-login-light-blue">
          <CircularProgress className="text-blue" />
        </div>
      ) : (
        <ReviewList
          wantedReviews={wantedReviews}
          acceptedReviews={acceptedReviews}
        />
      )}
      <PostLoginFooter />
    </div>
  )
}

export default withAuthUser({
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
})(Home)
