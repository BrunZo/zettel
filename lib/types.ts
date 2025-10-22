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