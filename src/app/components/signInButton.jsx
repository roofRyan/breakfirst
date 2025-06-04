import { signInAction } from "@/app/actions/myAuth";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default async function SignInButton({provider, btnText, btnCss }){
    return (
        <form action={signInAction} >
            <Button type="submit" name="provider" value={provider} className={btnCss}>
                <div>
                    <Image
                        src={`/${provider}.png`}
                        alt={`${provider} logo`}
                        width={48}
                        height={48}
                        className="w-8 h-8 p-2 inline-block bg-slate300/50"
                    />
                    {btnText}
                </div>
            </Button>
        </form>
    );
}