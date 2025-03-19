"use client";

import { useParams } from "next/navigation";
import { blogPosts } from "@/app/data/blog/blogPosts";
import { avatar } from "@/app/data/blog/users";
import Link from "next/link";

export default function UserPage() {
    const { userId } = useParams(); 
    const userPosts = blogPosts.filter((post) => post.userId === parseInt(userId, 10));
    const user = avatar.find((u) => u.id === parseInt(userId, 10));

    return (
        <div className="container mx-auto p-6 max-w-2xl bg-white shadow-md rounded-lg">
            <h1 className="text-3xl font-bold mb-6">
                {user ? `${user.name} 的文章` : `用户 ${userId} 的文章`}
            </h1>

            {userPosts.length > 0 ? (
                <ul className="space-y-4">
                    {userPosts.map((post) => {
                        const author = avatar.find((u) => u.id === post.userId);

                        return (
                            <li key={post.id} className="border-b pb-2">
                                <Link href={`/blog/posts/${user.id}`} className="text-blue-600 hover:underline">
                                    {post.title}
                                </Link>
                                <p className="text-sm text-gray-500 mt-1">
                                    作者：
                                    <Link href={`/blog/users/${post.id}`} className="text-gray-700 hover:underline">
                                        {author ? author.name : "未知"}
                                    </Link>
                                </p>
                            </li>
                        );
                    })}
                </ul>
            ) : (
                <p className="text-gray-500">❌ 該用戶沒有發表任何文章</p>
            )}
        </div>
    );
}
