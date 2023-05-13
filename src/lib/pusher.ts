// app_id = "1596285"
// key = "616e509a0637a3ef02db"
// secret = "63c0bf5e7bfafd802af2"
// cluster = "eu"


import PusherServer from 'pusher'
import PusherClient from 'pusher-js'

export const pusherServer = new PusherServer({
    appId: process.env.PUSHER_APP_ID!,
    key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY!,
    secret: process.env.PUSHER_APP_SECRET!,
    cluster: "eu",
    useTLS: true,

})

export const pusherClient = new PusherClient("616e509a0637a3ef02db", {
    cluster: 'eu'
})
