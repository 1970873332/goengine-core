import { Euler, Quaternion, Vector3 } from "../Index";
import Matrix from "../Matrix";

/**
 * 4x4矩阵
 */
export default class Matrix4 extends Matrix<TMatrix4, {}> {
    /**
     * 是否是4x4矩阵
     */
    public readonly isMatrix4: boolean = true;

    /**
     * 单位矩阵
     */
    public static readonly identity: TMatrix4 = [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1,
    ];

    /**
     * 旋转
     * @param e
     * @returns
     */
    public static rotation(e: Euler): Matrix4 {
        const matrix: Matrix4 = new Matrix4(),
            matrixX: Matrix4 = Matrix4.rotationX(e.x),
            matrixY: Matrix4 = Matrix4.rotationY(e.y),
            matrixZ: Matrix4 = Matrix4.rotationZ(e.z);
        switch (e.order) {
            case "XYZ":
                matrix.multiply(matrixZ).multiply(matrixY).multiply(matrixX);
                break;
            case "YXZ":
                matrix.multiply(matrixZ).multiply(matrixX).multiply(matrixY);
                break;
            case "ZXY":
                matrix.multiply(matrixY).multiply(matrixX).multiply(matrixZ);
                break;
            case "ZYX":
                matrix.multiply(matrixX).multiply(matrixY).multiply(matrixZ);
                break;
            case "YZX":
                matrix.multiply(matrixX).multiply(matrixZ).multiply(matrixY);
                break;
            case "XZY":
                matrix.multiply(matrixY).multiply(matrixZ).multiply(matrixX);
                break;
        }
        return matrix;
    }

    /**
     * X轴旋转矩阵
     * @param radian 
     * @returns 
     */
    public static rotationX(radian: number): Matrix4 {
        const cos = Math.cos(radian), sin = Math.sin(radian);
        // 列主序:
        // col0 = (1,0,0,0)
        // col1 = (0, cos, sin, 0)
        // col2 = (0,-sin, cos, 0)
        // col3 = (0, 0, 0, 1)
        return new Matrix4().set([
            1, 0, 0, 0,
            0, cos, sin, 0,
            0, -sin, cos, 0,
            0, 0, 0, 1,
        ]);
    }

    /**
     * Y轴旋转矩阵
     * @param radian 
     * @returns 
     */
    public static rotationY(radian: number): Matrix4 {
        const cos = Math.cos(radian), sin = Math.sin(radian);
        // 列主序:
        // col0 = (cos, 0, -sin, 0)
        // col1 = (0, 1, 0, 0)
        // col2 = (sin, 0, cos, 0)
        // col3 = (0, 0, 0, 1)
        return new Matrix4().set([
            cos, 0, -sin, 0,
            0, 1, 0, 0,
            sin, 0, cos, 0,
            0, 0, 0, 1,
        ]);
    }

    /**
     * Z轴旋转矩阵
     * @param radian 
     * @returns 
     */
    public static rotationZ(radian: number): Matrix4 {
        const cos = Math.cos(radian), sin = Math.sin(radian);
        // 列主序:
        // col0 = (cos, sin, 0, 0)
        // col1 = (-sin, cos, 0, 0)
        // col2 = (0, 0, 1, 0)
        // col3 = (0, 0, 0, 1)
        return new Matrix4().set([
            cos, sin, 0, 0,
            -sin, cos, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1,
        ]);
    }

    /**
     * 缩放矩阵
     * @param v
     * @returns
     */
    public static scale(v: Vector3): Matrix4 {
        // 对角阵，列主序与行主序相同
        return new Matrix4().set([
            v.x, 0, 0, 0,
            0, v.y, 0, 0,
            0, 0, v.z, 0,
            0, 0, 0, 1,
        ]);
    }

    /**
     * 平移矩阵
     * @param v
     * @returns
     */
    public static translate(v: Vector3): Matrix4 {
        // 列主序: 平移量放在第4列的前三个分量
        return new Matrix4().set([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            v.x, v.y, v.z, 1,
        ]);
    }

    /**
     * 四元数转旋转矩阵
     * @param q 
     * @returns 
     */
    public static quaternion(q: Quaternion): Matrix4 {
        const { x, y, z, w } = q;
        const x2 = x + x, y2 = y + y, z2 = z + z;
        const xx = x * x2, xy = x * y2, xz = x * z2;
        const yy = y * y2, yz = y * z2, zz = z * z2;
        const wx = w * x2, wy = w * y2, wz = w * z2;

        // 列主序（原行主序矩阵的转置）
        return new Matrix4().set([
            1 - (yy + zz),   // col0 row0
            xy + wz,         // col0 row1
            xz - wy,         // col0 row2
            0,               // col0 row3

            xy - wz,         // col1 row0
            1 - (xx + zz),   // col1 row1
            yz + wx,         // col1 row2
            0,               // col1 row3

            xz + wy,         // col2 row0
            yz - wx,         // col2 row1
            1 - (xx + yy),   // col2 row2
            0,               // col2 row3

            0, 0, 0, 1,
        ]);
    }

