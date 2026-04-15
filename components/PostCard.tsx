import Link from "next/link";
import LikeButton from "./LikeButton";

type PostCardProps = {
  post: {
    id: string;
    title: string;
    artist: string;
    genre: string;
    comment: string;
    url: string | null;
    created_at: string;
    profiles: {
      id: string;
      username: string;
    };
    likes: { user_id: string }[];
  };
  currentUserId: string | null;
};

function getYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : null;
}

function getSpotifyId(url: string): { type: string; id: string } | null {
  const match = url.match(
    /spotify\.com\/(track|album|playlist)\/([a-zA-Z0-9]+)/
  );
  return match ? { type: match[1], id: match[2] } : null;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "たった今";
  if (minutes < 60) return `${minutes}分前`;
  if (hours < 24) return `${hours}時間前`;
  if (days < 7) return `${days}日前`;
  return date.toLocaleDateString("ja-JP");
}

const GENRE_COLORS: Record<string, string> = {
  "J-POP": "bg-blue-500/20 text-blue-300 border-blue-500/30",
  "K-POP": "bg-pink-500/20 text-pink-300 border-pink-500/30",
  ロック: "bg-red-500/20 text-red-300 border-red-500/30",
  ヒップホップ: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  "R&B": "bg-purple-500/20 text-purple-300 border-purple-500/30",
  EDM: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  クラシック: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  ジャズ: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  アニソン: "bg-green-500/20 text-green-300 border-green-500/30",
  ボカロ: "bg-teal-500/20 text-teal-300 border-teal-500/30",
  洋楽POP: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
  インディーズ: "bg-violet-500/20 text-violet-300 border-violet-500/30",
  メタル: "bg-slate-500/20 text-slate-300 border-slate-500/30",
  レゲエ: "bg-lime-500/20 text-lime-300 border-lime-500/30",
  その他: "bg-gray-500/20 text-gray-300 border-gray-500/30",
};

export default function PostCard({ post, currentUserId }: PostCardProps) {
  const likeCount = post.likes.length;
  const isLiked = currentUserId
    ? post.likes.some((like) => like.user_id === currentUserId)
    : false;

  const genreColor =
    GENRE_COLORS[post.genre] || "bg-gray-500/20 text-gray-300 border-gray-500/30";

  let embedContent = null;
  if (post.url) {
    const youtubeId = getYouTubeId(post.url);
    const spotifyInfo = getSpotifyId(post.url);

    if (youtubeId) {
      embedContent = (
        <div className="mt-3 overflow-hidden rounded-lg">
          <iframe
            width="100%"
            height="200"
            src={`https://www.youtube.com/embed/${youtubeId}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="border-0"
          />
        </div>
      );
    } else if (spotifyInfo) {
      embedContent = (
        <div className="mt-3 overflow-hidden rounded-lg">
          <iframe
            src={`https://open.spotify.com/embed/${spotifyInfo.type}/${spotifyInfo.id}?theme=0`}
            width="100%"
            height="152"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            className="border-0"
          />
        </div>
      );
    } else {
      embedContent = (
        <a
          href={post.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-block text-sm text-purple-400 hover:text-purple-300 underline"
        >
          リンクを開く
        </a>
      );
    }
  }

  return (
    <article className="glass-strong rounded-xl p-5 transition-all hover:bg-black/50">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Link
              href={`/profile/${post.profiles.id}`}
              className="text-sm font-medium text-white/70 hover:text-purple-400 transition-colors"
            >
              {post.profiles.username}
            </Link>
            <span className="text-xs text-white/30">
              {formatDate(post.created_at)}
            </span>
          </div>

          <h2 className="text-lg font-bold text-white">{post.title}</h2>
          <p className="text-sm text-white/60">{post.artist}</p>

          <div className="mt-2 flex items-center gap-2">
            <span
              className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${genreColor}`}
            >
              {post.genre}
            </span>
          </div>

          <p className="mt-3 text-sm text-white/80 leading-relaxed">
            {post.comment}
          </p>

          {embedContent}
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3 border-t border-white/10 pt-3">
        <LikeButton
          postId={post.id}
          initialLiked={isLiked}
          initialCount={likeCount}
        />
      </div>
    </article>
  );
}
