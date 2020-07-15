function clockwise_distance(curr, prev) {
    if (curr < 0 && prev >= 0) {
        curr += 2*Math.PI;
    }
    const diff = curr - prev;
    if (diff < 0) {
        return diff + 2*Math.PI;
    }
    return diff;
}

console.log(clockwise_distance(-3.14, 3.14))
console.log(clockwise_distance(3.14, 3.13))
console.log(clockwise_distance(3.13, 3.14))
console.log(clockwise_distance(3.14, -3.14))
console.log(clockwise_distance(-0.1, 0.1))
console.log(clockwise_distance(0.1, -0.1))
console.log(clockwise_distance(1.57, -1.57))
console.log(clockwise_distance(-1.57, 1.57))