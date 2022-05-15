import { Atto, LawyerId, Entry } from '../models/attoModel';

const attoExtractor = (acc, field): Atto => {
    switch (field.id) {
        case 1:
            acc = { ...acc, ...{ idPex: field.value } };

        case 6:
            acc = { ...acc, ...{ atto: field.value } };

        case 18:
            acc = { ...acc, ...{ stato: field.value } };
        
        case 33:
            acc = { ...acc, ...{ dataConsegna: field.value } };
        
        case 146:
            acc = { ...acc, ...{ lawyerId: field.value } };
    }
    return acc;
}

const lawyerIdExtractor = (acc, field): LawyerId => {
    switch (field.id) {
        case 146:
            acc = { ...acc, ...{ lawyerId: field.value } };
    }
    return acc
}

const entriesMapper = (entries: Entry[] | [], extractorIndex: string = 'attoExtractor'): Atto[] | LawyerId[] => {
    if (entries.length < 1) return [];

    const extractors = {'attoExtractor': attoExtractor, 'lawyerIdExtractor': lawyerIdExtractor};

    return entries.flatMap((entry: Entry) => {
        return entry.fields.reduce((acc, field) => extractors[extractorIndex](acc, field)
        ,{})
    })
}

export default entriesMapper