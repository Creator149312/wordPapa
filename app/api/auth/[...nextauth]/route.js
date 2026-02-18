import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { validateEmail, validatePasswordLength } from "@utils/Validator";

const validateForm = async (data) => {
  let err = {};
  let ve = validateEmail(data.email);
  let vp = validatePasswordLength(data.password);

  if (ve.length !== 0) err.email = ve;
  if (vp.length !== 0) err.password = vp;

  return err;
};

const checkLogin = async (email, password) => {
  await connectMongoDB();
  const user = await User.findOne({ email });

  if (!user) return null;

  const passwordsMatch = await bcrypt.compare(password, user.password);
  if (!passwordsMatch) return null;

  return user;
};

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {},
      async authorize(credentials) {
        const { email, password } = credentials;
        let validationError = await validateForm({ email, password });

        if (Object.keys(validationError).length !== 0) return null;

        try {
          let userData = await checkLogin(email, password);
          return userData;
        } catch (error) {
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account.provider === "google") {
        const { name, email, image } = user;
        try {
          await connectMongoDB();
          let existingUser = await User.findOne({ email });

          if (!existingUser) {
            // Create new user in DB
            existingUser = await User.create({
              name,
              email,
              image,
              provider: "google",
            });
          }
          return true;
        } catch (error) {
          console.error("Error saving Google user:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user._id || user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.id) {
        session.user.id = token.id;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
