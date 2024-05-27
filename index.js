// script.js
document.addEventListener('DOMContentLoaded', () => {
    const car = document.getElementById('car');
    let posX = window.innerWidth / 2 - 50; // Başlangıçta ekranın ortasında
    let posY = window.innerHeight / 2 - 25;
    let rotation = 0;
    const step = 5;
    const rotationStep = 5;

    let keys = {};

    function moveCar() {
        if (keys['ArrowUp']) {
            posX += step * Math.cos(rotation * Math.PI / 180);
            posY += step * Math.sin(rotation * Math.PI / 180);
        }
        if (keys['ArrowDown']) {
            posX -= step * Math.cos(rotation * Math.PI / 180);
            posY -= step * Math.sin(rotation * Math.PI / 180);
        }
        if (keys['ArrowLeft']) {
            rotation -= rotationStep;
        }
        if (keys['ArrowRight']) {
            rotation += rotationStep;
        }
        car.style.transform = `translate(${posX}px, ${posY}px) rotate(${rotation}deg)`;
    }

    document.addEventListener('keydown', (event) => {
        keys[event.key] = true;
    });

    document.addEventListener('keyup', (event) => {
        keys[event.key] = false;
    });

    setInterval(moveCar, 20);
});
