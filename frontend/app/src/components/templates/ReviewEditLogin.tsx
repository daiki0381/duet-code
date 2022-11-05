import type { NextPage } from 'next'
import type { Review } from '@/api/api'
import { useState } from 'react'
import { useDidUpdateEffect } from '@/hooks/useDidUpdateEffect'
import { useRouter } from 'next/router'
import { useQuery } from '@tanstack/react-query'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useSetRecoilState } from 'recoil'
import toast from 'react-hot-toast'
import { auth } from '@/firebase'
import PostLoginHeader from '../organisms/PostLoginHeader'
import ReviewEditHeader from '@/components/organisms/ReviewEditHeader'
import NotFound from '@/components/templates/NotFound'
import Footer from '@/components/organisms/Footer'
import { isLoginState } from '@/stores/isLoginState'
import { avatarState } from '@/stores/avatarState'
import { userApi, reviewApi } from '@/api/custom-instance'
import CircularProgress from '@mui/material/CircularProgress'

type Props = {
  children: JSX.Element
}

const ReviewEditLogin: NextPage<Props> = ({ children }) => {
  const router = useRouter()
  const { id } = router.query
  const [user, isLoading] = useAuthState(auth)
  const setIsLogin = useSetRecoilState(isLoginState)
  const setAvatar = useSetRecoilState(avatarState)
  const [userId, setUserId] = useState<number | null>(null)
  const [review, setReview] = useState<Review | null>(null)

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

  const { isLoading: userIdLoading } = useQuery(
    ['userId'],
    async () => {
      const { data } = await userApi.getCurrentUserId()
      return data
    },
    {
      onSuccess: (data) => {
        setUserId(data)
      },
      enabled: user !== null,
    },
  )

  const { isLoading: reviewLoading } = useQuery(
    ['review'],
    async () => {
      if (typeof id === 'string') {
        const { data } = await reviewApi.getReview(id)
        return data
      }
    },
    {
      onSuccess: (data) => {
        if (data !== undefined) {
          setReview(data)
        }
      },
      retry: 0,
      enabled: user !== null,
    },
  )

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
      {(() => {
        if (user !== null && (userIdLoading || reviewLoading)) {
          return (
            <div className="flex h-[100vh] items-center justify-center">
              <CircularProgress />
            </div>
          )
        } else if (user !== null && review?.reviewee?.id === userId) {
          return (
            <div className="flex min-h-screen flex-col">
              <ReviewEditHeader />
              {children}
              <Footer />
            </div>
          )
        } else if (user !== null && review?.reviewee?.id !== userId) {
          return (
            <div className="flex min-h-screen flex-col">
              <PostLoginHeader />
              <NotFound />
              <Footer />
            </div>
          )
        } else {
          return redirect()
        }
      })()}
    </>
  )
}

export default ReviewEditLogin