    /**
     * 合并平移旋转缩放为矩阵
     * @param p 
     * @param q 
     * @param s 
     * @returns 
     */
    public static compose(p: Vector3, q: Quaternion, s: Vector3): Matrix4 {
        const { x, y, z, w } = q;
        const { x: sx, y: sy, z: sz } = s;
        const { x: px, y: py, z: pz } = p;
        const x2 = x + x, y2 = y + y, z2 = z + z;
        const xx = x * x2, xy = x * y2, xz = x * z2;
        const yy = y * y2, yz = y * z2, zz = z * z2;
        const wx = w * x2, wy = w * y2, wz = w * z2;

        // 列主序: 先四元数转矩阵（列主序），再乘缩放和平移
        return new Matrix4().set([
            (1 - (yy + zz)) * sx,   // col0 row0
            (xy + wz) * sx,         // col0 row1
            (xz - wy) * sx,         // col0 row2
            0,                      // col0 row3

            (xy - wz) * sy,         // col1 row0
            (1 - (xx + zz)) * sy,   // col1 row1
            (yz + wx) * sy,         // col1 row2
            0,                      // col1 row3

            (xz + wy) * sz,         // col2 row0
            (yz - wx) * sz,         // col2 row1
            (1 - (xx + yy)) * sz,   // col2 row2
            0,                      // col2 row3

            px,                     // col3 row0
            py,                     // col3 row1
            pz,                     // col3 row2
            1,                      // col3 row3
        ]);
    }

    public m: TMatrix4 = [...Matrix4.identity];

    public get x1(): number {
        return this.m[0];
    }
    public set x1(v: number) {
        this.m[0] = v;
    }
    public get x2(): number {
        return this.m[4];
    }
    public set x2(v: number) {
        this.m[4] = v;
    }
    public get x3(): number {
        return this.m[8];
    }
    public set x3(v: number) {
        this.m[8] = v;
    }
    public get x4(): number {
        return this.m[12];
    }
    public set x4(v: number) {
        this.m[12] = v;
    }

    public get y1(): number {
        return this.m[1];
    }
    public set y1(v: number) {
        this.m[1] = v;
    }
    public get y2(): number {
        return this.m[5];
    }
    public set y2(v: number) {
        this.m[5] = v;
    }
    public get y3(): number {
        return this.m[9];
    }
    public set y3(v: number) {
        this.m[9] = v;
    }
    public get y4(): number {
        return this.m[13];
    }
    public set y4(v: number) {
        this.m[13] = v;
    }

    public get z1(): number {
        return this.m[2];
    }
    public set z1(v: number) {
        this.m[2] = v;
    }
    public get z2(): number {
        return this.m[6];
    }
    public set z2(v: number) {
        this.m[6] = v;
    }
    public get z3(): number {
        return this.m[10];
    }
    public set z3(v: number) {
        this.m[10] = v;
    }
    public get z4(): number {
        return this.m[14];
    }
    public set z4(v: number) {
        this.m[14] = v;
    }

    public get w1(): number {
        return this.m[3];
    }
    public set w1(v: number) {
        this.m[3] = v;
    }
    public get w2(): number {
        return this.m[7];
    }
    public set w2(v: number) {
        this.m[7] = v;
    }
    public get w3(): number {
        return this.m[11];
    }
    public set w3(v: number) {
        this.m[11] = v;
    }
    public get w4(): number {
        return this.m[15];
    }
    public set w4(v: number) {
        this.m[15] = v;
    }

