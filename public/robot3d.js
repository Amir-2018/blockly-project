/* public/robot3d.js — animated 3D robot background (Three.js, transparent canvas) */
(function () {
    if (typeof THREE === 'undefined') return; // CDN failed; page still works without it

    const canvas = document.createElement('canvas');
    canvas.className = 'robot3d-canvas';
    document.body.appendChild(canvas);

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0.6, 7);
    camera.lookAt(0, 0, 0);

    scene.add(new THREE.AmbientLight(0xffffff, 0.65));
    const dir = new THREE.DirectionalLight(0xffffff, 0.9);
    dir.position.set(4, 6, 5);
    scene.add(dir);
    const glow = new THREE.PointLight(0xfeda4f, 0.8, 20);
    glow.position.set(0, 1.2, 2);
    scene.add(glow);

    const blue = new THREE.MeshStandardMaterial({ color: 0x51c1e5, roughness: 0.5, metalness: 0.1 });
    const blueLight = new THREE.MeshStandardMaterial({ color: 0x7fcbe8, roughness: 0.5, metalness: 0.1 });
    const yellow = new THREE.MeshStandardMaterial({ color: 0xfeda4f, emissive: 0xfeda4f, emissiveIntensity: 0.6, roughness: 0.4 });
    const dark = new THREE.MeshStandardMaterial({ color: 0x0d1d37, roughness: 0.7 });

    const robot = new THREE.Group();

    const body = new THREE.Mesh(new THREE.BoxGeometry(1.3, 1.5, 0.9), blue);
    robot.add(body);

    const screen = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.9), yellow);
    screen.position.set(0, 0.15, 0.46);
    robot.add(screen);

    const head = new THREE.Mesh(new THREE.BoxGeometry(1.05, 0.85, 0.85), blueLight);
    head.position.y = 1.3;
    robot.add(head);

    const eyeGeo = new THREE.SphereGeometry(0.13, 16, 16);
    const eyeL = new THREE.Mesh(eyeGeo, dark); eyeL.position.set(-0.26, 1.35, 0.43);
    const eyeR = new THREE.Mesh(eyeGeo, dark); eyeR.position.set(0.26, 1.35, 0.43);
    robot.add(eyeL, eyeR);

    const antenna = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.4, 8), dark);
    antenna.position.y = 1.92;
    robot.add(antenna);
    const tip = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 16), yellow);
    tip.position.y = 2.18;
    robot.add(tip);

    const armGeo = new THREE.BoxGeometry(0.28, 1.05, 0.28);
    const armL = new THREE.Mesh(armGeo, blueLight); armL.position.set(-0.9, 0.1, 0);
    const armR = new THREE.Mesh(armGeo, blueLight); armR.position.set(0.9, 0.1, 0);
    robot.add(armL, armR);

    const legGeo = new THREE.BoxGeometry(0.4, 0.8, 0.4);
    const legL = new THREE.Mesh(legGeo, dark); legL.position.set(-0.35, -1.15, 0);
    const legR = new THREE.Mesh(legGeo, dark); legR.position.set(0.35, -1.15, 0);
    robot.add(legL, legR);

    scene.add(robot);

    function resize() {
        const w = canvas.clientWidth || window.innerWidth / 2;
        const h = canvas.clientHeight || window.innerHeight;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
    }
    resize();
    window.addEventListener('resize', resize);

    const clock = new THREE.Clock();
    (function animate() {
        requestAnimationFrame(animate);
        const t = clock.getElapsedTime();
        robot.position.y = Math.sin(t * 1.4) * 0.18;
        robot.rotation.y = Math.sin(t * 0.5) * 0.6;
        head.rotation.z = Math.sin(t * 1.1) * 0.08;
        armL.rotation.z = Math.sin(t * 2) * 0.35;
        armR.rotation.z = -Math.sin(t * 2) * 0.35;
        const s = 1 + Math.sin(t * 3) * 0.15;
        tip.scale.set(s, s, s);
        renderer.render(scene, camera);
    })();
})();
