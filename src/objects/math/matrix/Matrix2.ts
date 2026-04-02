import { Matrix3, Matrix4 } from "../Index";
import Matrix from "../Matrix";

/**
 * 2x2矩阵
 */
export default class Matrix2 extends Matrix<TMatrix2> {
    /**
     * 单位矩阵
     */
    public static readonly identity: TMatrix2 = [1, 0, 0, 1];
    /**
     * 旋转
     * @param radian
     * @returns
     */
    public static rotation(radian: number): Matrix2 {
        const cos: number = Math.cos(radian),
            sin: number = Math.sin(radian);
        return new Matrix2().set([cos, -sin, sin, cos]);
    }
    /**
     * 缩放
     * @param x
     * @param y
     * @returns
     */
    public static scale(x: number, y: number): Matrix2 {
        return new Matrix2().set([x, 0, 0, y]);
    }

    public m: TMatrix2 = [...Matrix2.identity];

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
    public get y1(): number {
        return this.m[2];
    }
    public set y1(v: number) {
        this.m[2] = v;
    }
    public get y2(): number {
        return this.m[3];
    }
    public set y2(v: number) {
        this.m[3] = v;
    }

    /**
     * 相乘
     * @param m
     * @returns
     */
    public multiply(m: Matrix2): this {
        return this.set([
            this.x1 * m.x1 + this.x2 * m.y1,
            this.x1 * m.x2 + this.x2 * m.y2,

            this.y1 * m.x1 + this.y2 * m.y1,
            this.y1 * m.x2 + this.y2 * m.y2,
        ]);
    }
    /**
     * 旋转
     * @param radian
     * @returns
     */
    public rotate(radian: number): this {
        const rotationMatrix2 = Matrix2.rotation(radian);
        return this.multiply(rotationMatrix2);
    }
    /**
     * 缩放
     * @param x
     * @param y
     * @returns
     */
    public scale(x: number, y: number): this {
        const scaleMatrix2 = Matrix2.scale(x, y);
        return this.multiply(scaleMatrix2);
    }
    /**
     * 转为Matrix3
     * @returns
     */
    public toMatrix3(): Matrix3 {
        return new Matrix3().set([
            this.x1,
            this.x2,
            0,
            this.y1,
            this.y2,
            0,
            0,
            0,
            1,
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
            0,
            0,
            this.y1,
            this.y2,
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

    public identity(): this {
        return this.set(Matrix2.identity);
    }
}

type TMatrix2 = [number, number, number, number];
