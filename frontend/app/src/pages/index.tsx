import type { NextPage } from 'next'
import type { Review } from '@/openapi-generator/api'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { GithubAuthProvider, signInWithPopup, signOut } from 'firebase/auth'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '@/firebase'
import { userApi } from '@/openapi-generator/user'
import { reviewApi } from '@/openapi-generator/review'

const Home: NextPage = () => {
  const [user, loading] = useAuthState(auth)
  const router = useRouter()
  const [wantedReviews, setWantedReviews] = useState<Review[] | []>([])
  const [acceptedReviews, setAcceptedReviews] = useState<Review[] | []>([])

  const signInWithGithub = async (): Promise<void> => {
    const provider = new GithubAuthProvider()
    provider.addScope('repo')
    const result = await signInWithPopup(auth, provider)
    const user = result.user
    const uid = user.uid
    const name = user.displayName
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

  const goToPostsDetail = (id: number): void => {
    router.push(`/posts/${id}`).catch((error) => {
      console.error(error)
    })
  }

  useEffect(() => {
    if (user !== null) {
      getReviews().catch((error) => {
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
          <button onClick={signOutWithGithub}>ログアウト</button>
          <div>レビュー募集中</div>
          {wantedReviews.map((review) => {
            return (
              <div
                key={review.id}
                onClick={() => {
                  if (review.id !== undefined) {
                    goToPostsDetail(review.id)
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
                    goToPostsDetail(review.id)
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
