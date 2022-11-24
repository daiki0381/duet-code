import type { NextPage } from 'next'
import Avatar from '@mui/material/Avatar'

type Props = {
  name: string
  avatar: string
  message: string
  onClick: () => void
}

const ThanksOrFeedbackCard: NextPage<Props> = ({
  name,
  avatar,
  message,
  onClick,
}) => {
  return (
    <div
      className="cursor-pointer rounded-lg bg-white p-[30px] shadow-[0_0_5px_0_rgba(221,221,221,1)] hover:opacity-70"
      onClick={onClick}
    >
      <div className="mb-5 flex items-center">
        <Avatar src={avatar} className="mr-[10px]" alt="アバター画像" />
        <p className="text-sm font-semibold text-black">{name}</p>
      </div>
      <p className="break-all text-sm text-black">{message}</p>
    </div>
  )
}

export default ThanksOrFeedbackCard
