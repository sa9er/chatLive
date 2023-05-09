'use client'

import { Loader2, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { ButtonHTMLAttributes, FC, useState } from "react";
import toast from "react-hot-toast";
import Button from "./ui/Button";

interface SignOutBUttonProps extends ButtonHTMLAttributes<HTMLButtonElement> {

}

const SignOutBUtton: FC<SignOutBUttonProps> = ({ ...props }) => {

    const [isSignedOut, setIsSignedOut] = useState<boolean>(false)

    return <Button {...props} variant='ghost' onClick={async () => {
        setIsSignedOut(true)
        try
        {
            await signOut()
        } catch (error)
        {
            toast.error('ops sigout ops')
        } finally
        {
            setIsSignedOut(false)
        }
    }} > {isSignedOut ? (
        <Loader2 className="animate-spin h-4 w-4 " />
    ) : (
        <LogOut className="h-4 w-4" />
    )}</Button>;
}

export default SignOutBUtton;