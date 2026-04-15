"use client";

import { login } from "./actions";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    try {
      const result = await login(formData);
      if (result?.error) {
        setError(result.error);
        setLoading(false);
      } else {
        router.push("/");
        router.refresh();
      }
    } catch (e) {
      setError("ログインに失敗しました。もう一度試してね！");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
      <div className="w-full max-w-md glass-strong rounded-2xl p-8">
        <h1 className="mb-2 text-center text-3xl font-bold text-white">
          ログイン
        </h1>
        <p className="mb-8 text-center text-white/50">
          MusicShare にログインしよう
        </p>

        {error && (
          <div className="mb-4 rounded-lg bg-red-500/20 border border-red-500/30 p-3 text-sm text-red-300">
            {error}
          </div>
        )}

        <form action={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-white/70"
            >
              メールアドレス
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="mt-1 block w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-white/30 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
              placeholder="example@email.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-white/70"
            >
              パスワード
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="mt-1 block w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-white/30 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
              placeholder="6文字以上"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-purple-500/80 px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 transition-colors"
          >
            {loading ? "ログイン中..." : "ログイン"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-white/40">
          アカウントがない？{" "}
          <Link
            href="/signup"
            className="font-semibold text-purple-400 hover:text-purple-300"
          >
            サインアップ
          </Link>
        </p>
      </div>
    </div>
  );
}
