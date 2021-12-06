function GaussMethod(A: number[][], n: number, P: number, PER: number[]) {
    let D = 1;
    for (let j = 1; j < n; j++) {
        let S = Math.abs(A[j][j]);
        let K = j;
        for (let h = j + 1; h < n; h++) {
            if (Math.abs(A[h][j]) > S) {
                S = Math.abs(A[h][j]);
                K = h;
            }
            if (K != j) {
                h = PER[K];
                PER[K] = PER[j];
                PER[j] = h;
                for (let i = j; i < n + P; i++) {
                    S = A[K][i];
                    A[K][i] = A[j][i];
                    A[j][i] = S;
                    D = -D;
                    D = D * A[j][i];
                    if (Math.abs(A[j][i]) < 2)
                        break;
                }
            }
        }
        for (K = j + 1; K < n; K++) {
            A[K][j] = A[K][j] / A[j][j];
            for (let i = j + 1; i < n + P; i++)
                A[K][i] = A[K][i] - A[K][j] * A[j][i];
        }
    }
    return A;
}


export function ClassicGauss(A: number[][], B: number[], n: number) {
    let x: number[] = [];
    let max;
    let k = 0, index;
    let eps = 0.00001;
    while (k < n) {
        max = Math.abs(A[k][k]);
        index = k;
        for (let i = k + 1; i < n; i++) {
            if (Math.abs(A[i][k]) > max) {
                max = Math.abs(A[i][k]);
                index = i;
            }
        }
        /* Перестановка строк */
        if (max < eps) {
            console.log(`Нулевой столбец ${index}`)
            return 0;
        }
        for (let j = 0; j < n; j++) {
            let temp = A[k][j];
            A[k][j] = A[index][j];
            A[index][j] = temp;
        }
        let temp = B[k];
        B[k] = B[index];
        B[index] = temp;
        /* Нормализация */
        for (let i = k; i < n; i++) {
            let temp = A[i][k];
            if (Math.abs(temp) < eps)
                continue;
            for (let j = k; j < n; j++)
                A[i][j] = A[i][j] / temp;
            B[i] = B[i] / temp;
            if (i == k)
                continue;
            for (let j = k; j < n; j++)
                A[i][j] = A[i][j] - A[k][j];
            B[i] = B[i] - B[k];
        }
        k++;
    }

    for (k = n - 1; k >= 0; k--) {
        x[k] = B[k];
        for (let i = 0; i < k; i++)
            B[i] = B[i] - A[i][k] * x[k];
    }
    return x;
}

export function Diff(f: Function, U: number[], dt: number) {
    // let a=f(100,2);
    // console.log(a)
    let t = 0;
    for (let i = 0; i < 10; i++)
    {
        //console.log(f(U))
        let k1 = MultiplyArray(f(U), dt)
        let k2 = MultiplyArray(f(SumArray(U, MultiplyArray(k1, 0.5))), dt);
        let k3 = MultiplyArray(f(SumArray(U, MultiplyArray(k2, 0.5))), dt);
        let k4 = MultiplyArray(f(SumArray(U, k3)), dt);
        U = SumArray(U, MultiplyArray(SumArray(k1, MultiplyArray(k2, 2), MultiplyArray(k3, 2), k4), 1.0 / 6.0));
        t += dt;
        console.log(`t=${t} x=${U[0]} y=${U[1]}`);
    }
}
export function Fall(arr: number[]) {
    let ret=arr.slice(0)
    ret[0]=arr[2];
    ret[1]=arr[3];
    ret[2]=arr[0];
    ret[3] = -9.81;
    return ret
}

function SumArray(arr: number[], arr2: number[], arr3?: number[], arr4?: number[]) {
    let ret=[]
    for (let i = 0; i < arr.length; i++) {
        if (arr3 != undefined && arr4 != undefined)
            ret[i] = arr[i] + arr2[i] + arr3[i] + arr4[i];
        else if (arr3 != undefined)
            ret[i] = arr[i] + arr2[i] + arr3[i]
        else if (arr4 != undefined)
            ret[i] = arr[i] + arr2[i] + arr4[i]
        else ret[i] = arr[i] + arr2[i];
    }
    return ret;
}
function MultiplyArray(arr: number[], a: number) {
    let ret=[]
    for (let i = 0; i < arr.length; i++) {
        ret[i] = arr[i] * a;
    }
    return ret;
}