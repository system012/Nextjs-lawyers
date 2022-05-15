import { GetStaticProps } from 'next';
import { Atto } from '../../models/attoModel';
import { controllerGetPaths, controllerGetLawyerAttiById as controllerGetLawyerAttiById, controllerCacheAtti, controllerCachePaths } from '../../controllers/attoController';

interface Props {
    atti: Atto[] | [];
}

export default function showAtti({atti}: Props) {
    const attiData = atti.map((atto: Atto, index: number) => {
        return (
            <ul key={index}>
                <li>{atto.idPex}</li>
                <li>{atto.atto}</li>
                <li>{atto.stato}</li>
            </ul>
    )});
    
    return (
        <div>
            {attiData.length > 0 ? attiData : <p>No data</p>}
            {attiData && attiData.length}
        </div>
    )
}

export async function getStaticPaths() {
    const [paths, entries] = await controllerGetPaths();
    await controllerCachePaths(paths);
    await controllerCacheAtti(entries);

    return {
        fallback: false,
        paths: paths.map(id => ({ params: { lawyerId: id } }))
    }
}

export const getStaticProps: GetStaticProps = async (context) => {
    const id = context.params.lawyerId as string;
    const atti = await controllerGetLawyerAttiById(id);
    
    return {
        props: {
            atti
        }
    }
}