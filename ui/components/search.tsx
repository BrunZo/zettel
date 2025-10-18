'use client';

import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useDebouncedCallback } from 'use-debounce';

export default function Search() { 
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const search = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');
    if (term)
      params.set('query', term);
    else
      params.delete('query');
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <input
      className='border border-gray-300 rounded p-2 w-full'
      type='text'
      placeholder='search keywords'
      onChange={(e) => { search(e.target.value) }}
      defaultValue={searchParams.get('query')?.toString()}>
    </input>
  );
}
