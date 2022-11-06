import type { NextPage } from 'next'

type Props = {
  onClick?: () => void
  form?: string
}

const SubmitButton: NextPage<Props> = ({ onClick, form }) => {
  return (
    <button
      className="rounded-lg bg-blue py-[10px]  px-5 text-sm text-white hover:opacity-70 "
      onClick={onClick}
      form={form}
    >
      送信する
    </button>
  )
}

export default SubmitButton
