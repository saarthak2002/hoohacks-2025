'use server';

import postgres from "postgres";
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache'
import { fetchCardsData } from "./discover_actions";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function createCollection(formData: FormData){
    const session = await auth();
    const userId = session?.user?.id;
    const title = formData.get("title")?.toString();
    if (!title || !userId) { return; }
    
    try {
        await sql`
            INSERT INTO collections (user_id, title)
            VALUES (${userId}, ${title})
        `;
    } catch(error) {
        console.error('SQL error:', error);
    }
    revalidatePath('/dashboard/collections');
}

export async function getCollectionFromId(collectionId: string) {
    try {
        const sql_result = await sql`
            SELECT * FROM collections
            WHERE id=${collectionId}
        `;
        if(sql_result && sql_result.length > 0) {
            return sql_result[0];
        }
    } catch(error) {
        console.error('SQL error:', error);
    }
}

export async function getCollections() {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) { return; }
    try {
        
        const sql_result = await sql`
            SELECT * FROM collections
            WHERE user_id=${userId}
        `;

        const results = await Promise.all(
            sql_result.map(async (row) => {
                const num = await getCollectionCount(row.id);
                return {
                    id: row.id,
                    title: row.title,
                    count: num,
                };
            })  
        );
        
        console.log(results)
        return results;
    } catch(error) {
        console.error('SQL error:', error);
    }
    
}

async function getCollectionCount(collectionId: number) {
    try {
        const sql_result = await sql`
            SELECT COUNT(*) FROM collection_contents
            WHERE collection_id=${collectionId}
        `;
        if(sql_result && sql_result.length > 0) {
            return sql_result[0].count;
        }
    } catch(error) {
        console.error('SQL error:', error);
    }
}

export async function getCollectionContents(collectionId: string) {
    try {
        const sql_result = await sql`
            SELECT title FROM collection_contents
            WHERE collection_id=${collectionId}
        `;
        
        const titleResults = await Promise.all(
            sql_result.map(async (row) => {
                return row.title;
            })  
        );
        const cardsData = await fetchCardsData(titleResults)
        console.log(cardsData)
        return cardsData;
    } catch(error) {
        console.error('SQL error:', error);
    }
}

export async function addTitleToCollection(collectionId: string, title: string) {
    try {
        // make sure does not exist already
        const sql_result = await sql`
            SELECT * FROM collection_contents
            WHERE collection_id=${collectionId} AND title=${title}
        `;

        if(sql_result.length > 0) {
            return;
        }

        await sql`
            INSERT INTO collection_contents (collection_id, title)
            VALUES (${collectionId}, ${title})
        `;
        
    } catch(error) {
        console.error('SQL error:', error);
    }
}