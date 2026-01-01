import React from "react";
import { ZettelMeta, ZettelVersion } from "../../lib/types";
import Tag from "../components/tag";

export type ZettelProps = ZettelMeta & {
  mode?: "link" | "card" | "full" | "semi-full";
  showTitle?: boolean;
  showDate?: boolean;
  showTags?: boolean;
  showAbstract?: boolean;
  version?: ZettelVersion;
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
  showAbstract,
  version
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

  function VersionInfo() {
    if (!version) return null;
    return (
      <div className='text-sm text-gray-500 mb-4 border-b border-gray-200 pb-2'>
        <span>Revision {version.revision}</span>
        <span className='mx-2'>•</span>
        <span className='font-mono text-xs'>{version.commitHash.substring(0, 7)}</span>
        <span className='mx-2'>•</span>
        <span>{version.commitMessage}</span>
      </div>
    );
  }

  switch (mode) {
    case "link":
      return <a className='text-gray-500 hover:text-gray-800' href={`/notes/${id}`}>{title || id}</a>;

    case "card":
      return (
        <a
          className='flex flex-col border-b border-gray-800 p-4 hover:bg-gray-100 overflow-hidden'
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
          {version && <VersionInfo />}
          {showTitle !== false && <Title />}
          {showDate !== false && <Date />}
          {showTags !== false && tags?.length && <Tags />}
          <Content />
        </article>
      );

    case "full":
      return (
        <article className="zettel-full prose">
          {version && <VersionInfo />}
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
