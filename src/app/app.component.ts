import { Component } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { Color, Mesh, Side, Vector2, Vector3 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { BODY, FACE, POINT } from 'src/shared/model';
import * as Triangulation from 'src/shared/Triangulation'
import * as Geometry from 'src/shared/geometry'
import * as CADMath from 'src/shared/CADMath'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'CADProject';
}

const scene = new THREE.Scene();
scene.add(new THREE.AxesHelper(5))
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500);
camera.position.set(0, 0, 10);
camera.lookAt(0, 0, 0);
const renderer = new THREE.WebGLRenderer();
var controls = new OrbitControls(camera, renderer.domElement);
renderer.setSize(window.innerWidth * 0.9, window.innerHeight * 0.9);
document.body.appendChild(renderer.domElement);
const light = new THREE.Light(0x404040); // soft white light
scene.add(light);

// const loader = new GLTFLoader();
// loader.setPath("C:\Users\Dima Woronin\Documents\Работы\Three.JS\CADProject")
// loader.load("\source\hedgehog.glb", function (gltf) {
//   scene.add(gltf.scene.children[0]);
// }, undefined, function (error) {
//   console.error(error);
// });




// console.log(body);
// Triangulation.TriangulateBody(body);


/*Многоугольник*/
let body = Geometry.CreateObject(0, 0, 0, 1, 1.25, 12);
Triangulation.TriangulateBody(body, 0.5);
console.log(body);

let a: number[][] = []
a[0] = [];
a[0][0] = 2;
a[0][1] = 4;
a[0][2] = 1;
a[1] = []
a[1][0] = 5;
a[1][1] = 2;
a[1][2] = 1;
a[2] = []
a[2][0] = 2;
a[2][1] = 3;
a[2][2] = 4;
let b = [36, 47, 37];
let x = CADMath.ClassicGauss(a, b, b.length);
console.log(a);
console.log(b);
console.log(x);

let arr=[0,0,1,2];
CADMath.Diff(CADMath.Fall,arr,0.05);

/* Отображение полигонов */
body.mesh.forEach(mesh => mesh.edges.forEach(edge => {
  let geom = new THREE.EdgesGeometry().setFromPoints(POINT.PointsToVec3(edge.points));
  let mat = new THREE.LineBasicMaterial({ color: 0xff0000, linewidth: 1 });
  let faceRES = new THREE.Line(geom, mat);
  scene.add(faceRES);
}))

/* Отображение тела */
body.mesh.forEach(mesh => {
  let r = Math.random();
  let g = Math.random();
  let b = Math.random();
  let arr = POINT.PointsToVec3(mesh.points);
  let geom = new THREE.BufferGeometry().setFromPoints(arr);
  let mat = new THREE.MeshBasicMaterial({ color: new Color(r, g, b), side: THREE.DoubleSide });
  let faceRES = new THREE.Mesh(geom, mat);
  scene.add(faceRES);
})




controls.update();

function animate() {

  requestAnimationFrame(animate);

  // required if controls.enableDamping or controls.autoRotate are set to true
  controls.update();
  //console.log(camera.rotation.z*180/Math.PI);
  renderer.render(scene, camera);

}
animate()