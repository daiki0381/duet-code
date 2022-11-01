import type { NextPage } from 'next'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { useQuery } from '@tanstack/react-query'
import { useRecoilValue } from 'recoil'
import { signOut } from 'firebase/auth'
import toast from 'react-hot-toast'
import { auth } from '@/firebase'
import { isLoginState } from '@/stores/isLoginState'
import { userApi } from '@/api/custom-instance'

const Menu: NextPage = () => {
  const router = useRouter()
  const isLogin = useRecoilValue(isLoginState)
  const [userId, setUserId] = useState<number | null>(null)

  const signOutWithGithub = (): void => {
    signOut(auth)
      .then(() => {
        router.replace('/').catch((error) => {
          console.error(error)
        })
        toast.success('ログアウトしました')
      })
      .catch((error) => {
        console.error(error)
      })
  }

  const goToUsersDetails = (): void => {
    if (userId !== null) {
      router.push(`/users/${userId}`).catch((error) => {
        console.error(error)
      })
    }
  }

  useQuery(
    ['userId'],
    async (): Promise<number> => {
      const { data } = await userApi.getCurrentUserId()
      return data
    },
    {
      onSuccess: (data) => {
        setUserId(data)
      },
      enabled: isLogin,
    },
  )

  return (
    <div className="w-[185px] rounded-lg p-[5px] shadow-[0_3px_10px_0_rgba(0,0,0,0.15)]">
      <div
        className="cursor-pointer rounded-lg py-[15px] px-[10px] text-sm text-black hover:bg-[#F7F7F7]"
        onClick={goToUsersDetails}
      >
        マイページ
      </div>
      <div
        className="cursor-pointer rounded-lg py-[15px] px-[10px] text-sm text-black hover:bg-[#F7F7F7]"
        onClick={signOutWithGithub}
      >
        ログアウト
      </div>
    </div>
  )
}

export default Menu
