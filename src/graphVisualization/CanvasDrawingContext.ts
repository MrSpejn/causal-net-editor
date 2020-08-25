import Victor from 'victor';
import { Point, ContextOptions } from './types';

const DEFAULT_ARROW_LENGTH = 4;
const DEFAULT_ARROW_WIDTH = 5;

class CanvasDrawingContext {
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
            (point[this.X]) * this.SCALE  + this.shiftX,
            (point[this.Y]) * this.SCALE  + this.shiftY,
        ];
    }

    drawSegmentedArrow(points: Array<Point>, contextOptions: ContextOptions): void {
        this._drawSegmentedLine(points, {...contextOptions, fill: false, cfill: false, stroke: true });
        const last = points[points.length - 1];
        const prelast = points[points.length - 2];

        this._drawArrowHead(
            points[points.length - 1],
            [last[0] - prelast[0], last[1] - prelast[1]],
            {...contextOptions, fill: false, cfill: true },
        )
    }

    _drawArrowHead(origin: Point, directionVector: Point, contextOptions: ContextOptions): void {
        this.context.beginPath();
        const origin_v = new Victor(...origin);
        
        const diff_vect = new Victor(...directionVector).normalize();
        const ortogonal = diff_vect.clone().rotateDeg(90)

        const arr_length = (contextOptions.arr_length || DEFAULT_ARROW_LENGTH);
        const arr_width =  (contextOptions.arr_width || DEFAULT_ARROW_WIDTH);
        diff_vect.x = diff_vect.x * arr_length;
        diff_vect.y = diff_vect.y * arr_length;
        ortogonal.x = ortogonal.x * arr_width / 2;
        ortogonal.y = ortogonal.y * arr_width / 2;

        const points = [
            origin_v.clone().toArray(),
            origin_v.clone().subtract(diff_vect).add(ortogonal).toArray(),
            origin_v.clone().subtract(diff_vect).subtract(ortogonal).toArray(),
        ];
        
        const coords = points.map(point => this._coord(point as Point));
        coords.forEach((coord) => this.context.lineTo(coord[0], coord[1]));
        this._applyContextOptions(contextOptions, false);
        this.context.closePath();

        this._applyContextOptions(contextOptions, true);
    }

    _drawSegmentedLine(points: Array<Point>, contextOptions: ContextOptions): void {
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

    drawText(text: string, position: Point, maxWidth: number): void {
        
        this.context.textAlign = "center";
        this.context.textBaseline = "middle";

        const initialFont = 15;
        const targetWidth = maxWidth * .9 * this.SCALE;

        this.context.font = `${initialFont}px Arial`;

        const words = text.split(' ');
        const segments = words.map(word => this.context.measureText(word.padStart(5, "0")));

        const height = segments.length * initialFont * 1.9;
        
        const width = segments.reduce((max, m) => (max > m.width ? max : m.width), 0)

        const scale = Math.min(targetWidth / width, targetWidth / height)

        this.context.font = `${Math.floor(initialFont * scale)}px Arial`;
        const lineHeight = initialFont * scale * 1.1

        const start = -words.length / 2 + 0.5
        const end = start * -1
        for (let i = start, j = 0; i <= end; i++, j++) {
            const coord = this._coord([position[0], position[1]]);
            this.context.fillText(words[j], coord[0], coord[1] + i * lineHeight);
        }
    }
}

export default CanvasDrawingContext;