import fs from 'fs';
import { matrix } from 'mathjs';

import { fixAdjMatrix } from "./graphGeneration/utils";
import Graph from "../src/graphRepresentation/Graph";

const tiers = [[0], [1, 2], [3], [4, 5], [6], [7], [8], [9, 10], [11, 12], [13]];

const graph = Graph.fromJSON(fs.readFileSync("./experiments/instances/0.1_12_v/graph-2c8567af-7bae-4eec-83f6-862c7dd2be12.json").toString());

const mtx = matrix(graph.adj_matrix);
fixAdjMatrix(mtx, tiers);
console.log(mtx);