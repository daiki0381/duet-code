import type { NextPage } from 'next'
import { useEffect } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useSetRecoilState } from 'recoil'
import { auth } from '@/firebase'
import PreLoginHeader from '@/components/organisms/PreLoginHeader'
import PostLoginHeader from '@/components/organisms/PostLoginHeader'
import Top from '@/components/templates/Top'
import Footer from '@/components/organisms/Footer'
import { isLoginState } from '@/stores/isLoginState'
import { avatarState } from '@/stores/avatarState'

type Props = {
  children: JSX.Element
}

const Login: NextPage<Props> = ({ children }) => {
  const [user] = useAuthState(auth)
  const setIsLogin = useSetRecoilState(isLoginState)
  const setAvatar = useSetRecoilState(avatarState)

  useEffect(() => {
    if (user !== null && user !== undefined) {
      setIsLogin(true)
      const avatar = user.photoURL
      if (avatar !== null) {
        setAvatar(avatar)
      }
    } else {
      setIsLogin(false)
    }
  }, [user])

  return (
    <>
      {user !== null ? (
        <div className="flex min-h-screen flex-col">
          <PostLoginHeader />
          {children}
          <Footer />
        </div>
      ) : (
        <div className="flex min-h-screen flex-col">
          <PreLoginHeader />
          <Top />
          <Footer />
        </div>
      )}
    </>
  )
}

export default Login
