const KODIK_API_KEY = process.env.KODIK_API_KEY!;
const KODIK_BASE = "https://kodikapi.com";

const headers = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Accept": "application/json",
};

export async function searchAnime(query: string) {
  const res = await fetch(
    `${KODIK_BASE}/search?token=${KODIK_API_KEY}&title=${encodeURIComponent(query)}&limit=20`,
    { headers }
  );
  const data: any = await res.json();
  return data.results ?? [];
}

export async function getAnimeByShikimori(shikimoriId: number) {
  const res = await fetch(
    `${KODIK_BASE}/search?token=${KODIK_API_KEY}&shikimori_id=${shikimoriId}`,
    { headers }
  );
  const data: any = await res.json();
  return data.results ?? [];
}

export async function getPopularAnime() {
  const res = await fetch(
    `${KODIK_BASE}/list?token=${KODIK_API_KEY}&limit=20&order=shikimori_rating&sort=desc`,
    { headers }
  );
  const data: any = await res.json();
  return data.results ?? [];
}

export function getKodikPlayerUrl(link: string) {
  if (link.startsWith("//")) return `https:${link}`;
  return link;
}
