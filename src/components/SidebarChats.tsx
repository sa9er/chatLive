'use client'

import { chatHrefConstructor } from '@/lib/utils'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/router'
import { FC, useEffect, useState } from 'react'

interface SidebarChatsProps {
    friends: User[]
    sessionId: string
}

const SidebarChats: FC<SidebarChatsProps> = ({ friends, sessionId }) => {
    // const router = useRouter()
    const pathname = usePathname()
    const [unseenMessages, setUnseenMessages] = useState<Message[]>([])

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