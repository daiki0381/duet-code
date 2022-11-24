import type { NextPage } from 'next'
import { useState } from 'react'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import IconButton from '@mui/material/IconButton'
import Menu, { MenuProps } from '@mui/material/Menu'
import { styled } from '@mui/material/styles'

type Props = {
  editOnClick: () => void
}

const EditMenu: NextPage<Props> = ({ editOnClick }) => {
  const StyledMenu = styled((props: MenuProps) => (
    <Menu
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      {...props}
    />
  ))(() => ({
    '& .MuiPaper-root': {
      boxShadow: '0 3px 10px 0 rgba(0,0,0,0.15)',
      '& .MuiMenu-list': {
        padding: '0',
      },
    },
  }))

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: any): void => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = (): void => {
    setAnchorEl(null)
  }

  return (
    <>
      <IconButton
        onClick={handleClick}
        aria-controls={open ? 'edit-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
      >
        <MoreHorizIcon />
      </IconButton>
      <StyledMenu
        anchorEl={anchorEl}
        id="edit-menu"
        open={open}
        onClose={handleClick}
        onClick={handleClose}
      >
        <div className="w-[185px] rounded-lg bg-white p-[5px]">
          <div
            className="cursor-pointer rounded-lg py-[15px] px-[10px] text-sm text-black hover:bg-[#F7F7F7]"
            onClick={editOnClick}
          >
            編集する
          </div>
        </div>
      </StyledMenu>
    </>
  )
}

export default EditMenu
