"use client";

import React from "react";
import Link from "next/link";
import { ZettelVersion } from "../../lib/types";

interface VersionHistoryProps {
  zettelId: string;
  versions: ZettelVersion[];
}

export default function VersionHistory({ zettelId, versions }: VersionHistoryProps) {
  const baseUrl = `/notes/${zettelId}`;

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-2">Version History</h3>
      <div className="space-y-2">
        {versions.map((version) => (
          <div
            key={version.revision}
            className="p-3 border border-gray-200 rounded hover:bg-gray-50"
          >
            <div className="flex items-center justify-between">
              <div>
                <Link
                  href={`${baseUrl}?version=${version.revision}`}
                  className="font-semibold text-gray-800 hover:text-gray-600"
                >
                  Revision {version.revision}
                </Link>
                <div className="text-sm text-gray-500 mt-1">
                  {version.timestamp.toLocaleDateString()} {version.timestamp.toLocaleTimeString()}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {version.commitMessage}
                </div>
              </div>
              <div className="text-xs font-mono text-gray-400">
                {version.commitHash.substring(0, 7)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


