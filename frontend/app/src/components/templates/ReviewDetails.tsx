import type { NextPage } from 'next'
import type { Review } from '@/api/api'
import { useRouter } from 'next/router'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { reviewApi, notificationApi, gitHubApi } from '@/api/custom-instance'
import ItemTitle from '@/components/atoms/ItemTitle'
import AlertWithActionButton from '@/components/molecules/AlertWithActionButton'
import EditMenu from '@/components/atoms/EditMenu'
import EditWithDeleteMenu from '@/components/atoms/EditWithDeleteMenu'
import Avatar from '@mui/material/Avatar'
import Chip from '@mui/material/Chip'

type Props = {
  review: Review
  userId: number
  authUser: any
}

const ReviewDetails: NextPage<Props> = ({ review, userId, authUser }) => {
  const router = useRouter()
  const { id } = router.query
  const queryClient = useQueryClient()
  const goToPostsEdit = (): void => {
    if (typeof id === 'string') {
      router.push(`/posts/${id}/edit`).catch((error) => {
        console.error(error)
      })
    }
  }
  const goToFeedback = (): void => {
    if (typeof id === 'string') {
      router.push(`/posts/${id}/feedback`).catch((error) => {
        console.error(error)
      })
    }
  }
  const goToThanks = (): void => {
    if (typeof id === 'string') {
      router.push(`/posts/${id}/thanks`).catch((error) => {
        console.error(error)
      })
    }
  }
  const goToUsersDetails = (userId: any): void => {
    router.push(`/users/${userId}`).catch((error) => {
      console.error(error)
    })
  }
  const formatCreatedAt = (createdAt: string): string => {
    const year = createdAt.slice(0, 4)
    const month = createdAt.slice(5, 7)
    const day = createdAt.slice(8, 10)
    return `${year}年${month}月${day}日`
  }

  const { mutate: acceptReview } = useMutation(async (): Promise<void> => {
    const token: string = await authUser.getIdToken()
    if (
      typeof id === 'string' &&
      confirm(
        'レビューを承諾しますか？1度承諾するをクリックすると取り消すことができないのでご注意ください。',
      )
    ) {
      await reviewApi
        .acceptReview(id, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(async () => {
          await gitHubApi.requestReview(id)
          queryClient.invalidateQueries(['review']).catch((error) => {
            console.error(error)
          })
        })
      await notificationApi.createAcceptedNotification(id)
    }
  })

  const { mutate: deleteReview } = useMutation(async (): Promise<void> => {
    if (typeof id === 'string' && confirm('本当に削除しますか？')) {
      await reviewApi.deleteReview(id).then(() => {
        queryClient.invalidateQueries(['reviews']).catch((error) => {
          console.error(error)
        })
        router.replace('/').catch((error) => {
          console.error(error)
        })
      })
    }
  })

  return (
    <div className="px-4 pt-[50px] sm:mx-auto sm:w-[640px] md:w-[768px] lg:w-[1024px] xl:w-[1280px]">
      <div className="mb-[50px]">
        {(() => {
          if (review?.accepted_at === null && review.reviewee?.id !== userId) {
            return (
              <AlertWithActionButton
                name={review.reviewee?.name}
                spanClick={() => goToUsersDetails(review.reviewee?.id)}
                message="さんがレビューを募集しています。レビューを承諾する場合、承諾するをクリックしてください。承諾するをクリックすると、自動でリポジトリのコラボレーターに追加され、レビューリクエストが届きます。"
                buttonText="承諾する"
                buttonClick={acceptReview}
              />
            )
          } else if (
            review?.accepted_at === null &&
            review.reviewee?.id === userId
          ) {
            return (
              <AlertWithActionButton message="レビュアーを募集しています。レビュアーがレビューを承諾すると、自動でリポジトリのコラボレーターに追加され、レビュアーにレビューリクエストが届きます。" />
            )
          } else if (
            review?.reviewer?.id === userId &&
            review?.feedback === null
          ) {
            return (
              <AlertWithActionButton
                message="からレビューリクエストが届いています。プルリクエストをApproveしたら、評価するをクリックして、レビューの評価をしてください。"
                buttonText="評価する"
                buttonClick={goToFeedback}
                url={review?.pull_request_url}
              />
            )
          } else if (
            review?.reviewee?.id === userId &&
            review?.feedback === null
          ) {
            return (
              <AlertWithActionButton
                name={review.reviewer?.name}
                spanClick={() => goToUsersDetails(review.reviewer?.id)}
                message="さんがレビューを承諾しました。プルリクエストにコメントがありましたら、返信をお願いします。"
              />
            )
          } else if (
            review?.reviewer?.id === userId &&
            review?.feedback !== null &&
            review?.thanks === null
          ) {
            return (
              <AlertWithActionButton
                name={review.reviewee?.name}
                spanClick={() => goToUsersDetails(review.reviewee?.id)}
                message="さんがレビューに対するお礼を入力しています。"
              />
            )
          } else if (
            review?.reviewee?.id === userId &&
            review?.feedback !== null &&
            review?.thanks === null
          ) {
            return (
              <AlertWithActionButton
                name={review?.reviewer?.name}
                spanClick={() => goToUsersDetails(review?.reviewer?.id)}
                message="さんがレビューに対する評価を送信しました。お礼するをクリックして、レビューに対するお礼をしてください。"
                buttonText="お礼する"
                buttonClick={goToThanks}
              />
            )
          } else if (review.thanks !== null) {
            return (
              <AlertWithActionButton
                message="レビューが完了しました。"
                done={true}
              />
            )
          } else if (review.thanks === null && review.reviewer?.id !== userId) {
            return (
              <>
                <AlertWithActionButton message="レビュー中です。" />
              </>
            )
          }
        })()}
      </div>
      <div className="mb-[50px]">
        {(() => {
          if (review?.reviewee?.id === userId && review?.accepted_at === null) {
            return (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Avatar src={review?.reviewee?.avatar} alt="アバター画像" />
                  <div className="ml-[10px] flex flex-col">
                    <span
                      className="cursor-pointer text-sm text-black hover:opacity-70"
                      onClick={() => goToUsersDetails(review?.reviewee?.id)}
                    >
                      {review?.reviewee?.name}
                    </span>
                    <span className="text-sm text-gray">
                      {review?.created_at !== undefined &&
                        formatCreatedAt(review.created_at)}
                    </span>
                  </div>
                </div>
                <EditWithDeleteMenu
                  editOnClick={goToPostsEdit}
                  deleteOnClick={deleteReview}
                />
              </div>
            )
          } else if (
            review?.reviewee?.id === userId &&
            review?.accepted_at !== null &&
            review?.thanks === null
          ) {
            return (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Avatar src={review?.reviewee?.avatar} alt="アバター画像" />
                  <div className="ml-[10px] flex flex-col">
                    <span
                      className="cursor-pointer text-sm text-black hover:opacity-70"
                      onClick={() => goToUsersDetails(review?.reviewee?.id)}
                    >
                      {review?.reviewee?.name}
                    </span>
                    <span className="text-sm text-gray">
                      {review?.created_at !== undefined &&
                        formatCreatedAt(review.created_at)}
                    </span>
                  </div>
                </div>
                <EditMenu editOnClick={goToPostsEdit} />
              </div>
            )
          } else {
            return (
              <div className="flex items-center">
                <Avatar src={review?.reviewee?.avatar} alt="アバター画像" />
                <div className="ml-[10px] flex flex-col">
                  <span
                    className="cursor-pointer text-sm text-black hover:opacity-70"
                    onClick={() => goToUsersDetails(review?.reviewee?.id)}
                  >
                    {review?.reviewee?.name}
                  </span>
                  <span className="text-sm text-gray">
                    {review?.created_at !== undefined &&
                      formatCreatedAt(review.created_at)}
                  </span>
                </div>
              </div>
            )
          }
        })()}
      </div>
      <h1 className="mb-[50px] break-all text-3xl text-black">
        {review?.title}
      </h1>
      <div className="mb-[50px]">
        <div className="mb-[30px]">
          <ItemTitle>プルリクエスト</ItemTitle>
        </div>
        <a
          href={review?.pull_request_url}
          className="break-all text-sm text-blue"
          target="_blank"
          rel="noreferrer"
        >
          {review?.pull_request_url}
        </a>
      </div>
      <div className="mb-[50px]">
        <div className="mb-[30px]">
          <ItemTitle>使用言語</ItemTitle>
        </div>
        <div className="flex flex-wrap">
          {review?.languages?.map((language) => (
            <Chip
              key={language}
              variant="outlined"
              label={language}
              className="mr-[5px] mb-[5px] font-serif"
            />
          ))}
        </div>
      </div>
      <div className="mb-[50px]">
        <div className="mb-[30px]">
          <ItemTitle>プルリクエストの説明</ItemTitle>
        </div>
        <p className="whitespace-pre-wrap break-all text-sm text-black">
          {review?.pull_request_description}
        </p>
      </div>
      <div className="mb-[100px]">
        <div className="mb-[30px]">
          <ItemTitle>レビューしてほしい点</ItemTitle>
        </div>
        <p className="whitespace-pre-wrap break-all text-sm text-black">
          {review?.review_point}
        </p>
      </div>
    </div>
  )
}

export default ReviewDetails
