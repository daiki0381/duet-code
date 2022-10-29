/* eslint-disable @typescript-eslint/promise-function-async */
/* eslint-disable @typescript-eslint/no-misused-promises */
import type { NextPage } from 'next'
import type { Review, Notification } from '@/openapi-generator/api'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { GithubAuthProvider, signInWithPopup, signOut } from 'firebase/auth'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '@/firebase'
import { userApi } from '@/openapi-generator/user'
import { reviewApi } from '@/openapi-generator/review'
import { notificationApi } from '@/openapi-generator/notification'

const Home: NextPage = () => {
  const [user, loading] = useAuthState(auth)
  const router = useRouter()
  const [wantedReviews, setWantedReviews] = useState<Review[] | []>([])
  const [acceptedReviews, setAcceptedReviews] = useState<Review[] | []>([])
  const [userId, setUserId] = useState<number | null>(null)
  const [notifications, setNotifications] = useState<Notification[] | []>([])

  const signInWithGithub = async (): Promise<void> => {
    const provider = new GithubAuthProvider()
    provider.addScope('repo')
    const result = await signInWithPopup(auth, provider)
    const user: any = result.user
    const uid = user.uid
    const name = user.reloadUserInfo.screenName
    const avatar = user.photoURL
    const githubAccessToken =
      GithubAuthProvider.credentialFromResult(result)?.accessToken
    if (name !== null && avatar !== null && githubAccessToken !== undefined) {
      await userApi.loginUser({
        uid,
        name,
        avatar,
        github_access_token: githubAccessToken,
      })
    }
  }

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

  const getReviews = async (): Promise<void> => {
    const response = await reviewApi.getReviews()
    const reviews = response.data
    const wantedReviews = reviews.filter((review) => {
      return review.accepted_at === null
    })
    const acceptedReviews = reviews.filter((review) => {
      return review.accepted_at !== null
    })
    setWantedReviews(wantedReviews)
    setAcceptedReviews(acceptedReviews)
  }

  const getNotifications = async (): Promise<void> => {
    const response = await notificationApi.getCurrentUserNotifications()
    const notifications = response.data
    setNotifications(notifications)
  }

  const updateNotification = async (notificationId: number): Promise<void> => {
    await notificationApi.updateNotification(notificationId)
  }

  const goToPostsDetails = (id: number): void => {
    router.push(`/posts/${id}`).catch((error) => {
      console.error(error)
    })
  }

  const getUserId = async (): Promise<void> => {
    const response = await userApi.getCurrentUserId()
    const userId = response.data
    setUserId(userId)
  }

  const goToUsersDetails = (id: number): void => {
    router.push(`/users/${id}`).catch((error) => {
      console.error(error)
    })
  }

  useEffect(() => {
    if (user !== null) {
      getReviews().catch((error) => {
        console.error(error)
      })
      getUserId().catch((error) => {
        console.error(error)
      })
      getNotifications().catch((error) => {
        console.error(error)
      })
    }
  }, [user])

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
                  onClick={() => updateNotification(Number(notification.id))}
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
        <div>
          <div>ログイン前/TOP画面</div>
          <button
            onClick={() => {
              signInWithGithub().catch((error) => {
                console.error(error)
              })
            }}
          >
            ログイン
          </button>
        </div>
      )}
    </div>
  )
}

export default Home