    /**
     * 矩阵乘法
     * @param m 
     * @returns 
     */
    public multiply(m: Matrix4): this {
        // 使用列主序的 getter 实现 C = this * m
        const a = this;
        const b = m;
        // 计算结果矩阵的 16 个分量（列主序）
        const result: TMatrix4 = [
            // 第1列 (x1, y1, z1, w1)
            a.x1 * b.x1 + a.x2 * b.y1 + a.x3 * b.z1 + a.x4 * b.w1,
            a.y1 * b.x1 + a.y2 * b.y1 + a.y3 * b.z1 + a.y4 * b.w1,
            a.z1 * b.x1 + a.z2 * b.y1 + a.z3 * b.z1 + a.z4 * b.w1,
            a.w1 * b.x1 + a.w2 * b.y1 + a.w3 * b.z1 + a.w4 * b.w1,

            // 第2列 (x2, y2, z2, w2)
            a.x1 * b.x2 + a.x2 * b.y2 + a.x3 * b.z2 + a.x4 * b.w2,
            a.y1 * b.x2 + a.y2 * b.y2 + a.y3 * b.z2 + a.y4 * b.w2,
            a.z1 * b.x2 + a.z2 * b.y2 + a.z3 * b.z2 + a.z4 * b.w2,
            a.w1 * b.x2 + a.w2 * b.y2 + a.w3 * b.z2 + a.w4 * b.w2,

            // 第3列 (x3, y3, z3, w3)
            a.x1 * b.x3 + a.x2 * b.y3 + a.x3 * b.z3 + a.x4 * b.w3,
            a.y1 * b.x3 + a.y2 * b.y3 + a.y3 * b.z3 + a.y4 * b.w3,
            a.z1 * b.x3 + a.z2 * b.y3 + a.z3 * b.z3 + a.z4 * b.w3,
            a.w1 * b.x3 + a.w2 * b.y3 + a.w3 * b.z3 + a.w4 * b.w3,

            // 第4列 (x4, y4, z4, w4)
            a.x1 * b.x4 + a.x2 * b.y4 + a.x3 * b.z4 + a.x4 * b.w4,
            a.y1 * b.x4 + a.y2 * b.y4 + a.y3 * b.z4 + a.y4 * b.w4,
            a.z1 * b.x4 + a.z2 * b.y4 + a.z3 * b.z4 + a.z4 * b.w4,
            a.w1 * b.x4 + a.w2 * b.y4 + a.w3 * b.z4 + a.w4 * b.w4,
        ];
        return this.set(result);
    }

    /**
     * 旋转
     * @param e
     * @returns
     */
    public rotate(e: Euler): this {
        return this.multiply(Matrix4.rotation(e));
    }

    /**
     * X轴旋转
     * @param radian
     * @returns
     */
    public rotateX(radian: number): this {
        return this.multiply(Matrix4.rotationX(radian));
    }

    /**
     * Y轴旋转
     * @param radian
     * @returns
     */
    public rotateY(radian: number): this {
        return this.multiply(Matrix4.rotationY(radian));
    }

    /**
     * Z轴旋转
     * @param radian
     * @returns
     */
    public rotateZ(radian: number): this {
        return this.multiply(Matrix4.rotationZ(radian));
    }

    /**
     * 缩放
     * @param v 
     * @returns 
     */
    public scale(v: Vector3): this {
        return this.multiply(Matrix4.scale(v));
    }

    /**
     * 平移
     * @param v 
     * @returns 
     */
    public translate(v: Vector3): this {
        return this.multiply(Matrix4.translate(v));
    }

    /**
     * 四元数
     * @param q
     * @returns
     */
    public quaternion(q: Quaternion): this {
        return this.multiply(Matrix4.quaternion(q));
    }

    /**
     * 合并平移旋转缩放
     * @param p
     * @param q
     * @param s
     * @returns
     */
    public compose(p: Vector3, q: Quaternion, s: Vector3): this {
        return this.multiply(Matrix4.compose(p, q, s));
    }

    /**
     * 对角值
     * @param target
     * @returns
     */
    public trace(target: number): number {
        const { x1, y2, z3, w4 } = this;

        switch (target) {
            case 1:
                return x1;
            case 2:
                return +x1 + y2;
            case 3:
                return +x1 + y2 + z3;
            case 4:
                return +x1 + y2 + z3 + w4;
            default:
                return 0;
        }
    }

    /**
     * 看向矩阵
     * @param eye
     * @param target
     * @param up
     * @returns
     */
    public lookAt(eye: Vector3, target: Vector3, up: Vector3): this {
        const zAxis = target.clone().sub(eye).normalize();
        const xAxis = up.clone().cross(zAxis).normalize();
        const yAxis = zAxis.clone().cross(xAxis).normalize();

        // 列主序 lookAt 矩阵
        return this.set([
            xAxis.x, xAxis.y, xAxis.z, -xAxis.dot(eye),
            yAxis.x, yAxis.y, yAxis.z, -yAxis.dot(eye),
            zAxis.x, zAxis.y, zAxis.z, -zAxis.dot(eye),
            0, 0, 0, 1,
        ]);
    }

    public identity(): this {
        return this.set(Matrix4.identity);
    }
}

type TMatrix4 = [
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
];