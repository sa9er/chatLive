import { fetchRedis } from "@/helper/redis"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { getServerSession } from "next-auth"
import { z } from "zod"

export async function POST(req: Request) {
    try 
    {
        const body = await req.json()

        const { id: idToAdd } = z.object({ id: z.string() }).parse(body)


        const session = await getServerSession(authOptions)
        if (!session)
        {
            return new Response('Unauthorized', { status: 401 })
        }

        const isAlreadyFriends = await fetchRedis('sismember', `user:${session.user.id}:friends`, idToAdd)
        const isAlreadyalsoFriends = await fetchRedis('sismember', `user:${idToAdd}:friends`, session.user.id)

        if (isAlreadyFriends)
        {
            return new Response('already friends', { status: 401 })
        }

        const hasFriendReq = await fetchRedis('sismember', `user:${session.user.id}:incoming_friend_requests`, idToAdd)

        if (!hasFriendReq)
        {
            return new Response('no friend requests found', { status: 400 })
        }

        await db.sadd(`user:${session.user.id}:friends`, idToAdd)
        await db.sadd(`user:${idToAdd}:friends`, session.user.id)

        if (isAlreadyFriends)
        {
            console.log('ok session')
        }

        if (isAlreadyalsoFriends)
        {
            console.log('ok idToAdd')

        }

        // db.srem(`user:${idToAdd}:incoming_friend_requests`, session.user.id)

        await db.srem(`user:${session.user.id}:incoming_friend_requests`, idToAdd)


        return new Response('ok', { status: 201 })
    } catch (error)
    {
        if (error instanceof z.ZodError)
        {
            return new Response('Invaled request payload', { status: 422 })
        }
        return new Response('Invaled request', { status: 400 })
    }
}