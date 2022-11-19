import type { NextPage } from 'next'
import ActionButton from '@/components/atoms/ActionButton'
import Alert from '@mui/material/Alert'

type Props = {
  message: string
  name?: string
  spanClick?: () => void
  url?: string
  buttonText?: string
  buttonClick?: () => void
  done?: boolean
}

const AlertWithActionButton: NextPage<Props> = ({
  message,
  name,
  spanClick,
  url,
  buttonText,
  buttonClick,
  done,
}) => {
  return (
    <Alert
      severity={done !== undefined ? 'success' : 'info'}
      color={done !== undefined ? 'success' : 'warning'}
      className="flex items-center font-serif"
      action={
        buttonText !== undefined &&
        buttonClick !== undefined && (
          <div>
            <ActionButton onClick={buttonClick}>{buttonText}</ActionButton>
          </div>
        )
      }
    >
      {(() => {
        if (
          name === undefined &&
          spanClick === undefined &&
          url === undefined
        ) {
          return <p className="text-sm text-black">{message}</p>
        } else if (name !== undefined && spanClick !== undefined) {
          return (
            <p className="text-sm text-black">
              <span
                onClick={spanClick}
                className="cursor-pointer hover:opacity-70"
              >
                {name}
              </span>
              {message}
            </p>
          )
        } else if (url !== undefined) {
          return (
            <p className="text-sm text-black">
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
          )
        }
      })()}
    </Alert>
  )
}

export default AlertWithActionButton
