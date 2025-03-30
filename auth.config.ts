import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const authConfig = {
    pages: {
        signIn: '/login',
    },
    callbacks: {
        // protect the /dashboard route
        // if user is logged in, redirect them to the dashboard
        authorized({ auth, request: { nextUrl }}) {
            const isLoggedIn = !!auth?.user;
            const isOnDashBoard = nextUrl.pathname.startsWith('/dashboard');
            if (isOnDashBoard) {
                if (isLoggedIn) {
                    return true;
                } else {
                    return false;
                }
            } else if (isLoggedIn) {
                return Response.redirect(new URL('/dashboard', nextUrl));
            }
            return true;
        },
        // Extends the session to include user id from DB
        jwt({ token, user }) {
            if (user) {
                token.id = user.id
            }
            return token;
        },
        session({ session, token}) {
            if(token.id) {
                session.user = {
                    ...session.user,
                    id: token.id as string,
                };
            }
            return session;
        },
    },
    providers: [ Credentials({}) ],
} satisfies NextAuthConfig;