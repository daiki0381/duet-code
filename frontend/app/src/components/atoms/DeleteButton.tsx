import type { NextPage } from 'next'

type Props = {
  onClick: () => void
}

const DeleteButton: NextPage<Props> = ({ onClick }) => {
  return (
    <button
      className="rounded-lg bg-[#DD0E1B] py-[10px]  px-5 text-sm text-white hover:opacity-70 "
      onClick={onClick}
    >
      削除する
    </button>
  )
}

export default DeleteButton
