import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = process.env.KODIK_API_KEY || process.env.NEXT_PUBLIC_KODIK_API_KEY;
  if (!token) return NextResponse.json({ error: "Missing KODIK_API_KEY or NEXT_PUBLIC_KODIK_API_KEY" }, { status: 500 });

  const type = req.nextUrl.searchParams.get("type") || "list";
  const base = type === "search" ? "https://kodikapi.com/search" : "https://kodikapi.com/list";
  const url = new URL(base);
  url.searchParams.set("token", token);
  url.searchParams.set("limit", req.nextUrl.searchParams.get("limit") || "20");

  if (type === "search") {
    const title = req.nextUrl.searchParams.get("title");
    const sid = req.nextUrl.searchParams.get("shikimori_id");
    if (title) url.searchParams.set("title", title);
    if (sid) url.searchParams.set("shikimori_id", sid);
  } else {
    url.searchParams.set("order", req.nextUrl.searchParams.get("order") || "shikimori_rating");
    url.searchParams.set("sort", req.nextUrl.searchParams.get("sort") || "desc");
  }

  try {
    const res = await fetch(url.toString(), { headers: { Accept: "application/json" } });
    const data: any = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Kodik request failed" }, { status: 502 });
  }
}
