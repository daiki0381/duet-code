import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { GithubAuthProvider, signInWithPopup, signOut } from 'firebase/auth'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '@/firebase'
import { userApi } from '@/openapi-generator/user'

const Home: NextPage = () => {
  const [user, loading] = useAuthState(auth)
  const router = useRouter()

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
