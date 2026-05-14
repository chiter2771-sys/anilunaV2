"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [animes, setAnimes] = useState<any[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_KODIK_API_KEY;
    if (!apiKey) {
      setError("API ключ не найден! Добавьте NEXT_PUBLIC_KODIK_API_KEY в .env.local");
      return;
    }
    fetch(`https://kodikapi.com/list?token=${apiKey}&limit=20&order=shikimori_rating&sort=desc`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(`Ошибка API: ${data.error}`);
        } else {
          setAnimes(data.results ?? []);
        }
      })
      .catch((e) => setError(`Ошибка запроса: ${e.message}`));
  }, []);

  return (
    <main className="container mx-auto px-4 py-8">
      <nav className="flex items-center justify-between py-4 border-b border-moon-800/50">
        <h1 className="text-2xl font-bold bg-linear-to-r from-lunar to-lunar-glow bg-clip-text text-transparent">
          🌙 AniLuna
        </h1>
        <div className="flex gap-6 text-moon-300">
          <a href="/catalog" className="hover:text-lunar transition-colors">Каталог</a>
          <a href="/ongoing" className="hover:text-lunar transition-colors">Онгоинги</a>
          <a href="/popular" className="hover:text-lunar transition-colors">Популярное</a>
        </div>
      </nav>

      <section className="mt-8 rounded-2xl bg-linear-to-r from-moon-800/60 to-moon-900/60 border border-moon-700/30 p-8 backdrop-blur-sm">
        <h2 className="text-4xl font-bold text-lunar-glow">Смотри аниме. Без ограничений.</h2>
        <p className="mt-2 text-moon-300">Тысячи тайтлов, озвучка, субтитры — всё в одном месте</p>
      </section>

      {error && (
        <div className="mt-6 p-4 rounded-xl bg-red-900/30 border border-red-500/30 text-red-300">
          ⚠️ {error}
        </div>
      )}

      <section className="mt-10">
        <h3 className="text-xl font-semibold text-lunar mb-4">🔥 Популярное</h3>
        {animes.length === 0 && !error && (
          <p className="text-moon-400">Загрузка...</p>
        )}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {animes.map((anime: any) => {
            const poster = anime.material_data?.poster_url;
            const title = anime.title || anime.material_data?.title || "Без названия";
            const score = anime.material_data?.score || "—";
            const episodes = anime.material_data?.episodes || "?";
            const animeType = anime.type || "TV";
            return (
              <a key={anime.id} href={`/anime/${anime.shikimori_id}`}
                className="group cursor-pointer rounded-xl overflow-hidden bg-moon-900/50 border border-moon-800/40 hover:border-lunar/30 hover:shadow-lg hover:shadow-moon-500/10 transition-all duration-300">
                <div className="aspect-3/4 bg-moon-800 relative overflow-hidden">
                  {poster && <img src={poster} alt={title} className="w-full h-full object-cover" />}
                  <div className="absolute inset-0 bg-linear-to-t from-moon-950/80 to-transparent" />
                  <div className="absolute bottom-2 left-2">
                    <span className="text-xs bg-moon-500/80 px-2 py-0.5 rounded-full">{animeType}</span>
                  </div>
                </div>
                <div className="p-3">
                  <h4 className="text-sm font-medium text-moon-100 group-hover:text-lunar transition-colors line-clamp-2">{title}</h4>
                  <p className="text-xs text-moon-400 mt-1">⭐ {score} • Эпизоды: {episodes}</p>
                </div>
              </a>
            );
          })}
        </div>
      </section>
    </main>
  );
}
