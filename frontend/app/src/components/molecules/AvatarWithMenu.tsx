import type { NextPage } from 'next'
import { useState } from 'react'
import { useRecoilValue } from 'recoil'
import Avatar from '@mui/material/Avatar'
import Menu from '@/components/atoms/Menu'
import { avatarState } from '@/stores/avatarState'

const AvatarWithMenu: NextPage = () => {
  const [isOpen, setIsOpen] = useState(false)
  const avatar = useRecoilValue(avatarState)

  const onClick = (): void => {
    setIsOpen(!isOpen)
  }

  return (
    <div>
      <Avatar
        src={avatar}
        className="mb-[5px] cursor-pointer hover:opacity-70"
        onClick={onClick}
      />
      {isOpen && <Menu />}
    </div>
  )
}

export default AvatarWithMenu
