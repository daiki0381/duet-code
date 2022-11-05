import type { NextPage } from 'next'
import { useDidUpdateEffect } from '@/hooks/useDidUpdateEffect'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useSetRecoilState } from 'recoil'
import { auth } from '@/firebase'
import PreLoginHeader from '@/components/organisms/PreLoginHeader'
import PostLoginHeader from '@/components/organisms/PostLoginHeader'
import Top from '@/components/templates/Top'
import Footer from '@/components/organisms/Footer'
import { isLoginState } from '@/stores/isLoginState'
import { avatarState } from '@/stores/avatarState'
import CircularProgress from '@mui/material/CircularProgress'

type Props = {
  children: JSX.Element
}

const TopLogin: NextPage<Props> = ({ children }) => {
  const [user, isLoading] = useAuthState(auth)
  const setIsLogin = useSetRecoilState(isLoginState)
  const setAvatar = useSetRecoilState(avatarState)

  useDidUpdateEffect(() => {
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

  if (isLoading) {
    return (
      <div className="flex h-[100vh] items-center justify-center">
        <CircularProgress />
      </div>
    )
  }

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

export default TopLogin
