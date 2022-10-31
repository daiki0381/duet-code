import type { NextPage } from 'next'
import type { Review, Notification } from '@/api/api'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { signOut } from 'firebase/auth'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '@/firebase'
import { userApi, reviewApi, notificationApi } from '@/api/custom-instance'
import PreLoginHeader from '@/components/organisms/PreLoginHeader'
import Footer from '@/components/organisms/Footer'
import Top from '@/components/templates/Top'

const Home: NextPage = () => {
  const [user, loading] = useAuthState(auth)
  const router = useRouter()
  const queryClient = useQueryClient()

  const [wantedReviews, setWantedReviews] = useState<Review[] | []>([])
  const [acceptedReviews, setAcceptedReviews] = useState<Review[] | []>([])
  const [userId, setUserId] = useState<number | null>(null)
  const [notifications, setNotifications] = useState<Notification[] | []>([])

  const signOutWithGithub = (): void => {
    signOut(auth).catch((error) => {
      console.log(error)
    })
  }

  const goToPostsNew = (): void => {
    router.push('/posts/new').catch((error) => {
      console.error(error)
    })
  }

  const goToPostsDetails = (id: number): void => {
    router.push(`/posts/${id}`).catch((error) => {
      console.error(error)
    })
  }

  const goToUsersDetails = (id: number): void => {
    router.push(`/users/${id}`).catch((error) => {
      console.error(error)
    })
  }

  useQuery(
    ['reviews'],
    async (): Promise<Review[]> => {
      const response = await reviewApi.getReviews()
      const reviews = response.data
      return reviews
    },
    {
      onSuccess: (data) => {
        const wantedReviews = data.filter((review) => {
          return review.accepted_at === null
        })
        const acceptedReviews = data.filter((review) => {
          return review.accepted_at !== null
        })
        setWantedReviews(wantedReviews)
        setAcceptedReviews(acceptedReviews)
      },
      enabled: user !== null,
    },
  )

  useQuery(
    ['notifications'],
    async (): Promise<Notification[]> => {
      const response = await notificationApi.getCurrentUserNotifications()
      const notifications = response.data
      return notifications
    },
    {
      onSuccess: (data) => {
        setNotifications(data)
      },
      enabled: user !== null,
    },
  )

  useQuery(
    ['userId'],
    async (): Promise<number> => {
      const response = await userApi.getCurrentUserId()
      const userId = response.data
      return userId
    },
    {
      onSuccess: (data) => {
        setUserId(data)
      },
      enabled: user !== null,
    },
  )

  const { mutate } = useMutation(
    async (notificationId: number): Promise<void> => {
      await notificationApi.updateNotification(notificationId)
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['notifications']).catch((error) => {
          console.error(error)
        })
      },
    },
  )

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      {user !== null ? (
        <div>
          <div>ログイン後/一覧画面</div>
          <button onClick={goToPostsNew}>レビュー募集</button>
          <button onClick={() => goToUsersDetails(Number(userId))}>
            マイページ
          </button>
          <button onClick={signOutWithGithub}>ログアウト</button>
          <div>通知</div>
          <ul>
            {notifications.map((notification) => {
              return (
                <li
                  key={notification.id}
                  onClick={() => mutate(Number(notification.id))}
                >
                  {notification.action}
                </li>
              )
            })}
          </ul>
          <div>レビュー募集中</div>
          {wantedReviews.map((review) => {
            return (
              <div
                key={review.id}
                onClick={() => {
                  if (review.id !== undefined) {
                    goToPostsDetails(review.id)
                  }
                }}
              >
                <p>タイトル: {review.title}</p>
              </div>
            )
          })}
          <div>レビュー募集終了</div>
          {acceptedReviews.map((review) => {
            return (
              <div
                key={review.id}
                onClick={() => {
                  if (review.id !== undefined) {
                    goToPostsDetails(review.id)
                  }
                }}
              >
                <p>タイトル: {review.title}</p>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="flex min-h-screen flex-col">
          <PreLoginHeader />
          <Top />
          <Footer />
        </div>
      )}
    </div>
  )
}

export default Home
