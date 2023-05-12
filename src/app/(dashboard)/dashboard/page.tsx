import { getFriends } from "@/helper/get-friends";
import { fetchRedis } from "@/helper/redis";
import { authOptions } from "@/lib/auth";
import { chatHrefConstructor } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

interface pageProps {

}

const page = async () => {
    const session = await getServerSession(authOptions)

    if (!session) notFound()

    const friends = await getFriends(session.user.id)

    const friendsWithLastMessages = await Promise.all(
        friends.map(async (friend) => {
            const [lastMessageRaw] = await fetchRedis(
                'zrange',
                `chat:${chatHrefConstructor(
                    session.user.id,
                    friend.id
                )}:messages`,
                -1,
                -1
            ) as string[]


            const lastMessage = lastMessageRaw ? JSON.parse(lastMessageRaw) as Message : null


            return {
                ...friend,
                lastMessage
            }
        })
    )
    return (
        <div className="container py-12 ">
            <h1 className="font-bold text-5xl mb-8">Recent Chats</h1>
            {friendsWithLastMessages.length === 0 ? (
                <p></p>
            ) : friendsWithLastMessages.map((friend) => (
                <div key={friend.id} className='relative bg-zinc-50 border border-zinc-200 rounded-md p-3  '
                >
                    <div className="absolute right-4 inset-y-0 flex items-center  ">
                        <ChevronRight className="h-7 text-zinc-400" />
                    </div>
                    <Link href={`/dashboard/chat/${chatHrefConstructor(
                        session.user.id,
                        friend.id
                    )}`} className='relative sm:flex' >
                        <div className="mb-4 flex-shrink-0 sm:mb-0 sm:mr-4" >
                            <div className="relative h-6 w-6" >
                                <Image
                                    referrerPolicy='no-referrer'
                                    className='rounded-full'
                                    alt={`${friend.name} profile picture`}
                                    fill
                                    src={friend.image}
                                />
                            </div>
                        </div>
                        <div>
                            <h4 className="text-lg font-semibold" >{friend.name}</h4>
                            <p className="mt-1 max-w-md" >
                                <span className="text-zinc-400 " >
                                    {friend.lastMessage?.senderId === session.user.id ? ' you : ' : ''}
                                </span>
                                {friend.lastMessage?.text}
                            </p>
                        </div>
                    </Link>
                </div>
            ))}
        </div>
    );
}

export default page;