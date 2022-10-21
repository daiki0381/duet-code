import type { NextPage } from 'next'
import { GithubAuthProvider, signInWithPopup, signOut } from 'firebase/auth'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '@/firebase'
import { UserApi } from '@/openapi-generator/api'

const Home: NextPage = () => {
  const [user, loading] = useAuthState(auth)

  const signInUser = (): void => {
    const provider = new GithubAuthProvider()
    provider.addScope('repo')
    signInWithPopup(auth, provider)
      .then((result) => {
        const user: any = result.user
        const uid = user.uid
        const name = user.displayName
        const avatar = user.photoURL
        const token = user.accessToken
        const githubAccessToken =
          GithubAuthProvider.credentialFromResult(result)?.accessToken
        if (
          token !== null &&
          uid !== null &&
          name !== null &&
          avatar !== null &&
          githubAccessToken !== undefined
        ) {
          const userApi = new UserApi()
          userApi
            .loginUser({
              token,
              uid,
              name,
              avatar,
              github_access_token: githubAccessToken,
            })
            .catch((error) => {
              console.error(error)
            })
        }
      })
      .catch((error) => {
        console.error(error)
      })
  }

  const signOutUser = (): void => {
    signOut(auth).catch((error) => {
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
          <button onClick={signOutUser}>ログアウト</button>
        </div>
      ) : (
        <div>
          <div>ログイン前/TOP画面</div>
          <button onClick={signInUser}>ログイン</button>
        </div>
      )}
    </div>
  )
}

export default Home
