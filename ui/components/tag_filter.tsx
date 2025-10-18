'use client';

import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";

export default function TagFilter({ availableTags }: { availableTags: string[] }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedTags = searchParams.get('tags')?.split(',') || [];

  // Filter tags based on search term
  const filteredTags = availableTags.filter(tag =>
    tag.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Separate selected and unselected tags
  const selectedFilteredTags = filteredTags.filter(tag => selectedTags.includes(tag));
  const unselectedFilteredTags = filteredTags.filter(tag => !selectedTags.includes(tag));

  const toggleTag = (tag: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');
    
    let newSelectedTags;
    if (selectedTags.includes(tag)) {
      newSelectedTags = selectedTags.filter(t => t !== tag);
    } else {
      newSelectedTags = [...selectedTags, tag];
    }
    
    if (newSelectedTags.length > 0) {
      params.set('tags', newSelectedTags.join(','));
    } else {
      params.delete('tags');
    }
    
    replace(`${pathname}?${params.toString()}`);
  };

  const removeTag = (tag: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');
    
    const newSelectedTags = selectedTags.filter(t => t !== tag);
    
    if (newSelectedTags.length > 0) {
      params.set('tags', newSelectedTags.join(','));
    } else {
      params.delete('tags');
    }
    
    replace(`${pathname}?${params.toString()}`);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Tag Filter Button */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          
          {selectedTags.length === 0 ? (
            <span className="text text-gray-500">Filter by tags</span>
          ) : selectedTags.length <= 3 ? (
            <div className="flex flex-wrap gap-1">
              {selectedTags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                >
                  {tag}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeTag(tag);
                    }}
                    className="hover:bg-blue-200 rounded-full p-0.5"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          ) : (
            <span className="text-sm text-gray-700">
              {selectedTags.length} tag{selectedTags.length > 1 ? 's' : ''} selected
            </span>
          )}
        </div>
        
        <svg 
          className={`w-4 h-4 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-80 bg-white border border-gray-300 rounded-md shadow-lg z-50">
          {/* Search Input */}
          <div className="p-3 border-b border-gray-200">
            <input
              type="text"
              placeholder="Search tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoFocus
            />
          </div>

          {/* Tags List */}
          <div className="max-h-60 overflow-y-auto">
            {filteredTags.length > 0 ? (
              <div className="p-2">
                {/* Selected Tags Section */}
                {selectedFilteredTags.length > 0 && (
                  <>
                    <div className="px-3 py-1 text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Selected ({selectedFilteredTags.length})
                    </div>
                    {selectedFilteredTags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className="w-full text-left px-3 py-2 text-sm rounded-md transition-colors bg-blue-100 text-blue-800 hover:bg-blue-200"
                      >
                        <div className="flex items-center justify-between">
                          <span>{tag}</span>
                          <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </button>
                    ))}
                    {unselectedFilteredTags.length > 0 && (
                      <div className="border-t border-gray-200 my-2"></div>
                    )}
                  </>
                )}

                {/* Unselected Tags Section */}
                {unselectedFilteredTags.length > 0 && (
                  <>
                    {selectedFilteredTags.length > 0 && (
                      <div className="px-3 py-1 text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Available ({unselectedFilteredTags.length})
                      </div>
                    )}
                    {unselectedFilteredTags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className="w-full text-left px-3 py-2 text-sm rounded-md transition-colors hover:bg-gray-100 text-gray-700"
                      >
                        <div className="flex items-center justify-between">
                          <span>{tag}</span>
                        </div>
                      </button>
                    ))}
                  </>
                )}
              </div>
            ) : (
              <div className="p-3 text-sm text-gray-500 text-center">
                No tags found matching "{searchTerm}"
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
