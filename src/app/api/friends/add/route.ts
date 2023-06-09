

import { fetchRedis } from "@/helper/redis"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { pusherServer } from "@/lib/pusher"
import { toPusherKey } from "@/lib/utils"
import { addFriendValidator } from "@/lib/validators/add-friend"
import { getServerSession } from "next-auth"
import { z } from "zod"

const auth: string = 'AXuNASQgMWI2NzdlM2MtMTBmMy00YWE3LTkzMDQtNjZjNDFjNWI0NGU0OWY4OWZjMThiZjkzNGM4NzkwYzFlNWRmNWU0MmYyODc='

export async function POST(req: Request) {
    try
    {
        const body = await req.json()

        const { email: emailToAdd } = addFriendValidator.parse(body.email)


        const idToAdd = await fetchRedis('get', `user:email:${emailToAdd}`) as string

        if (!idToAdd)
        {
            return new Response('This person dose not exist.', { status: 400 })
        }


        const session = await getServerSession(authOptions)



        if (!session)
        {
            return new Response('Unauthorized', { status: 401 })
        }
        if (idToAdd === session.user.id)
        {
            return new Response('You can not add yourself', { status: 400 })
        }

        const isAlreadyAdded = (await fetchRedis('sismember', `user:${idToAdd}:incoming_requests`, session.user.id)) as 0 | 1

        if (isAlreadyAdded)
        {
            return new Response('Already added this user.', { status: 400 })
        }

        const isAlreadyFriends = (await fetchRedis('sismember', `user:${session.user.id}:incoming_requests`, idToAdd)) as 0 | 1

        if (isAlreadyFriends)
        {
            return new Response('You are already friend with this user.', { status: 400 })
        }

        pusherServer.trigger(
            toPusherKey(`user:${idToAdd}:incoming_friend_requests`), 'incoming_friend_requests', {
            senderId: session.user.id,
            senderEmail: session.user.email
        }
        )

        db.sadd(`user:${idToAdd}:incoming_friend_requests`, session.user.id)


        return new Response('OK')
    } catch (error)
    {
        if (error instanceof z.ZodError)
        {
            return new Response('Invaled request payload', { status: 422 })
        }
        return new Response('Invaled request', { status: 400 })
    }
}