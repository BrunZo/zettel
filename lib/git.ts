import fs from 'fs';
import path from 'path';
import { compile } from "@mdx-js/mdx";
import { simpleGit, SimpleGit } from 'simple-git';
import { ZettelVersion } from './types';

const git: SimpleGit = simpleGit();

export async function getFileVersions(filePath: string): Promise<ZettelVersion[]> {
  try {
    const log = await git.log({
      file: 'public/' + filePath,
      maxCount: 50
    });
    
    const versions: ZettelVersion[] = [];
    
    // Filter out commits that only modify exports/imports
    for (const commit of log.all) {
      const hasContent = await hasContentChanges(filePath, commit.hash);
      if (hasContent) {
        versions.push({
          commitHash: commit.hash,
          commitDate: new Date(commit.date),
          commitMessage: commit.message,
          author: commit.author_name,
          filePath: filePath
        });
      }
    }
    
    return versions;
  } catch (error) {
    console.error(`Error getting versions for ${filePath}:`, error);
    return [];
  }
}

export async function getFileAtCommit(filePath: string, commitHash: string): Promise<any> {
  return undefined;
}

export async function getCurrentCommitHash(): Promise<string> {
  try {
    const log = await git.log({ maxCount: 1 });
    return log.latest?.hash || '';
  } catch (error) {
    console.error('Error getting current commit hash:', error);
    return '';
  }
}

export async function hasContentChanges(filePath: string, commitHash: string): Promise<boolean> {
  try {
    const fullPath = path.resolve(process.cwd(), 'public', filePath);
    const relativePath = path.relative(process.cwd(), fullPath);
    
    // Get the diff for this commit
    const diff = await git.show([commitHash, '--', relativePath]);
    
    if (!diff) return false;
    
    const lines = diff.split('\n');
    
    for (const line of lines) {
      if (line.startsWith('@@') || line.startsWith('diff --git') || line.startsWith('index') || line.startsWith('+++') || line.startsWith('---')) {
        continue;
      }
      
      // Check for actual content changes (added or removed lines)
      if (line.startsWith('+') || line.startsWith('-')) {
        const content = line.substring(1).trim();
        
        // Skip empty lines and export/import statements
        if (content === '' || content.startsWith('export ') || content.startsWith('import ')) {
          continue;
        }
        
        // If we find any non-export/import change, this commit has content changes
        return true;
      }
    }
    
    return false;
  } catch (error) {
    console.error(`Error checking content changes for commit ${commitHash}:`, error);
    return true; // Default to true if we can't determine
  }
}
