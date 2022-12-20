import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm, Controller } from 'react-hook-form'
import { reviewApi, notificationApi } from '@/api/custom-instance'
import Multiline from '@/components/atoms/Multiline'

type FormData = {
  feedback: string
}

const ReviewFeedback: NextPage = () => {
  const router = useRouter()
  const { id } = router.query
  const queryClient = useQueryClient()
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>()

  const { mutate: createFeedback } = useMutation(
    async (data: FormData): Promise<void> => {
      if (typeof id === 'string') {
        await reviewApi.createFeedback(id, data)
        await notificationApi.createFeedbackNotification(id)
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
    createFeedback(data)
  })

  return (
    <form
      onSubmit={onSubmit}
      id="review_feedback_form"
      className="flex flex-col items-center justify-center py-[50px]"
    >
      <Controller
        name="feedback"
        defaultValue=""
        control={control}
        rules={{
          required: 'フィードバックを入力してください',
        }}
        render={({ field }) => (
          <div className="mb-[30px]">
            <Multiline
              placeholder="今回はありがとうございました。レビューした側もとても勉強になりました。また機会がありましたら、よろしくお願いします。"
              rows={5}
              field={field}
              error={Boolean(errors.feedback)}
              helperText={errors.feedback?.message}
            />
          </div>
        )}
      />
    </form>
  )
}

export default ReviewFeedback
