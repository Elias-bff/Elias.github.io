Math.rotate = function(angle, cx, cy, x, y){
    let x2 = Math.cos(angle) * (x - cx) - Math.sin(angle) * (y - cy) + cx;
    let y2 = Math.sin(angle) * (x - cx) + Math.cos(angle) * (y - cy) + cy;

    return [x2, y2];
}