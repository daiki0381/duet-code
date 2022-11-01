import type { NextPage } from 'next'
import type { Notification } from '@/api/api'
import { useState } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useRecoilValue } from 'recoil'
import { isLoginState } from '@/stores/isLoginState'
import { notificationApi } from '@/api/custom-instance'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import Badge from '@mui/material/Badge'

const NotificationWithMenu: NextPage = () => {
  const router = useRouter()
  const isLogin = useRecoilValue(isLoginState)
  const queryClient = useQueryClient()
  const [notifications, setNotifications] = useState<Notification[] | []>([])
  const [isOpen, setIsOpen] = useState(false)

  const onClick = (): void => {
    setIsOpen(!isOpen)
  }

  const goToPostsDetails = (id: number): void => {
    router.push(`/posts/${id}`).catch((error) => {
      console.error(error)
    })
  }

  const formatCreatedAt = (createdAt: string): string => {
    const year = createdAt.slice(0, 4)
    const month = createdAt.slice(5, 7)
    const day = createdAt.slice(8, 10)
    return `${year}年${month}月${day}日`
  }

  useQuery(
    ['notifications'],
    async (): Promise<Notification[]> => {
      const { data } = await notificationApi.getCurrentUserNotifications()
      return data
    },
    {
      onSuccess: (data) => {
        setNotifications(data)
      },
      enabled: isLogin,
    },
  )

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
    <div className="w-[320px] text-right">
      <Badge
        badgeContent={
          notifications.filter((notification) => notification.checked === false)
            .length
        }
        color="error"
        className="relative mb-[5px] cursor-pointer hover:opacity-70"
        onClick={onClick}
      >
        <NotificationsNoneIcon className="h-[30px] w-[30px]" />
      </Badge>
      {isOpen && (
        <div className="absolute top-[50] w-[320px] rounded-lg bg-white shadow-[0_3px_10px_0_rgba(0,0,0,0.15)]">
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
              />
              <p className="text-base text-black">通知がありません</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default NotificationWithMenu
