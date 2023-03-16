export const loadFont = async (url: string) => {
  const font = await caches.default.match(url);
  if (font) return font.arrayBuffer();

  const res = await fetch(url);
  if (!res.ok) throw new Error();

  const cacheRes = new Response(res.body, res);
  cacheRes.headers.append("Cache-Control", "s-maxage=3600");
  await caches.default.put(url, cacheRes.clone());

  return await cacheRes.arrayBuffer();
};
