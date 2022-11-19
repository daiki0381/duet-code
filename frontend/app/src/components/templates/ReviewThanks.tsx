import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm, Controller } from 'react-hook-form'
import { reviewApi, notificationApi } from '@/api/custom-instance'
import Multiline from '@/components/atoms/Multiline'

type FormData = {
  thanks: string
}

const ReviewThanks: NextPage = () => {
  const router = useRouter()
  const { id } = router.query
  const queryClient = useQueryClient()
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>()

  const { mutate: createThanks } = useMutation(
    async (data: FormData): Promise<void> => {
      if (typeof id === 'string') {
        await reviewApi.createThanks(id, data)
        await notificationApi.createThanksNotification(id)
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['review']).catch((error) => {
          console.error(error)
        })
      },
    },
  )

  const onSubmit = handleSubmit((data) => {
    createThanks(data)
  })

  return (
    <form
      onSubmit={onSubmit}
      id="review_thanks_form"
      className="flex flex-col items-center justify-center py-[50px]"
    >
      <Controller
        name="thanks"
        defaultValue=""
        control={control}
        rules={{
          required: 'お礼を入力してください',
        }}
        render={({ field }) => (
          <div className="mb-[30px]">
            <Multiline
              placeholder="今回はありがとうございました。ご丁寧にレビューして頂いたおかげで綺麗なコードが書けるようになりました。また機会がありましたら、よろしくお願いします。"
              rows={5}
              width="w-[800px]"
              field={field}
              error={Boolean(errors.thanks)}
              helperText={errors.thanks?.message}
            />
          </div>
        )}
      />
    </form>
  )
}

export default ReviewThanks
