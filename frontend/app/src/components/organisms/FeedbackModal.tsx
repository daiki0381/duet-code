import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useForm, Controller } from 'react-hook-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { reviewApi, notificationApi } from '@/api/custom-instance'
import Modal from '@mui/material/Modal'
import Multiline from '@/components/atoms/Multiline'
import CancelButton from '@/components/atoms/CancelButton'
import SubmitButton from '@/components/atoms/SubmitButton'

type Props = {
  open: boolean
  handleClose: () => void
}

const FeedbackModal: NextPage<Props> = ({ open, handleClose }) => {
  type FormData = {
    feedback: string
  }

  const router = useRouter()
  const { id } = router.query
  const queryClient = useQueryClient()

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>()

  const { mutate } = useMutation(
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
        toast.success('フィードバックを送信しました')
      },
    },
  )

  const onSubmit = handleSubmit((data) => {
    mutate(data)
    handleClose()
  })

  return (
    <Modal open={open} onClose={handleClose}>
      <div className="absolute top-2/4 left-2/4 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-lg border border-border bg-white">
        <div className="border-b border-border py-5 text-center text-base font-semibold text-black">
          フィードバック
        </div>
        <form
          className=" border-b border-border py-[40px] text-center"
          onSubmit={onSubmit}
          id="review_feedback_form"
        >
          <Controller
            name="feedback"
            defaultValue=""
            control={control}
            rules={{
              required: 'フィードバックを入力してください',
            }}
            render={({ field }) => (
              <div className="h-[170px]">
                <Multiline
                  label="フィードバック"
                  placeholder="今回はありがとうございました。レビューした側もとても勉強になりました。また機会がありましたら、よろしくお願いします。"
                  rows={5}
                  width="w-[550px]"
                  field={field}
                  error={Boolean(errors.feedback)}
                  helperText={errors.feedback?.message}
                />
              </div>
            )}
          />
        </form>
        <div className="flex items-center justify-between p-5">
          <CancelButton onClick={handleClose} />
          <SubmitButton form="review_feedback_form" />
        </div>
      </div>
    </Modal>
  )
}

export default FeedbackModal
