import NextAuth from "next-auth";
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
      console.log("🟡 [signIn] 嘗試登入:", email);

      const { data, error } = await supabaseAdmin
        .from("users")
        .select("id")
        .eq("email", email)
        .single();

      console.log("🔵 [signIn] 查詢結果:", { data, error });

      if (!data && email) {
        console.log("🟠 [signIn] 該用戶不存在，準備新增");

        const { error: insertError } = await supabaseAdmin.from("users").insert([
          {
            email,
            role: "CUSTOMER",
          },
        ]);

        if (insertError) {
          console.error("🔴 [signIn] 新增使用者失敗:", insertError);
          return false;
        }

        console.log("🟢 [signIn] 新增使用者成功");
      }

      return true;
    },

    async session({ session }) {
      const email = session.user?.email;
      console.log("🟡 [session] 取得使用者 session:", email);

      if (email) {
        const { data, error } = await supabaseAdmin
          .from("users")
          .select("role")
          .eq("email", email)
          .single();

        if (error) {
          console.error("🔴 [session] 讀取使用者角色失敗:", error);
        } else {
          console.log("🟢 [session] 使用者角色:", data?.role);
          session.user.role = data?.role || "CUSTOMER";
        }
      }

      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
