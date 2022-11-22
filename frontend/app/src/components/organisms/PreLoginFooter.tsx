import type { NextPage } from 'next'
import Image from 'next/image'
import Link from 'next/link'

const Footer: NextPage = () => {
  return (
    <div className="bg-footer px-4 py-6">
      <div className="mb-5">
        <Link href="/login">
          <a>
            <Image
              src="/footer-logo.png"
              width={100}
              height={40}
              alt="Duet Code"
              className="cursor-pointer hover:opacity-70"
            />
          </a>
        </Link>
      </div>
      <div className="text-sm text-gray">
        <Link href="/login">
          <a className="hover:opacity-70">TOP</a>
        </Link>
        <span> / </span>
        <Link href="/tos">
          <a className="hover:opacity-70">利用規約</a>
        </Link>
        <span> / </span>
        <Link href="/pp">
          <a className="hover:opacity-70">プライバシーポリシー</a>
        </Link>
      </div>
    </div>
  )
}

export default Footer
