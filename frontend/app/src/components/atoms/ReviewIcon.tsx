import type { NextPage } from 'next'
import EditIcon from '@mui/icons-material/Edit'

const ReviewIcon: NextPage = () => {
  return (
    <div className="flex h-[50px] w-[50px] items-center justify-center rounded-full bg-blue">
      <EditIcon className="h-[30px] w-[30px] text-white" />
    </div>
  )
}

export default ReviewIcon
