import type { NextPage } from 'next'

type Props = {
  onClick: () => void
}

const DeleteButton: NextPage<Props> = ({ onClick }) => {
  return (
    <button
      className="rounded-lg border border-border bg-white py-[10px]  px-5 text-sm font-semibold text-black hover:opacity-70"
      onClick={onClick}
    >
      編集する
    </button>
  )
}

export default DeleteButton
