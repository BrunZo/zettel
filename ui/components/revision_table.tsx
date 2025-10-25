import React from 'react';
import Link from 'next/link';
import { ZettelVersion } from '../../lib/types';

interface RevisionTableProps {
  versions: ZettelVersion[];
  currentVersion?: ZettelVersion;
  zettelId: string;
  selectedCommitHash?: string;
}

export default function RevisionTable({ versions, currentVersion, zettelId, selectedCommitHash }: RevisionTableProps) {
  if (!versions || versions.length === 0) {
    return null;
  }

  return (
    <div className="my-8">
      <h3 className="text-xl font-semibold mb-4">Revision history</h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-50">
              <th className="border border-gray-300 px-4 py-2 text-left">Commit</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Date</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Message</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {versions.map((version, index) => {
              const isCurrent = currentVersion?.commitHash === version.commitHash;
              const isSelected = selectedCommitHash === version.commitHash;
              
              return (
                <tr 
                  key={version.commitHash}
                  className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} ${
                    isCurrent ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                  } ${
                    isSelected ? 'bg-yellow-50 border-l-4 border-yellow-500' : ''
                  }`}
                >
                <td className="border border-gray-300 px-4 py-2">
                  <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                    {version.commitHash.substring(0, 8)}
                  </code>
                  {isCurrent && (
                    <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      Current
                    </span>
                  )}
                  {isSelected && !isCurrent && (
                    <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                      Selected
                    </span>
                  )}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-sm">
                  {version.commitDate.toLocaleDateString()} {version.commitDate.toLocaleTimeString()}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-sm">
                  <div className="max-w-xs truncate" title={version.commitMessage}>
                    {version.commitMessage}
                  </div>
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {!isCurrent ? (
                    <Link 
                      href={`/notes/${zettelId}/${version.commitHash}`}
                      className="text-blue-600 hover:text-blue-800 text-sm underline"
                    >
                      View Version
                    </Link>
                  ) : (
                    <span className="text-gray-500 text-sm">Current</span>
                  )}
                </td>
              </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
