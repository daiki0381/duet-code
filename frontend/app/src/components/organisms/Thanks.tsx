/* eslint-disable @typescript-eslint/no-misused-promises */
import type { NextPage } from 'next'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { reviewApi, notificationApi } from '@/api/custom-instance'

type Props = {
  reviewId: number
}

const Thanks: NextPage<Props> = ({ reviewId }) => {
  type FormData = {
    thanks: string
  }
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>()

  const { mutate: createThanksNotification } = useMutation(async () => {
    await notificationApi.createThanksNotification(reviewId)
  })

  const { mutate: createThanks } = useMutation(async (data: FormData) => {
    await reviewApi.createThanks(reviewId, data)
  })

  const onSubmit = handleSubmit(async (data) => {
    createThanks(data)
    createThanksNotification()
    reset()
  })

  return (
    <form onSubmit={onSubmit}>
      <textarea
        placeholder="今回はありがとうございました。ご丁寧にレビューして頂いたおかげで綺麗なコードが書けるようになりました。また機会がありましたら、よろしくお願いします。"
        {...register('thanks', {
          required: 'お礼を入力してください',
        })}
      ></textarea>
      {errors.thanks !== undefined && <p>{errors.thanks.message}</p>}
      <button>送信</button>
    </form>
  )
}

export default Thanks
