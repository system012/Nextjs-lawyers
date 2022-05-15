export type Atto = {
    idPex: number;
    atto: string;
    stato: string;
    dataConsegna: string;
    lawyerId: string;
}

export type LawyerId = {
    lawyerId: string;
}

export type Entry = {
    id: string;
    author: string;
    createdTime: string;
    modifiedTime: string;
    revision: number;
    status: string;
    size: number;
    fields: {
        id: number;
        value: string | number | string[] | boolean;
    }[];
}

export type Entries = {
    entries: 
     Entry[],
    nextPageToken?: string;
    total: number;
  };