import { NextRequest, NextResponse } from "next/server";

function parseCoords(url: string): { lat: number; lng: number } | null {
  // @lat,lng (place/@17.42,78.40,15z)
  const at = url.match(/@(-?\d{1,3}\.\d+),(-?\d{1,3}\.\d+)/);
  if (at) return { lat: parseFloat(at[1]), lng: parseFloat(at[2]) };

  // ?q=lat,lng  or  &q=lat,lng
  const q = url.match(/[?&]q=(-?\d{1,3}\.\d+),(-?\d{1,3}\.\d+)/);
  if (q) return { lat: parseFloat(q[1]), lng: parseFloat(q[2]) };

  // ll=lat,lng
  const ll = url.match(/[?&]ll=(-?\d{1,3}\.\d+),(-?\d{1,3}\.\d+)/);
  if (ll) return { lat: parseFloat(ll[1]), lng: parseFloat(ll[2]) };

  // center=lat,lng
  const c = url.match(/[?&]center=(-?\d{1,3}\.\d+),(-?\d{1,3}\.\d+)/);
  if (c) return { lat: parseFloat(c[1]), lng: parseFloat(c[2]) };

  return null;
}

export async function GET(req: NextRequest) {
  const raw = req.nextUrl.searchParams.get("url");
  if (!raw) return NextResponse.json({ error: "No URL provided" }, { status: 400 });

  // Try parsing directly first (works for full URLs)
  const direct = parseCoords(raw);
  if (direct) return NextResponse.json({ ...direct, resolvedUrl: raw });

  // Expand the short / share link server-side
  try {
    const res = await fetch(raw, {
      redirect: "follow",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Linux; Android 11; Pixel 5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.0.0 Mobile Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
      },
      signal: AbortSignal.timeout(8000),
    });

    const finalUrl = res.url;

    const coords = parseCoords(finalUrl);
    if (coords) return NextResponse.json({ ...coords, resolvedUrl: finalUrl });

    // Some mobile share links embed coords inside a redirect chain meta-tag.
    // Try reading the HTML body for an og:url / canonical that contains coords.
    const html = await res.text();
    const ogUrl = html.match(/og:url[^>]*content="([^"]+)"/)?.[1]
      ?? html.match(/canonical[^>]*href="([^"]+)"/)?.[1]
      ?? "";

    const fromMeta = parseCoords(ogUrl);
    if (fromMeta) return NextResponse.json({ ...fromMeta, resolvedUrl: ogUrl });

    return NextResponse.json(
      { error: "coords_not_found", resolvedUrl: finalUrl },
      { status: 422 },
    );
  } catch {
    return NextResponse.json({ error: "fetch_failed" }, { status: 502 });
  }
}
