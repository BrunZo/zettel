'use client';

import clsx from 'clsx';
import { useState } from 'react';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';

interface MonthSelectorProps {
  availableMonths: Map<number, number[]>;
}

export default function MonthSelector({ availableMonths }: MonthSelectorProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [openYears, setOpenYears] = useState<Set<number>>(new Set());

  const selectedYear = searchParams.get('year') ? parseInt(searchParams.get('year')!) : undefined;
  const selectedMonth = searchParams.get('month') ? parseInt(searchParams.get('month')!) : undefined;

  const toggleYear = (year: number) => {
    const newOpenYears = new Set(openYears);
    if (newOpenYears.has(year)) {
      newOpenYears.delete(year);
    } else {
      newOpenYears.add(year);
    }
    setOpenYears(newOpenYears);
  };

  const selectMonth = (year: number, month: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');
    
    if (selectedYear == year && selectedMonth == month) {
      params.delete('year');
      params.delete('month');
    } else {
      params.set('year', year.toString());
      params.set('month', month.toString());
    }
    
    replace(`${pathname}?${params.toString()}`);
  };

  const years: number[] = Array.from(availableMonths.keys()).sort((a, b) => b - a);

  return (
    <div className='flex flex-col gap-2 mr-8 min-w-[200px]'>
      {years.map((year: number) => {
        const isOpen = openYears.has(year);
        const isYearSelected = selectedYear == year;
        const months = availableMonths.get(year).sort((a, b) => b - a);
        
        return (
          <div key={year} className='select-none overflow-hidden'>
            <YearButton 
              key={year}
              year={year} 
              isYearSelected={isYearSelected} 
              isOpen={isOpen} 
              toggleYear={toggleYear} 
            />
            
            {isOpen && (
              <div className='bg-white'>
                {months.map((month) => {
                  const isSelected = selectedYear == year && selectedMonth == month;
                  return <MonthButton 
                    key={month}
                    month={month} 
                    isSelected={isSelected} 
                    selectMonth={(month: number) => selectMonth(year, month)} 
                  />
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function YearButton({ year, isYearSelected, isOpen, toggleYear }: {
  year: number;
  isYearSelected: boolean;
  isOpen: boolean;
  toggleYear: (year: number) => void;
}) {
  return (
    <div
      onClick={() => toggleYear(year)}
      className={clsx({
        'w-full px-3 py-2 flex items-center justify-between hover:bg-gray-50 transition-colors min-w-[200px]': true,
        'bg-blue-50 text-blue-800': isYearSelected,
        'rounded-md': true,
      })}
    >
      <span className='font-medium'>
        {year}
      </span>
      <svg 
        className={clsx({
          'w-4 h-4 transition-transform': true,
          'rotate-180': isOpen,
        })}
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  )
}

export function MonthButton({ month, isSelected, selectMonth }: {
  month: number;
  isSelected: boolean;
  selectMonth: (month: number) => void;
}) {
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <button
      key={month}
      onClick={() => selectMonth(month)}
        className={clsx({
          'w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors rounded-md': true,
          'bg-blue-50 text-blue-800 font-medium': isSelected,
          'text-gray-700': !isSelected,
        })}
    >
      {monthNames[month]}
    </button>
  )
}