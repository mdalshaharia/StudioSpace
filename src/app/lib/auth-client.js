import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
    baseURL: process.env.BETTER_AUTH_URL,
    trustedOrigins: [
        "http://localhost:3000",
        "https://b14-a07-five.vercel.app",
    ],
})

export const { signIn, signUp, useSession, signOut, updateUser } = authClient