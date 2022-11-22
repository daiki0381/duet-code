import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { withAuthUser, useAuthUser, AuthAction } from 'next-firebase-auth'
import { useQuery } from '@tanstack/react-query'
import { userApi, notificationApi } from '@/api/custom-instance'
import PostLoginHeader from '@/components/organisms/PostLoginHeader'
import UserDetails from '@/components/templates/UserDetails'
import PostLoginFooter from '@/components/organisms/PostLoginFooter'
import CircularProgress from '@mui/material/CircularProgress'

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

  const { data: user, isLoading: userIsLoading } = useQuery(
    ['user'],
    async () => {
      if (typeof id === 'string') {
        const { data } = await userApi.getUser(id)
        return data
      }
    },
    {
      enabled: AuthUser.id !== null,
      retry: false,
    },
  )

  const { data: wantedReviews, isLoading: wantedReviewsIsLoading } = useQuery(
    ['wantedReviews'],
    async () => {
      if (typeof id === 'string') {
        const { data } = await userApi.getUserWantedReviews(id)
        return data
      }
    },
    {
      enabled: AuthUser.id !== null,
      retry: false,
    },
  )

  const { data: acceptedReviews, isLoading: acceptedReviewsIsLoading } =
    useQuery(
      ['acceptedReviews'],
      async () => {
        if (typeof id === 'string') {
          const { data } = await userApi.getUserAcceptedReviews(id)
          return data
        }
      },
      {
        enabled: AuthUser.id !== null,
        retry: false,
      },
    )

  const currentAvatar = avatar !== null ? avatar : ''
  const currentUserId = userId !== undefined ? userId : 0
  const reviewNotifications = notifications !== undefined ? notifications : []
  const badgeContent = reviewNotifications.filter(
    (notification) => notification.checked === false,
  ).length
  const userWantedReviews = wantedReviews !== undefined ? wantedReviews : []
  const userAcceptedReviews =
    acceptedReviews !== undefined ? acceptedReviews : []

  return (
    <>
      {userIsLoading ? (
        <></>
      ) : (
        <>
          {user !== undefined ? (
            <div className="flex min-h-screen flex-col">
              <PostLoginHeader
                avatar={currentAvatar}
                userId={currentUserId}
                notifications={reviewNotifications}
                badgeContent={badgeContent}
              />
              {wantedReviewsIsLoading || acceptedReviewsIsLoading ? (
                <div className="flex flex-1 items-center justify-center">
                  <CircularProgress className="text-blue" />
                </div>
              ) : (
                <UserDetails
                  user={user}
                  wantedReviews={userWantedReviews}
                  acceptedReviews={userAcceptedReviews}
                />
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
})(Details)
