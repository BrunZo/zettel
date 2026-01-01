"use client";

import React from "react";

interface DiffViewerProps {
  diff: string;
  fromRevision: number;
  toRevision: number;
}

export default function DiffViewer({ diff, fromRevision, toRevision }: DiffViewerProps) {
  const lines = diff.split('\n');
  
  return (
    <div className="mt-4">
      <div className="mb-2 text-sm text-gray-600">
        Diff from revision {fromRevision} to revision {toRevision}
      </div>
      <pre className="bg-gray-50 p-4 rounded overflow-x-auto text-sm font-mono">
        {lines.map((line, index) => {
          let className = "text-gray-800";
          if (line.startsWith("+")) {
            className = "text-green-600 bg-green-50";
          } else if (line.startsWith("-")) {
            className = "text-red-600 bg-red-50";
          } else if (line.startsWith("@@")) {
            className = "text-blue-600 font-semibold";
          } else if (line.startsWith("diff --git") || line.startsWith("index")) {
            className = "text-gray-500";
          }
          
          return (
            <div key={index} className={className}>
              {line || " "}
            </div>
          );
        })}
      </pre>
    </div>
  );
}
