export class Imgix {
  constructor(
    private domain: string,
    private newt_root: string,
    private resource_url: string
  ) {}

  replaceImgixUrl(src: string, width: number, quality: number) {
    const newtPrefix = this.newt_root ?? "newt/";
    const assetsPrefix = this.resource_url ?? "assets/";
    if (src.startsWith(newtPrefix)) {
      src = src.replace(newtPrefix, "newt/");
    } else if (src.startsWith(assetsPrefix)) {
      src = src.replace(assetsPrefix, "assets");
    } else {
      return src;
    }
    return `https://${this.domain}/${src}?auto=format&fit=max&w=${width}&width=${width}&q=${quality}`;
  }
}
