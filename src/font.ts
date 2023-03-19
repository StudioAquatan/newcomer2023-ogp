import { Env } from ".";

const BASE_URL = "https://newcomer2023-assets.studioaquatan.workers.dev/assets";

export const loadFont = async (env: Env, key: string) => {
  const font = await caches.default.match(`${BASE_URL}/${key}`);
  if (font) return font.arrayBuffer();

  const res = await env.ASSETS.get(key);
  if (res === null) throw new Error();

  const cacheRes = new Response(res.body);
  cacheRes.headers.append("Cache-Control", "s-maxage=3600");
  await caches.default.put(`${BASE_URL}/${key}`, cacheRes.clone());

  return await cacheRes.arrayBuffer();
};
