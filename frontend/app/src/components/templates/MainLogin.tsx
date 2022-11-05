import type { NextPage } from 'next'
import { useDidUpdateEffect } from '@/hooks/useDidUpdateEffect'
import { useRouter } from 'next/router'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useSetRecoilState } from 'recoil'
import { auth } from '@/firebase'
import PostLoginHeader from '@/components/organisms/PostLoginHeader'
import Footer from '@/components/organisms/Footer'
import { isLoginState } from '@/stores/isLoginState'
import { avatarState } from '@/stores/avatarState'
import CircularProgress from '@mui/material/CircularProgress'
import toast from 'react-hot-toast'

type Props = {
  children: JSX.Element
}

const MainLogin: NextPage<Props> = ({ children }) => {
  const [user, isLoading] = useAuthState(auth)
  const setIsLogin = useSetRecoilState(isLoginState)
  const setAvatar = useSetRecoilState(avatarState)
  const router = useRouter()

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

  const redirect = (): void => {
    router.push('/').catch((error) => {
      console.error(error)
    })
    toast.error('ログインしてください')
  }

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
        redirect()
      )}
    </>
  )
}

export default MainLogin
