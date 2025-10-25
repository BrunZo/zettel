export interface ZettelMeta {
    id: string;
    path: string;
    title: string;
    date: Date;
    tags?: string[];
    abstract?: string;
    default?: any;
};

export interface ZettelVersion {
    commitHash: string;
    commitDate: Date;
    commitMessage: string;
    author: string;
    filePath: string;
}

export interface ZettelWithVersions extends ZettelMeta {
    versions?: ZettelVersion[];
    currentVersion?: ZettelVersion;
    filePath?: string;
}
