export type Point = [number, number];
export type Angle = number;

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