import { APISession } from "@/types/models";
import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: AuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/auth/login"
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Add logic here to look up the user from the credentials supplied
        let response;
        const api_url = process.env.NEXT_PUBLIC_NODE_ENV === "development" ? process.env.NEXT_PUBLIC_DEV_API_URL : process.env.NEXT_PUBLIC_API_URL
        try {
          response = await fetch(`${api_url}/login/`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: credentials?.username,
              password: credentials?.password,
            }),
          });
        } catch(error) {
          console.log('error', error)
        }
        if (response?.ok) {
          const data = await response.json()
          return data
        } else {
          console.log(`error code: ${response?.json()}`)
          return null
        } 

        
      },
    }),
  ],
  callbacks: {
    async jwt({ token, trigger, user, session: newData }) {
      if (trigger === "update" && newData.profile) {
        const data: APISession = token as any
        data.profile = newData.profile
        return { ...data, ...user };
      }
      return { ...token, ...user };
    },
    async session({ session, token }) {
      session.user = token as any
      return session;
    }
    
  },
}

const handler = NextAuth(authOptions);
export default handler
