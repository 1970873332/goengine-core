import Value from "@goengine/core/src/object/attribute/Value";
import Matrix4 from "../matrix/Matrix4";
import Euler, { EulerOrder } from "../transfrom/Euler";
import Vector from "../Vector";
import Vector2 from "./Vector2";
import Vector4 from "./Vector4";

/**
 * 三维向量
 */
export default class Vector3 extends Vector<TArray, Vector3> {
    /**
     * 创建一个X向量
     * @param v
     * @returns
     */
    public static fromX(v?: number): Vector3 {
        return new Vector3(v);
    }
    /**
     * 创建一个Y向量
     * @param v
     * @returns
     */
    public static fromY(v?: number): Vector3 {
        return new Vector3(0, v);
    }
    /**
     * 创建一个Z向量
     * @param v
     * @returns
     */
    public static fromZ(v?: number): Vector3 {
        return new Vector3(0, 0, v);
    }
    /**
     * 创建一个标量向量
     * @param v
     * @returns
     */
    public static fromScalar(v?: number): Vector3 {
        return new Vector3(v, v, v);
    }
    /**
     * 数组转为Vector3
     * @param arr
     * @returns
     */
    public static fromArray(arr?: Partial<TArray>): Vector3 {
        const [v1, v2, v3] = arr ?? [];
        return new Vector3(v1, v2, v3);
    }
    /**
     * 从对象创建
     * @param obj
     * @returns
     */
    public static fromObject(obj: VectorAttr.Vector3): Vector3 {
        const {
            x,
            y,
            z,

            width,
            height,
            depth,

            r,
            g,
            b,
        } = obj;

        return new Vector3(x ?? width ?? r, y ?? height ?? g, z ?? depth ?? b);
    }
    /**
     * 数组转为Vector3
     * @param arr
     * @returns
     */
    public static fromArrays(arr?: Partial<TArray>[]): Vector3[] {
        return arr?.map((v) => Vector3.fromArray(v)) ?? [];
    }
    /**
     * 创建一个零向量
     * @returns
     */
    public static zero(): Vector3 {
        return new Vector3(0, 0, 0);
    }
    /**
     * 创建一个单位向量
     * @returns
     */
    public static one(): Vector3 {
        return new Vector3(1, 1, 1);
    }
    /**
     * 创建一个x轴向量
     * @returns
     */
    public static xAxis(): Vector3 {
        return Vector3.fromX(1);
    }
    /**
     * 创建一个y轴向量
     * @returns
     */
    public static yAxis(): Vector3 {
        return Vector3.fromY(1);
    }
    /**
     * 创建一个z轴向量
     * @returns
     */
    public static zAxis(): Vector3 {
        return Vector3.fromZ(1);
    }

    constructor(
        x?: Poly.resolveFunc<number>,
        y?: Poly.resolveFunc<number>,
        z?: Poly.resolveFunc<number>,
    ) {
        super(x, y);
        this.reckSilendSetter(this.rz, z);
    }

    public readonly rz = new Value<number>(0, {
        set: (nv) => this.safety(nv),
    }).bindCallback(this.trigger.bind(this));

    public get z(): number {
        return this.rz.value;
    }
    public set z(v: number) {
        this.rz.value = v;
    }

    public get v3(): number {
        return this.z;
    }
    public set v3(v: number) {
        this.z = v;
    }

