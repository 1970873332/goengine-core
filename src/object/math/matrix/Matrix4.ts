import { Euler, Quaternion, Vector3 } from "../Index";
import Matrix from "../Matrix";

/**
 * 4x4矩阵
 */
export default class Matrix4 extends Matrix<TMatrix4, Record<any, any>> {
    /**
     * 是否是4x4矩阵
     */
    public readonly isMatrix4: boolean = true;

    /**
     * 单位矩阵
     */
    public static readonly identity: TMatrix4 = [
        1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1,
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
                matrix.multiply(matrixX).multiply(matrixY).multiply(matrixZ);
                break;
            case "YXZ":
                matrix.multiply(matrixY).multiply(matrixX).multiply(matrixZ);
                break;
            case "ZXY":
                matrix.multiply(matrixZ).multiply(matrixX).multiply(matrixY);
                break;
            case "ZYX":
                matrix.multiply(matrixZ).multiply(matrixY).multiply(matrixX);
                break;
            case "YZX":
                matrix.multiply(matrixY).multiply(matrixZ).multiply(matrixX);
                break;
            case "XZY":
                matrix.multiply(matrixX).multiply(matrixZ).multiply(matrixY);
                break;
        }
        return matrix;
    }
    /**
     * X轴旋转
     * @param radian
     * @returns
     */
    public static rotationX(radian: number): Matrix4 {
        const cos = Math.cos(radian),
            sin = Math.sin(radian);
        return new Matrix4().set([
            1,
            0,
            0,
            0,
            0,
            cos,
            -sin,
            0,
            0,
            sin,
            cos,
            0,
            0,
            0,
            0,
            1,
        ]);
    }
    /**
     * Y轴旋转
     * @param radian
     * @returns
     */
    public static rotationY(radian: number): Matrix4 {
        const cos = Math.cos(radian),
            sin = Math.sin(radian);
        return new Matrix4().set([
            cos,
            0,
            sin,
            0,
            0,
            1,
            0,
            0,
            -sin,
            0,
            cos,
            0,
            0,
            0,
            0,
            1,
        ]);
    }
    /**
     * Z轴旋转
     * @param radian
     * @returns
     */
    public static rotationZ(radian: number): Matrix4 {
        const cos = Math.cos(radian),
            sin = Math.sin(radian);
        return new Matrix4().set([
            cos,
            -sin,
            0,
            0,
            sin,
            cos,
            0,
            0,
            0,
            0,
            1,
            0,
            0,
            0,
            0,
            1,
        ]);
    }
    /**
     * 缩放
     * @param v
     * @returns
     */
    public static scale(v: Vector3): Matrix4 {
        return new Matrix4().set([
            v.x,
            0,
            0,
            0,
            0,
            v.y,
            0,
            0,
            0,
            0,
            v.z,
            0,
            0,
            0,
            0,
            1,
        ]);
    }
    /**
     * 平移
     * @param v
     * @returns
     */
    public static translate(v: Vector3): Matrix4 {
        return new Matrix4().set([
            1,
            0,
            0,
            v.x,
            0,
            1,
            0,
            v.y,
            0,
            0,
            1,
            v.z,
            0,
            0,
            0,
            1,
        ]);
    }
    /**
     * 四元数转为Matrix4
     * @param q
     * @returns
     */
    public static quaternionToMatrix(q: Quaternion): Matrix4 {
        return new Matrix4().set([
            1 - 2 * (q.y * q.y + q.z * q.z),
            2 * (q.x * q.y + q.z * q.w),
            2 * (q.x * q.z - q.y * q.w),
            0,

            2 * (q.x * q.y - q.z * q.w),
            1 - 2 * (q.x * q.x + q.z * q.z),
            2 * (q.y * q.z + q.x * q.w),
            0,

            2 * (q.x * q.z + q.y * q.w),
            2 * (q.y * q.z - q.x * q.w),
            1 - 2 * (q.x * q.x + q.y * q.y),
            0,

            0,
            0,
            0,
            1,
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
        const x = q.x,
            y = q.y,
            z = q.z,
            w = q.w,
            x2 = x + x,
            y2 = y + y,
            z2 = z + z,
            xx = x * x2,
            xy = x * y2,
            xz = x * z2,
            yy = y * y2,
            yz = y * z2,
            zz = z * z2,
            wx = w * x2,
            wy = w * y2,
            wz = w * z2,
            sx = s.x,
            sy = s.y,
            sz = s.z;
        return new Matrix4().set([
            (1 - (yy + zz)) * sx,
            (xy + wz) * sx,
            (xz - wy) * sx,
            0,

            (xy - wz) * sy,
            (1 - (xx + zz)) * sy,
            (yz + wx) * sy,
            0,

            (xz + wy) * sz,
            (yz - wx) * sz,
            (1 - (xx + yy)) * sz,
            0,

            p.x,
            p.y,
            p.z,
            1,
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
        return this.m[1];
    }
    public set x2(v: number) {
        this.m[1] = v;
    }
    public get x3(): number {
        return this.m[2];
    }
    public set x3(v: number) {
        this.m[2] = v;
    }
    public get x4(): number {
        return this.m[3];
    }
    public set x4(v: number) {
        this.m[3] = v;
    }
    public get y1(): number {
        return this.m[4];
    }
    public set y1(v: number) {
        this.m[4] = v;
    }
    public get y2(): number {
        return this.m[5];
    }
    public set y2(v: number) {
        this.m[5] = v;
    }
    public get y3(): number {
        return this.m[6];
    }
    public set y3(v: number) {
        this.m[6] = v;
    }
    public get y4(): number {
        return this.m[7];
    }
    public set y4(v: number) {
        this.m[7] = v;
    }
    public get z1(): number {
        return this.m[8];
    }
    public set z1(v: number) {
        this.m[8] = v;
    }
    public get z2(): number {
        return this.m[9];
    }
    public set z2(v: number) {
        this.m[9] = v;
    }
    public get z3(): number {
        return this.m[10];
    }
    public set z3(v: number) {
        this.m[10] = v;
    }
    public get z4(): number {
        return this.m[11];
    }
    public set z4(v: number) {
        this.m[11] = v;
    }
    public get w1(): number {
        return this.m[12];
    }
    public set w1(v: number) {
        this.m[12] = v;
    }
    public get w2(): number {
        return this.m[13];
    }
    public set w2(v: number) {
        this.m[13] = v;
    }
    public get w3(): number {
        return this.m[14];
    }
    public set w3(v: number) {
        this.m[14] = v;
    }
    public get w4(): number {
        return this.m[15];
    }
    public set w4(v: number) {
        this.m[15] = v;
    }

    /**
     * 相乘
     * @param m
     * @returns
     */
    public multiply(m: Matrix4): this {
        return this.set([
            this.x1 * m.x1 + this.x2 * m.y1 + this.x3 * m.z1 + this.x4 * m.w1,
            this.x1 * m.x2 + this.x2 * m.y2 + this.x3 * m.z2 + this.x4 * m.w2,
            this.x1 * m.x3 + this.x2 * m.y3 + this.x3 * m.z3 + this.x4 * m.w3,
            this.x1 * m.x4 + this.x2 * m.y4 + this.x3 * m.z4 + this.x4 * m.w4,

            this.y1 * m.x1 + this.y2 * m.y1 + this.y3 * m.z1 + this.y4 * m.w1,
            this.y1 * m.x2 + this.y2 * m.y2 + this.y3 * m.z2 + this.y4 * m.w2,
            this.y1 * m.x3 + this.y2 * m.y3 + this.y3 * m.z3 + this.y4 * m.w3,
            this.y1 * m.x4 + this.y2 * m.y4 + this.y3 * m.z4 + this.y4 * m.w4,

            this.z1 * m.x1 + this.z2 * m.y1 + this.z3 * m.z1 + this.z4 * m.w1,
            this.z1 * m.x2 + this.z2 * m.y2 + this.z3 * m.z2 + this.z4 * m.w2,
            this.z1 * m.x3 + this.z2 * m.y3 + this.z3 * m.z3 + this.z4 * m.w3,
            this.z1 * m.x4 + this.z2 * m.y4 + this.z3 * m.z4 + this.z4 * m.w4,

            this.w1 * m.x1 + this.w2 * m.y1 + this.w3 * m.z1 + this.w4 * m.w1,
            this.w1 * m.x2 + this.w2 * m.y2 + this.w3 * m.z2 + this.w4 * m.w2,
            this.w1 * m.x3 + this.w2 * m.y3 + this.w3 * m.z3 + this.w4 * m.w3,
            this.w1 * m.x4 + this.w2 * m.y4 + this.w3 * m.z4 + this.w4 * m.w4,
        ]);
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
        switch (target) {
            case 1:
                return this.x1;
            case 2:
                return +this.x1 + this.y2;
            case 3:
                return +this.x1 + this.y2 + this.z3;
            case 4:
                return +this.x1 + this.y2 + this.z3 + this.w4;
            default:
                return 0;
        }
    }
    /**
     * 应用四元数
     * @param quaternion
     * @returns
     */
    public applyQuaternion(quaternion: Quaternion): this {
        return this.multiply(Matrix4.quaternionToMatrix(quaternion));
    }
    /**
     * 看向
     * @param eye
     * @param target
     * @param up
     * @returns
     */
    public lookAt(eye: Vector3, target: Vector3, up: Vector3): this {
        const zAxis: Vector3 = target.clone().sub(eye).normalize(),
            xAxis: Vector3 = up.clone().cross(zAxis).normalize(),
            yAxis: Vector3 = zAxis.clone().cross(xAxis).normalize(),
            position: Vector3 = eye.clone();
        return this.set([
            xAxis.x,
            yAxis.x,
            zAxis.x,
            0,
            xAxis.y,
            yAxis.y,
            zAxis.y,
            0,
            xAxis.z,
            yAxis.z,
            zAxis.z,
            0,
            -position.dot(xAxis),
            -position.dot(yAxis),
            -position.dot(zAxis),
            1,
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
