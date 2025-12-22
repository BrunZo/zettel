'use client';

import clsx from 'clsx';
import { useState, useRef, useEffect } from 'react';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';

interface MonthSelectorProps {
  availableMonths: Map<number, number[]>;
}

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export default function MonthSelector({ availableMonths }: MonthSelectorProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [openYears, setOpenYears] = useState<Set<number>>(new Set());
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const getSelectedText = () => {
    if (selectedYear !== undefined && selectedMonth !== undefined) {
      return `${monthNames[selectedMonth]} ${selectedYear}`;
    }
    return 'Filter by date';
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const years: number[] = Array.from(availableMonths.keys()).sort((a, b) => b - a);
  const monthSelectorContent = (
    <MonthSelectorContent 
      years={years} 
      openYears={openYears} 
      selectedYear={selectedYear} 
      selectedMonth={selectedMonth} 
      toggleYear={toggleYear} 
      selectMonth={selectMonth}
      availableMonths={availableMonths}
    />
  );

  return (
    <div className='relative' ref={dropdownRef}>
      <div className='md:hidden'>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className={clsx({
            'w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 transition-colors': true,
            'bg-blue-50 border-blue-300': selectedYear !== undefined && selectedMonth !== undefined,
          })}
        >
          <span className={clsx({
            'text-md': true,
            'text-blue-800 font-medium': selectedYear !== undefined && selectedMonth !== undefined,
            'text-gray-500': selectedYear === undefined || selectedMonth === undefined,
          })}>
            {getSelectedText()}
          </span>
          <svg 
            className={clsx({
              'w-4 h-4 transition-transform flex-shrink-0': true,
              'rotate-180': isDropdownOpen,
            })} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isDropdownOpen && (
          <div className='absolute top-full left-0 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg z-50 max-h-96 overflow-y-auto'>
            <div className='p-2'>
              {monthSelectorContent}
            </div>
          </div>
        )}
      </div>

      <div className='hidden md:block mr-8'>
        {monthSelectorContent}
      </div>
    </div>
  );
}

export function MonthSelectorContent({ years, openYears, selectedYear, selectedMonth, toggleYear, selectMonth, availableMonths }: {
  years: number[];
  openYears: Set<number>;
  selectedYear: number;
  selectedMonth: number;
  toggleYear: (year: number) => void;
  selectMonth: (year: number, month: number) => void;
  availableMonths: Map<number, number[]>;
}) {
  return (
    <div className='flex flex-col gap-2'>
      {years.map((year: number) => {
        const isOpen = openYears.has(year);
        const isYearSelected = selectedYear == year;
        const months = availableMonths.get(year)!.sort((a, b) => b - a);
        
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
  )
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
        'w-full px-3 py-2 flex items-center justify-between hover:bg-gray-50 transition-colors': true,
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