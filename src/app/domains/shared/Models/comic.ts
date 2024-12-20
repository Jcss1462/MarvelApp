export interface Comic {
    id: number;
    digitalId: number;
    title: string;
    issueNumber: number;
    variantDescription: string;
    description: string;
    modified: string;
    isbn: string;
    upc: string;
    diamondCode: string;
    ean: string;
    issn: string;
    format: string;
    pageCount: number;
    resourceURI: string;
    urls: Url[];
    thumbnail: Thumbnail;
    image: Image[];
    favorite: boolean;
    creators: Creators;
    characters: Characters;
}

export interface Url {
    type: string,
    url: string
}

export interface Thumbnail {
    path: string,
    extension: string
}

export interface Image  {
    path: string,
    extension: string
}

export interface Items  {
    name: string,
    type: string
}

export interface Creators  {
    items: Items[],
}

export interface Characters  {
    items: Items[],
}