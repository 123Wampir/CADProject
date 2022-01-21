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
    let t = 0;
    for (let i = 0; i < 10; i++) {
        let g0 = MultiplyArray(f(U), dt)
        let g1 = MultiplyArray(f(SumArray(U, MultiplyArray(g0, 0.5))), dt);
        let g2 = MultiplyArray(f(SumArray(U, MultiplyArray(g1, 0.5))), dt);
        let g3 = MultiplyArray(f(SumArray(U, g2)), dt);
        U = SumArray(U, MultiplyArray(SumArray(g0, MultiplyArray(g1, 2), MultiplyArray(g2, 2), g3), 1.0 / 6.0));
        t += dt;
        console.log(`t=${t} x=${U[0]} y=${U[1]}`);
    }
}
export function Fall(arr: number[]) {
    let ret = arr.slice(0)
    ret[0] = arr[2];
    ret[1] = arr[3];
    ret[2] = arr[0];
    ret[3] = -9.81;
    return ret
}

function SumArray(arr: number[], arr2: number[], arr3?: number[], arr4?: number[]) {
    let ret = []
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
    let ret = []
    for (let i = 0; i < arr.length; i++) {
        ret[i] = arr[i] * a;
    }
    return ret;
}

// Оптимизация
function Optimization() {
    let x = [];
    x[1] = 100;
    x[2] = 200;

    // MinF(2,F,10.0D0,0.01DO,X,FX) F берётся из функции Ff, но я хз, что за N и X
    //return X, FX;
}

function MinF(N: number, FUNCT: Function /*Не уверен*/, VOISIN: number, EPSIL: number, X: number[], FX: number) {
    //console.log(N);
    let w = 0;
    let Y = [], S = [];
    let ITER = 0
    if (N <= 100) {
        let delta = VOISIN;
        let R0 = 0.0;
        for (let i = 0; i < N; i++) {
            S[i] = delta;           //1
        }
        FX = FUNCT(N, X) // FUNCT(N, X)
        while (w < N) {
            let FY = FX;                //2
            for (let i = 0; i < N; i++) {
                Y[i] = X[i];           //3
            }
            ITER = ITER + 1 //(Возможно это для проверки нужно, хз; Просто больше ты этого в коде не увидишь)
            FY = MiniF(N, FUNCT, Y, S, FY);
            if (FY < FX) {
                let k = 0;
                while (k < 10) {
                    for (let i = 0; i < N; i++) {           //6
                        if (S[i] * (Y[i] - X[i]) < 0) {
                            S[i] = -S[i];
                        }
                        let TETA = X[i];
                        X[i] = Y[i];
                        Y[i] = 2 * Y[i] - TETA;            //7
                    }
                    FX = FY;
                    FY = FUNCT(N, Y) //FUNCT (N,Y)
                    MiniF(N, FUNCT, Y, S, FY);
                    if (FY >= FX) {
                        w++
                        continue;
                        // Тут нужно начать со второй строчки ( строчки помечены так: /*1*/)
                    }
                    for (let i = 0; i < N; i++) {
                        if (Math.abs(Y[i] - X[i]) < 0.5 * Math.abs(S[i])) {
                            k++
                            break;
                            // Тут нужно начать с шестой строчки ( строчки помечены так: /*1*/)
                        }
                        //continue; // Тут тип надо перейти к следующему i (Надеюсь, это так и работает)
                    }
                }
                // Тут нужно начать с четвёртой строчки ( строчки помечены так: /*1*/)
            }
            w++
        }
        if (delta < EPSIL) {          //4
            //console.log(FX);// RETURN (Выход из функции)
        }
        delta = R0 * delta;
        for (let i = 0; i < N; i++) {
            S[i] = S[i] * R0;         //5
        }
        console.log(X)
        console.log(Y)
        console.log(FX)

        // Тут нужно начать со второй строчки ( строчки помечены так: /*1*/)
    }
}

function MiniF(N: number, FUNCT: Function, X: number[], S: number[], FX: number) {
    for (let i = 0; i < N; i++) {
        X[i] = X[i] + S[i];
        let F = FUNCT(N, X)
        if (F >= FX) {
            X[i] = X[i] - 2 * S[i];
        }
        else {
            FX = F;
            continue;
        }
        F = FUNCT(N, X)
        if (F >= FX) {
            X[i] = X[i] + S[i];
            continue;
        }
        else {
            FX = F;
            S[i] = -S[i];
            continue;
        }
    }
    return FX;
}

