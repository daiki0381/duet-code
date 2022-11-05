import type { NextPage } from 'next'

type Props = {
  children: string
}

const LargeButton: NextPage<Props> = ({ children }) => {
  return (
    <div className="border-l-8 border-blue py-[5px] pl-[10px] text-2xl text-black">
      {children}
    </div>
  )
}

export default LargeButton
