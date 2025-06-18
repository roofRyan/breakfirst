// lib/auth.js
import GoogleProvider from "next-auth/providers/google";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async signIn({ user }) {
      const email = user.email;
      const name = user.name;
      const createdAt = new Date().toISOString();

      const { data } = await supabaseAdmin
        .from("users")
        .select("id")
        .eq("email", email)
        .single();

      if (!data && email) {
        await supabaseAdmin
          .from("users")
          .insert([{ email, name, role: "CUSTOMER", createdAt }]);
      }

      return true;
    },

    async session({ session }) {
      const email = session.user?.email;
      if (email) {
        const { data } = await supabaseAdmin
          .from("users")
          .select("id, role")
          .eq("email", email)
          .single();

        session.user.id = data?.id;
        session.user.role = data?.role || "CUSTOMER";
      }
      return session;
    },
  },
};
