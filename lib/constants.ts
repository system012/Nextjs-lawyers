import path from 'path';

export const CACHE_PATH = path.resolve('./cache/paths.json');
export const CACHE_ATTI = path.resolve('./cache/entries.json');
export const IN_CORSO_QUERY = encodeURI('in corso');
export const IN_GESTIONE_QUERY = encodeURI('in gestione');
export const IN_CONSEGNA_QUERY = encodeURI('in consegna');