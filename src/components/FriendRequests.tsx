'use client'

import { pusherClient } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";
import axios from "axios";
import { Check, UserPlus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";

interface FriendsRequestsProps {
    incomingFriendRequests: IncomingFriendRequests[]
    sessionId: string
}



const FriendsRequests: FC<FriendsRequestsProps> = ({ incomingFriendRequests, sessionId }) => {
    const router = useRouter()

    console.log(incomingFriendRequests)
    const [friendRequests, setFriendRequests] = useState<IncomingFriendRequests[]>(
        incomingFriendRequests
    )

    useEffect(() => {

        pusherClient.subscribe(
            toPusherKey(`user:${sessionId}:incoming_friend_requests`)
        )


        const friendRequestHandler = ({ senderId, senderEmail }: IncomingFriendRequests) => {
            if (friendRequests.includes({ senderId, senderEmail }))
            {
                return setFriendRequests(friendRequests), console.log('ok')
            } else
            {
                setFriendRequests((prev) => [...prev, { senderId, senderEmail }])
                console.log('ok here')
            }

        }

        pusherClient.bind('incoming_friend_requests', friendRequestHandler)


        return () => {
            pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:incoming-friend_requests`))
            pusherClient.unbind('incoming_friend_request', friendRequestHandler)
        }

    }, [])

    const accpetFriend = async (senderId: string) => {

        await axios.post('/api/friends/accept', { id: senderId })

        setFriendRequests((prev) =>
            prev.filter((request) => request.senderId !== senderId))
        router.refresh()
    }

    const denyFriend = async (senderId: string) => {
        await axios.post('/api/friends/deny', { id: senderId })

        setFriendRequests((prev) => prev.filter((request) => request.senderId !== senderId))
        router.refresh()
    }

    return (<>
        {friendRequests.length === 0 ? (
            <p className="text-sm text-zinc-400 ">nothing to show here...</p>
        ) : (
            friendRequests.map((request) => (
                <div className="flex gap-4 items-center" key={request.senderId}>
                    <UserPlus className='text-black' />
                    <p className="font-md text-lg">{request.senderEmail}</p>
                    <button onClick={() => accpetFriend(request.senderId)} aria-label="accept friend" className="w-8 h-8 bg-indigo-600 hover:bg-indigo-700 grid place-items-center rounded-full transition hover:shadow-md">
                        <Check className="font-semibold text-white w-3/4 h-3/4" />
                    </button>

                    <button onClick={() => denyFriend(request.senderId)} aria-label="accept friend" className="w-8 h-8 bg-red-600 hover:bg-indigo-700 grid place-items-center rounded-full transition hover:shadow-md">
                        <X className="font-semibold text-white w-3/4 h-3/4" />
                    </button>

                </div>
            ))
        )
        }</>);
}

export default FriendsRequests;

function async() {
    throw new Error("Function not implemented.");
}
