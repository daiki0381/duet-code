import type { NextPage } from 'next'
import ActionButton from '@/components/atoms/ActionButton'
import Alert from '@mui/material/Alert'

type Props = {
  message: string
  url?: string
  buttonText?: string
  onClick?: () => void
}

const AlertWithActionButton: NextPage<Props> = ({
  message,
  url,
  buttonText,
  onClick,
}) => {
  return (
    <Alert severity="info" className="flex items-center">
      {buttonText === undefined && onClick === undefined ? (
        <p className="text-sm text-black">{message}</p>
      ) : (
        <div className="flex items-center justify-between">
          {url !== undefined ? (
            <p className="w-4/5 text-sm text-black">
              <a
                href={url}
                target="_blank"
                className="text-blue"
                rel="noreferrer"
              >
                {url}
              </a>
              {message}
            </p>
          ) : (
            <p className="w-4/5 text-sm text-black">{message}</p>
          )}
          {buttonText !== undefined && onClick !== undefined && (
            <div className="ml-5">
              <ActionButton onClick={onClick}>{buttonText}</ActionButton>
            </div>
          )}
        </div>
      )}
    </Alert>
  )
}

export default AlertWithActionButton
