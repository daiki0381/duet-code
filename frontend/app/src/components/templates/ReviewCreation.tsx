import type { NextPage } from 'next'
import type { Pull, CreateOrUpdateReview } from '@/api/api'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useForm, Controller } from 'react-hook-form'
import { useRecoilValue } from 'recoil'
import { reviewApi, gitHubApi } from '@/api/custom-instance'
import { isLoginState } from '@/stores/isLoginState'
import TextInput from '@/components/atoms/TextInput'
import SelectMenu from '@/components/atoms/SelectMenu'
import MultipleSelectMenu from '@/components/atoms/MultipleSelectMenu'
import CircularProgress from '@mui/material/CircularProgress'

const ReviewCreation: NextPage = () => {
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

  const [pulls, setPulls] = useState<Pull[] | []>([])
  const [initialPullsLoading, setInitialPullsLoading] = useState<boolean>(true)

  const router = useRouter()
  const isLogin = useRecoilValue(isLoginState)

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    register,
  } = useForm<FormData>()

  const { isLoading } = useQuery(
    ['pulls'],
    async (): Promise<Pull[]> => {
      const { data } = await gitHubApi.getCurrentUserPulls()
      return data
    },
    {
      onSuccess: (data) => {
        setPulls(data)
        setInitialPullsLoading(false)
      },
      enabled: isLogin,
    },
  )

  const { mutate } = useMutation(
    async (review: CreateOrUpdateReview) => {
      await reviewApi.createReview(review)
    },
    {
      onSuccess: () => {
        router.replace(`/`).catch((error) => {
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

  return (
    <>
      {isLoading && initialPullsLoading ? (
        <CircularProgress />
      ) : (
        <form
          onSubmit={onSubmit}
          id="review_creation_form"
          className="flex flex-col items-center justify-center py-[50px]"
        >
          <Controller
            name="title"
            defaultValue=""
            control={control}
            rules={{
              required: 'タイトルを入力してください',
            }}
            render={({ field }) => (
              <div className="mb-[30px]">
                <TextInput
                  label="タイトル"
                  placeholder="Rubyのレビューをお願いします。"
                  field={field}
                  error={Boolean(errors.title)}
                  helperText={errors.title?.message}
                />
              </div>
            )}
          />
          <Controller
            control={control}
            defaultValue=""
            name="pull_request_title"
            rules={{
              required: 'プルリクエストを選択してください',
            }}
            render={({ field }) => (
              <div className="mb-[30px]">
                <SelectMenu
                  label="プルリクエスト (Publicリポジトリ)"
                  labelId="pull-request"
                  field={field}
                  error={Boolean(errors.pull_request_title)}
                  helperText={errors.pull_request_title?.message}
                  options={pulls.map((pull) => pull.title)}
                />
              </div>
            )}
          />
          <Controller
            control={control}
            defaultValue={[]}
            name="languages"
            rules={{
              required: '使用言語を選択してください',
            }}
            render={({ field }) => (
              <div className="mb-[30px]">
                <MultipleSelectMenu
                  label="使用言語 (複数選択可)"
                  labelId="languages"
                  field={field}
                  error={Boolean(errors.languages)}
                  helperText={errors.languages?.message}
                  options={languages}
                />
              </div>
            )}
          />
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
        </form>
      )}
    </>
  )
}

export default ReviewCreation