function Ff(N: number, X: number[]) {
    let A = X[0];
    let B = X[1];
    let F = A * A + 100 * B * B;
    return F;
}


export function TEST() {
    let X = [10, 200];
    let FX = 0;
    MinF(2, Ff, 10, 0.00001, X, FX);
}

export function myContourLine2(F: Function, x0: number, y0: number, x1: number, y1: number, nx: number, ny: number, line: any[], out: any[]) {
    let NBC;
    let nOfLine;
    let mx = nx + 1;
    let xy = [];
    let zf: number[] = []; //значения функции от х,у
    let ib: number[] = []; //номер изолинии для значения функции
    let zd: number[] = []; //значения функции от х,у
    let C = 0; //константа
    if (mx >= 1025)
        return;
    else {
        let my = ny + 1;
        let ex = (x1 - x0) / nx; //шаг по х
        let ey = (y1 - y0) / ny; //шаг по y
        for (let j = 0; j < my; j++) {
            let yf = y0 + ey * j;
            zf = []
            for (let i = 0; i < mx; i++) {
                let xf = x0 + ex * (i);
                zf.push(Number.parseFloat(F(xf, yf).toFixed(1)));
                //xf = x0 + (i) * ex;
                ib[i] = 0;
            }
            console.log(zf)
        }
        // console.log(zf)
        // console.log(ib)
        NBC = 0; //число точек в изолинии
        nOfLine = 0; //число точек в изолинии
        let yf = y0; //у при заданном iy
        let xf = x0; //x при заданном ix
        let yd = y0; //y перед yf(текущий)
        let xd = x0; //х перед xf(текущий)
        let ptInLine = false;

        for (let iy = 0; iy < my; iy++) {
            //zf.splice(0);
            mx = nx + 1;
            yd = yf;
            yf = y0 + ey * (iy);
            for (let i = 0; i <= mx; i++) {
                xf = x0 + ex * i;
                zd[i] = zf[i];
                zf[i] = Number.parseFloat(F(xf, yf).toFixed(1));
            }
            for (let ix = 0; ix < mx; ix++) {
                xd = xf;
                xf = x0 + ex * (ix);
                if (!isNaN(zf[ix]) && C != zf[ix]) {
                    C = zf[ix];
                    nOfLine++;
                    NBC++;
                    ib[ix] = nOfLine;
                    let lastX = 0;
                    for (let jy = iy; jy < my; jy++) {
                        let yd1 = yf;
                        let yf1 = y0 + ey * (jy);
                        for (let i = 0; i < nx + 1; i++) {
                            xf = x0 + ex * i;
                            zd[i] = zf[i];
                            zf[i] = Number.parseFloat(F(xf, yf1).toFixed(1));
                        }
                        let nOfX = 0;
                        for (let jx = 0; jx < nx + 1; jx++) {
                            xd = xf;
                            xf = x0 + ex * (jx);
                            if (zf[jx] == C) {
                                lastX = jx;
                                NBC++;
                                ib[jx] = nOfLine;
                                nOfX++;
                                ISOF4(nOfLine, xf, yf1, zf[jx], line, out);
                                if (zf[jx + 1] > zf[jx]) {
                                    nOfLine++;
                                }
                            }
                            /*else {
                                if (zf[jx] > C && zd[jx] < C) {
                                    //console.log("HERETOOO")
                                    lastX = jx;
                                    NBC++;
                                    ib[jx] = nOfLine;
                                    //console.log(ib)
                                    ISOF4(nOfLine, xf, yf1, line, out);
                                }
                            }*/
                        }

                    }
                    //console.log(lastX)
                    if (lastX != 0)
                        mx = lastX;
                }
                for (let i = 0; i < nx + 1; i++) {
                    xf = x0 + ex * i;
                    zd[i] = zf[i];
                    zf[i] = Number.parseFloat(F(xf, yf).toFixed(1));
                    //ib[i] = 0;
                }
            }

        }
    }
}
export function myContourLine(F: Function, x0: number, y0: number, x1: number, y1: number, nx: number, ny: number, NBC: number, line: any[], out: any[]) {
    let nOfLine;
    let mx = nx + 1;
    let xy = [];
    let zf: number[] = []; //значения функции от х,у
    let ib: number[] = []; //номер изолинии для значения функции
    let zd: number[] = []; //значения функции от х,у
    let C = 0; //константа
    let max = -10e6;
    let min = 10e6;
    if (mx >= 1025)
        return;
    else {
        let my = ny + 1;
        let ex = (x1 - x0) / nx; //шаг по х
        let ey = (y1 - y0) / ny; //шаг по y
        for (let j = 0; j < my; j++) {
            let yf = y0 + ey * j;
            zf = []
            for (let i = 0; i < mx; i++) {
                let xf = x0 + ex * (i);
                let z = F(xf, yf);
                zf.push(Number.parseFloat(z.toFixed(5)));
                if (z > max) {
                    max = z;
                    continue;
                }
                if (z < min) {
                    min = z;
                    continue;
                }
            }
        }
        nOfLine = 0; //число точек в изолинии
        let yf = y0; //у при заданном iy
        let xf = x0; //x при заданном ix
        let stepC = (max - min) / NBC;
        console.log(max)
        console.log(min)
        console.log(stepC)
        for (C = min - stepC; C < max + stepC; C += stepC) {
            for (let iy = 0; iy < ny; iy++) {
                yf = y0 + ex * iy;
                let yf1 = y0 + ex * (iy + 1);
                for (let ix = 0; ix < nx; ix++) {
                    xf = x0 + ex * ix;
                    let xf1 = x0 + ex * (ix + 1);
                    let z1 = F(xf, yf);
                    let z2 = F(xf1, yf);
                    let z3 = F(xf1, yf1);
                    let z4 = F(xf, yf1);
                    let a = {
                        x: xf + (xf1 - xf) * (C - z1) / (z2 - z1), y: yf,
                        z: (F(xf + (xf1 - xf) * (C - z1) / (z2 - z1), yf))
                    };
                    let b = {
                        x: xf1, y: yf + (yf1 - yf) * (C - z2) / (z3 - z2),
                        z: F(xf1, yf + (yf1 - yf) * (C - z2) / (z3 - z2))
                    };
                    let c = {
                        x: xf + (xf1 - xf) * (C - z4) / (z3 - z4), y: yf1,
                        z: (F(xf + (xf1 - xf) * (C - z4) / (z3 - z4), yf1))
                    };
                    let d = {
                        x: xf, y: yf + (yf1 - yf) * (C - z1) / (z4 - z1),
                        z: F(xf, yf + (yf1 - yf) * (C - z1) / (z4 - z1))
                    };
                    //console.log(a.z,b.z,c.z,d.z)
                    if (z1 >= C && z2 <= C && z3 <= C && z4 <= C) {  //Левый верхний '/
                        ISOF4(nOfLine, a.x, a.y, a.z, line, out);
                        ISOF4(nOfLine, d.x, d.y, d.z, line, out);
                        nOfLine++
                    } else if (z1 <= C && z2 >= C && z3 <= C && z4 <= C) { //Правый верхний \'
                        ISOF4(nOfLine, a.x, a.y, a.z, line, out);
                        ISOF4(nOfLine, b.x, b.y, b.z, line, out);
                        nOfLine++
                    } else if (z1 <= C && z2 <= C && z3 >= C && z4 <= C) { //Левый нижний /.
                        ISOF4(nOfLine, b.x, b.y, b.z, line, out);
                        ISOF4(nOfLine, c.x, c.y, c.z, line, out);
                        nOfLine++
                    } else if (z1 <= C && z2 <= C && z3 <= C && z4 >= C) { //Правый нижний .\
                        ISOF4(nOfLine, c.x, c.y, c.z, line, out);
                        ISOF4(nOfLine, d.x, d.y, d.z, line, out);
                        nOfLine++
                    } else if (z1 >= C && z2 <= C && z3 <= C && z4 >= C) { //Левый верхний и нижний |
                        ISOF4(nOfLine, a.x, a.y, a.z, line, out);
                        ISOF4(nOfLine, c.x, c.y, c.z, line, out);
                        nOfLine++
                    } else if (z1 <= C && z2 >= C && z3 >= C && z4 <= C) { //Правый верхний и нижний |
                        ISOF4(nOfLine, a.x, a.y, a.z, line, out);
                        ISOF4(nOfLine, c.x, c.y, c.z, line, out);
                        nOfLine++
                    } else if (z1 >= C && z2 >= C && z3 <= C && z4 <= C) { //Верхний левый и правый -
                        ISOF4(nOfLine, b.x, b.y, b.z, line, out);
                        ISOF4(nOfLine, d.x, d.y, d.z, line, out);
                        nOfLine++
                    } else if (z1 <= C && z2 <= C && z3 >= C && z4 >= C) { //Нижний левый и правый -
                        ISOF4(nOfLine, b.x, b.y, b.z, line, out);
                        ISOF4(nOfLine, d.x, d.y, d.z, line, out);
                        nOfLine++
                    } else if (z1 >= C && z2 <= C && z3 >= C && z4 <= C) { //Верхний левый и правый нижний \\
                        ISOF4(nOfLine, a.x, a.y, a.z, line, out);
                        ISOF4(nOfLine, b.x, b.y, b.z, line, out);
                        nOfLine++;
                        ISOF4(nOfLine, c.x, c.y, c.z, line, out);
                        ISOF4(nOfLine, d.x, d.y, d.z, line, out);
                        nOfLine++
                    } else if (z1 >= C && z2 <= C && z3 >= C && z4 <= C) { //Верхний правый и левый нижний \\
                        ISOF4(nOfLine, a.x, a.y, a.z, line, out);
                        ISOF4(nOfLine, d.x, d.y, d.z, line, out);
                        nOfLine++;
                        ISOF4(nOfLine, b.x, b.y, b.z, line, out);
                        ISOF4(nOfLine, c.x, c.y, c.z, line, out);
                        nOfLine++
                    } else if (z1 <= C && z2 >= C && z3 >= C && z4 >= C) { //Верхний правый и левый нижний \\
                        ISOF4(nOfLine, a.x, a.y, a.z, line, out);
                        ISOF4(nOfLine, d.x, d.y, d.z, line, out);
                        nOfLine++;
                    } else if (z1 >= C && z2 <= C && z3 >= C && z4 >= C) { //Верхний правый и левый нижний \\
                        ISOF4(nOfLine, a.x, a.y, a.z, line, out);
                        ISOF4(nOfLine, b.x, b.y, b.z, line, out);
                        nOfLine++;
                    } else if (z1 >= C && z2 >= C && z3 <= C && z4 >= C) { //Верхний правый и левый нижний \\
                        ISOF4(nOfLine, b.x, b.y, b.z, line, out);
                        ISOF4(nOfLine, c.x, c.y, c.z, line, out);
                        nOfLine++;
                    } else if (z1 >= C && z2 >= C && z3 >= C && z4 <= C) { //Верхний правый и левый нижний \\
                        ISOF4(nOfLine, c.x, c.y, c.z, line, out);
                        ISOF4(nOfLine, d.x, d.y, d.z, line, out);
                        nOfLine++;
                    }
                }
            }
        }
    }
}

