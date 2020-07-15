
const center = [32, 108];
const points = [
    [20,-13.33],[62,95],[62,36.33], [230,-72]
]

function calcAngle(x, y) {
    return Math.atan2(y, x);
}

function getInterpolationWithDistance(x1, y1, x2, y2, distance) {
    const A = (x2*x2) - (2*x1*x2) + (x1*x1) + (y1*y1) + (y2*y2) - (2*y1*y2)
    const B = 2*x1*x2 + 2*y1*y2 - (2*x1*x1) - (2*y1*y1);
    const C = y1*y1 + x1*x1 - distance*distance;

    const delta = B*B - 4*A*C;
    console.log('Delta', delta);

    if (delta < 0) {
        return null;
    }
    const optima = [
        (-B + Math.sqrt(delta)) / (2*A),
        (-B - Math.sqrt(delta)) / (2*A),
    ]
    console.log('Optima', optima);

    for (let i = 0; i < optima.length; i++) {
        if (optima[i] >= 0 && optima[i] <= 1) {
            return optima[i]
        }
    }
    return null;
}

function get_point_on_line_with_distance(center, line, distance) {
    const center_coords = line.map(point => ([point[0] - center[0], point[1] - center[1]]));

    for (let i = 0; i < center_coords.length - 1; i++) {
        const theta = getInterpolationWithDistance(center_coords[i][0], center_coords[i][1], center_coords[i+1][0], center_coords[i+1][1], distance);
        if (theta != null) {
            const point = [
                center_coords[i+1][0]*theta + center_coords[i][0]*(1 - theta),
                center_coords[i+1][1]*theta + center_coords[i][1]*(1 - theta),
            ]

            return point;
        }
       
    }

    throw new Error('Point could not be found');
}
const distance = 30;

console.log(points.map(point => ([point[0] - center[0], point[1] - center[1]])));

// console.log(get_point_on_line_with_distance(center, points, distance))

