'use client'

import { pusherClient } from '@/lib/pusher';
import { cn, toPusherKey } from '@/lib/utils';
import { Message } from '@/lib/validators/message-validator';
import { format } from 'date-fns';
import Image from 'next/image';
import { FC, useEffect, useRef, useState } from 'react'

interface MessagesProps {
    initialMessages: Message[],
    sessionId: string
    sessionImg: string | null | undefined
    chatParnter: User
    chatId: string
}

const Messages: FC<MessagesProps> = ({ initialMessages, sessionId, chatParnter, sessionImg, chatId }) => {

    const [messages, setMessages] = useState<Message[]>(initialMessages)

    useEffect(() => {

        pusherClient.subscribe(
            toPusherKey(`chat:${chatId}`)
        )


        const messageHandler = (message: Message) => {

            setMessages((prev) => [message, ...prev])
        }

        pusherClient.bind('incoming_message', messageHandler)


        return () => {
            pusherClient.unsubscribe(toPusherKey(`chat:${chatId}`))
            pusherClient.unbind('incoming_message', messageHandler)
        }

    }, [])

    const scrollDownRef = useRef<HTMLDivElement | null>(null)

    const formatTimestamp = (timestamp: number) => {
        return format(timestamp, 'HH:mm')
    }

    return (
        <div id='messages' className='flex h-full 
                 flex-1 flex-col-reverse gap-4 p-3 overflow-y-auto
                 scrollbar-thumb-bule scrollbar-thumb-rounded 
                 scrollbar-track-blue-lighter scrollbar-w-2 
                 scrolling-touch' >
            Messages
            <div ref={scrollDownRef} />
            {messages.map((message, index) => {
                const isCurrUser = message.senderId == sessionId

                const hasNextMessageFormSameUser = messages[index - 1]?.senderId === messages[index].senderId

                function cd(arg0: string, arg1: { 'justify-end': boolean; }): string | undefined {
                    throw new Error('Function not implemented.');
                }

                return (
                    <div key={`${message.id}-${message.timestamp}`}>
                        <div className={cn('flex items-end', {
                            'justify-end': isCurrUser,
                        })} >
                            <div className={cn('felx felx-col space-y-2 text-base max-w-xs mx-2', {
                                'order-1 items-end': isCurrUser,
                                'order-2 items-start': !isCurrUser,
                            })}>
                                <span className={cn('px-4 py-2 rounded-lg inline-block', {
                                    'bg-indigo-600 text-white': isCurrUser,
                                    'bg-gray-200 text-gray-900': !isCurrUser,
                                    'rounded-br-none': !hasNextMessageFormSameUser && isCurrUser,
                                    'rounded-bl-none': !hasNextMessageFormSameUser && !isCurrUser,
                                })}>
                                    {message.text}{' '}
                                    <span className='ml-2 text-xs text-gray-400'>
                                        {formatTimestamp(message.timestamp)}
                                    </span>
                                </span>
                            </div>
                            <div className={cn('relative w-6 h-6', {
                                'order-2': isCurrUser,
                                'order-1': !isCurrUser,
                                'invisible': hasNextMessageFormSameUser,

                            })} >
                                <Image
                                    fill
                                    src={
                                        isCurrUser ? (sessionImg as string) : chatParnter.image
                                    }
                                    alt='profile picture'
                                    referrerPolicy='no-referrer'
                                    className='rounded-full'
                                    sizes=''
                                />
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>

    );
}

export default Messages;