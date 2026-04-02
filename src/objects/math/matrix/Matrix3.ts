import { Matrix4 } from "../Index";
import Matrix from "../Matrix";

/**
 * 3x3矩阵
 */
export default class Matrix3 extends Matrix<TMatrix3> {
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
        return this.set([
            this.x1 * m.x1 + this.x2 * m.y1 + this.x3 * m.z1,
            this.x1 * m.x2 + this.x2 * m.y2 + this.x3 * m.z2,
            this.x1 * m.x3 + this.x2 * m.y3 + this.x3 * m.z3,

            this.y1 * m.x1 + this.y2 * m.y1 + this.y3 * m.z1,
            this.y1 * m.x2 + this.y2 * m.y2 + this.y3 * m.z2,
            this.y1 * m.x3 + this.y2 * m.y3 + this.y3 * m.z3,

            this.z1 * m.x1 + this.z2 * m.y1 + this.z3 * m.z1,
            this.z1 * m.x2 + this.z2 * m.y2 + this.z3 * m.z2,
            this.z1 * m.x3 + this.z2 * m.y3 + this.z3 * m.z3,
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
