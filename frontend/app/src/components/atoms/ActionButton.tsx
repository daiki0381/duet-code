import type { NextPage } from 'next'

type Props = {
  children: string
  onClick: () => void
}

const ActionButton: NextPage<Props> = ({ children, onClick }) => {
  return (
    <button
      className="w-full whitespace-nowrap rounded-lg bg-[#238636] py-[10px] px-5 text-sm text-white hover:opacity-70"
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export default ActionButton
