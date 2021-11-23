import { POINT, EDGE, FACE, BODY } from "src/shared/model"

export function CreateObject(x0: number, y0: number, z0: number, w: number, h: number, n: number) {
    let faces:FACE[]=[];
    let angle = 2 * Math.PI / n;
    let points1: POINT[] = [];
    let points2: POINT[] = [];
    //  let z = 0;
    //  let x = 0;
    for (let i = 0; i < n; i++) {
        let x = Math.cos(angle * i) * w + x0;
        let z = Math.sin(angle * i) * w + z0;
        x = Number.parseFloat(x.toFixed(5))
        z = Number.parseFloat(z.toFixed(5))
        let pt1 = new POINT(x, y0, z);
        let pt2 = new POINT(x, y0 + h, z)
        points1.push(pt1);
        points2.push(pt2);
    }
    let face1 = FACE.CreateFaceFromPoints(points1);
    let face2 = FACE.CreateFaceFromPoints(points2);
    faces.push(face1,face2);
    for(let i =0;i<n;i++)
    {
        let pts:POINT[]=[];
        pts=pts.concat(face1.edges[i].points,face2.edges[i].points.reverse());
        let fc=FACE.CreateFaceFromPoints(pts);
        console.log(fc);
        faces.push(fc)
    }
    let body = BODY.CreateSolid(faces)
    return body;
}