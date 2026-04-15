"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function createPost(formData: FormData) {
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

  const { error } = await supabase.from("posts").insert({
    user_id: user.id,
    title,
    artist,
    genre,
    comment,
    url,
  });

  if (error) {
    return { error: "投稿に失敗しちゃった...もう一回試してみて！" };
  }

  redirect("/");
}
