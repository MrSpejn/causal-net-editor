import _ from 'lodash';
import { findPointOnLine } from './viz_helpers';
import DrawingContext from './DrawingContext';

import {
    Anchor,
    Point,
    RawConnection,
    Connection,
} from '../graphVisualization/types';

import {
    BindingLayering,
    Binding,
    Constructable,
} from '../bindingLayeringAlgorithms/types';
import ElementRegistry, { ElementType } from '../canvasIntercativity/ElementRegistry';

class VizNode {
    id: string;
    position: Point;
    width: number;
    height: number;
    anchors: Array<Anchor>;
    bindings: Array<Binding>;
    connections?: Array<Connection>;

    constructor(id: string, position:Point, outgoing_anchors: Array<Anchor>,
                incoming_anchors: Array<Anchor>, width: number, height: number) {
        this.id = id;
        this.position = position;
        this.width = width;
        this.height = height;
        this.bindings = [];

        let anchors = [
            ...incoming_anchors.map(anch => ({ in: true, ...anch })),
            ...outgoing_anchors.map(anch => ({ in: false, ...anch })),
        ]

        anchors = anchors.map(anch => ({
            angle: Math.atan2((anch.point[1] - position[1]), (anch.point[0] - position[0])),
            ...anch,
        }));

        this.anchors = _.sortBy(anchors, (o) => o.angle)
    }

    compute_bindings_position(binding_class: Constructable<BindingLayering>,
                              incomming_connections: Array<RawConnection>,
                              outgoing_connections: Array<RawConnection>) {
        const connections = [
            ...incomming_connections.map(conn => ({ in: true, nodes: conn })),
            ...outgoing_connections.map(conn => ({ in: false, nodes: conn })),
        ]
        const binder = new binding_class();

        this.bindings = binder.compute_bindings(this.anchors, connections);
        this.connections = connections;
    }

    draw(context: DrawingContext, elementRegistry: ElementRegistry) {
        context.drawCircle(this.position, (this.width / 2), {
            'lineWidth': 1.5,
            'stroke': true,
        });
        elementRegistry.registerElement(this.position, this.width / 2, {
            type: ElementType.NODE,
            node: this,
        });
        context.drawText(this.id, this.position, {
            font: 'bold 16px serif',
            textAlign: "center",
        });

        this.bindings.forEach((binding, idx) => this.drawBinding(binding, this.connections![idx], context, elementRegistry));
    }

    drawBinding(binding: Binding, conn: Connection, context: DrawingContext, elementRegistry: ElementRegistry) {
        const distance = 19 + 4*(conn.in as unknown as number) + 4 * binding.layer_n;

        const points = binding.sequence.map(anchor_idx => {
            const point = findPointOnLine(this.position, this.anchors[anchor_idx].points, distance)
            
            context.drawCircle(point, 2, {
                fillStyle:  anchor_idx === 0 ? 'green' : 'black',
                cfill: true,
            });
            elementRegistry.registerElement(point, 2, {
                type: ElementType.ANCHOR,
                anchor: this.anchors[anchor_idx],
                connection: conn, 
                node: this,
            });
            return point;
        });

        const start = [...points[0]];
        const end = [...points[points.length - 1]];
        start[0] -= this.position[0]
        start[1] -= this.position[1]
        end[0] -= this.position[0]
        end[1] -= this.position[1]
        
        const s_angle = Math.atan2(start[1], start[0])
        const e_angle = Math.atan2(end[1], end[0])

        if (s_angle !== e_angle) {
            context.drawArc(this.position, distance, s_angle, e_angle, {
                lineWidth: 1,
                stroke: true,
            });
        }
        
    }
}

export default VizNode;