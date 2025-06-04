import GitHub from"next-auth/providers/github";
import Google from"next-auth/providers/google";
import type { NextAuthConfig } from "next-auth";

const params = {
    prompt: "consent",
    access_type: "offline",
    Response_type: "code",
};

export default {
    providers: [
        GitHub({
            clientId: process.env.AUTH_GITHUB_ID,
            clientSecret: process.env.AUTH_GITHUB_SECRET,

                authorization:{
                    params: params,
                },
        }),
        Google({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
            authorization:{
                    params: params,
            },
        }),
    ],
} satisfies NextAuthConfig;