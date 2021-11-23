import { Component } from '@angular/core';
import * as THREE from 'three';
import * as EARCUT from "earcut"
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { Color, Mesh, Side, Vector2, Vector3 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { BODY, FACE, POINT } from 'src/shared/model';
import * as Triangulation from 'src/shared/Triangulation'
import * as geometry from 'src/shared/geometry'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'CADProject';
}

let points: Vector3[] = [];
const scene = new THREE.Scene();
scene.add(new THREE.AxesHelper(5))
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500);
camera.position.set(0, 0, 10);
camera.lookAt(0, 0, 0);
const renderer = new THREE.WebGLRenderer();
var controls = new OrbitControls(camera, renderer.domElement);
renderer.setSize(window.innerWidth * 0.9, window.innerHeight * 0.9);
document.body.appendChild(renderer.domElement);
const light = new THREE.Light( 0x404040 ); // soft white light
scene.add( light );

// const loader = new GLTFLoader();
// loader.setPath("C:\Users\Dima Woronin\Documents\Работы\Three.JS\CADProject")
// loader.load("\source\hedgehog.glb", function (gltf) {
//   scene.add(gltf.scene.children[0]);
// }, undefined, function (error) {
//   console.error(error);
// });


/* Многоугольник */
let faces: FACE[] = [];
/*let hex: POINT[] = []
hex.push(new POINT(0, 0, 0));
hex.push(new POINT(1, 0, 1));
hex.push(new POINT(2, 0, 1));
hex.push(new POINT(3, 0, 0));
hex.push(new POINT(3, 0, -1));
hex.push(new POINT(2, 0, -2));
hex.push(new POINT(1, 0, -2));
hex.push(new POINT(0, 0, -1));

let fpts = FACE.CreateFaceFromPoints(hex);
faces.push(fpts);*/
/*  CUBE  */
// let fpts = [];
// let pts: POINT[] = [];
// pts.push(new POINT(0, 0, 0));
// pts.push(new POINT(0, 0, 1));
// pts.push(new POINT(0, 1, 0));
// pts.push(new POINT(0, 1, 1));
// pts.push(new POINT(1, 0, 0));
// pts.push(new POINT(1, 0, 1));
// pts.push(new POINT(1, 1, 0));
// pts.push(new POINT(1, 1, 1));
// fpts.push(pts[0]);
// fpts.push(pts[1]);
// fpts.push(pts[3]);
// fpts.push(pts[2]);
// let face: FACE = FACE.CreateFaceFromPoints(fpts);
// faces.push(face);
// fpts = [];
// fpts.push(pts[0]);
// fpts.push(pts[1]);
// fpts.push(pts[5]);
// fpts.push(pts[4]);
// face = FACE.CreateFaceFromPoints(fpts);
// faces.push(face);
// fpts = [];
// fpts.push(pts[0]);
// fpts.push(pts[4]);
// fpts.push(pts[6]);
// fpts.push(pts[2]);
// face = FACE.CreateFaceFromPoints(fpts);
// faces.push(face);
// fpts = [];
// fpts.push(pts[4]);
// fpts.push(pts[6]);
// fpts.push(pts[7]);
// fpts.push(pts[5]);
// face = FACE.CreateFaceFromPoints(fpts);
// faces.push(face);
// fpts = [];
// fpts.push(pts[1]);
// fpts.push(pts[5]);
// fpts.push(pts[7]);
// fpts.push(pts[3]);
// face = FACE.CreateFaceFromPoints(fpts);
// faces.push(face);
// fpts = [];
// fpts.push(pts[2]);
// fpts.push(pts[6]);
// fpts.push(pts[7]);
// fpts.push(pts[3]);
// face = FACE.CreateFaceFromPoints(fpts);
// faces.push(face);
// let body = BODY.CreateSolid(faces);


// console.log(body);
// Triangulation.TriangulateBody(body);
// console.log(body);


/*Многоугольник*/

let fc = geometry.CreateObject(0, 0, 0, 10, 10, 20, 12);
let body = BODY.CreateSolid([fc]);
//console.log(body);
//Triangulation.TriangulateBody(body);
//console.log(body);


/* Отображение полигонов */
body.mesh.forEach(mesh => mesh.edges.forEach(edge => {
  let geom = new THREE.EdgesGeometry().setFromPoints(POINT.PointsToVec3(edge.points));
  let mat = new THREE.LineDashedMaterial({ color: 0xff0000});
  let faceRES = new THREE.Line(geom, mat);
  scene.add(faceRES);
}))

/* Отображение тела */
body.mesh.forEach(mesh => {
  let r = Math.random();
  let g = Math.random();
  let b = Math.random();
  let geom = new THREE.BufferGeometry().setFromPoints(POINT.PointsToVec3(mesh.points));
  let mat = new THREE.MeshBasicMaterial({ color: new Color(r, g, b),  side:THREE.DoubleSide});
  let faceRES = new THREE.Mesh(geom, mat);
  scene.add(faceRES);
}
)




controls.update();

function animate() {

  requestAnimationFrame(animate);

  // required if controls.enableDamping or controls.autoRotate are set to true
  controls.update();

  renderer.render(scene, camera);

}
animate()

