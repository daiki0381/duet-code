import type { NextPage } from 'next'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined'
import ActionButton from '@/components/atoms/ActionButton'

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
    <>
      {(() => {
        if (
          name === undefined &&
          spanClick === undefined &&
          url === undefined &&
          buttonText === undefined &&
          buttonClick === undefined
        ) {
          return (
            <div
              className={
                done === undefined
                  ? 'flex items-center rounded-lg bg-info p-4'
                  : 'flex items-center rounded-lg bg-success p-4'
              }
            >
              <div className="mr-[10px]">
                {done === undefined ? (
                  <InfoOutlinedIcon color="warning" />
                ) : (
                  <TaskAltOutlinedIcon color="success" />
                )}
              </div>
              <p className="text-sm text-black">{message}</p>
            </div>
          )
        } else if (
          name !== undefined &&
          spanClick !== undefined &&
          buttonText === undefined &&
          buttonClick === undefined
        ) {
          return (
            <div className="flex items-center rounded-lg bg-info p-4">
              <div className="mr-[10px]">
                <InfoOutlinedIcon color="warning" />
              </div>
              <p className="text-sm text-black">
                <span
                  onClick={spanClick}
                  className="cursor-pointer hover:opacity-70"
                >
                  {name}
                </span>
                {message}
              </p>
            </div>
          )
        } else if (
          url !== undefined &&
          buttonText !== undefined &&
          buttonClick !== undefined
        ) {
          return (
            <div className="flex flex-col items-center rounded-lg bg-info p-4 sm:flex-row sm:justify-between">
              <div className="mb-[10px] flex flex-col items-center sm:mb-0 sm:mr-5 sm:flex-row">
                <div className="mb-[10px] sm:mr-[10px] sm:mb-0">
                  <InfoOutlinedIcon color="warning" />
                </div>
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
              </div>
              <div className="w-full sm:w-auto">
                <ActionButton onClick={buttonClick}>{buttonText}</ActionButton>
              </div>
            </div>
          )
        } else if (
          name !== undefined &&
          spanClick !== undefined &&
          buttonText !== undefined &&
          buttonClick !== undefined
        ) {
          return (
            <div className="flex flex-col items-center rounded-lg bg-info p-4 sm:flex-row sm:justify-between">
              <div className="mb-[10px] flex flex-col items-center sm:mb-0 sm:mr-5 sm:flex-row">
                <div className="mb-[10px] sm:mr-[10px] sm:mb-0">
                  <InfoOutlinedIcon color="warning" />
                </div>
                <p className="text-sm text-black">
                  <span
                    onClick={spanClick}
                    className="cursor-pointer hover:opacity-70"
                  >
                    {name}
                  </span>
                  {message}
                </p>
              </div>
              <div className="w-full sm:w-auto">
                <ActionButton onClick={buttonClick}>{buttonText}</ActionButton>
              </div>
            </div>
          )
        }
      })()}
    </>
  )
}

export default AlertWithActionButton
