import type { NextPage } from 'next'
import type { Pull, Review, CreateOrUpdateReview } from '@/api/api'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useForm } from 'react-hook-form'
import { auth } from '@/firebase'
import { reviewApi, gitHubApi } from '@/api/custom-instance'

const ReviewEdit: NextPage = () => {
  type FormData = {
    title: string
    pull_request_title: string
    languages: string[]
    pull_request_description: string
    review_point: string
  }

  const languages = [
    'Ruby',
    'Ruby on Rails',
    'PHP',
    'Laravel',
    'Python',
    'Django',
    'Go',
    'Gin',
    'Java',
    'Spring Boot',
    'C#',
    'C/C++',
    'HTML/CSS',
    'JavaScript',
    'TypeScript',
    'jQuery',
    'Angular',
    'Vue.js',
    'React',
    'Node.js',
    'Express',
    'NestJS',
    'Next.js',
    'Nuxt.js',
    'Swift',
    'Objective-C',
    'Kotlin',
    'Flutter',
    'React Native',
    'Dart',
    'その他',
  ]

  const [user, loading] = useAuthState(auth)
  const [pulls, setPulls] = useState<Pull[] | []>([])
  const [review, setReview] = useState<Review | null>(null)

  const router = useRouter()
  const { id } = router.query
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormData>()

  useQuery(
    ['review'],
    async (): Promise<Review> => {
      if (typeof id === 'string') {
        const response = await reviewApi.getReview(id)
        const review = response.data
        return review
      }
      throw new Error('reviewの取得に失敗しました')
    },
    {
      onSuccess: (data) => {
        setReview(data)
        const title = data.title
        const languages = data.languages
        const pullRequestDescription = data.pull_request_description
        const reviewPoint = data.review_point
        if (
          title !== undefined &&
          languages !== undefined &&
          pullRequestDescription !== undefined &&
          reviewPoint !== undefined
        ) {
          setValue('title', title)
          setValue('languages', languages)
          setValue('pull_request_description', pullRequestDescription)
          setValue('review_point', reviewPoint)
        }
      },
      enabled: id !== undefined,
    },
  )

  useQuery(
    ['pulls'],
    async (): Promise<Pull[]> => {
      const { data } = await gitHubApi.getCurrentUserPulls()
      return data
    },
    {
      onSuccess: (data) => {
        const pullRequestTitle = review?.pull_request_title
        if (pullRequestTitle !== undefined) {
          setValue('pull_request_title', pullRequestTitle)
        }
        setPulls(data)
      },
      enabled: user !== null,
    },
  )

  const { mutate } = useMutation(
    async (review: CreateOrUpdateReview) => {
      if (typeof id === 'string') {
        await reviewApi.updateReview(id, review)
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['reviews']).catch((error) => {
          console.error(error)
        })
        router.replace(`/posts/${Number(id)}`).catch((error) => {
          console.error(error)
        })
      },
    },
  )

  const onSubmit = handleSubmit(async (data) => {
    const pull = pulls.find((pull) => pull.title === data.pull_request_title)
    if (pull?.title !== undefined && pull?.url !== undefined) {
      mutate({
        title: data.title,
        pull_request_title: pull.title,
        pull_request_url: pull.url,
        languages: data.languages,
        pull_request_description: data.pull_request_description,
        review_point: data.review_point,
      })
    }
    reset()
  })

  if (loading) {
    return <p>Loading...</p>
  }

  return (
    <>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="Rubyのレビューをお願いします"
          {...register('title', { required: 'titleを入力してください' })}
        />
        {errors.title !== undefined && <p>{errors.title.message}</p>}
        <select
          placeholder="ボウリングのスコア計算オブジェクト指向版"
          {...register('pull_request_title', {
            required: 'プルリクエストを選択してください',
          })}
        >
          {pulls.map((pull) => (
            <option key={pull.title} value={pull.title}>
              {pull.title}
            </option>
          ))}
        </select>
        {errors.pull_request_title !== undefined && (
          <p>{errors.pull_request_title.message}</p>
        )}
        <select
          placeholder="Ruby"
          multiple
          {...register('languages', {
            required: '使用言語を選択してください',
          })}
        >
          {languages.map((language) => (
            <option key={language} value={language}>
              {language}
            </option>
          ))}
        </select>
        {errors.languages !== undefined && <p>{errors.languages.message}</p>}
        <textarea
          placeholder="ボウリングのスコア計算をオブジェクト指向プログラミングで書きました。"
          {...register('pull_request_description', {
            required: 'プルリクエストの説明を入力してください',
          })}
        ></textarea>
        {errors.pull_request_description !== undefined && (
          <p>{errors.pull_request_description.message}</p>
        )}
        <textarea
          placeholder="メソッド/変数の命名"
          {...register('review_point', {
            required: 'レビューしてほしい点を入力してください',
          })}
        ></textarea>
        {errors.review_point !== undefined && (
          <p>{errors.review_point.message}</p>
        )}
        <button>送信</button>
      </form>
    </>
  )
}

export default ReviewEdit
