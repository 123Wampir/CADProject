import { Mesh, Vector3 } from "three"
import * as Triangulation from "src/shared/Triangulation"
import { POINT, EDGE, FACE, BODY } from "src/shared/model"

export function CreateObject (x0: number, y0: number, z0: number, w: number, l: number, h: number, n: number)
{
     let angle = 2*Math.PI/n;
     console.log(angle);
     let points: POINT[] = [];
    //  let z = 0;
    //  let x = 0;
    for (let i = 0; i < n; i ++)
    {
        let x=Math.cos(angle*i)*w+x0;
        let z=Math.sin(angle*i)*w+z0;
        let pt = new POINT(x, y0 ,z);
        points.push(pt);
    }

    let face1 = FACE.CreateFaceFromPoints(points);
    console.log(face1);
    return face1;
}