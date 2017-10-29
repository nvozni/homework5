// returns a random number between 1 and the given number inclusively
// Example: rand(5) will return 1, 2, 3, 4, or 5 randomly
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const rand = function(num) {
    return Math.floor(Math.random() * num) + 1;
};

const createPoints = function(count, canvasWidth, canvasHeight) {
    if (count === 0) {
        return;
    }

    const colorArray = ['red', 'green', 'orange'];
    const rectSideSize = 30;
    const x = rand(canvasWidth) - rectSideSize;
    const y = rand(canvasHeight) - rectSideSize;

    const point = {
        x: x > 0 ? x : 0,
        y: y > 0 ? y : 0,
        width: rectSideSize,
        height: rectSideSize,
        xDelta: 1,
        yDelta: 1,
        color: colorArray[rand(colorArray.length) - 1]
    };
    points.push(point);
    createPoints(count - 1, canvasWidth, canvasHeight);
};

const render = function(idx) {
    idx = idx || 0;
    if (idx === points.length) {
        return;
    }
    //ctx.clearRect(0, 0, canvas.width, canvas.height);
    const point = points[idx];

    ctx.fillStyle = point.color;
    ctx.fillRect(point.x, point.y, point.width, point.height);
    render(idx + 1);
};

const updateData = function(idx) {
    idx = idx || 0;
    if (idx === points.length) {
        return;
    }
    const point = points[idx];
    point.x = point.x + point.xDelta;
    point.y = point.y + point.yDelta;

    if (point.x >= canvas.width - point.width || point.x <= 0) {
        point.xDelta = -point.xDelta;
    }
    if (point.y >= canvas.height - point.height || point.y <= 0) {
        point.yDelta = -point.yDelta;
    }
    updateData(idx + 1);
};

const loop = function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    render();
    updateData();

    requestAnimationFrame(loop);
};

const points = [];
createPoints(10, canvas.width, canvas.height);
loop();