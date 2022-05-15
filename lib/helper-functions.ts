
//create a function that will sleep for a given amount of time
export function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export const dateAddDays = (date: string | Date, daysToAdd: number): number => {
    return new Date().setTime(new Date(date).valueOf() + 86400000 * daysToAdd)
}

export const datesDifference = (baseDate: string | Date, otherDate: number): number => {
    return new Date(baseDate).valueOf() - otherDate
}
