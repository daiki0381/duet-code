import type { NextPage } from 'next'

type Props = {
  onClick?: () => void
  form?: string
  children: string
}

const NormalButton: NextPage<Props> = ({ onClick, form, children }) => {
  return (
    <button
      className="rounded-[36px] bg-blue py-3 px-6 text-sm text-white hover:bg-blue/70"
      onClick={onClick}
      form={form}
    >
      {children}
    </button>
  )
}

export default NormalButton
