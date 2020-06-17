import _ from 'lodash';
import { findPointOnLine } from './viz_helpers';

class VizNode {
    constructor(id, position, outgoing_anchors, incoming_anchors, width, height) {
        this.id = id;
        this.position = position;
        this.width = width;
        this.height = height;

        let anchors = [
            ...incoming_anchors.map(anch => ({ in: true, ...anch })),
            ...outgoing_anchors.map(anch => ({ in: false, ...anch })),
        ]

        anchors = anchors.map(anch => ({
            angle: Math.atan2((anch.point[1] - position[1]), (anch.point[0] - position[0])),
            ...anch,
        }));

        this.anchors = _.sortBy(anchors, (o, i) => o.angle)
    }

    compute_bindings_position(binding_class, incomming_connections, outgoing_connections) {
        const connections = [
            ...incomming_connections.map(conn => ({ in: true, nodes: conn })),
            ...outgoing_connections.map(conn => ({ in: false, nodes: conn })),
        ]
        const binder = new binding_class()

        this.bindings = binder.compute_bindings(this.anchors, connections)[1];
    }

    drawOnCanvas(context, SCALE, [X, Y]) {
        context.beginPath();
        context.arc((this.position[X]) * SCALE, (this.position[Y]) * SCALE, (this.width / 2 - 5) * SCALE, 0, 2 * Math.PI, false);
        context.lineWidth = 5;
        context.stroke();
        context.closePath();
        context.fillText(this.id, (this.position[X]) * SCALE, (this.position[Y] + this.width / 8) * SCALE);

        this.bindings.forEach(binding => this.drawBindingOnCanvas(binding, context, SCALE, [X, Y]));
    }

    drawBindingOnCanvas(binding, context, SCALE, [X, Y]) {
        const distance = 28 + 4*binding.layer_n;

        const points = binding.sequence.map(anchor_idx => {
            const point = findPointOnLine(this.position, this.anchors[anchor_idx].points, distance)

            context.beginPath();
            context.arc((point[X]) * SCALE, (point[Y]) * SCALE, 2 * SCALE, 0, 2 * Math.PI, false);
            context.fillStyle = anchor_idx == 0 ? 'green' : 'black';
            context.fill();
            context.closePath();
            return point;
        });

        const start = [...points[0]];
        const end = [...points[points.length - 1]];
        start[X] -= this.position[X]
        start[Y] -= this.position[Y]
        end[X] -= this.position[X]
        end[Y] -= this.position[Y]
        
        const s_angle = Math.atan2(start[Y], start[X])
        const e_angle = Math.atan2(end[Y], end[X])

        if (s_angle != e_angle) {
            context.beginPath();
            context.arc(
                this.position[X] * SCALE,
                this.position[Y] * SCALE,
                distance * SCALE,
                s_angle,
                e_angle,
                false
            );
    
            context.lineWidth = 3;
    
            context.stroke();
            context.closePath();
        }
        
    }
}

export default VizNode;