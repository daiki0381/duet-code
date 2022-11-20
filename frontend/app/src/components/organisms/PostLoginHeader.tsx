import type { NextPage } from 'next'
import type { Notification } from '@/api/api'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { getAuth, signOut } from 'firebase/auth'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { notificationApi } from '@/api/custom-instance'
import NormalButton from '@/components/atoms/NormalButton'
import Avatar from '@mui/material/Avatar'
import IconButton from '@mui/material/IconButton'
import Menu, { MenuProps } from '@mui/material/Menu'
import { styled } from '@mui/material/styles'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import Badge from '@mui/material/Badge'

type Props = {
  avatar: string
  userId: number
  notifications: Notification[]
  badgeContent: number
}

const PostLoginHeader: NextPage<Props> = ({
  avatar,
  userId,
  notifications,
  badgeContent,
}) => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [accountAnchorEl, setAccountAnchorEl] = useState<null | HTMLElement>(
    null,
  )
  const accountOpen = Boolean(accountAnchorEl)
  const accountHandleClick = (event: any): void => {
    setAccountAnchorEl(event.currentTarget)
  }
  const accountHandleClose = (): void => {
    setAccountAnchorEl(null)
  }
  const [notificationAnchorEl, setNotificationAnchorEl] =
    useState<null | HTMLElement>(null)
  const notificationOpen = Boolean(notificationAnchorEl)
  const notificationHandleClick = (event: any): void => {
    setNotificationAnchorEl(event.currentTarget)
  }
  const notificationHandleClose = (): void => {
    setNotificationAnchorEl(null)
  }
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
  const signOutWithGithub = (): void => {
    const auth = getAuth()
    signOut(auth).catch((error) => {
      console.error(error)
    })
  }
  const formatCreatedAt = (createdAt: string): string => {
    const year = createdAt.slice(0, 4)
    const month = createdAt.slice(5, 7)
    const day = createdAt.slice(8, 10)
    return `${year}年${month}月${day}日`
  }
  const goToPostsNew = (): void => {
    router.push('/posts/new').catch((error) => {
      console.error(error)
    })
  }
  const goToPostsDetails = (id: number): void => {
    router.push(`/posts/${id}`).catch((error) => {
      console.error(error)
    })
  }
  const goToUsersDetails = (): void => {
    router.push(`/users/${userId}`).catch((error) => {
      console.error(error)
    })
  }
  const { mutate: updateNotification } = useMutation(
    async (notificationId: number): Promise<void> => {
      await notificationApi.updateNotification(notificationId)
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['notifications']).catch((error) => {
          console.error(error)
        })
      },
    },
  )

  return (
    <div className="sticky top-0 z-50 flex items-center justify-between border-b border-border bg-white px-4 py-3">
      <Link href="/">
        <a>
          <Image
            src="/header-logo.png"
            width={100}
            height={40}
            alt="Duet Code"
            className="cursor-pointer hover:opacity-70"
          />
        </a>
      </Link>
      <div className="flex items-center">
        <div className="mr-5 pt-[3px]">
          <IconButton
            onClick={notificationHandleClick}
            aria-controls={notificationOpen ? 'notification-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={notificationOpen ? 'true' : undefined}
          >
            <Badge badgeContent={badgeContent} color="error">
              <NotificationsNoneIcon />
            </Badge>
          </IconButton>
          <StyledMenu
            anchorEl={notificationAnchorEl}
            id="notification-menu"
            open={notificationOpen}
            onClose={notificationHandleClose}
            onClick={notificationHandleClose}
          >
            <div className="w-[320px] rounded-lg bg-white">
              {notifications.length !== 0 ? (
                <div className="max-h-[230px] overflow-scroll text-left">
                  {notifications.map((notification: any) => (
                    <div
                      className="cursor-pointer border-b border-border p-5 text-xs hover:bg-[#F7F7F7]"
                      key={notification.id}
                      onClick={() => {
                        updateNotification(notification.id)
                        goToPostsDetails(notification.review_id)
                      }}
                    >
                      <div
                        className={
                          notification.checked === true
                            ? 'mb-[10px] text-gray'
                            : 'mb-[10px] text-black'
                        }
                      >
                        {(() => {
                          if (notification.action === 'accepted') {
                            return (
                              <div>
                                {notification.sender.name}
                                さんがレビューを承諾しました。プルリクエストにコメントがありましたら、返信をお願いします。
                              </div>
                            )
                          } else if (notification.action === 'feedback') {
                            return (
                              <div>
                                {notification.sender.name}
                                さんがフィードバックを送信しました。
                              </div>
                            )
                          } else if (notification.action === 'thanks') {
                            return (
                              <div>
                                {notification.receiver.name}
                                さんがお礼を送信しました。
                              </div>
                            )
                          }
                        })()}
                      </div>
                      <div className="text-right text-blue">
                        {formatCreatedAt(notification.created_at)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex h-[230px] w-[320px]  flex-col items-center justify-center">
                  <Image
                    src="/notification.svg"
                    width={150}
                    height={150}
                    className="mb-[10px]"
                    alt="通知が無い場合のイラスト"
                  />
                  <p className="text-base text-black">通知がありません</p>
                </div>
              )}
            </div>
          </StyledMenu>
        </div>
        <div className="mr-5 pt-[3px]">
          <IconButton
            onClick={accountHandleClick}
            aria-controls={accountOpen ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={accountOpen ? 'true' : undefined}
          >
            <Avatar src={avatar} />
          </IconButton>
          <StyledMenu
            anchorEl={accountAnchorEl}
            id="account-menu"
            open={accountOpen}
            onClose={accountHandleClose}
            onClick={accountHandleClose}
          >
            <div className="w-[185px] rounded-lg bg-white p-[5px]">
              <div
                className="cursor-pointer rounded-lg py-[15px] px-[10px] text-sm text-black hover:bg-[#F7F7F7]"
                onClick={goToUsersDetails}
              >
                マイページ
              </div>
              <div
                className="cursor-pointer rounded-lg py-[15px] px-[10px] text-sm text-black hover:bg-[#F7F7F7]"
                onClick={signOutWithGithub}
              >
                ログアウト
              </div>
            </div>
          </StyledMenu>
        </div>
        <div>
          <NormalButton onClick={goToPostsNew}>レビュー募集</NormalButton>
        </div>
      </div>
    </div>
  )
}

export default PostLoginHeader
