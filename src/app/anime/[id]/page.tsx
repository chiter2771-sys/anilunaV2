"use client";

export const runtime = "edge";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";

export default function AnimePage() {
  const { id } = useParams();
  const [anime, setAnime] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const key = `aniluna_saved_${id}`;
    setSaved(localStorage.getItem(key) === "1");
  }, [id]);

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

  const anime = variants[selected] || variants[0] || null;
  const title = anime?.title || anime?.material_data?.title || "Аниме";
  const description = anime?.material_data?.description || "Описание отсутствует.";
  const playerUrl = anime?.link ? (anime.link.startsWith("//") ? `https:${anime.link}` : anime.link) : "";
  const episodes = anime?.episodes_count || anime?.material_data?.episodes_total || anime?.material_data?.episodes_aired || 0;

  const seasons = useMemo(() => Array.from(new Set(variants.map((v: any) => v?.season).filter(Boolean))), [variants]);

  const toggleSaved = () => {
    const key = `aniluna_saved_${id}`;
    const next = !saved;
    setSaved(next);
    localStorage.setItem(key, next ? "1" : "0");
  };

  if (loading) return <main className="container mx-auto px-4 py-8 text-moon-300">Загрузка...</main>;
  if (error) return <main className="container mx-auto px-4 py-8 text-red-300">{error}</main>;

  return (
    <main className="w-full min-h-screen px-3 md:px-8 py-6">
      <a href="/" className="text-lunar hover:text-lunar-glow">← На главную</a>
      <section className="mt-4 rounded-2xl overflow-hidden border border-moon-700/40 bg-moon-950">
        {playerUrl ? <iframe src={playerUrl} className="w-full h-[50vh] md:h-[70vh]" allowFullScreen allow="autoplay; fullscreen" /> : <div className="h-[50vh] flex items-center justify-center">Плеер недоступен</div>}
      </section>

      <section className="grid lg:grid-cols-[280px_1fr] gap-6 mt-6">
        <div>
          {anime?.material_data?.poster_url ? <img src={anime.material_data.poster_url} alt={title} className="w-full rounded-xl border border-moon-800/50" /> : null}
          <button onClick={toggleSaved} className="mt-3 w-full rounded-xl bg-moon-800 hover:bg-moon-700 transition-colors px-4 py-2">{saved ? "★ В избранном" : "☆ Смотреть позже / В избранное"}</button>
        </div>
        <div>
          <h1 className="text-3xl font-bold text-lunar-glow">{title}</h1>
          <p className="text-moon-300 mt-3">{description}</p>
          <p className="text-moon-300 mt-3">Статус: {anime?.material_data?.anime_status || "—"} · Рейтинг: {anime?.material_data?.shikimori_rating || anime?.material_data?.score || "—"}</p>
          <div className="flex flex-wrap gap-2 mt-3">{(anime?.material_data?.anime_genre || []).map((g: string) => <span key={g} className="text-xs bg-moon-800/60 rounded-full px-2 py-1">{g}</span>)}</div>

          {variants.length > 1 ? (
            <div className="mt-5 grid md:grid-cols-2 gap-3">
              <select value={selected} onChange={(e) => setSelected(Number(e.target.value))} className="rounded-xl bg-moon-900/70 border border-moon-700/50 px-3 py-2">
                {variants.map((v: any, idx: number) => <option key={`${v?.id}_${idx}`} value={idx}>{v?.translation?.title || v?.title || `Вариант ${idx + 1}`}</option>)}
              </select>
              <select className="rounded-xl bg-moon-900/70 border border-moon-700/50 px-3 py-2" value={anime?.season || ""} onChange={(e) => {
                const idx = variants.findIndex((v: any) => String(v?.season || "") === e.target.value);
                if (idx >= 0) setSelected(idx);
              }}>
                <option value="">Сезон</option>
                {seasons.map((s: any) => <option key={String(s)} value={String(s)}>{String(s)}</option>)}
              </select>
            </div>
          ) : null}

          {Number(episodes) > 1 ? <p className="mt-4 text-moon-200">Список эпизодов: доступно {episodes} серий в плеере Kodik.</p> : null}
        </div>
      </section>
    </main>
  );
}
