'use client';

import React from "react";
import { ZettelMeta } from "../lib/types";
import Tag from "./components/tag";

export type ZettelProps = ZettelMeta & {
  mode?: "link" | "card" | "full";
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
  showTitle = true,
  showDate = true,
  showTags = true,
  showAbstract = true
}: ZettelProps) {
  switch (mode) {
    case "link":
      return <a href={`/notes/${id}`}>{showTitle ? title : "Note"}</a>;

    case "card":
      return (
        <a
          className='flex flex-col h-72 p-4 border rounded-[25px] hover:bg-gray-100 overflow-hidden hover:overflow-scroll'
          href={`/notes/${id}`}
        >
          {showTitle && <h1 className='font-bold text-gray-800 text-2xl m-0'>{title}</h1>}
          {showDate && <p className='text-gray-500 text-sm'>{date.toLocaleString()}</p>}
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
          {showTitle && <h1>{title}</h1>}
          {showDate && <p className='text-gray-500 text-sm'>{new Date(date).toLocaleString()}</p>}
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
