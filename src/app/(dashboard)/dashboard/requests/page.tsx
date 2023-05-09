import FriendRequests from "@/components/FriendRequests";
import { fetchRedis } from "@/helper/redis";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import { FC } from "react";

interface pageProps {

}

const page = async () => {
    const session = await getServerSession(authOptions)
    if (!session) notFound()

    const incomingSenderIds = await fetchRedis(
        'smembers',
        `user:${session.user.id}:incoming_friend_requests`) as string[]

    const incomingFreindRequests = await Promise.all(
        incomingSenderIds.map(async (senderId) => {
            const sender = await fetchRedis('get', `user:${senderId}`) as string
            const result = JSON.parse(sender)
            return {
                senderId,
                senderEmail: result.email
            }
        })
    )
    console.log(incomingSenderIds)

    return (
        <main className="pt-8 pl-4">
            <h1 className="font-bold text-5xl mb-8">Friend requests</h1>
            <div className="flex flex-col gap-4">
                <FriendRequests incomingFriendRequests={incomingFreindRequests} sessionId={session.user.id} />
            </div>
        </main>
    );
}

export default page;