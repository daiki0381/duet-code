/* eslint-disable @typescript-eslint/no-misused-promises */
import type { NextPage } from 'next'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { reviewApi, notificationApi } from '@/api/custom-instance'

type Props = {
  reviewId: number
}

const Feedback: NextPage<Props> = ({ reviewId }) => {
  type FormData = {
    feedback: string
  }

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>()

  const { mutate: createFeedbackNotification } = useMutation(async () => {
    await notificationApi.createFeedbackNotification(reviewId)
  })

  const { mutate: createFeedback } = useMutation(async (data: FormData) => {
    await reviewApi.createFeedback(reviewId, data)
  })

  const onSubmit = handleSubmit(async (data) => {
    createFeedback(data)
    createFeedbackNotification()
    reset()
  })

  return (
    <>
      <form onSubmit={onSubmit}>
        <textarea
          placeholder="今回はありがとうございました。レビューした側もとても勉強になりました。また機会がありましたら、よろしくお願いします。"
          {...register('feedback', {
            required: 'フィードバックを入力してください',
          })}
        ></textarea>
        {errors.feedback !== undefined && <p>{errors.feedback.message}</p>}
        <button>送信する</button>
      </form>
    </>
  )
}

export default Feedback
