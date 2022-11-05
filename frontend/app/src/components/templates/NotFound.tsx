import type { NextPage } from 'next'
import Image from 'next/image'
import { useRouter } from 'next/router'
import LargeButton from '@/components/atoms/LargeButton'

const NotFound: NextPage = () => {
  const router = useRouter()
  const goToHome = (): void => {
    router.push('/').catch((error) => {
      console.error(error)
    })
  }

  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="mr-[50px]">
        <Image src="/404.svg" alt="404" width={400} height={400} />
      </div>
      <div className="w-[370px]">
        <h1 className="mb-5 text-4xl text-black">404 Not Found.</h1>
        <p className="mb-5 text-base text-black">
          あなたがアクセスしようとしたページは、削除されたかURLが変更されているため、見つけることができませんでした。
        </p>
        <p className="mb-[30px] text-base text-black">
          トップページへお戻りください。
        </p>
        <LargeButton onClick={goToHome}>トップページへ戻る</LargeButton>
      </div>
    </div>
  )
}

export default NotFound
