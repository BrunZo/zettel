"use client";

import React from "react";
import Link from "next/link";
import { ZettelVersion } from "../../lib/types";

interface VersionSelectorProps {
  zettelId: string;
  versions: ZettelVersion[];
  currentRevision?: number;
  currentDiff?: { from: number; to: number };
}

export default function VersionSelector({
  zettelId,
  versions,
  currentRevision,
  currentDiff
}: VersionSelectorProps) {
  const baseUrl = `/notes/${zettelId}`;

  return (
    <div className="mb-4 p-4 border-b border-gray-200">
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-sm font-semibold text-gray-700">Version:</span>
        <Link
          href={baseUrl}
          className={`px-3 py-1 rounded text-sm ${
            !currentRevision && !currentDiff
              ? "bg-gray-800 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Current
        </Link>
        {versions.map((version) => (
          <Link
            key={version.revision}
            href={`${baseUrl}?version=${version.revision}`}
            className={`px-3 py-1 rounded text-sm ${
              currentRevision === version.revision
                ? "bg-gray-800 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            v{version.revision}
          </Link>
        ))}
        {versions.length > 1 && (
          <Link
            href={`${baseUrl}?diff=1&from=${versions[0].revision}&to=${versions[versions.length - 1].revision}`}
            className={`px-3 py-1 rounded text-sm ${
              currentDiff
                ? "bg-gray-800 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Diff
          </Link>
        )}
      </div>
    </div>
  );
}
