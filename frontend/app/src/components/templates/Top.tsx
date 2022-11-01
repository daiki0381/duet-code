import type { NextPage } from 'next'
import Image from 'next/image'
import { GithubAuthProvider, signInWithPopup } from 'firebase/auth'
import toast from 'react-hot-toast'
import { auth } from '@/firebase'
import { userApi } from '@/api/custom-instance'
import Card from '@/components/molecules/Card'
import LargeButton from '@/components/atoms/LargeButton'
import FreeIcon from '@/components/atoms/FreeIcon'
import ReviewIcon from '@/components/atoms/ReviewIcon'
import GrowthIcon from '@/components/atoms/GrowthIcon'

const Top: NextPage = () => {
  const signInWithGithub = async (): Promise<void> => {
    const provider = new GithubAuthProvider()
    provider.addScope('repo')
    const result = await signInWithPopup(auth, provider)
    const user: any = result.user
    const uid = user.uid
    const name = user.reloadUserInfo.screenName
    const avatar = user.photoURL
    const githubAccessToken =
      GithubAuthProvider.credentialFromResult(result)?.accessToken
    if (name !== null && avatar !== null && githubAccessToken !== undefined) {
      await userApi.loginUser({
        uid,
        name,
        avatar,
        github_access_token: githubAccessToken,
      })
    }
  }

  return (
    <>
      <div className="flex items-center justify-between px-[220px] py-[120px]">
        <div className="w-[450px]">
          <h1 className="mb-[30px] text-[32px] font-semibold">
            無料で使える
            <br />
            コードレビューサービス
          </h1>
          <p className="mb-[30px] text-sm">
            レビューしてほしいプルリクエストを投稿し、レビュアーを募集できるサービスです。ログインすることでレビュイーにもレビュアーにもなることができます。
          </p>
          <LargeButton
            onClick={async () =>
              await signInWithGithub().then(() => {
                toast.success('ログインしました')
              })
            }
          >
            無料で始める
          </LargeButton>
        </div>
        <Image src="/top-hero.svg" width={480} height={300} />
      </div>
      <div className="mb-[80px] bg-[#D6E7F7] px-[220px] py-[80px] text-center">
        <div className="mb-[50px] text-[32px] font-semibold">特徴</div>
        <div className="flex items-center justify-between">
          <Card
            main="無料で使える"
            sub="レビューを募集することも、レビューを承認することも無料で使えます。"
          >
            <FreeIcon />
          </Card>
          <Card
            main="レビュイー・レビュアーになれる"
            sub="ログインするだけでレビュイーにもレビュアーにもなることができます。"
          >
            <ReviewIcon />
          </Card>
          <Card
            main="技術力を高められる"
            sub="コードレビューを通して読みやすいコードが書けるようになったり、他の人のコードが読めるようになります。"
          >
            <GrowthIcon />
          </Card>
        </div>
      </div>
      <div className="mb-[80px] px-[220px] text-center">
        <div className="mb-[80px] text-[32px] font-semibold">
          メリット (レビュイー)
        </div>
        <div className="mb-[50px] flex items-center justify-around">
          <Image src="/top-reviewee1.svg" width={350} height={350} />
          <div className="w-[480px] text-left">
            <div className="mb-[30px] text-2xl font-semibold">
              プライベートで書いた
              <br />
              コードをレビューしてもらえる
            </div>
            <p className="text-xl">
              通常、プライベートで書いたコードをレビューしてもらえる機会はありません。しかし、このサービスにプルリクエストを投稿することで、プライベートで書いたコードをレビューしてもらうことができます。
            </p>
          </div>
        </div>
        <div className="flex items-center justify-around">
          <div className="w-[480px] text-left">
            <div className="mb-[30px] text-2xl font-semibold">
              読みやすいコードが書けるようになる
            </div>
            <p className="text-xl">
              自分では読みやすいと思っているコードでも他の人が読んだら、命名がぐちゃぐちゃで、ここの処理は何をしているのか理解できないということがあります。他の人にコードを見てもらうことで、読みやすいコードが書けるようになります。
            </p>
          </div>
          <Image src="/top-reviewee2.svg" width={350} height={350} />
        </div>
      </div>
      <div className="mb-[80px] px-[220px] text-center">
        <div className="mb-[80px] text-[32px] font-semibold">
          メリット (レビュアー)
        </div>
        <div className="mb-[50px] flex items-center justify-around">
          <Image src="/top-reviewer1.svg" width={350} height={350} />
          <div className="w-[480px] text-left">
            <div className="mb-[30px] text-2xl font-semibold">
              他の人のコードが読めるようになる
            </div>
            <p className="text-xl">
              実務に入るとコードを書いている時間より、他の人が書いたコードを読んでいる時間の方が長いです。他の人が書いたコードを読むことで、コードリーディングの能力を向上させることができます。
            </p>
          </div>
        </div>
        <div className="flex items-center justify-around">
          <div className="w-[480px] text-left">
            <div className="mb-[30px] text-2xl font-semibold">
              実装の引き出しが増える
            </div>
            <p className="text-xl">
              他の人が書いたコードを読むことで、こういう書き方ができるのかという気付きがあり、実装の引き出しを増やすことができます。
            </p>
          </div>
          <Image src="/top-reviewer2.svg" width={350} height={350} />
        </div>
      </div>
      <div className="bg-[#D6E7F7] py-[80px] text-center">
        <div className="mb-[30px]">
          <Image src="/top-logo.png" width={250} height={100} />
        </div>
        <div>
          <LargeButton
            onClick={async () =>
              await signInWithGithub().then(() => {
                toast.success('ログインしました')
              })
            }
          >
            無料で始める
          </LargeButton>
        </div>
      </div>
    </>
  )
}

export default Top
