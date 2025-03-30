import { auth } from '@/auth';
import DiscoverCards from '@/ui/discover-cards';
import Link from "next/link";

export default async function Page() {
    const session = await auth();
    const id = session?.user?.id;
    const name = session?.user?.name;
    const email = session?.user?.email;

    return (
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold mb-6">Discover</h1>
        <p className="text-muted-foreground mb-6">Add at least three <Link href="/dashboard/settings" className='underline'>interests</Link> to get personalized recommendations.</p>
        <DiscoverCards />
      </div>
    );
  }
  