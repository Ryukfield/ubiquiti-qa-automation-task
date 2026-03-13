/** biome-ignore-all lint/correctness/noUnusedVariables: Those variables used as types in the project */

type BookObjectType = {
    name: string;
    author: string;
    year: string;
    available: number;
}

type BookObjectTypeFromDatabase = BookObjectType & {
    id: number;
};