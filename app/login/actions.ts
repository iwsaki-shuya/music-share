"use server";

import { createClient } from "@/lib/supabase/server";

export async function login(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "メールアドレスとパスワードを入力してね！" };
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    if (error.message.includes("Email not confirmed")) {
      return { error: "メールアドレスの確認が完了してないよ！管理者にメール確認の無効化を依頼してね。" };
    }
    return { error: `ログインに失敗: ${error.message}` };
  }

  return { success: true };
}
