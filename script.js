const { Engine, World, Bodies, Runner } = Matter;

const engine = Engine.create();
const world = engine.world;

const ground = Bodies.rectangle(window.innerWidth / 2, window.innerHeight - 20, window.innerWidth, 40, { isStatic: true });

World.add(world, ground);
Runner.run(Runner.create(), engine);

const DOM = document.getElementById('board');
DOM.addEventListener('keydown', function(event){
    const size = 50;
    const el = document.createElement('p');
    el.className = 'letter';
    el.textContent = event.key;
    el.style.position = 'absolute';
    el.style.width = `${size}px`;
    el.style.height = `${size}px`;
    DOM.appendChild(el);

    const x = Math.random() * (window.innerWidth - size);
    const body = Bodies.rectangle(x + size / 2, size / 2, size, size);
    World.add(world, body);

    function update(){
        el.style.left = (body.position.x - size / 2) + "px";
        el.style.top = (body.position.y - size / 2) + "px";
        el.style.transform = `rotate(${body.angle}rad)`;
        requestAnimationFrame(update);
    }
    update();
});