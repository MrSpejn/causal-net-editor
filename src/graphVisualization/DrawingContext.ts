import Victor from 'victor';
import { Point } from './types';

interface ContextOptions {
    [key: string]: any;
};
 
interface RegistrationData {
    [key: string]: any;
}

const DEFAULT_ARROW_LENGTH = 5;
const DEFAULT_ARROW_WIDTH = 4;

class DrawingContext {
    context: CanvasRenderingContext2D;
    SCALE: number;
    X: number;
    Y: number;
    shiftX: number;
    shiftY: number;

    constructor(canvas: HTMLCanvasElement, scale: number,
                x: number, y: number,
                shift_x: number, shift_y: number) {
        this.context = canvas.getContext('2d')!;
        this.SCALE = scale;
        this.X = x;
        this.Y = y;
        this.shiftX = shift_x;
        this.shiftY = shift_y;
    }

    _applyContextOptions(contextOptions: ContextOptions, afterClose: boolean): void {
        const toExecute = []
        for (let [key, value] of Object.entries(contextOptions)) {
            
            if ((key === 'stroke' || key === 'fill')) {
                if (value && !afterClose) {
                    toExecute.push(key);
                }
            } else if ((key === 'cstroke' || key === 'cfill')) {
                if (value && afterClose) {
                    toExecute.push(key.slice(1));
                }
            } else {
                if (typeof value === 'number') {
                    // @ts-ignore
                    this.context[key] = value * this.SCALE;
                } else if (key === 'font') {
                    const fields = value.split(' ');
                    const fontSize = parseInt(fields[1].slice(0, -2)) * this.SCALE;
                    this.context.font = `${fields[0]} ${fontSize}px ${fields[2]}`;
                }
            }
        }
        for (let fn of toExecute) {
            // @ts-ignore
            this.context[fn]();
        }
    }

    _coord(point: Point): Point {
        return [
            (point[this.X] + this.shiftX) * this.SCALE,
            (point[this.Y] + this.shiftY) * this.SCALE
        ];
    }

    drawSegmentedArrow(points: Array<Point>, contextOptions: ContextOptions): void {
        this.drawSegmentedLine(points, {...contextOptions, fill: false, cfill: false, stroke: true });
        const last = points[points.length - 1];
        const prelast = points[points.length - 2];

        this.drawArrowHead(
            points[points.length - 1],
            [last[0] - prelast[0], last[1] - prelast[1]],
            {...contextOptions, fill: false, cfill: true },
        )
    }

    drawArrowHead(origin: Point, directionVector: Point, contextOptions: ContextOptions): void {
        this.context.beginPath();
        const origin_v = new Victor(...origin);
        
        const diff_vect = new Victor(...directionVector).normalize();
        const arr_length = (contextOptions.arr_length || DEFAULT_ARROW_LENGTH);
        const arr_width =  (contextOptions.arr_width || DEFAULT_ARROW_WIDTH);
        diff_vect.x = diff_vect.x * arr_length;
        diff_vect.y = diff_vect.y * arr_length;
        const ortogonal = diff_vect.clone().rotateBy(Math.PI / 2).normalize();
        ortogonal.x = ortogonal.x * arr_width / 2;
        ortogonal.y = ortogonal.y * arr_width / 2;

        const points = [
            origin_v.clone().add(diff_vect).toArray(),
            origin_v.clone().add(ortogonal).toArray(),
            origin_v.clone().subtract(ortogonal).toArray(),
        ];
        
        points.forEach((point) => {
            const coord = this._coord(point as Point);
            this.context.lineTo(coord[0], coord[1]);
        });
        this._applyContextOptions(contextOptions, false);
        this.context.closePath();

        this._applyContextOptions(contextOptions, true);
    }

    drawSegmentedLine(points: Array<Point>, contextOptions: ContextOptions): void {
        this.context.beginPath();
        points.forEach((point) => {
            this.context.lineTo(...this._coord(point));
        });
        this._applyContextOptions(contextOptions, false);
        this.context.closePath();

        this._applyContextOptions(contextOptions, true);
    }

    drawArc(center: Point, radius: number, angleStart: number, angleEnd: number, contextOptions: ContextOptions): void {
        this.context.beginPath();
        const coord = this._coord(center);
        this.context.arc(coord[0], coord[1], radius * this.SCALE, angleStart, angleEnd, false);
        this._applyContextOptions(contextOptions, false);
        this.context.closePath();

        this._applyContextOptions(contextOptions, true);
    }

    drawCircle(center: Point, radius: number, contextOptions: ContextOptions): void {
        this.context.beginPath();
        const coord = this._coord(center);
        this.context.arc(coord[0], coord[1], radius * this.SCALE, 0, 2 * Math.PI, false);
        this._applyContextOptions(contextOptions, false);
        this.context.closePath();

        this._applyContextOptions(contextOptions, true);
    }

    drawText(text: string, position: Point, contextOptions: ContextOptions): void {
        this._applyContextOptions({
            ...contextOptions,
            stroke: false,
            fill: false,
        }, false);
        const coord = this._coord(position);
        this.context.fillText(text, coord[0], coord[1]);

    }
}

export default DrawingContext;