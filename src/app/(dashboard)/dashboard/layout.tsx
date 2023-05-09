import FriendRequestSidebareOption from "@/components/FriendRequestSidebareOption";
import { Icon, Icons } from "@/components/Icons";
import SidebarChats from "@/components/SidebarChats";
import SignOutButton from "@/components/SignOutButton";
import { getFriends } from "@/helper/get-friends";
import { fetchRedis } from "@/helper/redis";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FC, ReactNode } from "react";

interface LayoutProps {
    children: ReactNode
}

interface SideBarOption {
    id: number
    name: string
    href: string
    Icon: Icon
}

const sideBarOptions: SideBarOption[] = [
    {
        id: 1,
        name: 'Add friend',
        href: '/dashboard/add',
        Icon: 'UserPlus',
    },
    {
        id: 2,
        name: 'dashboard',
        href: '/dashboard',
        Icon: 'Logo'
    }
]

const Layout = async ({ children }: LayoutProps) => {
    const layoutSidebarOptions: SideBarOption[] = sideBarOptions.filter(option => option.name != 'dashboard')

    const session = await getServerSession(authOptions)
    if (!session) notFound()

    const friends = await getFriends(session.user.id)

    const unseenFriendReqs = (
        await fetchRedis(
            'smembers',
            `user:${session.user.id}:incoming_friend_requests`
        ) as User[]).length

    const FriendReqs =
        await fetchRedis(
            'smembers',
            `user:${session.user.id}:incoming_friend_requests`
        ) as string[]

    // console.log('friReqs', FriendReqs)

    return (
        <div className="w-full flex h-screen" >
            <div className="flex h-full max-w-xs grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6">
                <Link href={sideBarOptions[1]} className="flex h-16 shrink-0 items-center">
                    <Icons.Logo className="h-8 w-auto text-indigo-600" />
                </Link>

                {friends.length > 0 ? (
                    <div className="text-xs font-semibold leading-6 text-grey-400">

                    </div>
                ) : null}

                <nav className="flex flex-col flex-1 ">
                    <ul role='list' className="flex flex-1 flex-col gap-y-7">
                        <li>
                            <SidebarChats friends={friends} sessionId={session.user.id} />
                        </li>
                        <div className="tex-xs font-semibold leading-6 text-gray-400">Overview</div>
                        <li>
                            <ul role='list' className="-mx-1 mt-2 space-y-1">
                                {layoutSidebarOptions.map((option) => {
                                    const Icon = Icons[option.Icon]
                                    return (
                                        <li key={option.id}>{
                                            <Link
                                                href={option.href}
                                                className='text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex gap-3 rounded-md p-2 text-sm leading-6 font-semibold'
                                            >
                                                <span className=" flex text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600 h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-md bg-white">
                                                    <Icon className="h-4 w-4 " />
                                                </span>
                                                <span className="truncate">{option.name}</span>
                                            </Link>
                                        }</li>
                                    )
                                })}
                                <li>
                                    <FriendRequestSidebareOption sessionId={session.user.id} initUnseenReqCount={unseenFriendReqs} FriendReqs={FriendReqs} />
                                </li>
                            </ul>
                        </li>

                        <li className="-mx-6 mt-auto flex items-center">
                            <div className="flex flex-1 items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-gray-600">
                                <div className="relative h-8 w-8 bg-gray-50">

                                    <Image
                                        fill
                                        referrerPolicy='no-referrer'
                                        className='rounded-full'
                                        src={session?.user.image || ''}
                                        alt={"Profile Picture"}
                                    />
                                </div>

                                <span className="sr-only">Your profile</span>
                                <div className="flex flex-col">
                                    <span aria-hidden='true'>{session.user.name}</span>
                                    <span className="text-xs text-zinc-400" aria-hidden='true'>
                                        {session.user.email}
                                    </span>
                                </div>
                            </div>
                            <SignOutButton className='h-full aspact-square' />
                        </li>
                    </ul>
                </nav>
            </div>
            {children}
        </div>
    );
}

export default Layout;