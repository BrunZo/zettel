
import fs from "fs";
import { glob } from "glob";
import path from "path";
import { ZettelMeta, ZettelWithVersions, ZettelVersion } from "./types";
import { getFileAtCommit, getFileVersions, getCurrentCommitHash } from "./git";

export async function filterZettels(filters?: {
  globPattern?: string;
  id?: string;
  query?: string;
  tags?: string[];
  page?: number;
  limit?: number;
  sortMethod?: (a: ZettelMeta, b: ZettelMeta) => number;
}): Promise<ZettelMeta[]> {
  const publicDir = path.join(process.cwd(), "public");
  const zettelFiles = await glob(
    filters?.globPattern || "**/*{.jsx,.mdx}", 
    { cwd: publicDir }
  );
  
  let zettels: ZettelMeta[] = await Promise.all(
    zettelFiles.map(async (file: string): Promise<ZettelMeta | undefined> => {
      try {
        let zettel = await import(`public/${file}`);
        let content_string = fs.readFileSync(path.join(publicDir, file), "utf8")
                               .replace(/^export const .* = /gm, "")
        let searchable_string = zettel.title + " " + zettel.abstract + " " + content_string;            

        if (!zettel.id) {
          zettel.id = file.split(path.sep).pop().split(".")[0];
        }

        if (filters?.id && zettel.id !== filters.id) {
          return undefined;
        }

        if (filters?.query && !searchable_string.toLowerCase().includes(filters.query.toLowerCase())) {
          return undefined;
        }

        if (filters?.tags && filters.tags.length > 0 && 
            !zettel.tags?.some((tag: string) => filters.tags.includes(tag))) {
          return undefined;
        }
       
        return {
          ...zettel,
          Content: zettel.default,
          path: file
        }
      } catch (error) {
        console.error(`Error loading zettel ${file}:`, error);
        return undefined;
      }
    })
  ).then(zettels => zettels.filter(z => z !== undefined));

  let defaultSortMethod = (a: ZettelMeta, b: ZettelMeta) => {
    if (a.date && b.date) return b.date.getTime() - a.date.getTime();
    else if (a.date) return -1;
    else if (b.date) return 1;
    else return a.id.localeCompare(b.id);
  }

  zettels.sort(filters?.sortMethod || defaultSortMethod);

  if (filters?.page && filters?.limit) {
    const start = (filters.page - 1) * filters.limit;
    const end = start + filters.limit;
    return zettels.slice(start, end);
  }
  else return zettels;
}

export async function numPages(filters: {
  globPattern?: string;
  query?: string;
  tags?: string[];
  limit?: number;
}): Promise<number> {
  const zettels = await filterZettels({
    globPattern: filters.globPattern,
    query: filters.query,
    tags: filters.tags
  });
  return Math.ceil(zettels.length / (filters.limit || 6));
}

export async function allTags(): Promise<string[]> {
  const zettels = await filterZettels();
  const allTags = zettels.flatMap(z => z.tags || []);
  return [...new Set(allTags)].sort();
}

export async function zettelById(id: string): Promise<ZettelMeta> {
  const zettels = await filterZettels({ id });
  if (zettels.length === 0) {
    return undefined;
  }
  return zettels[0];
}

export async function zettelByIdWithVersions(id: string): Promise<ZettelWithVersions & { filePath?: string }> {
  const zettel = await zettelById(id);
  if (!zettel) {
    return undefined;
  }

  const versions = await getFileVersions(zettel.path);
  const currentCommitHash = await getCurrentCommitHash();
  
  const currentVersion = versions.find(v => v.commitHash === currentCommitHash) || versions[0];

  return {
    ...zettel,
    versions,
    currentVersion
  };
}

export async function zettelAtCommit(id: string, commitHash: string): Promise<ZettelMeta> {
  try {
    const zettel = await zettelById(id);
    const historicalZettel = await getFileAtCommit(zettel.path, commitHash);
    return historicalZettel;
  } catch (error) {
    console.error(`Error getting zettel at commit ${commitHash}:`, error);
    return undefined;
  }
}
