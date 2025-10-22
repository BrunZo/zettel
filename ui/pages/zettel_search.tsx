import React from 'react';
import { filterZettels, numPages, allTags } from '../../lib/retrieve';
import ZettelGrid from '../z/zettel_grid';
import Pagination from '../components/pagination';
import Search from '../components/search';
import TagFilter from '../components/tag_filter';

interface ZettelSearchProps {
  searchParams?: Promise<{
    query?: string;
    tags?: string | string[];
    page?: string;
  }>;
}

export default async function ZettelSearch({ searchParams }: ZettelSearchProps) {
  const params = await searchParams;

  const tagsParam = params?.tags;
  const tags = Array.isArray(tagsParam) 
    ? tagsParam 
    : tagsParam 
      ? tagsParam.split(',') 
      : undefined;

  const filters = {
    query: params?.query,
    tags,
    page: parseInt(params?.page || "1"),
    limit: 6
  };

  const [zettels, totalPages, availableTags] = await Promise.all([
    filterZettels(filters),
    numPages(filters),
    allTags()
  ]);

  return (
    <>
      <h1 className='text-gray-800 text-3xl font-bold mt-2'>notes</h1>
      <div className='flex flex-col md:flex-row gap-4 mt-4'>
        <div className='w-full md:w-1/2'>
          <Search />
        </div>
        <div className='w-full md:w-1/2'>
          <TagFilter availableTags={availableTags} />
        </div>
      </div>
      
      {zettels.length > 0 ? (
        <div className='mt-4'>
          <ZettelGrid zettels={zettels} />
          <Pagination numPages={totalPages} /> 
        </div>
      ) : (
        <p className="text-center text-gray-800 italic my-20">
          Nothing here...
        </p>
      )}
    </>
  );
}
