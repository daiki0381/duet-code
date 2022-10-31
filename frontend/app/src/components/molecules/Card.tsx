import type { NextPage } from 'next'

type Props = {
  children: JSX.Element
  main: string
  sub: string
}

const Card: NextPage<Props> = ({ children, main, sub }) => {
  return (
    <div className="flex h-[300px] w-[300px] flex-col items-center justify-center rounded-lg bg-white p-[30px] shadow-[5px_15px_30px_-15px_rgba(0,0,0,0.5)]">
      <div className="mb-5">{children}</div>
      <div className="mb-5 text-base text-blue">{main}</div>
      <div className="text-sm text-black">{sub}</div>
    </div>
  )
}

export default Card
