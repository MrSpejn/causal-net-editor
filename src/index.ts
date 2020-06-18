import Graph from './graphRepresentation/Graph';
import SugiyamaLayout from './layoutAlgorithms/SugiyamaLayout';
import RandomLayering from './bindingLayeringAlgorithms/RandomLayering';
import GraphVisualization from './graphVisualization/GraphVisualization';

import JSONGraph from './graph2';

const graph = Graph.fromJSON(JSON.stringify(JSONGraph));
const graph_visualization = new GraphVisualization(SugiyamaLayout, RandomLayering);

graph_visualization.computeGraphicalRepresentation(graph).then(() => {
  const canvas = document.querySelector('canvas');
  graph_visualization.drawOnCanvas(canvas!);
});
