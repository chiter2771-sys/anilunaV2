"use client";

import { useEffect, useMemo, useState } from "react";

function AnimeCard({ anime }: { anime: any }) {
  const poster = anime?.material_data?.poster_url;
  const title = anime?.title || anime?.material_data?.title || "Без названия";
  const score = anime?.material_data?.shikimori_rating || anime?.material_data?.score || "—";
  const episodes = anime?.material_data?.episodes_total || anime?.material_data?.episodes_aired || anime?.episodes_count || "?";
  return (
    <a href={`/anime/${anime?.shikimori_id}`} className="group rounded-2xl overflow-hidden bg-moon-900/60 border border-moon-800/60 hover:border-lunar/40 hover:-translate-y-1 transition-all duration-300">
      <div className="aspect-3/4 bg-moon-800">{poster ? <img src={poster} alt={title} className="w-full h-full object-cover" /> : null}</div>
      <div className="p-3"><h3 className="text-sm text-moon-100 font-semibold line-clamp-2">{title}</h3><p className="text-xs text-moon-300 mt-1">⭐ {score} · Эпизоды: {episodes}</p></div>
    </a>
  );
}

function GridSkeleton() { return <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">{Array.from({ length: 12 }).map((_, i) => <div key={i} className="rounded-2xl bg-moon-900/60 border border-moon-800/60 animate-pulse"><div className="aspect-3/4 bg-moon-800" /><div className="p-3 space-y-2"><div className="h-4 bg-moon-800 rounded" /><div className="h-3 bg-moon-800 rounded w-2/3" /></div></div>)}</div>; }

export default function Home() {
  const [items, setItems] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/kodik?type=list&limit=20&order=shikimori_rating&sort=desc");
        const data: any = await res.json();
        if (!res.ok || data?.error) throw new Error(data?.error || "Ошибка загрузки списка");
        setItems(data?.results || []);
      } catch (e: any) { setError(e?.message || "Ошибка сети"); }
      finally { setLoading(false); }
    })();
  }, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.trim().length < 2) return setSuggestions([]);
      try {
        const res = await fetch(`/api/kodik?type=search&title=${encodeURIComponent(query)}&limit=8`);
        const data: any = await res.json();
        setSuggestions(data?.results || []);
      } catch { setSuggestions([]); }
    }, 250);
    return () => clearTimeout(timer);
  }, [query]);

  const shown = useMemo(() => (query.trim() ? suggestions : items), [query, suggestions, items]);

  return <main className="container mx-auto px-4 py-8">{/* UI unchanged */}
    <nav className="flex flex-wrap gap-3 items-center justify-between py-4 border-b border-moon-800/50"><h1 className="text-2xl font-bold bg-linear-to-r from-lunar to-lunar-glow bg-clip-text text-transparent">🌙 AniLuna</h1><div className="flex gap-5 text-moon-300 text-sm md:text-base"><a href="/catalog" className="hover:text-lunar">Каталог</a><a href="/ongoing" className="hover:text-lunar">Онгоинги</a><a href="/popular" className="hover:text-lunar">Популярное</a></div></nav>
    <section className="mt-6"><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Поиск по названию..." className="w-full rounded-xl bg-moon-900/70 border border-moon-700/50 px-4 py-3" /></section>
    {error ? <div className="mt-6 p-4 rounded-xl bg-red-900/20 border border-red-500/40 text-red-300">⚠️ {error}</div> : null}
    <section className="mt-8"><h2 className="text-xl font-semibold text-lunar mb-4">🔥 Популярное</h2>{loading ? <GridSkeleton /> : <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">{shown.map((anime: any) => <AnimeCard key={anime?.id || anime?.link} anime={anime} />)}</div>}</section>
  </main>;
}
