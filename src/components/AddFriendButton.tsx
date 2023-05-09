'use client'

import { FC, useState } from "react";
import Button from "./ui/Button";
import { addFriendValidator } from "@/lib/validators/add-friend";
import axios, { AxiosError } from "axios";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod'

interface AddFriendButtonProps {
}

const AddFriendButton: FC<AddFriendButtonProps> = () => {

    type FormData = z.infer<typeof addFriendValidator>

    const [showSuccessState, setShowSuccessState] = useState(false)

    const { register, handleSubmit, setError, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(addFriendValidator)
    })

    const addFriend = async (email: string) => {
        try
        {
            const validatedEmail = addFriendValidator.parse({ email })

            await axios.post('/api/friends/add', {
                email: validatedEmail,
            })


            setShowSuccessState(true)


        } catch (error)
        {
            if (error instanceof z.ZodError)
            {

                setError('email', { message: error.message })
            }
            if (error instanceof AxiosError)
            {

                setError('email', { message: error.response?.data })
            }
            setError('email', { message: 'something went wrong ops' })
        }
    }

    const onSubmit = async (data: FormData) => {
        addFriend(data.email)
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-sm px-4" >
            <label htmlFor="email" className="text-sm block font-medium leading-6 text-gray-900 pl-1">
                Add friend by E-mail
            </label>

            <div className="mt-2 flex gap-4 ">
                <input
                    {...register('email')}
                    type="text"
                    className="block w-ful rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 hover:ring-2 hover:ring-inset hover:ring-indigo-600 sm:text-cm sm:leading-6"
                    placeholder="you@example.com" />
                <Button>Add</Button>
            </div>
            <p className="mt-1 text-sm text-red-600" >
                {errors.email?.message}
            </p>
            {showSuccessState && (
                <p className="mt-1 text-sm text-green-600" >
                    Friend request sent
                </p>
            )}
        </form>
    );
}

export default AddFriendButton;