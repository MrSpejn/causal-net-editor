import _ from 'lodash';
import { StandarisedLayout } from "../../../src/layoutAlgorithms/types";

export function medianEdgeBreaksMetric(layout: StandarisedLayout): number {
    const breaks = layout.edges.map(edge => Math.max(edge.points.length - 4, 2));

    const sortedBreaks = _.sortBy(breaks)

    if (sortedBreaks.length % 2 === 1) {
        return sortedBreaks[Math.floor(sortedBreaks.length / 2)]
    }
    const i = Math.floor(sortedBreaks.length / 2);
    const j = Math.floor(sortedBreaks.length / 2) - 1;
    return (sortedBreaks[i] + sortedBreaks[j]) / 2
}