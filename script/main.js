import * as THREE from 'three';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';


//Load 3D models
const loader = new GLTFLoader();

loader.load('https://github.com/WillBBHM/BloomCity/blob/main/assets/models/japnessStore/scene.gltf?raw=true', function (gltf) {
    const foodcenter = gltf.scene;
    foodcenter.position.set(0, -1, 0);
    scene.add(foodcenter);
}, undefined, function (error) {
    console.error(error);
});

loader.load('https://github.com/WillBBHM/BloomCity/blob/main/assets/models/japnessStore/scene.gltf?raw=true', function (gltf) {
    const foodleft = gltf.scene;
    foodleft.position.set(-8, -1, 0);
    scene.add(foodleft);
}, undefined, function (error) {
    console.error(error);
});

loader.load('https://github.com/WillBBHM/BloomCity/blob/main/assets/models/japnessStore/scene.gltf?raw=true', function (gltf) {
    const foodright = gltf.scene;
    foodright.position.set(8, -1, 0);
    scene.add(foodright);
}, undefined, function (error) {
    console.error(error);
});

loader.load('https://github.com/WillBBHM/BloomCity/blob/main/assets/models/SkyboxNight/scene.gltf?raw=true', function (gltf) {
    const foodright = gltf.scene;
    foodright.position.set(0, 0, 0);
	foodright.scale.set(15, 15, 15);
    scene.add(foodright);
}, undefined, function (error) {
    console.error(error);
});

//Sections init

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer();


renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );


// const geometry = new THREE.BoxGeometry();
// const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
// const cube = new THREE.Mesh( geometry, material );
// scene.add( cube );

camera.position.z = 5;

renderer.autoClear = false;
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));

const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
composer.addPass(bloomPass)

const pointLight = new THREE.PointLight(0xffffff, 10);
pointLight.position.set(5, 5, 5);
scene.add(pointLight);

const particles = new Array(1000).fill().map(() => {
	const color = Math.random() * 0xffffff;
    const particle = new THREE.Mesh(
        new THREE.SphereGeometry(0.0075, 32, 32),
        new THREE.MeshStandardMaterial({ color: color, emissive: color, emissiveIntensity: 10 })
    );
    particle.originalX = (Math.random() - 0.5) * 10;
    particle.originalY = (Math.random() - 0.5) * 10;
    particle.originalZ = (Math.random() - 0.5) * 10;
    particle.position.set(particle.originalX, particle.originalY, particle.originalZ);

    // Ajouter des propriétés de mouvement individuelles
    particle.speedX = Math.random() * 0.1;
    particle.speedY = Math.random() * 0.1;
    particle.speedZ = Math.random() * 0.1;

    scene.add(particle);
    return particle;
});

const animateParticles = function () {
    particles.forEach((particle) => {
        const time = Date.now() * 0.0005;
        particle.position.x = particle.originalX + Math.sin(time * particle.speedX) * 5;
        particle.position.y = particle.originalY + Math.cos(time * particle.speedY) * 5;
        particle.position.z = particle.originalZ + Math.sin(time * particle.speedZ) * 5;
    });
};

const animate = function () {
    requestAnimationFrame( animate );
    // cube.rotation.x += 0.01;
    // cube.rotation.y += 0.01;
	animateParticles()
	renderer.render(scene, camera)
	composer.render()
};
animate();





//Sections menu
const gui = new dat.GUI();
const settings = {
	Radius: 0.0075,
};
gui.add(settings, "Radius", 0, 0.1, 0.0001).onChange(function(e) {
	particles.forEach((particle) => {
		particle.geometry = new THREE.SphereGeometry(e, 32, 32);
	});
});
