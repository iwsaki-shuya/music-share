import { createClient } from "@/lib/supabase/server";
import PostCard from "@/components/PostCard";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function Home() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: posts } = await supabase
    .from("posts")
    .select(
      `
      id,
      title,
      artist,
      genre,
      comment,
      url,
      created_at,
      profiles (id, username),
      likes (user_id)
    `
    )
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
          MusicShare
        </h1>
        <p className="mt-2 text-white/50">
          好きな音楽をみんなとシェアしよう
        </p>
      </div>

      {!posts || posts.length === 0 ? (
        <div className="text-center py-16 glass-strong rounded-2xl">
          <p className="text-5xl mb-4">🎵</p>
          <p className="text-white/60 text-lg">まだ投稿がないよ！</p>
          {user ? (
            <Link
              href="/posts/new"
              className="mt-4 inline-block rounded-lg bg-purple-500/80 px-6 py-2.5 text-sm font-bold text-white hover:bg-purple-500 transition-colors"
            >
              最初の投稿をしよう
            </Link>
          ) : (
            <Link
              href="/signup"
              className="mt-4 inline-block rounded-lg bg-purple-500/80 px-6 py-2.5 text-sm font-bold text-white hover:bg-purple-500 transition-colors"
            >
              サインアップして投稿しよう
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post as any}
              currentUserId={user?.id ?? null}
            />
          ))}
        </div>
      )}
    </div>
  );
}
