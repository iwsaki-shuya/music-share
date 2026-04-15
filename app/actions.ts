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

export async function deletePost(postId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "ログインが必要だよ！" };
  }

  const { error } = await supabase
    .from("posts")
    .delete()
    .eq("id", postId)
    .eq("user_id", user.id);

  if (error) {
    return { error: "削除に失敗しました" };
  }

  revalidatePath("/");
  return { success: true };
}

export async function updatePost(postId: string, formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "ログインが必要だよ！" };
  }

  const title = formData.get("title") as string;
  const artist = formData.get("artist") as string;
  const genre = formData.get("genre") as string;
  const comment = formData.get("comment") as string;
  const url = (formData.get("url") as string) || null;

  if (!title || !artist || !genre || !comment) {
    return { error: "URL以外の項目は全部入力してね！" };
  }

  const { error } = await supabase
    .from("posts")
    .update({ title, artist, genre, comment, url })
    .eq("id", postId)
    .eq("user_id", user.id);

  if (error) {
    return { error: "更新に失敗しました" };
  }

  revalidatePath("/");
  return { success: true };
}
