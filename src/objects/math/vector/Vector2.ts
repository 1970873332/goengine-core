import { Vector3, Vector4 } from "../Index";
import Vector from "../Vector";

/**
 * 二维向量
 */
export default class Vector2 extends Vector<TVector2> {
    /**
     * 数组转为Vector2
     * @param arr
     * @returns
     */
    public static fromArray(arr?: Partial<TVector2>): Vector2 {
        const [v1, v2] = arr ?? [];
        return new Vector2(v1, v2);
    }
    /**
     * 数组转为Vector2
     * @param arr
     * @returns
     */
    public static fromArrays(arr?: Partial<TVector2>[]): Vector2[] {
        return arr?.map((v) => Vector2.fromArray(v)) ?? [];
    }

    public get width(): number {
        return this.x;
    }
    public set width(v: number) {
        this.x = v;
    }
    public get height(): number {
        return this.y;
    }
    public set height(v: number) {
        this.y = v;
    }

    public get near(): number {
        return this.x;
    }
    public set near(v: number) {
        this.x = v;
    }
    public get far(): number {
        return this.y;
    }
    public set far(v: number) {
        this.y = v;
    }

    /**
     * 长度平方
     */
    public get lengthSquared(): number {
        return this.x ** 2 + this.y ** 2;
    }
    /**
     * 长度
     */
    public get length(): number {
        return Math.sqrt(this.lengthSquared);
    }

    /**
     * 设置
     * @param x
     * @param y
     * @param silend
     * @returns
     */
    public set(x: number, y: number, silend?: boolean): this {
        return this.unifySetter(silend, x, y);
    }
    /**
     * 设置为相加结果
     * @param v1
     * @param v2
     * @returns
     */
    public addVectors(v1: Vector2, v2: Vector2): this {
        return this.set(v1.x + v2.x, v1.y + v2.y);
    }
    /**
     * 相加
     * @param v
     * @returns
     */
    public add(v: Vector2): this {
        return this.addVectors(this, v);
    }
    /**
     * 相加标量
     * @param n
     * @returns
     */
    public addScalar(n: number): this {
        return this.addVectors(this, new Vector2(n, n));
    }
    /**
     * 设置为减去结果
     * @param v1
     * @param v2
     * @returns
     */
    public subVectors(v1: Vector2, v2: Vector2): this {
        return this.set(v1.x - v2.x, v1.y - v2.y);
    }
    /**
     * 减去
     * @param v
     * @returns
     */
    public sub(v: Vector2): this {
        return this.subVectors(this, v);
    }
    /**
     * 减去标量
     * @param n
     * @returns
     */
    public subScalar(n: number): this {
        return this.subVectors(this, new Vector2(n, n));
    }
    /**
     * 设置为相乘结果
     * @param v1
     * @param v2
     * @returns
     */
    public multiplyVectors(v1: Vector2, v2: Vector2): this {
        return this.set(v1.x * v2.x, v1.y * v2.y);
    }
    /**
     * 相乘
     * @param v
     * @returns
     */
    public multiply(v: Vector2): this {
        return this.multiplyVectors(this, v);
    }
    /**
     * 乘以标量
     * @param n
     * @returns
     */
    public multiplyScalar(n: number): this {
        return this.multiplyVectors(this, new Vector2(n, n));
    }
    /**
     * 设置为除以结果
     * @param v1
     * @param v2
     * @returns
     */
    public divideVectors(v1: Vector2, v2: Vector2): this {
        return this.set(v1.x / v2.x, v1.y / v2.y);
    }
    /**
     * 除以
     * @param v
     * @returns
     */
    public divide(v: Vector2): this {
        return this.divideVectors(this, v);
    }
    /**
     * 除以标量
     * @param n
     * @returns
     */
    public divideScalar(n: number): this {
        return this.divideVectors(this, new Vector2(n, n));
    }
    /**
     * 距离平方
     * @param v
     * @returns
     */
    public distanceSquared(v: Vector2): number {
        const dx = this.x - v.x;
        const dy = this.y - v.y;
        return dx ** 2 + dy ** 2;
    }
    /**
     * 距离
     * @param v
     * @returns
     */
    public distance(v: Vector2): number {
        return Math.sqrt(this.distanceSquared(v));
    }
    /**
     * 归一化
     * @returns
     */
    public normalize(): this {
        return this.divideScalar(this.length);
    }
    /**
     * 判断是否相等
     * @param v
     * @returns
     */
    public equals(v: Vector2): boolean {
        return this.x === v.x && this.y === v.y;
    }
    /**
     * 转为Vector3
     * @returns
     */
    public toVector3(): Vector3 {
        return new Vector3(this.x, this.y, 0);
    }
    /**
     * 转为Vector4
     * @param inFirst
     * @returns
     */
    public toVector4(head: boolean = true): Vector4 {
        return head
            ? new Vector4(this.x, this.y)
            : new Vector4(0, 0, this.x, this.y);
    }
    /**
     * 转为指定宽度的比例
     * @param fixed
     * @returns
     */
    public toFixedWidthScale(fixed: number): Vector2 {
        return new Vector2(
            fixed,
            Math.round((fixed / this.width) * this.height),
        );
    }

    public toArray(): TVector2 {
        return [this.x, this.y];
    }

    public identity(): this {
        return this.set(0, 0);
    }
}

type TVector2 = [number, number];
