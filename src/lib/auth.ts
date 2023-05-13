import { NextAuthOptions } from "next-auth";
import { UpstashRedisAdapter } from "@next-auth/upstash-redis-adapter";
import { db } from "./db";
import GoogleProvider from 'next-auth/providers/google'
import { fetchRedis } from "@/helper/redis";


function getGoogleCredentials() {
    const clientId = process.env.GOOGLE_CLIENT_ID
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET

    if (!clientId || clientId.length === 0)
    {
        throw new Error('missing client id')
    }
    if (!clientSecret || clientSecret.length === 0)
    {
        throw new Error('missing client Secret')
    }

    return {
        clientId, clientSecret
    }
}

export const authOptions: NextAuthOptions = {
    adapter: UpstashRedisAdapter(db),
    session: {
        strategy: 'jwt'
    },
    secret: process.env.NEXTAUTH_URL,
    pages: {
        signIn: '/login',
        signOut: '/',

    },
    providers: [
        GoogleProvider({
            clientId: getGoogleCredentials().clientId,
            clientSecret: getGoogleCredentials().clientSecret,
        })
    ],

    callbacks: {
        async jwt({ token, user }) {
            const dbUserResult = await fetchRedis('get', `user:${token.id}`) as string || null

            if (!dbUserResult)
            {
                token.id = user!.id
                return token
            }

            const dbUser = JSON.parse(dbUserResult) as User

            return {
                name: dbUser.name,
                id: dbUser.id,
                image: dbUser.image,
                email: dbUser.email
            }
        },
        async session({ session, token }) {
            if (token)
            {
                session.user.id = token.id
                session.user.name = token.name
                session.user.email = token.email
                session.user.image = token?.picture
            }

            return session

        },
        redirect() {
            return '/dashboard'
        }
    }
}