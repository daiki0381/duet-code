import type { NextPage } from 'next'
import type { ReviewPost } from '@/openapi-generator/api'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { GithubAuthProvider, signInWithPopup, signOut } from 'firebase/auth'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '@/firebase'
import { userApi } from '@/openapi-generator/user'
import { reviewPostApi } from '@/openapi-generator/reviewPost'

const Home: NextPage = () => {
  const [user, loading] = useAuthState(auth)
  const router = useRouter()
  const [wantedReviewPosts, setWantedReviewPosts] = useState<ReviewPost[] | []>(
    [],
  )
  const [acceptedReviewPosts, setAcceptedReviewPosts] = useState<
    ReviewPost[] | []
  >([])

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

  const getReviewPosts = async (): Promise<void> => {
    const response = await reviewPostApi.getReviewPosts()
    const reviewPosts = response.data
    const wantedReviewPosts = reviewPosts.filter((reviewPost) => {
      return reviewPost.accepted_datetime === null
    })
    const acceptedReviewPosts = reviewPosts.filter((reviewPost) => {
      return reviewPost.accepted_datetime !== null
    })
    setWantedReviewPosts(wantedReviewPosts)
    setAcceptedReviewPosts(acceptedReviewPosts)
  }

  const goToPostsDetail = (id: number): void => {
    router.push(`/posts/${id}`).catch((error) => {
      console.error(error)
    })
  }

  useEffect(() => {
    if (user !== null) {
      getReviewPosts().catch((error) => {
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
          {wantedReviewPosts.map((reviewPost) => {
            return (
              <div
                key={reviewPost.id}
                onClick={() => {
                  if (reviewPost.id !== undefined) {
                    goToPostsDetail(reviewPost.id)
                  }
                }}
              >
                <p>タイトル: {reviewPost.title}</p>
              </div>
            )
          })}
          <div>レビュー募集終了</div>
          {acceptedReviewPosts.map((reviewPost) => {
            return (
              <div
                key={reviewPost.id}
                onClick={() => {
                  if (reviewPost.id !== undefined) {
                    goToPostsDetail(reviewPost.id)
                  }
                }}
              >
                <p>タイトル: {reviewPost.title}</p>
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
