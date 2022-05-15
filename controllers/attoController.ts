import { CACHE_PATH, CACHE_ATTI, IN_CONSEGNA_QUERY, IN_CORSO_QUERY, IN_GESTIONE_QUERY } from '../lib/constants';
import { readFile, writeFile, safeParseJSON, safeParseAttiJSON } from '../services/attoService';
import { fetchMementoEntries, filterOutOldEntries } from '../services/attoService';
import { Atto, Entry } from '../models/attoModel';
import entriesMapper from '../services/mapper';
import mementoLibraryUrl from '../lib/requestUrls';

export const controllerGetPaths = async (): Promise<[string[], Atto[]]> => {
    const cachedPaths = safeParseJSON(await readFile(CACHE_PATH)) // return empty list when file is not found instead of throwing an error

    const [gestioneEntries, incorsoEntries, inconsegnaEntries] = await Promise.all([fetchMementoEntries(mementoLibraryUrl(IN_GESTIONE_QUERY)), 
                                                                                  fetchMementoEntries(mementoLibraryUrl(IN_CORSO_QUERY)),
                                                                                  fetchMementoEntries(mementoLibraryUrl(IN_CONSEGNA_QUERY))])

    const allEntries = [...gestioneEntries.entries, ...incorsoEntries.entries, ...inconsegnaEntries.entries]
    
    const arrayOfLawyerIdsObjects = entriesMapper(allEntries, 'lawyerIdExtractor') // extract lawyer ids into an array of objects

    const atti = entriesMapper(allEntries, 'attoExtractor') as Atto[]

    const extractArrayOfLawyerIds = (arrayOfLawyerIdsObjects): string[] => arrayOfLawyerIdsObjects.reduce(
        (acc: string[], value: {lawyerId: string}) => [...acc, value.lawyerId], []) // convert array of objects (of lawyer ids) to an array of strings (of lawyer ids)
    
    const uniqueLawyerIdPaths = [...new Set([...cachedPaths, ...extractArrayOfLawyerIds(arrayOfLawyerIdsObjects)])] // remove duplicates;
                            .filter(id => !id.includes("ReferenceError")) // remove invalid ids due to memento errors

    return [uniqueLawyerIdPaths, atti]

}

export const controllerCachePaths = async (paths): Promise<void> => {
    writeFile(CACHE_PATH, JSON.stringify(paths, null, 4)).catch(err => console.error(err))
}

export const controllerCacheAtti = async (atti: Atto[]): Promise<void> => {
    writeFile(CACHE_ATTI, JSON.stringify(atti, null, 4)).catch(err => console.error(err))  // cache entries for later use by getStaticProps
}

export const controllerGetLawyerAttiById = async (id: string): Promise<Atto[]> => {
    const cachedEntries = safeParseAttiJSON(await readFile(CACHE_ATTI)) as Atto[]

    const lawyerAtti = cachedEntries.filter(atto => atto.lawyerId === id)

    const relevantAtti = filterOutOldEntries(lawyerAtti)

    return relevantAtti    
}