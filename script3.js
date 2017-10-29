const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const imgHero = document.getElementById('hero');
const imgBadGuy = document.getElementById('bad_guy');

const leftKey = 37;
const upKey = 38;
const rightKey = 39;
const downKey = 40;

const rand = function(num) {
    return Math.floor(Math.random() * num) + 1;
};

document.addEventListener('keydown', function(event) {
    const hero = gameData.hero;
    hero.xDelta = 0;
    hero.yDelta = 0;
    if (event.keyCode === upKey && hero.y > 0) {
        hero.yDelta = -2;
    } else if (event.keyCode === downKey && hero.y + hero.height < canvas.height) {
        hero.yDelta = 2;
    } else if (event.keyCode === leftKey && hero.x > 0) {
        hero.xDelta = -2;
    } else if (event.keyCode === rightKey && hero.x + hero.width < canvas.width) {
        hero.xDelta = 2;
    }
}, false);

const addBadGuys = function(count) {
    if (count === 0) {
        return;
    }

    const rectSideSize = 30;
    const x = rand(canvas.width) - rectSideSize;
    const y = rand(canvas.height) - rectSideSize;

    const point = {
        x: x > 0 ? x : 0,
        y: y > 0 ? y : 0,
        width: rectSideSize,
        height: rectSideSize,
        xDelta: 0.5,
        yDelta: 0.5
    };
    gameData.badGuys.push(point);
    addBadGuys(count - 1);
};

const renderBadGuys = function(idx) {
    idx = idx || 0;
    if (idx === gameData.badGuys.length) {
        return;
    }
    const point = gameData.badGuys[idx];

    ctx.drawImage(imgBadGuy, point.x, point.y, point.width, point.height);
    renderBadGuys(idx + 1);
};

const render = function() {
    renderBadGuys();
    const hero = gameData.hero;
    ctx.drawImage(imgHero, hero.x, hero.y, hero.width, hero.height);
};

const updateBadGuysData = function(idx) {
    idx = idx || 0;
    const badGuys = gameData.badGuys;

    if (idx === badGuys.length) {
        return;
    }
    const point = badGuys[idx];
    point.x = point.x + point.xDelta;
    point.y = point.y + point.yDelta;

    if (point.x >= canvas.width - point.width || point.x <= 0) {
        point.xDelta = -point.xDelta;
    }
    if (point.y >= canvas.height - point.height || point.y <= 0) {
        point.yDelta = -point.yDelta;
    }
    updateBadGuysData(idx + 1);
};

const isGameOver = function(idx) {
    idx = idx || 0;
    const badGuys = gameData.badGuys;
    const hero = gameData.hero;
    if (idx === badGuys.length) {
        return false;
    }

    const point = badGuys[idx];
    const isBadGuyLeftSideInHero = point.x >= hero.x && point.x <= hero.x + hero.width;
    const isBadGuyRightSideInHero = point.x + point.width >= hero.x && point.x + point.width <= hero.x + hero.width;
    const isBadGuyTopSideInHero = point.y >= hero.y && point.y <= hero.y + hero.height;
    const isBadGuyBottomSideInHero = point.y + point.height >= hero.y && point.y + point.height <= hero.y + hero.height;

    if ((isBadGuyLeftSideInHero || isBadGuyRightSideInHero)
        && (isBadGuyTopSideInHero || isBadGuyBottomSideInHero)) {
        return true;
    }

    return isGameOver(idx + 1);
};

const updateData = function() {
    if (isGameOver()) {
        alert('Game Over');
    }
    updateBadGuysData();
    const hero = gameData.hero;
    hero.x = hero.x + hero.xDelta;
    hero.y = hero.y + hero.yDelta;

    if (hero.x >= canvas.width - hero.width || hero.x <= 0) {
        hero.xDelta = 0;
    }
    if (hero.y >= canvas.height - hero.height || hero.y <= 0) {
        hero.yDelta = 0;
    }
};

const loop = function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    render();
    updateData();

    requestAnimationFrame(loop);
};

const speedUpBadGuys = function(idx) {
    idx = idx || 0;
    const badGuys = gameData.badGuys;

    if (idx === badGuys.length) {
        return;
    }
    const point = badGuys[idx];
    const delta = 0.1;
    point.xDelta = (Math.abs(badGuys[0].xDelta) + delta) * Math.sign(point.xDelta);
    point.yDelta = (Math.abs(badGuys[0].yDelta) + delta) * Math.sign(point.yDelta);

    speedUpBadGuys(idx + 1);
};

const levelUp = function() {
    alert("Level up");
    addBadGuys(2);
    speedUpBadGuys();
};

const gameData = {
    hero: {
        x: canvas.width / 2,
        y: canvas.height / 2,
        width: 20,
        height: 20,
        xDelta: 0,
        yDelta: 0
    },
    badGuys: []
};

addBadGuys(10, canvas.width, canvas.height);
loop();
setInterval(levelUp, 30000);