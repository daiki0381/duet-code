import type { NextPage } from 'next'
import Image from 'next/image'
import { GithubAuthProvider, signInWithPopup, getAuth } from 'firebase/auth'
import { userApi } from '@/api/custom-instance'
import Card from '@/components/molecules/Card'
import LargeButton from '@/components/atoms/LargeButton'
import FreeIcon from '@/components/atoms/FreeIcon'
import ReviewIcon from '@/components/atoms/ReviewIcon'
import GrowthIcon from '@/components/atoms/GrowthIcon'

const Top: NextPage = () => {
  const signInWithGithub = async (): Promise<void> => {
    const auth = getAuth()
    const provider = new GithubAuthProvider()
    provider.addScope('repo')
    const result = await signInWithPopup(auth, provider)
    const user: any = result.user
    const uid = user.uid
    const name = user.reloadUserInfo.screenName
    const avatar = user.photoURL
    const githubAccessToken =
      GithubAuthProvider.credentialFromResult(result)?.accessToken
    const token = await auth.currentUser?.getIdToken()
    if (
      name !== null &&
      avatar !== null &&
      githubAccessToken !== undefined &&
      token !== undefined
    ) {
      await userApi.loginUser(
        {
          uid,
          name,
          avatar,
          github_access_token: githubAccessToken,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
    }
  }

  return (
    <>
      <div className="mx-auto flex flex-col items-center py-[60px] px-4 text-center sm:max-w-[640px] md:max-w-[768px] lg:max-w-[1024px] lg:flex-row lg:justify-between lg:py-[120px]">
        <div className="mb-5 lg:mb-0 lg:w-[450px] lg:text-left">
          <h1 className="mb-5 text-2xl font-semibold leading-snug lg:mb-[30px] lg:text-[32px]">
            ユーザー間の
            <br />
            コードレビューサービス
          </h1>
          <p className="mb-5 text-left text-sm lg:mb-[30px]">
            レビューしてほしいプルリクエストを投稿し、レビュアーを募集できるサービスです。ログインすることでレビュイーにもレビュアーにもなることができます。
          </p>
          <LargeButton onClick={async () => await signInWithGithub()}>
            無料で始める
          </LargeButton>
        </div>
        <Image
          src="/login-hero.svg"
          width={480}
          height={300}
          alt="ログイン後のホーム画面のイラスト"
        />
      </div>
      <div className="mb-[60px] bg-pre-login-light-blue py-[60px] text-center lg:mb-[80px] lg:py-[80px]">
        <div className="mx-auto max-w-[1024px] px-4">
          <h2 className="mb-[30px] text-2xl font-semibold lg:mb-[50px] lg:text-[32px]">
            サービスの特徴
          </h2>
          <div className="flex flex-col items-center lg:flex-row lg:justify-between">
            <div className="mb-[30px] lg:mb-0">
              <Card
                main="無料で使える"
                sub="レビューを募集することも、レビューを承認することも無料で使えます。"
              >
                <FreeIcon />
              </Card>
            </div>
            <div className="mb-[30px] lg:mb-0">
              <Card
                main="レビュイー・レビュアーになれる"
                sub="ログインするだけでレビュイーにもレビュアーにもなることができます。"
              >
                <ReviewIcon />
              </Card>
            </div>
            <div>
              <Card
                main="技術力を高められる"
                sub="コードレビューを通して読みやすいコードが書けるようになったり、他の人のコードが読めるようになります。"
              >
                <GrowthIcon />
              </Card>
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto mb-[60px] px-4 text-center sm:max-w-[640px] md:max-w-[768px] lg:mb-[80px] lg:max-w-[1024px]">
        <h2 className="mb-[30px] text-2xl font-semibold lg:mb-[80px] lg:text-[32px]">
          レビューをされるメリット
        </h2>
        <div className="mb-[30px] flex flex-col items-center lg:mb-[50px] lg:flex-row lg:justify-around">
          <div className="mb-5 lg:mb-0">
            <Image
              src="/login-reviewee1.svg"
              width={350}
              height={350}
              alt="レビュイーのイラスト"
            />
          </div>
          <div className="lg:w-[480px]">
            <div className="mb-5 text-lg font-semibold lg:mb-[30px] lg:text-left lg:text-2xl">
              プライベートで書いた
              <br />
              コードをレビューしてもらえる
            </div>
            <p className="text-left text-sm lg:text-xl">
              通常、プライベートで書いたコードをレビューしてもらえる機会はありません。しかし、このサービスにプルリクエストを投稿することで、プライベートで書いたコードをレビューしてもらうことができます。
            </p>
          </div>
        </div>
        <div className="flex flex-col-reverse items-center lg:flex-row lg:justify-around">
          <div className="lg:w-[480px]">
            <div className="mb-5 text-lg font-semibold lg:mb-[30px] lg:text-left lg:text-2xl">
              読みやすいコードが書けるようになる
            </div>
            <p className="text-left text-sm lg:text-xl">
              自分では読みやすいと思っているコードでも他の人が読んだら、命名がぐちゃぐちゃで、ここの処理は何をしているのか理解できないということがあります。他の人にコードを見てもらうことで、読みやすいコードが書けるようになります。
            </p>
          </div>
          <div className="mb-5 lg:mb-0">
            <Image
              src="/login-reviewee2.svg"
              width={350}
              height={350}
              alt="レビュイーのイラスト"
            />
          </div>
        </div>
      </div>
      <div className="mx-auto mb-[60px] px-4 text-center sm:max-w-[640px] md:max-w-[768px] lg:mb-[80px] lg:max-w-[1024px]">
        <h2 className="mb-[30px] text-2xl font-semibold lg:mb-[80px] lg:text-[32px]">
          レビューをするメリット
        </h2>
        <div className="mb-[30px] flex flex-col items-center lg:mb-[50px] lg:flex-row lg:justify-around">
          <div className="mb-5 lg:mb-0">
            <Image
              src="/login-reviewer1.svg"
              width={350}
              height={350}
              alt="レビュアーのイラスト"
            />
          </div>
          <div className="lg:w-[480px]">
            <div className="mb-5 text-lg font-semibold lg:mb-[30px] lg:text-left lg:text-2xl">
              他の人のコードが読めるようになる
            </div>
            <p className="text-left text-sm lg:text-xl">
              実務に入るとコードを書いている時間より、他の人が書いたコードを読んでいる時間の方が長いです。他の人が書いたコードを読むことで、コードリーディングの能力を向上させることができます。
            </p>
          </div>
        </div>
        <div className="flex flex-col-reverse items-center lg:flex-row lg:justify-around">
          <div className="lg:w-[480px]">
            <div className="mb-5 text-lg font-semibold lg:mb-[30px] lg:text-left lg:text-2xl">
              実装の引き出しが増える
            </div>
            <p className="text-left text-sm lg:text-xl">
              他の人が書いたコードを読むことで、こういう書き方ができるのかという気付きがあり、実装の引き出しを増やすことができます。
            </p>
          </div>
          <div className="mb-5 lg:mb-0">
            <Image
              src="/login-reviewer2.svg"
              width={350}
              height={350}
              alt="レビュアーのイラスト"
            />
          </div>
        </div>
      </div>
      <div className="bg-pre-login-light-blue py-[80px] text-center">
        <div className="mb-[30px]">
          <Image
            src="/login-logo.png"
            width={250}
            height={100}
            alt="Duet Code"
          />
        </div>
        <div>
          <LargeButton onClick={async () => await signInWithGithub()}>
            無料で始める
          </LargeButton>
        </div>
      </div>
    </>
  )
}

export default Top
