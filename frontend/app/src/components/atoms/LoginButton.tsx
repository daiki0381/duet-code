import type { NextPage } from 'next'
import GitHubIcon from '@mui/icons-material/GitHub'

type Props = {
  onClick: () => void
}

const LoginButton: NextPage<Props> = ({ onClick }) => {
  return (
    <button
      className="rounded-[36px] bg-blue py-3 px-6 text-sm text-white hover:bg-blue/70"
      onClick={onClick}
    >
      <GitHubIcon className="mr-2" />
      ログイン
    </button>
  )
}

export default LoginButton
