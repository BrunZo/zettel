import React from "react";
import { ZettelMeta } from "../../lib/types";
import Tag from "../components/tag";

export type ZettelProps = ZettelMeta & {
  mode?: "link" | "card" | "full" | "semi-full";
  showTitle?: boolean;
  showDate?: boolean;
  showTags?: boolean;
  showAbstract?: boolean;
};

export default function ZettelDisplay({
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
  function Title() { 
    return <span className={`font-bold ${mode == "full" ? "text-4xl" : "text-2xl"} m-0`}>{title || id}</span> 
  }

  function Date() {
    return <p className='text-gray-500 text-sm'>{date?.toLocaleDateString()}</p>
  } 

  function Tags() {
    return (
      <div className='flex flex-wrap gap-1 mb-1'>
        {tags.map((tag, index) => (
          <Tag key={index} tag={tag} />
        ))}
      </div>
    )
  }

  function Abstract() {
    return <p className='text-gray-800 text-md'>{abstract}</p>
  }

  switch (mode) {
    case "link":
      return <a className='text-gray-500 hover:text-gray-800' href={`/notes/${id}`}>{title || id}</a>;

    case "card":
      return (
        <a
          className='flex flex-col h-72 p-4 border rounded-[25px] hover:bg-gray-100 overflow-hidden hover:overflow-scroll'
          href={`/notes/${id}`}
        >
          {showTitle !== false && <Title />}
          {showDate !== false && <Date />}
          {showTags !== false && tags?.length && <Tags />}
          {showAbstract !== false && <Abstract />}
        </a>
      );

    case "semi-full":
      return (
        <article className="zettel-semi-full prose">
          {showTitle !== false && <Title />}
          {showDate !== false && <Date />}
          {showTags !== false && tags?.length && <Tags />}
          <Content />
        </article>
      );

    case "full":
      return (
        <article className="zettel-full prose">
          {showTitle !== false && <Title />}
          {showDate !== false && <Date />}
          {showTags !== false && tags?.length && <Tags />}
          {showAbstract !== false && <Abstract />}
          <Content />
        </article>
      );
    
    default:
      return null;
  }
}
