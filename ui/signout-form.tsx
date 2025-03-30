import { signOut } from '@/auth';
import { PowerIcon } from '@heroicons/react/24/outline';

export default function SignoutButton() {
    return (
        <form
            action={async () => {
                'use server';
                await signOut({ redirectTo: '/login?logout=true' });
            }}
        >
            <button className="flex h-[32px] w-full grow items-center justify-center gap-2 rounded-md p-2 text-sm font-medium md:flex-none md:justify-start md:p-2 md:px-3">
                <PowerIcon className="w-6" />
                <div className="md:block">Sign Out</div>
            </button>
        </form>
    );
}