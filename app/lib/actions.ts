'use server';

import postgres from "postgres";
import bcrypt from 'bcrypt';
import { z } from 'zod';
import type { User } from '@/app/lib/definitions';
import { redirect } from 'next/navigation';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function authenticate(prevState: string | undefined, formData: FormData) {
    try {
        await signIn('credentials', formData);
        console.log("User Authenticated!");
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Invalid credentials.'
                default:
                    return 'Something went wrong. Please try again later.'
            }
        }
        throw error;
    }
}

export async function createUser(prevState: string | undefined, formData: FormData) {
    const rawFormData = {
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password')
    };
    const parsedCredentials = z
        .object({ name: z.string(), email: z.string().email(), password: z.string().min(6) })
        .safeParse(rawFormData);
    if (parsedCredentials.success) {
        const { name, email, password } = parsedCredentials.data;
        try {
            // check if existing user with same email
            const user = await sql<User[]>`SELECT * FROM users WHERE email=${email}`;
            if (user.length !== 0) {
                console.log("A user with this email already exists.");
                return "A user with this email already exists.";
            } else {
                const hashedPassword = await bcrypt.hash(password, 10);;
                await sql`
                    INSERT INTO users (name, email, password)
                    VALUES (${name}, ${email}, ${hashedPassword})
                `
                console.log("User Added!");
            }
        } catch (error) {
            console.log("Failed to fetch user:", error);
            throw new Error("Failed to fecth user.");
        }
        redirect('/login?signup=true');
    } else {
        console.log("There was a validation error");
        return "There was a validation error.";
    }
}