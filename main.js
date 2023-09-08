import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import * as math from 'mathjs'

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// define initial constants
// var maxX = 2;
// var minX = -2;
// var minY = -3;
// var maxY = 3;
var maxT = 1.5;
var minT = -1.5;
// var rangeX = maxX - minX;
// var rangeY = maxY - minY;
var rangeT = maxT - minT;

var mathFunc = "x^2";

const parser = new math.parser();

class CustomCurve extends THREE.Curve {

	constructor( scale = 1 ) {
		super();
		this.scale = scale;
	}

	getPoint( t, optionalTarget = new THREE.Vector3() ) {

        parser.evaluate(`f(x)=${mathFunc}`)
        t = t * (rangeT) - (rangeT / 2);
		const tx = t;
        const ty = parser.evaluate(`f(${t})`);
		const tz = 0;

		return optionalTarget.set( tx, ty, tz ).multiplyScalar( this.scale );
	}
}

let mathCurve = new CustomCurve(3);

// define shape
const geometry = new THREE.TubeGeometry(mathCurve, 120, 0.05, 6, false);
geometry.computeBoundingBox();
const material = new THREE.MeshBasicMaterial({ color: 0x00ffff, wireframe: false });
const shape = new THREE.Mesh(geometry, material);
scene.add(shape);

// draw axis
const axesHelper = new THREE.AxesHelper(7);
scene.add(axesHelper);

camera.position.z = 5;

// add orbitcontrol
const controls = new OrbitControls(camera, renderer.domElement);

//controls.update() must be called after any manual changes to the camera's transform
camera.position.set(0, 0, 15);
controls.update();

// deal with window resize
window.addEventListener('resize', () => {
    const newWidth = window.innerWidth;
    const newHeight = window.innerHeight;
    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(newWidth, newHeight);
});

function animate() {
    requestAnimationFrame(animate);

    // shape.rotation.x += 0.01;
    shape.rotation.y += 0.01;

    controls.update();
    renderer.render(scene, camera);
}
animate();