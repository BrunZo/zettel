'use client';

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import clsx from 'clsx';

export default function Pagination({ numPages }: {
  numPages: number 
}) {
  const pathname = usePathname();
  const createPageURL = (page: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    return `${pathname}?${params.toString()}`;
  }
  
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;
  const allPages = generatePagination(currentPage, numPages);

  return (
    <div className='flex justify-center items-center mt-4'>
      <PaginationArrow
        direction='left'
        href={createPageURL(currentPage - 1)}
        isDisabled={currentPage <= 1}/>
      {allPages.map((i) => {
        return (
          <PaginationButton
            key={i}
            page={String(i)}
            href={createPageURL(i)}
            isActive={i === currentPage}/>
        )
      })}
      <PaginationArrow
        direction='right'
        href={createPageURL(currentPage + 1)}
        isDisabled={currentPage >= numPages}/>
    </div>
  );
}

function PaginationArrow({ direction, href, isDisabled }: {
  direction: 'left' | 'right',
  href: string,
  isDisabled: boolean
}) {
  const styles = clsx(
    'hover:bg-gray-100 text-gray-800 py-2 px-4',
    {
      'disabled': isDisabled
    }
  )
  return isDisabled ? (
    <div className={styles}>
      {direction === 'left' ? '<' : '>'}
    </div>
  ) : (
    <>
      <Link
        href={href}
        className={styles}>
          {direction === 'left' ? '<' : '>'}
      </Link>
    </>
  )
}

function PaginationButton({ page, href, isActive }: {
  page: string,
  href: string,
  isActive: boolean
}) {
  const styles = clsx(
    'text-gray-800 py-2 px-4',
    {
      'bg-gray-100': isActive
    }
  )
  return isActive || page === '...' ? (
    <div className={styles}> {page} </div>
  ) : (
    <>
      <Link
        href={href}
        className={styles}>
          {page}
      </Link>
    </>
  )
}

const generatePagination = (currentPage: number, numPages: number) => {
  if (numPages <= 7)
    return Array.from({ length: numPages }, (_, i) => i + 1);

  if (currentPage <= 3)
    return [1, 2, 3, '...', numPages - 1, numPages];

  if (currentPage >= numPages - 2)
    return [1, 2, '...', numPages - 2, numPages - 1, numPages];

  return [
    1,
    '...',
    currentPage - 1,
    currentPage,
    currentPage + 1,
    '...',
    numPages,
  ];
};
