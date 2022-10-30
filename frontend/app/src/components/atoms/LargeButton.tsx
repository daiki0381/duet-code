import type { NextPage } from 'next'

type Props = {
  onClick: () => void
  children: string
}

const LargeButton: NextPage<Props> = ({ onClick, children }) => {
  return (
    <button
      className="rounded-[40px] bg-blue py-4 px-14 text-base text-white hover:bg-blue/70"
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export default LargeButton
