import React from "react";

export interface ZettelMeta {
    id: string;
    title: string;
    date: Date;
    tags?: string[];
    abstract?: string;
    sectionNumber?: number;
    Content?: any;
};

export interface ZettelVersion {
    revision: number;
    commitHash: string;
    timestamp: Date;
    commitMessage: string;
}

export interface VersionedZettel extends ZettelMeta {
    version: ZettelVersion;
}