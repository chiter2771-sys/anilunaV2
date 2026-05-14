"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

export default function AnimePage() {
  const { id } = useParams();
  const [anime, setAnime] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_KODIK_API_KEY;
    if (!apiKey || !id) return;
    fetch(`https://kodikapi.com/search?token=${apiKey}&shikimori_id=${id}`)
      .then((res) => res.json())
      .then((data) => {
        setAnime(data.results?.[0] || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const title = anime?.title || anime?.material_data?.title || "Аниме";
  const description = anime?.material_data?.description || "";
  const poster = anime?.material_data?.poster_url || "";
  const link = anime?.link || "";
  const playerUrl = link ? (link.startsWith("//") ? `https:${link}` : link) : "";

  if (loading) {
    return (
      <main className="container mx-auto px-4 py-8">
        <p className="text-moon-400">Загрузка...</p>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <a href="/" className="text-lunar hover:text-lunar-glow transition-colors">← Назад</a>
      <div className="mt-6 flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          <div className="rounded-xl overflow-hidden border border-moon-800/40 bg-moon-950">
            {playerUrl ? (
              <iframe src={playerUrl} className="w-full aspect-video" allowFullScreen allow="autoplay; fullscreen" />
            ) : (
              <div className="w-full aspect-video flex items-center justify-center text-moon-400">Плеер недоступен</div>
            )}
          </div>
        </div>
        <div className="lg:w-80">
          {poster && <img src={poster} alt={title} className="w-full rounded-xl border border-moon-800/40" />}
          <h1 className="text-2xl font-bold text-lunar-glow mt-4">{title}</h1>
          {description && <p className="text-moon-300 text-sm mt-2">{description}</p>}
          {anime?.material_data?.anime_genre && (
            <div className="flex flex-wrap gap-2 mt-3">
              {anime.material_data.anime_genre.map((g: string) => (
                <span key={g} className="text-xs bg-moon-800/60 text-moon-200 px-2 py-1 rounded-full">{g}</span>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
