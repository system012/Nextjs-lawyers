const token = process.env.TOKEN
const libraryId = process.env.NOVADATA22_ID

const mementoLibraryUrl = (query: string): string => {
    return `https://api.mementodatabase.com/v1/libraries/${libraryId}/search?q=${query}&fields=all&token=${token}`
}

export default mementoLibraryUrl