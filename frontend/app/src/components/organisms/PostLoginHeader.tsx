import type { NextPage } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import NormalButton from '../atoms/NormalButton'
import AvatarWithMenu from '../molecules/AvatarWithMenu'
import NotificationWithMenu from '../molecules/NotificationWithMenu'

const PostLoginHeader: NextPage = () => {
  const router = useRouter()

  const goToPostsNew = (): void => {
    router.push('/posts/new').catch((error) => {
      console.error(error)
    })
  }

  return (
    <div className="sticky top-0 z-50 flex items-center justify-between border-b border-border bg-white px-4 py-3">
      <Link href="/">
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
      <div className="flex items-center">
        <div className="mr-5 pt-[3px]">
          <NotificationWithMenu />
        </div>
        <div className="mr-5 pt-[3px]">
          <AvatarWithMenu />
        </div>
        <div>
          <NormalButton onClick={goToPostsNew}>レビュー募集</NormalButton>
        </div>
      </div>
    </div>
  )
}

export default PostLoginHeader
