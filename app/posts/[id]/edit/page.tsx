"use client";

import { updatePost } from "@/app/actions";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const GENRES = [
  "J-POP",
  "K-POP",
  "ロック",
  "ヒップホップ",
  "R&B",
  "EDM",
  "クラシック",
  "ジャズ",
  "アニソン",
  "ボカロ",
  "洋楽POP",
  "インディーズ",
  "メタル",
  "レゲエ",
  "その他",
];

type Post = {
  id: string;
  title: string;
  artist: string;
  genre: string;
  comment: string;
  url: string | null;
  user_id: string;
};

export default function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [post, setPost] = useState<Post | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchPost() {
      const { id } = await params;
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const { data } = await supabase
        .from("posts")
        .select("id, title, artist, genre, comment, url, user_id")
        .eq("id", id)
        .single();

      if (!data || data.user_id !== user.id) {
        router.push("/");
        return;
      }

      setPost(data);
      setFetching(false);
    }
    fetchPost();
  }, [params, router]);

  async function handleSubmit(formData: FormData) {
    if (!post) return;
    setLoading(true);
    setError(null);
    try {
      const result = await updatePost(post.id, formData);
      if (result?.error) {
        setError(result.error);
        setLoading(false);
      } else {
        router.push("/");
        router.refresh();
      }
    } catch {
      setError("更新に失敗しました。もう一度試してね！");
      setLoading(false);
    }
  }

  if (fetching) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <p className="text-white/50">読み込み中...</p>
      </div>
    );
  }

  if (!post) return null;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="glass-strong rounded-2xl p-8">
        <h1 className="mb-8 text-2xl font-bold text-white">投稿を編集</h1>

        {error && (
          <div className="mb-4 rounded-lg bg-red-500/20 border border-red-500/30 p-3 text-sm text-red-300">
            {error}
          </div>
        )}

        <form action={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-white/70"
            >
              曲名 *
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              defaultValue={post.title}
              className="mt-1 block w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-white/30 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          </div>

          <div>
            <label
              htmlFor="artist"
              className="block text-sm font-medium text-white/70"
            >
              アーティスト *
            </label>
            <input
              id="artist"
              name="artist"
              type="text"
              required
              defaultValue={post.artist}
              className="mt-1 block w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-white/30 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          </div>

          <div>
            <label
              htmlFor="genre"
              className="block text-sm font-medium text-white/70"
            >
              ジャンル *
            </label>
            <select
              id="genre"
              name="genre"
              required
              defaultValue={post.genre}
              className="mt-1 block w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
            >
              {GENRES.map((genre) => (
                <option key={genre} value={genre} className="bg-gray-900">
                  {genre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="comment"
              className="block text-sm font-medium text-white/70"
            >
              ひとこと *
            </label>
            <textarea
              id="comment"
              name="comment"
              required
              rows={3}
              defaultValue={post.comment}
              className="mt-1 block w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-white/30 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          </div>

          <div>
            <label
              htmlFor="url"
              className="block text-sm font-medium text-white/70"
            >
              YouTube / Spotify のリンク（任意）
            </label>
            <input
              id="url"
              name="url"
              type="url"
              defaultValue={post.url ?? ""}
              className="mt-1 block w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-white/30 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-lg bg-purple-500/80 px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 transition-colors"
            >
              {loading ? "更新中..." : "更新する"}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="rounded-lg px-4 py-2.5 text-sm font-medium bg-white/5 text-white/60 border border-white/10 hover:bg-white/10 transition-colors"
            >
              キャンセル
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
