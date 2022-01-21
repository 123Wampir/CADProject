import { Component } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { Color, Mesh, Side, Vector2, Vector3 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { BODY, EDGE, FACE, POINT } from 'src/shared/model';
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

// Создание базовой сцены
const scene = new THREE.Scene();
scene.add(new THREE.AxesHelper(5))
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500);
camera.position.set(0, 0, 10);
camera.lookAt(0, 0, 0);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth * 0.9, window.innerHeight * 0.9);
document.body.appendChild(renderer.domElement);
var controls = new OrbitControls(camera, renderer.domElement);
const light = new THREE.Light(0x404040);
scene.add(light);
//


// ВЫЧИСЛИТЕЛЬНЫЕ МЕТОДЫ
// Метод Гаусса
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
console.log(x);
//

// Метод решения дифференциальных уравнений Рунге-Кутта
let arr = [0, 0, 1, 2];
CADMath.Diff(CADMath.Fall, arr, 0.05);
CADMath.TEST();
//
//


// ГРАФИЧЕСКИЕ МЕТОДЫ
// Триангуляция
let body = Geometry.CreateObject(0, 0, 0, 1, 1, 3);
Triangulation.TriangulateBody(body, 1);
console.log(body);

//Отображение полигонов
body.mesh.forEach(mesh => mesh.edges.forEach(edge => {
  let geom = new THREE.EdgesGeometry().setFromPoints(POINT.PointsToVec3(edge.points));
  let mat = new THREE.LineBasicMaterial({ color: 0xff0000, linewidth: 1 });
  let faceRES = new THREE.Line(geom, mat);
  scene.add(faceRES);
}))

//Отображение тела
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
//

// Линии уровня
let out: [] = [];
let line: [] = [];
//CADMath.myContourLine(CADMath.SPHERE, -5, -5, 5, 5, 50, 50, 5, line, out);
console.log(out)
out.forEach(line => {
  let pts: POINT[] = [];
  let ln = line as [];
  ln.forEach(pt => {
    pts.push(new POINT(pt[1], pt[3], pt[2]));
    //pts.push(new POINT(pt[1], 1, pt[2]));
  })
  const cz = (pts[0].z + pts[pts.length - 1].z) / 2;
  pts.sort((a, b) => b.x - a.x);
  const cx = (pts[0].x + pts[pts.length - 1].x) / 2;
  const center = { x: cx, z: cz };
  var startAng = 0;
  pts.forEach(point => {
    var ang = Math.atan2(point.z - center.z, point.x - center.x);
    if (startAng >= 0) {
      startAng = ang
    }
    else {
      if (ang < startAng) {  // ensure that all points are clockwise of the start point
        ang += Math.PI * 2;
      }
    }
    point.angle = ang; // add the angle to the point
  });
  pts.sort((a, b) => a.angle - b.angle);

  /*let points = new THREE.BufferGeometry().setFromPoints(POINT.PointsToVec3(pts));
  let material = new THREE.PointsMaterial({ color: "red" ,size:0.03});
  let cloud = new THREE.Points(points, material);*/
  let points = new THREE.EdgesGeometry().setFromPoints(POINT.PointsToVec3(pts));
  let material = new THREE.LineBasicMaterial({ color: new Color(-pts[0].y * 10e4) });
  let cloud = new THREE.Line(points, material);
  scene.add(cloud)
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