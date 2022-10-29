/* eslint-disable @typescript-eslint/no-misused-promises */
import type { NextPage } from 'next'
import { useForm } from 'react-hook-form'
import { reviewApi } from '@/openapi-generator/review'
import { notificationApi } from '@/openapi-generator/notification'

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

  const createThanksNotification = async (reviewId: number): Promise<void> => {
    await notificationApi.createThanksNotification(reviewId)
  }

  const onSubmit = handleSubmit(async (data) => {
    await reviewApi.createThanks(reviewId, data)
    createThanksNotification(reviewId).catch((error) => console.error(error))
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
