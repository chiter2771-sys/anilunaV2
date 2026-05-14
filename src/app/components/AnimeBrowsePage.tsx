"use client";

import { useEffect, useMemo, useState } from "react";

export default function AnimeBrowsePage({ mode, title }: { mode: "catalog" | "ongoing" | "popular"; title: string }) {
  const apiKey = process.env.NEXT_PUBLIC_KODIK_API_KEY;
  const [items, setItems] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const [year, setYear] = useState("");
  const [genre, setGenre] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!apiKey) return;
      setLoading(true);
      const params: string[] = [`token=${apiKey}`, "limit=40"];
      if (mode === "popular") params.push("order=shikimori_rating", "sort=desc");
      if (mode === "ongoing") params.push("translation_type=voice");
      const res = await fetch(`https://kodikapi.com/list?${params.join("&")}`);
      const data: any = await res.json();
      setItems(data?.results || []);
      setLoading(false);
    };
    load();
  }, [apiKey, mode]);

  const genres = useMemo(() => {
    const set = new Set<string>();
    items.forEach((x: any) => (x?.material_data?.anime_genre || []).forEach((g: string) => set.add(g)));
    return Array.from(set).sort((a, b) => a.localeCompare(b, "ru"));
  }, [items]);

  const filtered = useMemo(() => {
    return items.filter((x: any) => {
      const name = `${x?.title || ""} ${x?.material_data?.title || ""}`.toLowerCase();
      const y = String(x?.material_data?.anime_year || x?.year || "");
      const gs = x?.material_data?.anime_genre || [];
      return (!query || name.includes(query.toLowerCase())) && (!year || y === year) && (!genre || gs.includes(genre));
    });
  }, [items, query, year, genre]);

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-lunar-glow">{title}</h1>
      <div className="grid md:grid-cols-3 gap-3 mt-5">
        <input placeholder="Поиск..." value={query} onChange={(e) => setQuery(e.target.value)} className="rounded-xl bg-moon-900/70 border border-moon-700/50 px-4 py-3" />
        <input placeholder="Год (например 2024)" value={year} onChange={(e) => setYear(e.target.value)} className="rounded-xl bg-moon-900/70 border border-moon-700/50 px-4 py-3" />
        <select value={genre} onChange={(e) => setGenre(e.target.value)} className="rounded-xl bg-moon-900/70 border border-moon-700/50 px-4 py-3">
          <option value="">Все жанры</option>
          {genres.map((g) => <option key={g} value={g}>{g}</option>)}
        </select>
      </div>
      {loading ? <p className="text-moon-300 mt-6">Загрузка каталога...</p> : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-6">
          {filtered.map((anime: any) => (
            <a key={anime?.id || anime?.link} href={`/anime/${anime?.shikimori_id}`} className="rounded-2xl overflow-hidden bg-moon-900/60 border border-moon-800/60 hover:-translate-y-1 transition-all">
              <div className="aspect-3/4 bg-moon-800">{anime?.material_data?.poster_url ? <img src={anime.material_data.poster_url} alt={anime?.title || "anime"} className="w-full h-full object-cover" /> : null}</div>
              <div className="p-3 text-xs text-moon-200">
                <p className="line-clamp-2 text-sm font-semibold">{anime?.title || anime?.material_data?.title || "Без названия"}</p>
                <p className="mt-1">⭐ {anime?.material_data?.shikimori_rating || anime?.material_data?.score || "—"}</p>
                <p>Эпизоды: {anime?.material_data?.episodes_total || anime?.material_data?.episodes_aired || "?"}</p>
              </div>
            </a>
          ))}
        </div>
      )}
    </main>
  );
}
