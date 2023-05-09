import 'server-only'
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";



export const session = async () => {
    const data = await getServerSession(authOptions)
    return data
} 