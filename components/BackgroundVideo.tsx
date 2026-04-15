"use client";

import { useEffect, useRef, useCallback, useState } from "react";

const MV_LIST = [
  { id: "ony539T074w", title: "King Gnu - 白日" },
  { id: "TQ8WlA2GXbk", title: "Official髭男dism - Pretender" },
  { id: "PDSkFeMVNFs", title: "RADWIMPS - 前前前世" },
  { id: "Jy-QS27q7lA", title: "Mrs. GREEN APPLE - ケセラセラ" },
  { id: "Hh9yZWeTmVM", title: "ONE OK ROCK - The Beginning" },
  { id: "j7CDb610Bg0", title: "BUMP OF CHICKEN - 天体観測" },
  { id: "SII-S-zCg-c", title: "back number - 高嶺の花子さん" },
];

function getRandomVideo(excludeId?: string) {
  const filtered = excludeId
    ? MV_LIST.filter((v) => v.id !== excludeId)
    : MV_LIST;
  return filtered[Math.floor(Math.random() * filtered.length)];
}

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export default function BackgroundVideo() {
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentVideo, setCurrentVideo] = useState(() => getRandomVideo());
  const [isReady, setIsReady] = useState(false);

  const loadVideo = useCallback(
    (videoId: string) => {
      if (playerRef.current && playerRef.current.loadVideoById) {
        playerRef.current.loadVideoById({
          videoId,
          suggestedQuality: "hd720",
        });
      }
    },
    []
  );

  const onPlayerStateChange = useCallback(
    (event: any) => {
      // YT.PlayerState.ENDED === 0
      if (event.data === 0) {
        const next = getRandomVideo(currentVideo.id);
        setCurrentVideo(next);
        loadVideo(next.id);
      }
    },
    [currentVideo.id, loadVideo]
  );

  useEffect(() => {
    // YouTube IFrame API を読み込み
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScript = document.getElementsByTagName("script")[0];
      firstScript.parentNode?.insertBefore(tag, firstScript);
    }

    const initPlayer = () => {
      if (!containerRef.current) return;

      playerRef.current = new window.YT.Player(containerRef.current, {
        videoId: currentVideo.id,
        playerVars: {
          autoplay: 1,
          mute: 1,
          controls: 0,
          showinfo: 0,
          rel: 0,
          loop: 0,
          modestbranding: 1,
          iv_load_policy: 3,
          disablekb: 1,
          playsinline: 1,
        },
        events: {
          onReady: (event: any) => {
            event.target.playVideo();
            setIsReady(true);
          },
          onStateChange: onPlayerStateChange,
        },
      });
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      window.onYouTubeIframeAPIReady = initPlayer;
    }

    return () => {
      if (playerRef.current && playerRef.current.destroy) {
        playerRef.current.destroy();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // onPlayerStateChange の更新を反映
  useEffect(() => {
    if (playerRef.current && playerRef.current.addEventListener) {
      playerRef.current.addEventListener("onStateChange", onPlayerStateChange);
    }
  }, [onPlayerStateChange]);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* YouTube Player */}
      <div
        className={`absolute inset-0 transition-opacity duration-1000 ${
          isReady ? "opacity-100" : "opacity-0"
        }`}
        style={{
          // 動画をアスペクト比を維持しつつ画面全体を覆うように拡大
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "177.78vh", // 16:9 ratio
          height: "100vh",
          minWidth: "100vw",
          minHeight: "56.25vw",
        }}
      >
        <div ref={containerRef} className="w-full h-full" />
      </div>

      {/* ダークオーバーレイ */}
      <div className="absolute inset-0 bg-black/60" />

      {/* 再生中の曲名 */}
      {isReady && (
        <div className="absolute bottom-4 right-4 rounded-full bg-white/10 backdrop-blur-sm px-3 py-1.5 text-xs text-white/60">
          Now Playing: {currentVideo.title}
        </div>
      )}
    </div>
  );
}
