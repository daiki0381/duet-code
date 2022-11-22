import type { NextPage } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { GithubAuthProvider, signInWithPopup, getAuth } from 'firebase/auth'
import { userApi } from '@/api/custom-instance'
import LoginButton from '@/components/atoms/LoginButton'

const PreLoginHeader: NextPage = () => {
  const signInWithGithub = async (): Promise<void> => {
    const auth = getAuth()
    const provider = new GithubAuthProvider()
    provider.addScope('repo')
    const result = await signInWithPopup(auth, provider)
    const user: any = result.user
    const uid = user.uid
    const name = user.reloadUserInfo.screenName
    const avatar = user.photoURL
    const githubAccessToken =
      GithubAuthProvider.credentialFromResult(result)?.accessToken
    const token = await auth.currentUser?.getIdToken()
    if (
      name !== null &&
      avatar !== null &&
      githubAccessToken !== undefined &&
      token !== undefined
    ) {
      await userApi.loginUser(
        {
          uid,
          name,
          avatar,
          github_access_token: githubAccessToken,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
    }
  }

  return (
    <div className="sticky top-0 z-50 flex h-[73px] items-center justify-between border-b border-border bg-white px-4 py-3">
      <Link href="/login">
        <a>
          <Image
            src="/header-logo.png"
            width={100}
            height={40}
            alt="Duet Code"
            className="cursor-pointer hover:opacity-70"
          />
        </a>
      </Link>
      <LoginButton onClick={async () => await signInWithGithub()} />
    </div>
  )
}

export default PreLoginHeader
