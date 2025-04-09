import myImg from "@/../public/food02.jpg";
import Hero from "@/app/components/hero";

export default function Home2Page({ params }) {
    return <Hero imgUrl={myImg} content={"most reliability"} />;
}