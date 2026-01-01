import simpleGit, { SimpleGit } from "simple-git";
import path from "path";
import React from "react";
import { VersionedZettel, ZettelVersion } from "./types";

const notesDir = path.join(process.cwd(), "notes");

function getGit(): SimpleGit {
  const git = simpleGit(notesDir);
  return git;
}

export async function getZettelFilePath(zettelId: string): Promise<string | null> {
  const { glob } = await import("glob");
  const mdxFiles = await glob("**/*.mdx", { cwd: notesDir });
  
  for (const filePath of mdxFiles) {
    try {
      const zettel = await import(`notes/${filePath}`);
      const fileId = zettel.id || filePath.split(path.sep).pop()?.split(".")[0];
      if (fileId === zettelId) {
        return filePath;
      }
    } catch (error) {
      continue;
    }
  }
  return null;
}

export async function getFileAtCommit(zettelPath: string, commitHash: string): Promise<string> {
  const git = getGit();
  try {
    const content = await git.raw(['-C', notesDir, 'show', `${commitHash}:${zettelPath}`]);
    return content;
  } catch (error) {
    throw new Error(`Failed to get file content at commit ${commitHash}: ${error}`);
  }
}

export async function getDiff(zettelPath: string, fromCommit: string, toCommit: string): Promise<string> {
  const git = getGit();
  try {
    const diff = await git.raw(['-C', notesDir, 'diff', fromCommit, toCommit, '--', zettelPath]);
    return diff;
  } catch (error) {
    throw new Error(`Failed to get diff between ${fromCommit} and ${toCommit}: ${error}`);
  }
}

export async function getCommitInfo(commitHash: string): Promise<{ timestamp: Date; commitMessage: string }> {
  const git = getGit();
  const log = await git.raw(['-C', notesDir, 'log', '--format=%ai|%s', '-n', '1', commitHash]);
  
  if (!log || !log.trim()) {
    throw new Error(`Commit ${commitHash} not found`);
  }
  
  const [dateStr, ...messageParts] = log.trim().split('|');
  return {
    timestamp: new Date(dateStr.trim()),
    commitMessage: messageParts.join('|').trim(),
  };
}

export async function getCommitsForFile(zettelPath: string): Promise<Array<{ hash: string; timestamp: Date; message: string }>> {
  const git = getGit();
  const log = await git.raw(['-C', notesDir, 'log', '--format=%H|%ai|%s', '--', zettelPath]);
  
  if (!log) {
    return [];
  }
  
  const commits = log.trim().split('\n').filter(line => line.trim()).map(line => {
    const [hash, dateStr, ...messageParts] = line.split('|');
    return {
      hash: hash.trim(),
      timestamp: new Date(dateStr.trim()),
      message: messageParts.join('|').trim(),
    };
  });
  
  return commits.reverse(); // Reverse to get oldest first (revision 1, 2, 3, ...)
}

export async function getZettelVersions(zettelId: string): Promise<ZettelVersion[]> {
  const filePath = await getZettelFilePath(zettelId);
  if (!filePath) {
    return [];
  }
  
  const commits = await getCommitsForFile(filePath);
  
  return commits.map((commit, index) => ({
    revision: index + 1,
    commitHash: commit.hash,
    timestamp: commit.timestamp,
    commitMessage: commit.message,
  }));
}

export async function getZettelAtVersion(zettelId: string, revision: number): Promise<VersionedZettel | null> {
  try {
    const versions = await getZettelVersions(zettelId);
    const version = versions.find(v => v.revision === revision);
    
    if (!version) {
      return null;
    }
    
    const filePath = await getZettelFilePath(zettelId);
    if (!filePath) {
      return null;
    }
    
    // Get file content at the commit
    const fileContent = await getFileAtCommit(filePath, version.commitHash);
    
    // Parse the MDX content to extract metadata
    // MDX files have exports at the top, then content
    const lines = fileContent.split('\n');
    const exportLines: string[] = [];
    let contentStartIndex = 0;
    
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim().startsWith('export const ')) {
        exportLines.push(lines[i]);
      } else if (lines[i].trim() !== '' && !lines[i].trim().startsWith('export const ')) {
        contentStartIndex = i;
        break;
      }
    }
    
    // Parse exports to get metadata (without using eval for security)
    const metadata: any = {};
    exportLines.forEach(line => {
      const match = line.match(/export const (\w+)\s*=\s*(.+);?$/);
      if (match) {
        let [, key, value] = match;
        console.log(key, value)
        if (value.endsWith(';')) {
          value = value.slice(0, -1);
        }
        try {
          // Parse the value without using eval
          if (value.includes('new Date(')) {
            const dateMatch = value.match(/new Date\(["'](.+?)["']\)/);
            if (dateMatch) {
              metadata[key] = new Date(dateMatch[1]);
            }
          } else if (value.startsWith('[') && value.endsWith(']')) {
            // Array (tags) - parse manually
            const arrayContent = value.slice(1, -1).trim();
            if (arrayContent === '') {
              metadata[key] = [];
            } else {
              // Split by comma and parse each element
              const items = arrayContent.split(',').map(item => {
                const trimmed = item.trim();
                if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || 
                    (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
                  return trimmed.slice(1, -1);
                }
                return trimmed;
              });
              metadata[key] = items;
            }
          } else if (value.startsWith('`') && value.endsWith('`')) {
            // Template literal string
            metadata[key] = value.slice(1, -1);
          } else if ((value.startsWith('"') && value.endsWith('"')) || 
                     (value.startsWith("'") && value.endsWith("'"))) {
            // Regular string
            metadata[key] = value.slice(1, -1);
          } else if (!isNaN(Number(value))) {
            // Number
            metadata[key] = Number(value);
          } else {
            metadata[key] = value;
          }
        } catch (e) {
          // If parsing fails, just store the raw value
          metadata[key] = value;
        }
      }
    });
    
    // For Content, we need to compile the MDX. Since we can't easily do that from a string at runtime,
    // we'll create a simple component that renders the content as HTML for now.
    // TODO: Implement proper MDX compilation from string (could use @mdx-js/runtime or react-markdown)
    const contentString = lines.slice(contentStartIndex).join('\n');
    
    // Create a simple component that will be replaced with proper MDX rendering
    const Content = () => {
      return React.createElement('div', { 
        className: 'prose',
        dangerouslySetInnerHTML: { __html: contentString.replace(/\n/g, '<br/>') }
      });
    };
    
    return {
      id: zettelId,
      title: metadata.title || zettelId,
      date: metadata.date || new Date(),
      tags: metadata.tags,
      abstract: metadata.abstract,
      sectionNumber: metadata.sectionNumber,
      Content: Content as any,
      version: version,
    };
  } catch (error) {
    console.error(`Error getting zettel at version ${revision}:`, error);
    return null;
  }
}

export async function getZettelDiff(zettelId: string, fromRevision: number, toRevision: number): Promise<string | null> {
  try {
    const versions = await getZettelVersions(zettelId);
    const fromVersion = versions.find(v => v.revision === fromRevision);
    const toVersion = versions.find(v => v.revision === toRevision);
    
    if (!fromVersion || !toVersion) {
      return null;
    }
    
    const filePath = await getZettelFilePath(zettelId);
    if (!filePath) {
      return null;
    }
    
    return await getDiff(filePath, fromVersion.commitHash, toVersion.commitHash);
  } catch (error) {
    console.error(`Error getting diff between revisions ${fromRevision} and ${toRevision}:`, error);
    return null;
  }
}