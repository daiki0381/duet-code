import type { NextPage } from 'next'
import { getAuth, GithubAuthProvider, signInWithPopup } from 'firebase/auth'
import '@/firebase'
import { UserApi } from '@/openapi-generator/api'

const Home: NextPage = () => {
  const signIn = (): void => {
    const provider = new GithubAuthProvider()
    provider.addScope('repo')
    const auth = getAuth()
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

  return (
    <div>
      <button onClick={signIn}>ログイン</button>
    </div>
  )
}

export default Home
