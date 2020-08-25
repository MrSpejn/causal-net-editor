export type Point = [number, number];
export type Angle = number;

export interface ContextOptions {
    [key: string]: any;
};
 
export interface RegistrationData {
    [key: string]: any;
}


export type AnchorIdx = number;
export interface Anchor {
    point: Point;
    points: Array<Point>;
    target: string;
    angle?: Angle;
    in?: boolean;
};

export type RawConnection = Array<number>;
export type Connection = {
    in: boolean;
    nodes: RawConnection;
}

export interface DrawingContext {
    drawCircle(center: Point, radius: number, contextOptions: ContextOptions): void
    drawArc(center: Point, radius: number, angleStart: number, angleEnd: number, contextOptions: ContextOptions): void
    drawSegmentedArrow(points: Array<Point>, contextOptions: ContextOptions): void
    drawSegmentedArrow(points: Array<Point>, contextOptions: ContextOptions): void
}