function getState(a: number, b: number, c: number, d: number) {
    return a * 8 + b * 4 + c * 2 + d;
}

export function ContourLine(F: Function, x0: number, y0: number, x1: number, y1: number, nx: number, ny: number, nf: number, NBC: number, out: any[]) {
    let mx = nx + 1;
    let xy = [];
    let zf: number[] = []; //значения функции от х,у
    let ib: number[] = []; //номер изолинии для значения функции
    let zd: number[] = []; //значения функции от х,у
    let C = 0;
    if (mx >= 1025)
        return;
    else {
        let my = ny + 1;
        let ex = (x1 - x0) / nx; //шаг по х
        let ey = (y1 - y0) / ny; //шаг по y
        let iy = 0; //итератор для y
        let x = x0;
        for (let i = 1; i <= mx; i++) {
            zf.push(F(x, y0));
            x = x0 + i * ex;
            ib[i - 1] = 0;
        }
        console.log(zf)
        console.log(ib)
        NBC = 0; //число изолиний
        let yf = y0; //у при заданном iy
        let ja = -1; //что-то вроде bool; строить точку или нет; -1 - нет, 0 - хз, >0 - хз
        let i = 0; //итератор для х
        let xf = x0; //x при заданном ix
        x = x0;
        if (zf[0] == 0) { //если функция в точке (x0,y0) принимает значение 0 строится точка изолинии
            ja = 0;
            NBC++;
            ib[i] = NBC;
            ISOF3(NBC, x, y0, out);
            console.log(NBC, x, y0);
        }
        i++; //51
        xf = x0 + ex * i;
        while (mx - i >= 0) { //52 Поиск изолиний при y0
            if (zf[i] != 0) { //59 Если функция !=0
                if (zf[i - 1] * zf[i] < 0) { //60 Если между этой и предыдущей точкой функция равна 0
                    xy = ISOF1(xf - ex, y0, zf[i - 1], xf, y0, zf[i]);
                    ja = -1;
                    NBC++;
                    ib[i] = NBC;
                    ISOF3(NBC, xy[0], xy[1], out);
                    console.log(xy)
                }
                else { //62
                    ja = -1;
                }
            }
            else { //53 Если функция равна 0
                x = xf;
                if (ja < 0) { //54 //если точка проверяется впервые (ja=-1)
                    NBC++; //Добавить изолинию
                    ISOF3(NBC, xf, yf, out); //Добавить точку в изолинию
                    console.log(NBC, xf, yf)
                    ib[i] = NBC; //Добавить номер изолинии в массив
                    console.log(ib)
                    /*if (mx - i > 0) {
                        ja = 0;
                        NBC++;
                        ib[i] = NBC;
                        ISOF3(NBC, x, y0, out);
                        console.log(NBC,x, y0);
                    }*/
                }
                else {
                    if (ja > 0) { //56
                        ib[ja] = 0;
                    }
                    ja = i;
                    ib[i] = NBC;
                    ISOF3(NBC, x, y0, out);
                }
            }
            i++; //51
            xf = x0 + ex * i;
        }
        let yd = y0; //y перед yf(текущий)
        let xd = x0; //х перед xf(текущий)


        for (iy = 0; iy < my; iy++) {
            for (i = 0; i < mx; i++) {
                //console.log(`i=${i}, iy=${iy},`);
                //console.log(`ja=${ja}`);
                if (ja <= 0) { //70
                    yd = yf;
                }
                else { //71
                    ib[nx] = 0;
                    yd = yf;
                }
                let IGO = 1;
                yf = y0 + (iy + 1) * ey;
                for (i = 0; i < mx; i++) {
                    zd[i] = zf[i];
                    zf[i] = Number.parseFloat(F(xd, yf).toFixed(5));
                    xd = x0 + (i + 1) * ex;
                }
                for (i = 0; i < mx; i++)
                    if (ib[i] < 0)
                        ib[i] = 0;
                /*console.log("zd(предыдущий),zf(текущий),ib(номер изолинии)");
                console.log(zd);
                console.log(zf);
                console.log(ib);*/
            }
            let L = 4, k = 0, jn = 0, jl;
            let j = 0;
            let B = false;

            //Переход к следующей полосе
            for (i = 0; i < mx; i++) {
                ja = 0; //102
                L = 4;
                //console.log(`yi=${iy}, yf=${yf}, i=${i}`)
                if (ib[i] > 0) { //103
                    if (zd[i] == 0) { //111
                        if (i >= 0) {
                            if (ib[i - 1] + 2 != 0) {
                                ib[i] = 0
                                continue;
                            }
                            B = true;
                            k = 0;
                        }
                        else { //134
                            i++;
                            if (i == nx)
                                break;
                        }
                    }
                    else { //120
                        if (zd[i + 1] == 0)
                            k = 1; //121
                        else { k = 0; L = 5 } //131
                        B = true;
                    }
                }
                else { //134
                    i++;
                    if (i == nx)
                        break;
                }
                if (B == true) { //300
                    B = false;
                    xf = x0 + ex * (j + 1);
                    xd = xf - ex;
                    //console.log(`xd=${xd}, xf=${xf}, yd=${yd}, yf=${yf}, j=${j}`)
                    xy = ISOF2(zd, zf, xd, xf, yd, yf, j, k, L);
                    jn = xy[2];
                    k = xy[3];
                    L = xy[4];
                    console.log(jn)
                    L = xy[4];
                    if (jn >= 0) {
                        if (nx - jn >= 0) {
                            if (j - jn == 0) {
                                jl = ib[j];
                                ib[jn] = ib[j];
                            }
                            else {
                                if (zd[jn] == 0) {
                                    ib[jn] = ib[j];
                                    j = jn;
                                    jl = ib[j];
                                }
                                else {
                                    jl = ib[jn];
                                    ISOF3(jl, xy[0], xy[1], out);
                                    jl = ib[j];
                                    ib[j] = -1;
                                    ib[jn] = -1;
                                    j = jn;
                                }
                            }
                            ISOF3(jl, xy[0], xy[1], out);
                        }
                        else {
                            jn = j;
                            jl = ib[j];
                            if (L - 2 != 0)
                                ib[j] = -1;
                            ISOF3(jl, xy[0], xy[1], out);
                        }
                    }
                    else {
                        if (L - 2 != 0) {
                            ib[j] == -2;
                            if (ja > 0) {
                                ib[ja] = -1;
                            }
                        }
                        if (j - i > 0) {
                            i = j
                        }
                        continue;
                    }
                }

            }
            for (i = 0; i < mx; i++) {
                xf = x0;
                xd = xf;
                xf = x0 + ex * (i + 1);
                k = 3;
                L = 5;
                ja = 0;
                if (ib[i] == 0) { //202
                    xy = ISOF2(zd, zf, xd, xf, yd, yf, i, k, L);
                    j = xy[2];
                    k = xy[3];
                    L = xy[4];
                    if (j >= 0) { //203
                        NBC++;
                        ib[i] = NBC;
                        ISOF3(NBC, xy[0], xy[1], out);
                        if (k > 0) { //204
                            if (k == 0) { //207
                                if (L - 2 > 0) { //208
                                    k = 2;
                                    L = 1;
                                    j = i;
                                    B = true;
                                    break;
                                }
                                else continue;
                            }
                            if (L - 2 >= 0) { //206
                                if (L - 2 == 0) //205
                                    ja = -1;
                                k = 0;
                                j = i;
                                B = true;
                                break;
                            }
                        }
                    }
                }
            }
        }
        //До этого всё норм


        /*while (i < nx) { //102
            j = i;
            ja = 0;
            L = 4;
            let B = false;
            if (ib[i] <= 0) { //134 Если не изолиния
                //console.log(ib[i])
                i++
                if (nx - i > 0)
                    continue;
                else { //200
                    IGO = 2;
                    i = 0;
                    xf = x0;
                    //201
                    while (nx - i > 0) {
                        xd = xf;
                        xf = x0 + ex * i;
                        k = 3;
                        L = 5;
                        ja = 0;
                        if (ib[i] != 0) { //210
                            i++;
                            if (nx - i >= 0)
                                continue;
                            else {
                                iy++;
                                if (ny - iy > 0)
                                    break;
                                else { //400 END
                                    return;
                                }
                            }
                        }
                        //До сюда вроде всё хорошо
        
                        
        
                        else { //202
                            xy = ISOF2(zd, zf, xd, xf, yd, yf, i, j, k, L);
                            j = xy[2];
                            k = xy[3];
                            L = xy[4];
                            if (j < 0) { //210
                                i++;
                                if (nx - i >= 0)
                                    continue;
                                else {
                                    iy++;
                                    if (ny - iy >= 0)
                                        break;
                                    else { //400 END
                                        return;
                                    }
                                }
                            }
                            else {
                                NBC++;
                                ib[i] = NBC;
                                //console.log(ib)
                                ISOF3(ib[i], xy[0], xy[1], out);
                                //console.log(xy)
                                if (k < 0) { //210
                                    i++
                                    if (nx - i >= 0)
                                        continue;
                                    else {
                                        iy++;
                                        if (ny - iy >= 0)
                                            break;
                                        else { //400 END
                                            return;
                                        }
                                    }
                                }
                                else {
                                    if (k > 0) { //204
                                        if (L - 2 < 0) { //210
                                            i++
                                            if (nx - i >= 0)
                                                continue;
                                            else {
                                                iy++;
                                                if (ny - iy >= 0)
                                                    break;
                                                else { //400 END
                                                    return;
                                                }
                                            }
                                        }
                                        else {
                                            if (L - 2 > 0) {
                                                k = 0;
                                                j = i;
                                                //300
                                                B = true;
                                            }
                                            else {
                                                ja = -2;
                                                k = 0;
                                                j = i;
                                                //300
                                                B = true;
                                            }
                                        }
                                    }
                                    else {
                                        if (L - 2 <= 0) { //210
                                            i++
                                            if (nx - i >= 0)
                                                continue;
                                            else {
                                                iy++;
                                                if (ny - iy >= 0)
                                                    break;
                                                else { //400 END
                                                    return;
                                                }
                                            }
                                        }
                                        else {
                                            k = 2;
                                            L = 1;
                                            j = i;
                                            //300
                                            B = true;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            else { //103 Если изолиния которой можно добавить точки
                if (zd[i] == 0) { //111 Если функция равн
                    if (i - 1 < 0) { //134
                        i++
                        if (nx - i >= 0)
                            continue;
                    }
                    else {
                        if (i - 1 > 0) { //112
                            if (ib[i - 1] + 2 != 0) { //113
                                ib[i] = 0
                                i++                 //134
                                if (nx - i >= 0)
                                    continue;
                            }
                        }
                        else { //114
                            k = 0;
                            //300
                            B = true;
                        }
                    }
                }
                else { //120
                    if (zd[i + 1] != 0) {
                        k = 0;
                        L = 5;
                        //300
                        B = true;
                    }
                    else { //121
                        k = 1;
                        //300
                        B = true;
                    }
                }
            }
            while (B == true) { //300
                xf = x0 + ex * j;
                xd = xf - ex;
                xy = ISOF2(zd, zf, xd, xf, yd, yf, j, jn, k, L);
                jn = xy[2];
                k = xy[3];
                L = xy[4];
                if (jn < 0) { //301
                    if (L - 2 != 0) { //302
                        ib[j] = -2;
                        if (ja <= 0) { //360
                            if (j - i > 0)
                                i = j;
                            B = false;
                        }
                        else {
                            ib[ja] = -1;
                            //360;
                            if (j - i > 0)
                                i = j;
                            B = false;
                        }
                    }
                    else { //360
                        if (j - i > 0)
                            i = j;
                        B = false;
                    }
                }
                else {
                    if (jn > 0) { //320
                        if (nx - jn >= 0) { //321
                            if (j - jn != 0) { //323
                                if (ib[jn] >= 0) {
                                    if (ib[jn] > 0) { //322
                                        {
                                            if (zd[jn] != 0) { //325
                                                jl = ib[jn];
                                                //console.log(jl)
                                                ISOF3(jl, xy[0], xy[1], out);
                                                //console.log(xy)
                                                jl = ib[j];
                                                ib[j] = -1;
                                                ib[jn] = -1;
                                                j = jn;
                                            }
                                            else { //324
                                                ib[jn] = ib[j];
                                                j = jn;
                                                jl = ib[j];
                                                ib[jn] = ib[j];
                                            }
                                        }
                                    }
                                    else { //340
                                        jl = ib[j];
                                        ib[jn] = ib[j];
                                    }
                                }
                                else { //310
                                    jn = j;
                                    jl = ib[j];
                                    if (L - 2 != 0)
                                        ib[j] = -1;
                                }
                            }
                            else { //340
                                jl = ib[j];
                                ib[jn] = ib[j];
                            }
                        }
                        else { //310
                            jn = j;
                            jl = ib[j];
                            if (L - 2 != 0)
                                ib[j] = -1;
                        }
                    }
                    else { //310
                        jn = j;
                        jl = ib[j];
                        if (L - 2 != 0)
                            ib[j] = -1;
                    }
                    //342
                    ISOF3(jl, xy[0], xy[1], out);
                    //console.log(xy)
                    if (ja < 0) { //350
                        ja = 0;
                        if (j - 1 <= 0) { //354
                            NBC++;
                            ISOF3(NBC, xf, xy[1], out);
                            console.log(xy)
                            ib[1] = NBC;
                        }
                        else { //355
                            ib[j] = ib[j - 1];
                        }
                    }
                    else {
                        if (ja > 0) { //351
                            ib[ja] = -1;
                            ja = j;
                        }
                        else { //352
                            ja = j;
                        }
                    }
                    //353
                    if (j - jn != 0) { //349
                        j = jn;
                        continue;
                    }
                    else {
                        //360
                        if (j - i > 0)
                            i = j;
                        B = false;
                    }
                }
            }
        }*/
        //iy++

    }
    //out.sort((a, b) => a - b)
    //console.log(out)
}



