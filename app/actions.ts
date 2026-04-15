"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function toggleLike(postId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "ログインが必要だよ！" };
  }

  // いいね済みかチェック
  const { data: existingLike } = await supabase
    .from("likes")
    .select("id")
    .eq("user_id", user.id)
    .eq("post_id", postId)
    .single();

  if (existingLike) {
    // いいね取消
    await supabase.from("likes").delete().eq("id", existingLike.id);
  } else {
    // いいね追加
    await supabase.from("likes").insert({
      user_id: user.id,
      post_id: postId,
    });
  }

  revalidatePath("/");
}
