"use client";

import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { User } from "@supabase/supabase-js";

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const supabaseRef = useRef<ReturnType<typeof createClient> | null>(null);

  function getSupabase() {
    if (!supabaseRef.current) {
      supabaseRef.current = createClient();
    }
    return supabaseRef.current;
  }

  useEffect(() => {
    const supabase = getSupabase();

    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await getSupabase().auth.signOut();
    router.refresh();
  };

  return (
    <nav className="sticky top-0 z-50 glass border-b border-white/10">
      <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4">
        <Link
          href="/"
          className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
        >
          MusicShare
        </Link>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link
                href="/posts/new"
                className="rounded-lg bg-purple-500/80 px-4 py-2 text-sm font-bold text-white hover:bg-purple-500 transition-colors backdrop-blur-sm"
              >
                + 投稿する
              </Link>
              <Link
                href={`/profile/${user.id}`}
                className="rounded-lg px-3 py-2 text-sm font-medium text-white/80 hover:bg-white/10 transition-colors"
              >
                マイページ
              </Link>
              <button
                onClick={handleLogout}
                className="rounded-lg px-3 py-2 text-sm font-medium text-white/50 hover:bg-white/10 hover:text-white/80 transition-colors"
              >
                ログアウト
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-lg px-4 py-2 text-sm font-medium text-white/80 hover:bg-white/10 transition-colors"
              >
                ログイン
              </Link>
              <Link
                href="/signup"
                className="rounded-lg bg-purple-500/80 px-4 py-2 text-sm font-bold text-white hover:bg-purple-500 transition-colors backdrop-blur-sm"
              >
                サインアップ
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
