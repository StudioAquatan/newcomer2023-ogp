export interface Image {
  src: string;
  width: number;
  height: number;
}

export class Organization {
  constructor(
    public id: string,
    public fullName: string,
    public shortName: string,
    public shortDescription: string,
    public logo: Image | null,
    public logoFocus: boolean,
    public stampBackground: Image | null,
    public stampColor: string | null,
    public altLogo: Image | null,
    public description: string,
    public location: string | null,
    public fees: string | null,
    public activeDays: string | null,
    public links: string[]
  ) {}
}
