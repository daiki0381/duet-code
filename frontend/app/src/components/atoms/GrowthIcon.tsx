import type { NextPage } from 'next'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'

const GrowthIcon: NextPage = () => {
  return (
    <div className="flex h-[50px] w-[50px] items-center justify-center rounded-full bg-blue">
      <TrendingUpIcon className="h-[30px] w-[30px] text-white" />
    </div>
  )
}

export default GrowthIcon
