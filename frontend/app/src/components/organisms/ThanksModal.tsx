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

const ThanksModal: NextPage<Props> = ({ open, handleClose }) => {
  type FormData = {
    thanks: string
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
        await reviewApi.createThanks(id, data)
        await notificationApi.createThanksNotification(id)
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['review']).catch((error) => {
          console.error(error)
        })
        toast.success('お礼を送信しました')
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
          お礼
        </div>
        <form
          className=" border-b border-border py-[40px] text-center"
          onSubmit={onSubmit}
          id="review_thanks_form"
        >
          <Controller
            name="thanks"
            defaultValue=""
            control={control}
            rules={{
              required: 'お礼を入力してください',
            }}
            render={({ field }) => (
              <div className="h-[170px]">
                <Multiline
                  label="お礼"
                  placeholder="今回はありがとうございました。ご丁寧にレビューして頂いたおかげで綺麗なコードが書けるようになりました。また機会がありましたら、よろしくお願いします。"
                  rows={5}
                  width="w-[550px]"
                  field={field}
                  error={Boolean(errors.thanks)}
                  helperText={errors.thanks?.message}
                />
              </div>
            )}
          />
        </form>
        <div className="flex items-center justify-between p-5">
          <CancelButton onClick={handleClose} />
          <SubmitButton form="review_thanks_form" />
        </div>
      </div>
    </Modal>
  )
}

export default ThanksModal