    public get r(): number {
        return this.x;
    }
    public set r(v: number) {
        this.x = v;
    }
    public get g(): number {
        return this.y;
    }
    public set g(v: number) {
        this.y = v;
    }
    public get b(): number {
        return this.z;
    }
    public set b(v: number) {
        this.z = v;
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
    public get depth(): number {
        return this.z;
    }
    public set depth(v: number) {
        this.z = v;
    }

    public get same(): boolean {
        return this.rx.same && this.ry.same && this.rz.same;
    }

    /**
     * 长度
     */
    public get length(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }
    /**
     * 长度平方
     */
    public get lengthSquared(): number {
        return this.x * this.x + this.y * this.y + this.z * this.z;
    }

    /**
     * 设置Z
     * @param v
     * @returns
     */
    public setZ(v: number): void {
        this.z = v;
    }
    /**
     * 设置
     * @param x
     * @param y
     * @param z
     * @param silence 静默
     * @returns
     */
    public set(x?: number, y?: number, z?: number, silence?: boolean): this {
        return this.unifySetter(silence, x, y, z);
    }
    /**
     * 设置为标量
     * @param v
     * @param silence
     * @returns
     */
    public setScalar(v?: number, silence?: boolean): this {
        return this.set(v, v, v, silence);
    }
    /**
     * 设置
     * @param x
     * @param y
     * @param z
     * @returns
     */
    public liveset(x?: number, y?: number, z?: number): this {
        this.unifySetter(true, x, y, z);
        return this.trigger();
    }
    /**
     * Matrix转为Vector3
     * @param m
     * @param type
     * @returns
     */
    public fromMatrix(m: Matrix4, type: "position" | "scale"): this {
        const { x1, x2, x3, x4, y1, y2, y3, y4, z1, z2, z3, z4, w1, w2, w3 } =
            m;
        switch (type) {
            case "position":
                return this.set(x4, y4, z4);
            case "scale":
                return this.set(
                    Math.sqrt(x1 ** 2 + y1 ** 2 + z1 ** 2 + w1 ** 2),
                    Math.sqrt(x2 ** 2 + y2 ** 2 + z2 ** 2 + w2 ** 2),
                    Math.sqrt(x3 ** 2 + y3 ** 2 + z3 ** 2 + w3 ** 2),
                );
            default:
                return this;
        }
    }
    /**
     * 相加
     * @param v1
     * @param v2
     * @returns
     */
    public addVectors(v1: Vector3, v2: Vector3): this {
        return this.set(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z);
    }
    /**
     * 相加
     * @param v
     * @returns
     */
    public add(v: Vector3): this {
        return this.addVectors(this, v);
    }
    /**
     * 相加标量
     * @param n
     * @returns
     */
    public addScalar(n: number): this {
        return this.addVectors(this, new Vector3(n, n, n));
    }
    /**
     * 减去
     * @param v1
     * @param v2
     * @returns
     */
    public subVectors(v1: Vector3, v2: Vector3): this {
        return this.set(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z);
    }
    /**
     * 减去
     * @param v
     * @returns
     */
    public sub(v: Vector3): this {
        return this.subVectors(this, v);
    }
    /**
     * 减去标量
     * @param n
     * @returns
     */
    public subScalar(n: number): this {
        return this.subVectors(this, new Vector3(n, n, n));
    }
    /**
     * 相乘
     * @param v1
     * @param v2
     * @returns
     */
    public multiplyVectors(v1: Vector3, v2: Vector3): this {
        return this.set(v1.x * v2.x, v1.y * v2.y, v1.z * v2.z);
    }
    /**
     * 相乘
     * @param v
     * @returns
     */
    public multiply(v: Vector3): this {
        return this.multiplyVectors(this, v);
    }
    /**
     * 乘以标量
     * @param n
     * @returns
     */
    public multiplyScalar(n: number): this {
        return this.multiplyVectors(this, new Vector3(n, n, n));
    }
    /**
     * 除以
     * @param v1
     * @param v2
     * @returns
     */
    public divideVectors(v1: Vector3, v2: Vector3): this {
        return this.set(v1.x / v2.x, v1.y / v2.y, v1.z / v2.z);
    }
    /**
     * 除以
     * @param v
     * @returns
     */
    public divide(v: Vector3): this {
        return this.divideVectors(this, v);
    }
    /**
     * 除以标量
     * @param n
     * @returns
     */
    public divideScalar(n: number): this {
        return this.divideVectors(this, new Vector3(n, n, n));
    }
    /**
     * 距离平方
     * @param v
     * @returns
     */
    public distanceSquared(v: Vector3): number {
        const dx = this.x - v.x;
        const dy = this.y - v.y;
        const dz = this.z - v.z;
        return dx ** 2 + dy ** 2 + dz ** 2;
    }
    /**
     * 距离
     * @param v
     * @returns
     */
    public distanceTo(v: Vector3): number {
        return Math.sqrt(this.distanceSquared(v));
    }
    /**
     * 叉乘
     * @param v1
     * @param v2
     * @returns
     */
    public crossVectors(v1: Vector3, v2: Vector3): this {
        return this.set(
            v1.y * v2.z - v1.z * v2.y,
            v1.z * v2.x - v1.x * v2.z,
            v1.x * v2.y - v1.y * v2.x,
        );
    }
    /**
     * 叉乘
     * @param v
     * @returns
     */
    public cross(v: Vector3): this {
        return this.crossVectors(this, v);
    }
    /**
     * 点乘
     * @param v1
     * @param v2
     * @returns
     */
    public dotVectors(v1: Vector3, v2: Vector3): number {
        return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
    }
    /**
     * 点乘
     * @param v
     * @returns
     */
    public dot(v: Vector3): number {
        return this.dotVectors(this, v);
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
    public equals(v: Vector3): boolean {
        return this.x === v.x && this.y === v.y && this.z === v.z;
    }
    /**
     * 转为Vector2
     * @param vectors
     * @returns
     */
    public toVector2(names: TDownArray = ["x", "y"]): Vector2 {
        const [n1, n2] = names;
        return new Vector2(this[n1], this[n2]);
    }
    /**
     * 转为Vector4
     * @returns
     */
    public toVector4(w?: number): Vector4 {
        return new Vector4(this.x, this.y, this.z, w);
    }
    /**
     * 转为Euler
     * @param order
     * @returns
     */
    public toEuler(order?: EulerOrder): Euler {
        return new Euler(this.x, this.y, this.z, order);
    }
    /**
     * 应用矩阵变换
     * @param m
     * @returns
     */
    public applyMatrix4(m: Matrix4): this {
        const { x, y, z } = this,
            { x1, x2, x3, x4, y1, y2, y3, y4, z1, z2, z3, z4 } = m;

        return this.set(
            x * x1 + y * x2 + z * x3 + x4,
            x * y1 + y * y2 + z * y3 + y4,
            x * z1 + y * z2 + z * z3 + z4,
        );
    }
    /**
     * 设置为零向量
     * @returns
     */
    public zero(): this {
        return this.set(0, 0, 0);
    }
    /**
     * 设置为单位向量
     * @returns
     */
    public one(): this {
        return this.set(1, 1, 1);
    }
    /**
     * 判断是否有效
     * @returns
     */
    public valid(): boolean {
        return super.valid() && !!this.z;
    }

    protected unifySilendSetter(...array: unknown[]): this {
        const [x, y, z] = array;
        typeof z === "number" && this.rz.setter(z);

        return super.unifySilendSetter(x, y);
    }

    public toArray(): TArray {
        return [this.x, this.y, this.z];
    }
}

type TArray = [number, number, number];

type TDownArray<T = "x" | "y" | "z"> = [T, T];

export { TArray as Vector3Array };