function ISOF1(xd: number, yd: number, zd: number, xf: number, yf: number, zf: number) {
    let c = -zd / (zf - zd);
    let xy = [];
    xy.push(xd + c * (xf - zd));
    xy.push(yd + c * (yf - yd));
    return xy;
}

function ISOF2(zd: number[], zf: number[], xd: number,
    xf: number, yd: number, yf: number, i: number, k: number, l: number) {
    let j;
    /*console.log(zd)
    console.log(zf)
    console.log(xd,xf,yd,yf,i, k, l)*/
    let xyj = [0, 0, 0];
    for (let m = 0; m < l; m++) {
        let igo = m + k;
        if (igo == 0 || igo == 5) {
            if (zd[i + 1] * zf[i + 1] >= 0) {
                continue;
            }
            else {
                k = 0;
                l = 3;
                j = i + 1;
                xyj = ISOF1(xf, yd, zd[i + 1], xf, yf, zf[i + 1]);
                xyj.push(j);
                xyj.push(k);
                xyj.push(l);
                return xyj;
            }
        }
        if (igo == 1 || igo == 6) {
            if (zf[i + 1] == 0) {
                continue;
            }
            else {
                k = 0;
                l = 3;
                j = i + 1;
                xyj[0] = xf;
                xyj[1] = yf;
                xyj[2] = j;
                xyj.push(k);
                xyj.push(l);
                return xyj;
            }
        }
        if (igo == 2 || igo == 7) {
            if (zf[i] * zf[i + 1] >= 0) {
                continue;
            }
            else {
                k = -1;
                j = i;
                xyj = ISOF1(xd, yf, zf[i], xf, yf, zf[i + 1]);
                xyj.push(j);
                xyj.push(k);
                xyj.push(l);
                return xyj;
            }
        }
        if (igo == 3 || igo == 8) {
            if (zf[i] != 0) {
                continue;
            }
            else {
                k = 3;
                l = 2;
                j = i - 1;
                xyj[0] = xd;
                xyj[1] = yf;
                xyj[2] = j;
                xyj.push(k);
                xyj.push(l);
                return xyj;
            }
        }
        else {
            if (zd[i] * zf[i] >= 0) {
                continue;
            }
            else {
                k = 2;
                l = 3;
                j = i - 1;
                xyj = ISOF1(xd, yd, zd[i], xd, yf, zf[i]);
                xyj.push(j);
                xyj.push(k);
                xyj.push(l);
                return xyj;
            }
        }

    }
    j = -1;
    xyj[2] = j;
    return xyj;
}

function ISOF3(i: number, x: number, y: number, out: any[]) {
    let pt = [];
    pt.push(i, x, y);
    out.push(pt);
    return;
}
function ISOF4(i: number, x: number, y: number, z: number, line: any[], out: any[]) {
    let pt = [];
    pt.push(i, x, y, z);
    if (line.length != 0) {
        if (line[0][0] == i) {
            line.push(pt);
        }
        else {
            //if (line.length > 2)
            out.push(line.slice(0));
            line.splice(0);
            line.push(pt)
        }
    } else line.push(pt)
    return;
}

export function SPHERE(x: number, y: number) {
    return Math.pow(Math.E, -(Math.pow(x, 2) + Math.pow(y, 2)) / 8) * (Math.sin(Math.pow(x, 2)) + Math.cos(Math.pow(y, 2)));
    return Math.sqrt(4 - (Math.pow(x, 2) + Math.pow(y, 2)));
}
