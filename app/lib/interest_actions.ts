'use server';

import postgres from "postgres";
import { auth } from '@/auth';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function updateUserInterests(interests: string[]) {
    const session = await auth();
    const userId = session?.user?.id;
    const jsoniInterestsString = JSON.stringify(interests);
    
    if (!userId || !jsoniInterestsString) {
        return;
    }

    try {
        await sql`
            DELETE FROM interests
            WHERE user_id = ${userId}
        `;
        await sql`
            INSERT INTO interests (user_id, interests)
            VALUES (${userId}, ${JSON.stringify(interests)})
        `;
    } catch (error) {
        console.error('SQL error:', error);
    }
}

export async function getUserInterests() {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) { return; }

    try {
        const interestsStr = await sql`
            SELECT interests
            FROM interests
            WHERE user_id=${userId}
        `;
        if(interestsStr.length > 0) {
            const interestsArray = JSON.parse(interestsStr[0].interests);
            return interestsArray;
        }
        return [];
    } catch (error) {
        console.error('SQL error:', error);
    }
    
}