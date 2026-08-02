import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import connectDb from "./lib/connectDB"
import User from "./model/user.model"
import bcrypt from "bcryptjs"
import Google from "next-auth/providers/google"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectDb()
        const email = credentials?.email as string
        const password = credentials?.password as string

        const user = await User.findOne({ email })
        if (!user) {
          throw new Error("user is not found")
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
          throw new Error("Incorrect Password")
        }
        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
          image: user.image || null
        }
      }
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET
    })
  ],

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        await connectDb()
        let DBUser = await User.findOne({ email: user.email })

        if (!DBUser) {
          // ১. নতুন ইউজার হলে ডাটাবেজে ছবিসহ ক্রিয়েট হবে
          DBUser = await User.create({
            name: user.name,
            email: user.email,
            image: user.image,
            role: "user"
          })
        } else {
          // 🌟 ২. ইউজার আগে থেকে থাকলেও ডাটাবেজে ইমেজ না থাকলে গুগলের ছবি সেভ করে নেবে
          if (!DBUser.image && user.image) {
            DBUser.image = user.image
            await DBUser.save()
          }
        }

        user.id = DBUser._id.toString()
        user.role = DBUser.role ? DBUser.role.toString() : "user"
        user.image = DBUser.image || user.image
      }
      return true
    },

    jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
        token.role = user.role
        token.picture = user.image 
      }
      return token
    },

    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.email = token.email as string
        session.user.name = token.name as string
        session.user.role = token.role as string
        session.user.image = token.picture as string // 🌟 সেশনে ইমেজের মান
      }
      return session
    }
  },

  pages: {
    signIn: "/login",
    error: "/login"
  },

  session: {
    strategy: "jwt",
    maxAge: 10 * 24 * 60 * 60 // 🌟 ১০ দিন (সেকেন্ডে হিসাব)
  },

  secret: process.env.AUTH_SECRET
})