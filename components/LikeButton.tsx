"use client";

import { toggleLike } from "@/app/actions";
import { useState } from "react";

type LikeButtonProps = {
  postId: string;
  initialLiked: boolean;
  initialCount: number;
};

export default function LikeButton({
  postId,
  initialLiked,
  initialCount,
}: LikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    setLiked(!liked);
    setCount(liked ? count - 1 : count + 1);

    const result = await toggleLike(postId);
    if (result?.error) {
      setLiked(liked);
      setCount(count);
    }
    setLoading(false);
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
        liked
          ? "bg-pink-500/20 text-pink-400 border border-pink-500/30"
          : "bg-white/5 text-white/40 border border-white/10 hover:bg-white/10 hover:text-white/60"
      }`}
    >
      <span>{liked ? "♥" : "♡"}</span>
      <span>{count}</span>
    </button>
  );
}
