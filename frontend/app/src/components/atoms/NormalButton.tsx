import type { NextPage } from 'next'

type Props = {
  onClick: () => void
  children: string
}

const NormalButton: NextPage<Props> = ({ onClick, children }) => {
  return (
    <button
      className="rounded-[36px] bg-blue py-3 px-6 text-sm text-white hover:bg-blue/70"
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export default NormalButton
