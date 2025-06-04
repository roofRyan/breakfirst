import { signOutAction } from "../actions/myAuth";
import { Button } from "@/components/ui/button"; 

export default function SignOutButton() {
    return (
        <form action={signOutAction}>
            <Button type="submit" className="">
               Sign Out 
            </Button>
        </form>
    );
}