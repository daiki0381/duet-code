import type { NextPage } from 'next'

const PrivacyPolicy: NextPage = () => {
  return (
    <div className="mx-auto flex-1 py-[50px] px-4 sm:max-w-[640px] md:max-w-[768px] lg:max-w-[1024px]">
      <h1 className="mb-5 text-2xl font-bold text-black">
        プライバシーポリシー
      </h1>
      <p className="mb-[30px] text-sm text-black">
        本ウェブサイト上で提供するサービス（以下,「本サービス」といいます。）における、ユーザーの個人情報の取扱いについて、以下のとおりプライバシーポリシー（以下、「本ポリシー」といいます。）を定めます。
      </p>
      <h2 className="mb-5 text-xl font-semibold text-black">
        第1条（個人情報）
      </h2>
      <p className="mb-[30px] text-sm text-black">
        「個人情報」とは、個人情報保護法にいう「個人情報」を指すものとし、特定の個人を識別できる情報（個人識別情報）を指します。
      </p>
      <h2 className="mb-5 text-xl font-semibold text-black">
        第2条（個人情報の収集方法）
      </h2>
      <p className="mb-[30px] text-sm text-black">
        本サービスは、ユーザーが利用登録をする際にユーザーのGitHubアカウント情報を取得します。
      </p>
      <h2 className="mb-5 text-xl font-semibold text-black">
        第3条（個人情報を収集・利用する目的）
      </h2>
      <div className="mb-[30px] text-sm text-black">
        <p className="mb-5">
          本サービスが個人情報を収集・利用する目的は、以下のとおりです。
        </p>
        <ol className="list-decimal pl-10">
          <li className="mb-[10px]">本サービスの提供・運営のため</li>
          <li className="mb-[10px]">
            ユーザーからのお問い合わせに回答するため（本人確認を行うことを含む）
          </li>
          <li className="mb-[10px]">
            メンテナンス、重要なお知らせなど必要に応じたご連絡のため
          </li>
          <li className="mb-[10px]">
            利用規約に違反したユーザーや、不正・不当な目的でサービスを利用しようとするユーザーの特定をし、ご利用をお断りするため
          </li>
          <li className="mb-[10px]">
            ユーザーにご自身の登録情報の閲覧や変更、削除、ご利用状況の閲覧を行っていただくため
          </li>
          <li>上記の利用目的に付随する目的</li>
        </ol>
      </div>
      <h2 className="mb-5 text-xl font-semibold text-black">
        第4条（利用目的の変更）
      </h2>
      <div className="mb-[30px] text-sm text-black">
        <ol className="list-decimal pl-10">
          <li className="mb-[10px]">
            本サービスは、利用目的が変更前と関連性を有すると合理的に認められる場合に限り、個人情報の利用目的を変更するものとします。
          </li>
          <li>
            利用目的の変更を行った場合には、変更後の目的について、本サービス所定の方法により、ユーザーに通知し、または本ウェブサイト上に公表するものとします。
          </li>
        </ol>
      </div>
      <h2 className="mb-5 text-xl font-semibold text-black">
        第5条（個人情報の第三者提供）
      </h2>
      <p className="mb-[30px] text-sm text-black">
        本サービスはユーザーの同意を得ることなく、第三者に個人情報を提供することはありません。
      </p>
      <h2 className="mb-5 text-xl font-semibold text-black">
        第6条（プライバシーポリシーの変更）
      </h2>
      <div className="mb-[30px] text-sm text-black">
        <p className="mb-5">
          本サービスが個人情報を収集・利用する目的は、以下のとおりです。
        </p>
        <ol className="list-decimal pl-10">
          <li className="mb-[10px]">
            本ポリシーの内容は、法令その他本ポリシーに別段の定めのある事項を除いて、ユーザーに通知することなく、変更することができるものとします。
          </li>
          <li>
            本サービスが別途定める場合を除いて、変更後のプライバシーポリシーは、本ウェブサイトに掲載したときから効力を生じるものとします。
          </li>
        </ol>
      </div>
    </div>
  )
}

export default PrivacyPolicy
