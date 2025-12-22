import React from 'react';
import { filterZettels, numPages, allTags, availableMonths } from '../../lib/retrieve';
import ZettelGrid from '../z/zettel_grid';
import Pagination from '../components/pagination';
import Search from '../components/search';
import TagFilter from '../components/tag_filter';
import MonthSelector from '../components/month_selector';

interface ZettelSearchProps {
  searchParams?: Promise<{
    query?: string;
    tags?: string | string[];
    page?: string;
    year?: string;
    month?: string;
  }>,
  globPattern?: string;
}

export default async function ZettelSearch({ 
  searchParams,
  globPattern
}: ZettelSearchProps) {
  const params = await searchParams;

  const tagsParam = params?.tags;
  const tags = Array.isArray(tagsParam) 
    ? tagsParam 
    : tagsParam 
      ? tagsParam.split(',') 
      : undefined;

  const year = params?.year ? parseInt(params.year) : undefined;
  const month = params?.month ? parseInt(params.month) : undefined;

  const filters = {
    globPattern: globPattern,
    query: params?.query,
    tags,
    year,
    month,
  };

  const pagedFilters = filters && {
    page: parseInt(params?.page || "1"),
    limit: 6
  }

  const [zettels, totalPages, availableTags, months] = await Promise.all([
    filterZettels(pagedFilters),
    numPages(pagedFilters),
    allTags(filters),
    availableMonths({
      globPattern: globPattern,
      query: params?.query,
      tags
    })
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
      
      <div className='flex flex-col md:flex-row md:gap-2 mt-4'>
        <div className='w-full md:w-1/4 mb-4 md:mb-0'>
          <MonthSelector availableMonths={months} />
        </div>
        <div className='flex-1'>
          {zettels.length > 0 ? (
            <>
              <ZettelGrid zettels={zettels} />
              <Pagination numPages={totalPages} /> 
            </>
          ) : (
            <p className="text-center text-gray-800 italic my-20">
              Nothing here...
            </p>
          )}
        </div>
      </div>
    </>
  );
}
