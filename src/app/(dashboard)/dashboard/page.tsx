import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

interface pageProps {

}

const page = async () => {
    const data = await getServerSession(authOptions)

    return (<pre>{JSON.stringify(data)}</pre>);
}

export default page;