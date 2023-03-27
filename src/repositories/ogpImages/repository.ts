export class NoOgpImageError extends Error {
  constructor(public msg: string) {
    super(msg);
  }
}

export interface OgpImagesRepository {
  getById(userId: string): Promise<ArrayBuffer>;
  setById(userId: string, image: Uint8Array): Promise<void>;
}
