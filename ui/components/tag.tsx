'use client';

export default function Tag({
  tag
}: {
  tag: string
}) {
  return (
    <span
      className='px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full'
    >
      {tag}
    </span>
  )
}