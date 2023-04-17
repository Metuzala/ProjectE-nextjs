import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google";
import clientPromise from "@/lib/mongodb";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";

export default NextAuth({
    // Configure one or more authentication providers
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET
        })
        // ...add more providers here
    ],
    adapter: MongoDBAdapter(clientPromise)
})

