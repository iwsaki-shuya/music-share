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
  "J-POP": "bg-blue-100 text-blue-700",
  "K-POP": "bg-pink-100 text-pink-700",
  ロック: "bg-red-100 text-red-700",
  ヒップホップ: "bg-yellow-100 text-yellow-700",
  "R&B": "bg-purple-100 text-purple-700",
  EDM: "bg-cyan-100 text-cyan-700",
  クラシック: "bg-amber-100 text-amber-700",
  ジャズ: "bg-orange-100 text-orange-700",
  アニソン: "bg-green-100 text-green-700",
  ボカロ: "bg-teal-100 text-teal-700",
  洋楽POP: "bg-indigo-100 text-indigo-700",
  インディーズ: "bg-violet-100 text-violet-700",
  メタル: "bg-slate-100 text-slate-700",
  レゲエ: "bg-lime-100 text-lime-700",
  その他: "bg-gray-100 text-gray-700",
};

export default function PostCard({ post, currentUserId }: PostCardProps) {
  const likeCount = post.likes.length;
  const isLiked = currentUserId
    ? post.likes.some((like) => like.user_id === currentUserId)
    : false;

  const genreColor = GENRE_COLORS[post.genre] || "bg-gray-100 text-gray-700";

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
            src={`https://open.spotify.com/embed/${spotifyInfo.type}/${spotifyInfo.id}`}
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
          className="mt-3 inline-block text-sm text-purple-600 hover:text-purple-500 underline"
        >
          リンクを開く
        </a>
      );
    }
  }

  return (
    <article className="rounded-xl bg-white p-5 shadow-sm border border-gray-100 transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Link
              href={`/profile/${post.profiles.id}`}
              className="text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors"
            >
              {post.profiles.username}
            </Link>
            <span className="text-xs text-gray-400">
              {formatDate(post.created_at)}
            </span>
          </div>

          <h2 className="text-lg font-bold text-gray-900">{post.title}</h2>
          <p className="text-sm text-gray-600">{post.artist}</p>

          <div className="mt-2 flex items-center gap-2">
            <span
              className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${genreColor}`}
            >
              {post.genre}
            </span>
          </div>

          <p className="mt-3 text-sm text-gray-700 leading-relaxed">
            {post.comment}
          </p>

          {embedContent}
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3 border-t border-gray-100 pt-3">
        <LikeButton
          postId={post.id}
          initialLiked={isLiked}
          initialCount={likeCount}
        />
      </div>
    </article>
  );
}
