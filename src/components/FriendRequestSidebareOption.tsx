'use client'

import { pusherClient } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";
import { User } from "lucide-react";
import Link from "next/link";
import { FC, useEffect, useState } from "react";

interface FriendRequestSidebareOptionProps {
    sessionId: string
    initUnseenReqCount: number
}

const FriendRequestSidebareOption: FC<FriendRequestSidebareOptionProps> = ({ initUnseenReqCount, sessionId }) => {
    const [unseenRequests, setUnseenRequests] = useState<number>(
        initUnseenReqCount
    )

    useEffect(() => {

        pusherClient.subscribe(
            toPusherKey(`user:${sessionId}:incoming_friend_requests`)
        )


        const friendRequestHandler = () => {

            setUnseenRequests((prev) => prev + 1)
        }

        pusherClient.bind('incoming_friend_requests', friendRequestHandler)


        return () => {
            pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:incoming-friend_requests`))
            pusherClient.unbind('incoming_friend_request', friendRequestHandler)
        }

    }, [])
    return (
        <Link href='/dashboard/requests'
            className="text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold">
            <div className="text-gray-400 border border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600 flex h-6 w-6 shrink-0 items-center rounded-lg justify-center boarder text-[0.625rem] font-medium bg-white">
                <User className="h-4 w-4" />
            </div>
            <p className="truncate">Friend Requests</p>
            {unseenRequests > 0 ? (
                <div className="rounded-full w-6 h-6 text-xs flex justify-center items-center text-white bg-indigo-600">{unseenRequests}</div>
            ) : null}
        </Link>
    );
}

export default FriendRequestSidebareOption;