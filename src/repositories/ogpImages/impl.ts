import { NoOgpImageError, OgpImagesRepository } from "./repository";

const kvId = (userId: string) => `ogp-${userId}`;

export class OgpImagesRepositoryImpl implements OgpImagesRepository {
  constructor(private kv: KVNamespace) {}

  async getById(userId: string): Promise<ArrayBuffer> {
    const image = await this.kv.get(kvId(userId), { type: "arrayBuffer" });
    if (!image) throw new NoOgpImageError("No cached OGP image");
    return image;
  }

  async setById(userId: string, image: Uint8Array): Promise<void> {
    await this.kv.put(kvId(userId), image);
  }
}
