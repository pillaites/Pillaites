import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";

export default NextAuth({
  providers: [
    // Add your providers here
  ],
  adapter: PrismaAdapter(prisma),
  callbacks: {
    async session({ session, user }) {
      // Add the user id to the session object
      if (session?.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
});
