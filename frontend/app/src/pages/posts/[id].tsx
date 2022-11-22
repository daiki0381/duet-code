import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { withAuthUser, useAuthUser, AuthAction } from 'next-firebase-auth'
import { useQuery } from '@tanstack/react-query'
import { userApi, reviewApi, notificationApi } from '@/api/custom-instance'
import PostLoginHeader from '@/components/organisms/PostLoginHeader'
import ReviewDetails from '@/components/templates/ReviewDetails'
import PostLoginFooter from '@/components/organisms/PostLoginFooter'

const Details: NextPage<any> = () => {
  const AuthUser = useAuthUser()
  const avatar = AuthUser.photoURL
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
      cacheTime: 0,
    },
  )

  const currentAvatar = avatar !== null ? avatar : ''
  const currentUserId = userId !== undefined ? userId : 0
  const reviewNotifications = notifications !== undefined ? notifications : []
  const badgeContent = reviewNotifications.filter(
    (notification) => notification.checked === false,
  ).length

  return (
    <>
      {reviewIsLoading ? (
        <></>
      ) : (
        <>
          {review !== undefined ? (
            <>
              <div className="flex min-h-screen flex-col">
                <PostLoginHeader
                  avatar={currentAvatar}
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
            </>
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
})(Details)
