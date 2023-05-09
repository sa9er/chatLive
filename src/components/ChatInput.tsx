'use client'


import axios from 'axios';
import { send } from 'process';
import { FC, useRef, useState } from 'react'
import toast from 'react-hot-toast';
import ReactTextareaAutosize from 'react-textarea-autosize';
import Button from './ui/Button';


interface ChatInputProps {
    chatPartner: User
    chatId: string
}

const ChatInput: FC<ChatInputProps> = ({ chatPartner, chatId }) => {

    const [input, setInput] = useState<string>('')
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const textareaRef = useRef<HTMLTextAreaElement | null>(null)

    const sendMessage = async () => {
        setIsLoading(true)

        try
        {
            await axios.post('/api/message/send', { text: input, chatId })
        } catch (error)
        {
            toast.error('Something went wrong, please try again later')
        } finally
        {
            setIsLoading(false)
        }

        setInput('')
    }

    return (
        <div className='border-t border-gra-200 px-4 pt-4 mb-2 sm:mb-0'>
            <div className='relative flex-1 overflow-hidden rounded-lg shdow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600 pt-1'>
                <ReactTextareaAutosize ref={textareaRef} onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey)
                    {
                        e.preventDefault()
                        sendMessage()
                    }
                }}
                    rows={1}
                    value={input}
                    onChange={(e) => {
                        setInput(e.target.value)
                    }}
                    placeholder={`Message ${chatPartner.name}`}
                    className='block h-full resize-none border-0 bg-transparent text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:py-1.5 sm:leading-6 '
                />
                <div
                    onClick={() => { textareaRef.current?.focus() }}
                    className='py-2'
                    aria-hidden='true'
                >
                    <div className='py-px'>
                        <div className='h-9' />
                    </div>
                </div>
                <div className='absolute right-0 bottom-0 flex justify-between py-2 pl-3 pr-2 '>
                    <div className='flex-schrink-0'>
                        <Button isLoading={isLoading}
                            type='submit'
                            onClick={() => { textareaRef.current?.focus(), sendMessage() }}

                        >
                            <p className='m-1'> Post</p>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ChatInput;