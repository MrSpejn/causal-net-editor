import Graph from "../graphRepresentation/Graph";

export type CrossModeData = {
    canvasDisplay: {
        scale: number,
        scrollTop: number;
        scrollLeft: number;
    },
    graph: Graph | null,
}
