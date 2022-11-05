import type { NextPage } from 'next'
import { useDidUpdateEffect } from '@/hooks/useDidUpdateEffect'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useSetRecoilState } from 'recoil'
import { auth } from '@/firebase'
import PreLoginHeader from '@/components/organisms/PreLoginHeader'
import PostLoginHeader from '@/components/organisms/PostLoginHeader'
import NotFound from '@/components/templates/NotFound'
import Footer from '@/components/organisms/Footer'
import { isLoginState } from '@/stores/isLoginState'
import { avatarState } from '@/stores/avatarState'
import CircularProgress from '@mui/material/CircularProgress'

const NotFoundLogin: NextPage = () => {
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
          <NotFound />
          <Footer />
        </div>
      ) : (
        <div className="flex min-h-screen flex-col">
          <PreLoginHeader />
          <NotFound />
          <Footer />
        </div>
      )}
    </>
  )
}

export default NotFoundLogin
