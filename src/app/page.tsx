import Button from "@/components/ui/Button"
import { db } from "@/lib/db"
import Link from "next/link"

export default async function Home() {
  await db.set('hoo', 'hoo')

  return (
    <Link href='/login'>
      <Button>Home</Button>
    </Link>
  )
}
