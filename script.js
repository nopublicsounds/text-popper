const { Engine, World, Bodies, Runner } = Matter;

const engine = Engine.create();
const world = engine.world;

const w = window.innerWidth;
const h = window.innerHeight;
const thickness = 40;

const ground = Bodies.rectangle(w / 2, h - thickness / 2, w, thickness, { isStatic: true });
const ceiling = Bodies.rectangle(w / 2, -thickness / 2, w, thickness, { isStatic: true });
const leftWall = Bodies.rectangle(-thickness / 2, h / 2, thickness, h, { isStatic: true });
const rightWall = Bodies.rectangle(w + thickness / 2, h / 2, thickness, h, { isStatic: true });

const mouse = Matter.Mouse.create(document.getElementById('board'));
const mouseConstraint = Matter.MouseConstraint.create(engine, {
    mouse: mouse,
    constraint:{
        stiffness: 0.2,
        render:{
            visible: false
        }
    }
});

World.add(world, [ground, ceiling, leftWall, rightWall, mouseConstraint]);
Runner.run(Runner.create(), engine);

let isZeroG = false;

const btn = document.getElementById('toggleGravity');
btn.addEventListener('click', function(){
    isZeroG = !isZeroG;
    engine.world.gravity.y = isZeroG ? 0 : 1;
    btn.textContent = isZeroG ? '🚀 zero-g' : '🌍 gravity';
});

const arrowForce = { ArrowLeft: [-0.1,0], ArrowRight: [0.1,0], ArrowUp: [0,-0.1], ArrowDown: [0,0.1] };

const DOM = document.getElementById('board');
DOM.addEventListener('keydown', (event) => {
    const dir = arrowForce[event.key];
    if(dir){
        event.preventDefault();
        world.bodies.forEach((b) => {
            if(!b.isStatic){
                Matter.Body.applyForce(b, b.position, { x: dir[0], y: dir[1] });
            }
        }); 

        return;
    }

    
    const size = 50;
    const el = document.createElement('h2');
    el.className = 'letter';
    el.textContent = event.key;
    el.style.position = 'absolute';
    el.style.width = `${size}px`;
    el.style.height = `${size}px`;
    DOM.appendChild(el);

    const body = Bodies.rectangle(w / 2, h / 2, size, size);
    World.add(world, body);
    Matter.Body.setVelocity(body, { x: (Math.random() - 0.5) * 20, y: (Math.random() - 0.5) * 20 });

    function update(){
        el.style.left = (body.position.x - size / 2) + "px";
        el.style.top = (body.position.y - size / 2) + "px";
        el.style.transform = `rotate(${body.angle}rad)`;
        requestAnimationFrame(update);

        world.bodies.forEach((b) => {
            if(!b.isStatic){
                b.frictionAir = isZeroG ? 0.005 : 0.01;
            }
        });
    }
    update();
});