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
    // 楽観的更新
    setLiked(!liked);
    setCount(liked ? count - 1 : count + 1);

    const result = await toggleLike(postId);
    if (result?.error) {
      // エラー時は元に戻す
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
          ? "bg-pink-100 text-pink-600"
          : "bg-gray-100 text-gray-500 hover:bg-gray-200"
      }`}
    >
      <span>{liked ? "♥" : "♡"}</span>
      <span>{count}</span>
    </button>
  );
}
