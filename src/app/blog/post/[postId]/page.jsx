import { notFound } from "next/navigation"
import { avatar } from "@/app/data/blog/users";
import { blogPosts } from "@/app/data/blog/blogPosts";
import Link from "next/link";

const posts = blogPosts;

export default async function PostPage({params}){
    const { postId } = await params;
    const post = posts.find((post) => post.id === Number
    (postId));
    
    if( !post ) notFound();

    const user = avatar[post.userId - 1];
    return (
        <div className="container mx-auto p-4 max-w-2xl">
            <div>
                    <img
                        src={user.avatar}
                        alt={`User ${user.id}'s avatar`}
                        className="w-12 h-12 rounded-full"
                    />
                    <div>
                        <h1>{post.title}</h1>
                    <Link
                        href={`/blog/users/${user.id}`}
                        className="text-gray-600 hover:bg-yellow-300"
                    >
                        作者: #{user.id}:{user.name}
                    </Link>
                  </div>  
                </div>
            <article className="border bg-slate-100 rounded-lg shadow-sm">
                {post.content}
            </article>
        </div>
    );
}
