export type AdjacencyMatrix = Array<Array<number>>
export type Node = {
    id: number;
    name: string;
    additional_info?: Object;
    outgoing: Array<Array<number>>;
    incomming: Array<Array<number>>;
}
export type ConnectionInProgress = {
    origin: Node | null,
    destination: Array<Node>,
    in: boolean,
}