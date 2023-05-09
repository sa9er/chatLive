interface User {
    name: string
    email: string
    id: string
    image: string
}

interface Message {
    id: string
    senderId: string
    receiverId: string
    text: string
    timestamp
}

interface Chat {
    id: string
    messages: Message[]
}

interface FriendRequest {
    id: string
    senderId: string
    receiverId: string
}