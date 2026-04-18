export type Comment = {
id: string;
text: string;
};

export type Issue = {
id: string;
title: string;
description: string;
location: string;
image?: string | null;
status: string;
likes: number;
comments: Comment[];
};

export const issuesStore: Issue[] = [];
