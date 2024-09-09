Math.rotate = function(angle, cx, cy, x, y){
    let x2 = Math.cos(angle) * (x - cx) - Math.sin(angle) * (y - cy) + cx;
    let y2 = Math.sin(angle) * (x - cx) + Math.cos(angle) * (y - cy) + cy;

    return [x2, y2];
}

Math.randInt = function(min, max){
    const ceil = Math.ceil(min)
    const floor = Math.floor(max)

    return Math.floor(Math.random() * (floor - ceil) + ceil)
}
  