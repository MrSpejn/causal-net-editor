import { Point, Connection, Anchor } from "../graphVisualization/types";
import VizNode from "../graphVisualization/VizNode";

export enum ElementType {
    ANCHOR = "ANCHOR",
    NODE = "NODE",
}

export interface ElementData {
    type: ElementType;
    [key: string]: any;
}

export interface AnchorData {
    type: ElementType;
    node: VizNode;
    connection: Connection;
    anchor: Anchor;
}

export interface NodeData {
    type: ElementType;
    node: VizNode;
}

export interface InteractiveElement {
    center: Point;
    radius: number;
    data: ElementData;    
}

class ElementRegistry {
    elementList: Array<InteractiveElement> = [];

    registerElement(center: Point, radius: number, data: ElementData) {
        this.elementList.push({
            center,
            radius,
            data,
        });
    }

    getElementOnPosition(position: Point): InteractiveElement | null {
        for (let el of this.elementList) {
            const quadraticDistance = (position[0] - el.center[0])*(position[0] - el.center[0]) +
            (position[1] - el.center[1])*(position[1] - el.center[1]);
            if (quadraticDistance < el.radius*el.radius) {
                return el;
            }
        }
        return null;
    }
}

export default ElementRegistry