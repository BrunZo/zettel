import fs from "fs";
import { glob } from "glob";
import path from "path";

import { ZettelMeta } from "./types";

export async function filterZettels(filters: {
  globPattern?: string;
  id?: string;
  query?: string;
  tags?: string[];
  page?: number;
  limit?: number;
  sortMethod?: (a: ZettelMeta, b: ZettelMeta) => number;
}): Promise<ZettelMeta[]> {
  const publicDir = path.join(process.cwd(), "public");
  const mdxFiles = await glob(
    filters.globPattern || "**/*{.jsx,.mdx}", 
    { cwd: publicDir }
  );
  
  let zettels: ZettelMeta[] = await Promise.all(
    mdxFiles.map(async (filePath: string): Promise<ZettelMeta | undefined> => {
      try {
        let zettel = await import(`public/${filePath}`);
        let content_string = fs.readFileSync(`public/${filePath}`, "utf8")
                               .replace(/^export const .* = /gm, "");
        let searchable_string = zettel.title + " " + zettel.abstract + " " + content_string;            

        let zettelId = zettel.id || filePath.split(path.sep).pop().split(".")[0];
        if (filters?.id && zettelId !== filters.id) {
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
          id: zettelId,
          Content: zettel.default,
        };
      } catch (error) {
        console.error(`Error loading zettel ${filePath}:`, error);
        return undefined;
      }
    })
  ).then(zettels => zettels.filter(z => z !== undefined));

  let defaultSortMethod = (a: ZettelMeta, b: ZettelMeta) => {
    if (a.date && b.date) {
      return b.date.getTime() - a.date.getTime();
    }
    else if (a.date) {
      return -1;
    }
    else if (b.date) {
      return 1;
    }
    else {
      return a.id.localeCompare(b.id);
    }
  }

  zettels.sort(filters?.sortMethod || defaultSortMethod);

  if (filters?.page && filters?.limit) {
    const start = (filters.page - 1) * filters.limit;
    const end = start + filters.limit;
    return zettels.slice(start, end);
  }
  else {
    return zettels;
  }
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

export async function allTags(filters: {
  globPattern?: string;
  query?: string;
  tags?: string[];
  limit?: number;
}): Promise<string[]> {
  const zettels = await filterZettels(filters);
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
