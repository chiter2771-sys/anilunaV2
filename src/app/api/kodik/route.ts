import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const token = process.env.NEXT_PUBLIC_KODIK_API_KEY;
  if (!token) {
    return NextResponse.json({ error: "NEXT_PUBLIC_KODIK_API_KEY is not configured" }, { status: 500 });
  }

  const type = req.nextUrl.searchParams.get("type") || "list";
  const title = req.nextUrl.searchParams.get("title") || "";
  const shikimoriId = req.nextUrl.searchParams.get("shikimori_id") || "";
  const limit = req.nextUrl.searchParams.get("limit") || "20";
  const order = req.nextUrl.searchParams.get("order") || "shikimori_rating";
  const sort = req.nextUrl.searchParams.get("sort") || "desc";

  const base = type === "search" ? "https://kodikapi.com/search" : "https://kodikapi.com/list";
  const url = new URL(base);
  url.searchParams.set("token", token);
  url.searchParams.set("limit", limit);

  if (type === "search") {
    if (title) url.searchParams.set("title", title);
    if (shikimoriId) url.searchParams.set("shikimori_id", shikimoriId);
  } else {
    url.searchParams.set("order", order);
    url.searchParams.set("sort", sort);
  }

  try {
    const res = await fetch(url.toString(), { headers: { Accept: "application/json" } });
    const data: any = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Proxy fetch failed" }, { status: 502 });
  }
}
