import SignInButton from "@/app/components/signInButton";
import SignOutButton from "@/app/components/signOutButton";
import UserInfo from "../components/userInfo";
import { auth } from "../../../auth";

export default async function AuthPage() {
    const session = await auth();
    if(!session) {
        return (
            <div>
                <h1>歡迎登入</h1>
                <SignInButton
                provider="github"
                btnText="使用 GitHub登入"
                btnCss="bg-slate-300/50 hover:bg-slate-900 font-bold py-2 px-4 rounded-md shadow-lg"
                />
                <SignInButton
                provider="google"
                btnText="使用 Google 登入"
                btnCss="bg-slate-300/50 hover:bg-slate-900 font-bold py-2 px-4 rounded-md shadow-lg"
                />
            </div>
        );
    }
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <UserInfo/>
            <SignOutButton/>
        </div>
    );
}