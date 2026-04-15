"use client";

import { createPost } from "./actions";
import { useState } from "react";

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

export default function NewPostPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    const result = await createPost(formData);
    if (result?.error) {
      setError(result.error);
    }
    setLoading(false);
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="glass-strong rounded-2xl p-8">
        <h1 className="mb-8 text-2xl font-bold text-white">
          好きな曲をシェアしよう
        </h1>

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
              className="mt-1 block w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-white/30 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
              placeholder="例: 夜に駆ける"
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
              className="mt-1 block w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-white/30 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
              placeholder="例: YOASOBI"
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
              className="mt-1 block w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
            >
              <option value="" className="bg-gray-900">ジャンルを選んでね</option>
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
              className="mt-1 block w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-white/30 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
              placeholder="この曲のおすすめポイントを書いてね！"
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
              className="mt-1 block w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-white/30 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
              placeholder="https://..."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-purple-500/80 px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 transition-colors"
          >
            {loading ? "投稿中..." : "投稿する"}
          </button>
        </form>
      </div>
    </div>
  );
}
