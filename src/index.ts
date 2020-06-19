import Graph from './graphRepresentation/Graph';

import JSONGraph from './graph2';
import InteractivityController from './canvasIntercativity/InteractivityController';

import './index.css';

const graph = Graph.fromJSON(JSON.stringify(JSONGraph));
const canvas = document.querySelector('canvas');
const controller = new InteractivityController();

controller.init(canvas!, graph);
