"use client";

import { deletePost } from "@/app/actions";
import { useRouter } from "next/navigation";
import { useState } from "react";

type PostActionsProps = {
  postId: string;
};

export default function PostActions({ postId }: PostActionsProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    setDeleting(true);
    try {
      const result = await deletePost(postId);
      if (result?.error) {
        alert(result.error);
      } else {
        router.refresh();
      }
    } catch {
      alert("削除に失敗しました");
    }
    setDeleting(false);
    setShowConfirm(false);
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => router.push(`/posts/${postId}/edit`)}
        className="rounded-full px-3 py-1.5 text-xs font-medium bg-white/5 text-white/40 border border-white/10 hover:bg-white/10 hover:text-white/60 transition-colors"
      >
        編集
      </button>

      {!showConfirm ? (
        <button
          onClick={() => setShowConfirm(true)}
          className="rounded-full px-3 py-1.5 text-xs font-medium bg-white/5 text-white/40 border border-white/10 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30 transition-colors"
        >
          削除
        </button>
      ) : (
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="rounded-full px-3 py-1.5 text-xs font-medium bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 transition-colors disabled:opacity-50"
          >
            {deleting ? "削除中..." : "本当に削除"}
          </button>
          <button
            onClick={() => setShowConfirm(false)}
            className="rounded-full px-3 py-1.5 text-xs font-medium bg-white/5 text-white/40 border border-white/10 hover:bg-white/10 transition-colors"
          >
            やめる
          </button>
        </div>
      )}
    </div>
  );
}
