import { avatar } from "@/app/data/blog/users";
import { blogPosts } from "@/app/data/blog/blogPosts";
import Link from "next/link";
const posts = blogPosts;
const users = avatar;

export default function PostPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">
        技術文章<span className="text-2xl text-slate-500">{posts.length}</span>
      </h1>
      <div className="grid gap-4">
        {posts.map((post) => {
          const user = users[post.userId - 1];
          return (
            <div key={post.id} className="p-4 shadow-sm rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <img
                  src={user.avatar}
                  alt={`User ${post.userId}'s avatar`}
                  className="w-10 h-10 rounded-full"
                />
                <Link href={`/blog/users/${post.userId}`}>
                  <span className="text-gray-600
                  hover:bg-red-300">
                    {user.name}
                  </span>
                </Link>
                </div>
                <Link href={`/blog/post/${post.id}`}>
                  <span className="text-gray-600
                  hover:bg-yellow-300">
                    文章#{`${post.id}:${post.title}`}
                  </span>
                </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}