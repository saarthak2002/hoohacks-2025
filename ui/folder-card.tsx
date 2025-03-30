'use client';

import { motion } from 'motion/react';
import { FolderOpen } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface FolderCardProps {
    collectionId: string;
    title: string;
    count?: number; // Optional: number of items inside
}

export default function FolderCard({ title, count, collectionId }: FolderCardProps) {
    const router = useRouter();
    const handleClick = () => {
        router.push(`/dashboard/collections/${collectionId}`);
    };
    return (
        <motion.div
            onClick={handleClick}
            whileHover={{ y: -4, scale: 1.02 }}
            className="cursor-pointer relative bg-yellow-100 dark:bg-yellow-300/10 text-yellow-900 dark:text-yellow-100 rounded-lg shadow-md border border-yellow-300 dark:border-yellow-700 w-full max-w-xs p-4 transition-all"
        >
        <div className="absolute -top-3 left-4 bg-yellow-300 dark:bg-yellow-600 px-3 py-1 rounded-t-md shadow-sm text-sm font-semibold">
            {title}
        </div>
        <div className="pt-6 flex flex-col items-center justify-center space-y-2">
            <FolderOpen className="w-10 h-10 text-yellow-600 dark:text-yellow-400" />
            <p className="text-sm text-center font-medium">{count ?? '...' } cards inside</p>
        </div>
        </motion.div>
    );
}
