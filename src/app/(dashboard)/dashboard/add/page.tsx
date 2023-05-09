
import AddFriendButton from "@/components/AddFriendButton";
import { session } from "@/helper/session";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { FC } from "react";

interface PageProps {

}

const page = async () => {
    return (
        <main className="pt-8" >
            <h1 className="font-bold text-5xl mb-8 pl-4" >Add a friend</h1>
            <AddFriendButton />
        </main>
    );
}

export default page;