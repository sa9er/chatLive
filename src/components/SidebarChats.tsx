'use client'

import { pusherClient } from '@/lib/pusher'
import { chatHrefConstructor, toPusherKey } from '@/lib/utils'
import { usePathname, useRouter } from 'next/navigation'
import { FC, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import UnseenChatToaster from './unseenChatToast'

interface SidebarChatsProps {
    friends: User[]
    sessionId: string
}

interface ExtendedMessage extends Message {
    senderImg: string,

    senderName: string
}

const SidebarChats: FC<SidebarChatsProps> = ({ friends, sessionId }) => {
    const router = useRouter()
    const pathname = usePathname()
    const [unseenMessages, setUnseenMessages] = useState<Message[]>([])

    useEffect(() => {
        pusherClient.subscribe(toPusherKey(`user:${sessionId}:chats`))
        pusherClient.subscribe(toPusherKey(`user:${sessionId}:friends`))

        const newFriendHandler = () => {
            router.refresh()
        }

        const chatHandler = (message: ExtendedMessage) => {
            const shouldNotify = pathname !== `/dashboard/chat/${chatHrefConstructor(sessionId, message.senderId)}`

            if (!shouldNotify) return

            toast.custom((t) => (
                <UnseenChatToaster
                    t={t}
                    sessionId={sessionId}
                    senderId={message.senderId}
                    senderImg={message.senderImg}
                    senderMessage={message.text}
                    senderName={message.senderName}
                />
            ))

            setUnseenMessages((prev) => [...prev, message])
        }

        pusherClient.bind('new_message', chatHandler)
        pusherClient.bind('new_friend', newFriendHandler)

        return () => {
            pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:chats`))
            pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:friends`))
        }
    }, [pathname, sessionId, router])


    useEffect(() => {
        if (pathname?.includes('chat'))
        {
            setUnseenMessages((prev) => {
                return prev.filter((msg) => {
                    !pathname.includes(msg.senderId)
                })
            })
        }
    }, [pathname])


    return (
        <ul role='list' className='max-h-[25rm] overflow-y-auto -mx-2 space-y-1 '>
            {friends.sort().map((friend) => {
                const unseenMsgsCount = unseenMessages.filter((unseenMsg) => {
                    return unseenMsg.senderId
                }).length
                return <li key={friend.id}>
                    <a
                        href={`/dashboard/chat/${chatHrefConstructor(
                            sessionId,
                            friend.id
                        )}`}
                        className='text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                    >
                        <div className=' text-lg font-semibold'>{friend.name}</div>
                        {unseenMsgsCount > 0 && (
                            <div className='bg-indigo-500 font-medium text-xs w-4 h-4 rounded-full flex items-center justify-center'>
                                {unseenMsgsCount}
                            </div>
                        )}
                    </a>
                </li>
            })}
        </ul>
    );
}

export default SidebarChats;