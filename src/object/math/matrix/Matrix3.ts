import { Matrix4 } from "../Index";
import Matrix from "../Matrix";

/**
 * 3x3矩阵
 */
export default class Matrix3 extends Matrix<TMatrix3, {}> {
    /**
     * 是否是3x3矩阵
     */
    public readonly isMatrix3: boolean = true;

    /**
     * 单位矩阵
     */
    public static readonly identity: TMatrix3 = [1, 0, 0, 0, 1, 0, 0, 0, 1];

    public m: TMatrix3 = [...Matrix3.identity];

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
    public get y1(): number {
        return this.m[3];
    }
    public set y1(v: number) {
        this.m[3] = v;
    }
    public get y2(): number {
        return this.m[4];
    }
    public set y2(v: number) {
        this.m[4] = v;
    }
    public get y3(): number {
        return this.m[5];
    }
    public set y3(v: number) {
        this.m[5] = v;
    }
    public get z1(): number {
        return this.m[6];
    }
    public set z1(v: number) {
        this.m[6] = v;
    }
    public get z2(): number {
        return this.m[7];
    }
    public set z2(v: number) {
        this.m[7] = v;
    }
    public get z3(): number {
        return this.m[8];
    }
    public set z3(v: number) {
        this.m[8] = v;
    }

    /**
     * 相乘
     * @param m
     * @returns
     */
    public multiply(m: Matrix3): this {
        const a11 = this.x1, a12 = this.x2, a13 = this.x3;
        const a21 = this.y1, a22 = this.y2, a23 = this.y3;
        const a31 = this.z1, a32 = this.z2, a33 = this.z3;

        const b11 = m.x1, b12 = m.x2, b13 = m.x3;
        const b21 = m.y1, b22 = m.y2, b23 = m.y3;
        const b31 = m.z1, b32 = m.z2, b33 = m.z3;

        return this.set([
            a11 * b11 + a12 * b21 + a13 * b31,
            a21 * b11 + a22 * b21 + a23 * b31,
            a31 * b11 + a32 * b21 + a33 * b31,

            a11 * b12 + a12 * b22 + a13 * b32,
            a21 * b12 + a22 * b22 + a23 * b32,
            a31 * b12 + a32 * b22 + a33 * b32,

            a11 * b13 + a12 * b23 + a13 * b33,
            a21 * b13 + a22 * b23 + a23 * b33,
            a31 * b13 + a32 * b23 + a33 * b33,
        ]);
    }
    /**
     * 转为Matrix4
     * @returns
     */
    public toMatrix4(): Matrix4 {
        return new Matrix4().set([
            this.x1,
            this.x2,
            this.x3,
            0,
            this.y1,
            this.y2,
            this.y3,
            0,
            this.z1,
            this.z2,
            this.z3,
            0,
            0,
            0,
            0,
            1,
        ]);
    }

    public identity(): this {
        return this.set(Matrix3.identity);
    }
}

type TMatrix3 = [
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
