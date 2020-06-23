export type AdjacencyMatrix = Array<Array<number>>
export type Node = {
    id: number;
    name: string;
    additional_info?: Object;
    outgoing: Array<Array<number>>;
    incomming: Array<Array<number>>;
}
export type ConnectionInProgress = {
    origin: number | null,
    destination: Array<number>,
    in: boolean,
}