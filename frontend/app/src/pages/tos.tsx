import type { NextPage } from 'next'
import Head from 'next/head'
import { withAuthUser, useAuthUser, AuthAction } from 'next-firebase-auth'
import { useQuery } from '@tanstack/react-query'
import { userApi, notificationApi } from '@/api/custom-instance'
import PreLoginHeader from '@/components/organisms/PreLoginHeader'
import PostLoginHeader from '@/components/organisms/PostLoginHeader'
import TermsOfService from '@/components/templates/TermsOfService'
import PreLoginFooter from '@/components/organisms/PreLoginFooter'
import PostLoginFooter from '@/components/organisms/PostLoginFooter'

const Tos: NextPage<any> = () => {
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

  const currentUserId = userId !== undefined ? userId : 0
  const reviewNotifications = notifications !== undefined ? notifications : []
  const badgeContent = reviewNotifications.filter(
    (notification) => notification.checked === false,
  ).length

  return (
    <>
      <Head>
        <title>Duet Code | 利用規約</title>
      </Head>
      <div className="flex min-h-screen flex-col">
        {avatar !== null ? (
          <>
            <PostLoginHeader
              avatar={avatar}
              userId={currentUserId}
              notifications={reviewNotifications}
              badgeContent={badgeContent}
            />
            <TermsOfService />
            <PostLoginFooter />
          </>
        ) : (
          <>
            <PreLoginHeader />
            <TermsOfService />
            <PreLoginFooter />
          </>
        )}
      </div>
    </>
  )
}

export default withAuthUser({
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
})(Tos)
