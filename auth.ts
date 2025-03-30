import { authConfig } from '@/auth.config';
import NextAuth from 'next-auth';
import postgres from "postgres";
import bcrypt from 'bcrypt';
import Credentials from 'next-auth/providers/credentials'; 
import { z } from 'zod';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

async function getUser(email: string) {
    try {
        const user = await sql`
            SELECT * FROM users WHERE email = ${email}
        `;
        return user[0];
    } catch (error) {
        console.error('Failed to fetch user: ', error)
        throw new Error("Failed to fetch user.")
    }
}

export const { auth, signIn, signOut } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            async authorize(credentials) {
                const parsedCredentials = z.object({
                    email: z.string().email(),
                    password: z.string(),
                })
                .safeParse(credentials);
                
                if(parsedCredentials.success) {
                    const { email, password } = parsedCredentials.data;
                    const user = await getUser(email);
                    if (!user) { 
                        console.log('A user with this email does not exist');
                        return null; 
                    } 
                    const passwordMatch = await bcrypt.compare(password, user.password);
                    if (passwordMatch) {
                        return user;
                    }
                }
                console.log('Invalid credentials.')
                return null;
            }
        }),
    ],
});