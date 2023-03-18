import { HTTPException } from "hono/http-exception";

type RecommendResult = {
  id: string;
  orgs: string;
  // ignoreCount: number;
  // renewCount: number;
};

type SimpleRecommendItem = {
  orgId: string;
  coefficient: number;
};

type RecommendItem = {
  orgId: string;
  coefficient: number;
  isExcluded: boolean;
};

type SimpleRecommend = {
  userId: string;
  orgs: SimpleRecommendItem[];
  // ignoreCount: number;
  // renewCount: number;
};

export async function fetchRecommendation(
  db: D1Database,
  userId: string
): Promise<SimpleRecommend> {
  const results = await db
    .prepare("SELECT id, orgs FROM recommendation WHERE id = ?")
    .bind(userId)
    .all<RecommendResult>();

  if (!results.success) {
    throw new HTTPException(500, { message: "Database error" });
  } else if (!results.results?.length) {
    throw new HTTPException(404, { message: "Not found user recommendation" });
  }

  return {
    userId,
    // 診断結果はJSON形式で保存されているのでパースする
    orgs: JSON.parse(results.results[0].orgs),
  };
}

type Exclusion = {
  orgId: string;
};

export async function fetchExclusion(
  db: D1Database,
  userId: string
): Promise<Exclusion[]> {
  const result = await db
    .prepare(`SELECT orgId FROM exclusion WHERE userId = ?`)
    .bind(userId)
    .all<Exclusion>();

  return result.results ?? [];
}

function applyExclusion(
  orgs: SimpleRecommendItem[],
  exclusionList: Exclusion[]
): RecommendItem[] {
  const applied = orgs.map((item) => {
    const isExcluded = exclusionList.find(({ orgId }) => {
      return item.orgId === orgId;
    });

    return {
      orgId: item.orgId,
      coefficient: item.coefficient,
      isExcluded: !!isExcluded,
    };
  });

  return applied;
}

function sortOrgs(orgs: RecommendItem[]): RecommendItem[] {
  // おすすめ団体リストを相性の昇順にソート
  return orgs.sort((a, b) => {
    if (a.isExcluded && b.isExcluded) return 0;
    if (a.isExcluded) return 1;
    if (b.isExcluded) return -1;
    return a.coefficient - b.coefficient;
  });
}

type Image = {
  src: string;
  width: number;
  height: number;
};

type Organization = {
  id: string;
  fullName: string;
  shortName: string;
  shortDescription: string;
  logo?: Image;
  logoFocus: boolean;
  stampBackground?: Image;
  stampColor?: string;
  altLogo?: Image;
  description: string;
  location?: string;
  fees?: string;
  activeDays?: string;
  links?: string[];
};

async function fetchOrgs() {
  const response = await fetch(
    "https://newcomer2023-api-dev.studioaquatan.workers.dev/orgs"
  );

  if (!response.ok) {
    console.log(response.statusText);
    throw new HTTPException(500, { message: "Failed to fetch orgs" });
  }

  return response.json<Organization[]>();
}

type OgpOrg = {
  shortName: string;
  logo: Image;
};

export async function getTop3RecommendedOrgs(
  db: D1Database,
  userId: string
): Promise<OgpOrg[]> {
  const [recommend, exclusion, orgs] = await Promise.all([
    fetchRecommendation(db, userId),
    fetchExclusion(db, userId),
    fetchOrgs(),
  ]);

  const applied = applyExclusion(recommend.orgs, exclusion);
  const sorted = sortOrgs(applied);

  const top3: OgpOrg[] = [];

  for (const item of sorted) {
    // 除外されている団体は無視
    if (item.isExcluded) continue;

    const org = orgs.find((org) => {
      return org.id === item.orgId;
    });

    if (!org) {
      throw new HTTPException(500, {
        message: "Recommended organizations is not found in all organizations.",
      });
    }

    if (!org.logo) {
      throw new HTTPException(500, {
        message: "Recommended organizations has no logo.",
      });
    }

    top3.push({
      shortName: org.shortName,
      logo: org.logo,
    });

    if (top3.length >= 3) break;
  }

  return top3;
}
