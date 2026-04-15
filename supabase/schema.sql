-- ========================================
-- MusicShare データベーススキーマ
-- Supabase の SQL Editor にコピペして実行してね！
-- ========================================

-- プロフィールテーブル
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  username text not null,
  avatar_url text,
  created_at timestamp with time zone default now() not null
);

-- 音楽投稿テーブル
create table posts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  title text not null,
  artist text not null,
  genre text not null,
  comment text not null,
  url text,
  created_at timestamp with time zone default now() not null
);

-- いいねテーブル
create table likes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  post_id uuid references posts(id) on delete cascade not null,
  created_at timestamp with time zone default now() not null,
  unique(user_id, post_id)
);

-- インデックス（パフォーマンス向上）
create index posts_user_id_idx on posts(user_id);
create index posts_created_at_idx on posts(created_at desc);
create index likes_post_id_idx on likes(post_id);
create index likes_user_id_idx on likes(user_id);

-- RLS (Row Level Security) を有効化
alter table profiles enable row level security;
alter table posts enable row level security;
alter table likes enable row level security;

-- profiles のポリシー
create policy "誰でもプロフィールを閲覧可能" on profiles
  for select using (true);

create policy "自分のプロフィールのみ更新可能" on profiles
  for update using (auth.uid() = id);

create policy "認証済みユーザーはプロフィールを作成可能" on profiles
  for insert with check (auth.uid() = id);

-- posts のポリシー
create policy "誰でも投稿を閲覧可能" on posts
  for select using (true);

create policy "認証済みユーザーは投稿可能" on posts
  for insert with check (auth.uid() = user_id);

create policy "自分の投稿のみ削除可能" on posts
  for delete using (auth.uid() = user_id);

-- likes のポリシー
create policy "誰でもいいねを閲覧可能" on likes
  for select using (true);

create policy "認証済みユーザーはいいね可能" on likes
  for insert with check (auth.uid() = user_id);

create policy "自分のいいねのみ取消可能" on likes
  for delete using (auth.uid() = user_id);

-- サインアップ時に自動でプロフィールを作成するトリガー
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username)
  values (new.id, coalesce(new.raw_user_meta_data->>'username', 'ユーザー'));
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
