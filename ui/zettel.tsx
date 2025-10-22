import React from "react";
import { ZettelMeta } from "../lib/types";
import Tag from "./components/tag";

export type ZettelProps = ZettelMeta & {
  mode?: "link" | "card" | "full" | "semi-full";
  showTitle?: boolean;
  showDate?: boolean;
  showTags?: boolean;
  showAbstract?: boolean;
};

export default function Zettel({
  id,
  title,
  date,
  tags,
  abstract,
  Content,
  mode = "full",
  showTitle,
  showDate,
  showTags,
  showAbstract
}: ZettelProps) {
  switch (mode) {
    case "link":
      return <a href={`/notes/${id}`}>{showTitle ? title || id : "Note"}</a>;

    case "card":
      return (
        <a
          className='flex flex-col h-72 p-4 border rounded-[25px] hover:bg-gray-100 overflow-hidden hover:overflow-scroll'
          href={`/notes/${id}`}
        >
          {<span className='font-bold text-gray-800 text-2xl m-0'>{title || id}</span>}
          {showDate && <p className='text-gray-500 text-sm'>{date ? date.toLocaleDateString() : "Unknown"}</p>}
          {showTags && tags?.length && (
            <div className='flex flex-wrap gap-1 mb-1'>
              {tags.map((tag, index) => (
                <Tag key={index} tag={tag} />
              ))}
            </div>
          )}
          {showAbstract && <p className='text-gray-800 text-md'>{abstract}</p>}
        </a>
      );

    case "full":
      return (
        <article className="zettel-full prose">
          {showTitle && <h1>{title || id}</h1>}
          {showDate && <p className='text-gray-500 text-sm'>{date ? new Date(date).toLocaleDateString() : "Unknown"}</p>}
          {showTags && tags?.length && (
            <div className='flex flex-wrap gap-1 mb-1'>
              {tags.map((tag, index) => (
                <Tag key={index} tag={tag} />
              ))}
            </div>
          )}
          <Content />
        </article>
      );

    case "semi-full":
      return (
        <article className="zettel-semi-full prose">
          {showTitle && <h3>{title || id}</h3>}
          {showDate && <p className='text-gray-500 text-sm'>{date ? new Date(date).toLocaleDateString() : "Unknown"}</p>}
          {showTags && tags?.length && (
            <div className='flex flex-wrap gap-1 mb-1'>
              {tags.map((tag, index) => (
                <Tag key={index} tag={tag} />
              ))}
            </div>
          )}
          <Content />
        </article>
      );
    
    default:
      return null;
  }
}
