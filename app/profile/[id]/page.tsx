import { createClient } from "@/lib/supabase/server";
import PostCard from "@/components/PostCard";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ProfilePage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // プロフィール取得
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, username, avatar_url, created_at")
    .eq("id", id)
    .single();

  if (!profile) {
    notFound();
  }

  // そのユーザーの投稿を取得
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
    .eq("user_id", id)
    .order("created_at", { ascending: false });

  const joinDate = new Date(profile.created_at).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      {/* プロフィールヘッダー */}
      <div className="mb-8 rounded-xl bg-white p-6 shadow-sm border border-gray-100 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-purple-400 to-pink-400 text-3xl font-bold text-white">
          {profile.username.charAt(0).toUpperCase()}
        </div>
        <h1 className="mt-4 text-2xl font-bold text-gray-900">
          {profile.username}
        </h1>
        <p className="mt-1 text-sm text-gray-500">{joinDate} から参加</p>
        <div className="mt-3 flex justify-center gap-6 text-sm">
          <div>
            <span className="font-bold text-gray-900">
              {posts?.length ?? 0}
            </span>
            <span className="ml-1 text-gray-500">投稿</span>
          </div>
        </div>
      </div>

      {/* 投稿一覧 */}
      <h2 className="mb-4 text-lg font-bold text-gray-900">投稿一覧</h2>

      {!posts || posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-4xl mb-3">🎶</p>
          <p className="text-gray-500">まだ投稿がないよ</p>
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
