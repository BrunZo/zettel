import { ZettelMeta } from "./types";
import { glob } from "glob";
import path from "path";
import fs from "fs";

export async function filterZettels(filters?: {
  globPattern?: string;
  id?: string;
  query?: string;
  tags?: string[];
  page?: number;
  limit?: number;
}): Promise<ZettelMeta[]> {
  const publicDir = path.join(process.cwd(), "public");
  const mdxFiles = await glob(
    filters?.globPattern || "**/*{.jsx,.mdx}", 
    { cwd: publicDir }
  );
  
  let zettels: ZettelMeta[] = await Promise.all(
    mdxFiles.map(async (file: string): Promise<ZettelMeta | undefined> => {
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
          id: zettel.id,
          title: zettel.title,
          date: zettel.date,
          tags: zettel.tags,
          abstract: zettel.abstract,
          Content: zettel.default
        };
      } catch (error) {
        console.error(`Error loading zettel ${file}:`, error);
        return undefined;
      }
    })
  );
  
  zettels = zettels.filter(z => z !== undefined);
  zettels.sort((a, b) => {
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
      return b.id.localeCompare(a.id);
    }
  });

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