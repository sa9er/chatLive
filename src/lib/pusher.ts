// app_id = "1596285"
// key = "616e509a0637a3ef02db"
// secret = "63c0bf5e7bfafd802af2"
// cluster = "eu"


import PusherServer from 'pusher'
import PusherClient from 'pusher-js'

export const pusherServer = new PusherServer({
    appId: "1596285",
    key: "616e509a0637a3ef02db",
    secret: "63c0bf5e7bfafd802af2",
    cluster: "eu",
    useTLS: true,

})

export const pusherClient = new PusherClient("616e509a0637a3ef02db", {
    cluster: 'eu'
})
