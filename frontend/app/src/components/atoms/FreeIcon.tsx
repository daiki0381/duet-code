import type { NextPage } from 'next'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'

const FreeIcon: NextPage = () => {
  return (
    <div className="flex h-[50px] w-[50px] items-center justify-center rounded-full bg-blue">
      <AttachMoneyIcon className="h-[30px] w-[30px] text-white" />
    </div>
  )
}

export default FreeIcon
