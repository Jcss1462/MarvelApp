import { Comic } from "./comic";

export interface ComicDataWrapper  {
    code: number;
    status: string;
    copyright: string;
    attributionText: string;
    attributionHTML: string;
    etag: string;
    data: ComicDataContainer
}


export interface ComicDataContainer {
    offset : number;
    limit : number;
    total : number;
    count : number;
    results : Comic[];
}

