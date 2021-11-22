import { POINT, EDGE, FACE, BODY } from "src/shared/model"




export function GetNormal(p1: POINT, p2: POINT, p3: POINT) {
    if (p1 != undefined && p2 != undefined && p3 != undefined) {
        let v1 = new POINT(p2.x - p1.x, p2.y - p1.y, p2.z - p1.z)
        let v2 = new POINT(p3.x - p1.x, p3.y - p1.y, p3.z - p1.z)
        let normal = new POINT(
            v1.y * v2.z - v1.z * v2.y,
            v1.z * v2.x - v1.x * v1.z,
            v1.x * v2.y - v1.y * v2.x);
        return normal;
    }
    return new POINT(0, 0, 0);
}

function Dot(x: POINT, y: POINT) {
    return x.x * y.x + x.y * y.y + x.z * y.z;
}
function Cross(x: POINT, y: POINT) {
    return new POINT
        (x.y * y.z - x.z * y.y,
            x.z * y.x - x.x * y.z,
            x.x * y.y - x.y * y.x);
}
function VectorBetweenPoints(p1: POINT, p2: POINT) {
    return new POINT(p2.x - p1.x, p2.y - p1.y, p2.z - p1.z);
}

function GetAngle(p1: POINT, p2: POINT, p3: POINT, normal: POINT) {
    let v1 = VectorBetweenPoints(p2, p1);
    let v3 = VectorBetweenPoints(p2, p3);
    v1.Normalize();
    v3.Normalize();
    let cp = Cross(v1, v3);
    let det = cp.x * normal.x + cp.y * normal.y + cp.z * normal.z;
    let angle = Math.atan2(det, Dot(v1, v3));
    return angle;
}
function ReplaceFaceFromBody(body: BODY, face: FACE, newFaces: FACE[]) {
    newFaces.forEach(face => body.mesh.push(face))
}

export function triangulateMesh(body: BODY, mesh: FACE) {
    let m = new FACE();
    m.edges = mesh.edges.slice(0);
    m.points = mesh.points.slice(0)
    let firstFace = new FACE();
    let i = 0;
    let w = 0;
    let newFaces = [];
    while (mesh.points.length > 3) {
        let A = mesh.points[i % mesh.points.length]
        let B = mesh.points[(i + 1) % mesh.points.length]
        let C = mesh.points[(i + 2) % mesh.points.length]
        let angle = GetAngle(A, B, C, mesh.normal)
        //console.log(angle)
        // console.log(i);
        // console.log(A);
        // console.log(B);
        // console.log(C);
        if (angle <= 0) {
            let nPointsOutside = 0;
            for (let j = 0; j < mesh.points.length; j++) {
                if (j < i || j > i + 2) {
                    let P = mesh.points[j];
                    let AB = VectorBetweenPoints(A, B);
                    let BC = VectorBetweenPoints(B, C);
                    let CA = VectorBetweenPoints(C, A);
                    let AP = VectorBetweenPoints(A, P);
                    let BP = VectorBetweenPoints(B, P);
                    let CP = VectorBetweenPoints(C, P);

                    let N1 = Cross(AB, mesh.normal);
                    let N2 = Cross(BC, mesh.normal);
                    let N3 = Cross(CA, mesh.normal);

                    let S1 = Dot(AP, N1);
                    let S2 = Dot(BP, N1);
                    let S3 = Dot(BP, N2);
                    let S4 = Dot(CP, N2);
                    let S5 = Dot(CP, N3);
                    let S6 = Dot(AP, N3);

                    if ((S1 > 0 && S2 > 0 && S3 > 0 && S4 > 0 && S5 > 0 && S6 > 0) || (S1 < 0 && S2 < 0 && S3 < 0 && S4 < 0 && S5 < 0 && S6 < 0)) {
                        i++;
                        i = i % mesh.points.length;
                        break;
                    }
                    else {
                        nPointsOutside++;
                        if (nPointsOutside == mesh.points.length - 3) {
                            let pts = [];
                            pts.push(A);
                            pts.push(B);
                            pts.push(C);
                            mesh = FACE.RemovePointFromMesh(mesh, B);
                            let newFace = FACE.CreateFaceFromPoints(pts);
                            newFaces.push(newFace);
                            newFace.normal = mesh.normal;
                            if (mesh.points.length == 3) {
                                break;
                            }
                            i++;
                            i = i % mesh.points.length;
                        }
                    }
                }
            }
        }
        i++;
        i = i % mesh.points.length;
        w++;
        if (w > mesh.points.length)
            break;
    }
    let A = mesh.points[0];
    let B = mesh.points[1];
    let C = mesh.points[2];
    let pts = [];
    pts.push(A);
    pts.push(B);
    pts.push(C);
    let face2 = FACE.CreateFaceFromPoints(pts);
    newFaces.push(face2);
    // console.log(A);
    // console.log(B);
    // console.log(C);
    ReplaceFaceFromBody(body, mesh, newFaces);
    return mesh;
}

export function TriangulateBody(body: BODY) {
    body.mesh.forEach(mesh => triangulateMesh(body, mesh))
    for (let i = 0; i < body.faces.length; i++) {
        body.mesh.shift();
    }


}