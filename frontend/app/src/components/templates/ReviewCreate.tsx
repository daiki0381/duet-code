import type { NextPage } from 'next'
import { Pull, CreateOrUpdateReview } from '@/api/api'
import { useRouter } from 'next/router'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm, Controller } from 'react-hook-form'
import { reviewApi } from '@/api/custom-instance'
import TextInput from '@/components/atoms/TextInput'
import SelectMenu from '@/components/atoms/SelectMenu'
import MultipleSelectMenu from '@/components/atoms/MultipleSelectMenu'
import Multiline from '@/components/atoms/Multiline'

type Props = {
  pulls: Pull[]
  authUser: any
}

type FormData = {
  title: string
  pull_request_title: string
  languages: string[]
  pull_request_description: string
  review_point: string
}

const ReviewCreate: NextPage<Props> = ({ pulls, authUser }) => {
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
  const router = useRouter()
  const queryClient = useQueryClient()
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>()
  const { mutate: createReview } = useMutation(
    async (review: CreateOrUpdateReview) => {
      const token: string = await authUser.getIdToken()
      await reviewApi.createReview(review, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['reviews']).catch((error) => {
          console.error(error)
        })
        router.replace('/').catch((error) => console.error(error))
      },
    },
  )
  const onSubmit = handleSubmit(async (data) => {
    const pull = pulls.find((pull) => pull.title === data.pull_request_title)
    if (pull?.title !== undefined && pull?.url !== undefined) {
      createReview({
        title: data.title,
        pull_request_title: pull.title,
        pull_request_url: pull.url,
        languages: data.languages,
        pull_request_description: data.pull_request_description,
        review_point: data.review_point,
      })
    }
  })

  return (
    <form
      onSubmit={onSubmit}
      id="review_create_form"
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
      <Controller
        name="pull_request_description"
        defaultValue=""
        control={control}
        rules={{
          required: 'プルリクエストの説明を入力してください',
        }}
        render={({ field }) => (
          <div className="mb-[30px]">
            <Multiline
              label="プルリクエストの説明"
              rows={5}
              field={field}
              error={Boolean(errors.pull_request_description)}
              helperText={errors.pull_request_description?.message}
            />
          </div>
        )}
      />
      <Controller
        name="review_point"
        defaultValue=""
        control={control}
        rules={{
          required: 'レビューしてほしい点を入力してください',
        }}
        render={({ field }) => (
          <div className="mb-[30px]">
            <Multiline
              label="レビューしてほしい点"
              rows={5}
              field={field}
              error={Boolean(errors.review_point)}
              helperText={errors.review_point?.message}
            />
          </div>
        )}
      />
    </form>
  )
}

export default ReviewCreate
