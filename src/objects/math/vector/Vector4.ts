import ResponseAttribute from "../../attribute/Response";
import { Vector2, Vector3 } from "../Index";
import Vector from "../Vector";

/**
 * 四维向量
 */
export default class Vector4 extends Vector<TVector4> {
    /**
     * 数组转为Vector4
     * @param arr
     * @returns
     */
    public static fromArray(arr?: Partial<TVector4>): Vector4 {
        const [v1, v2, v3, v4] = arr ?? [];
        return new Vector4(v1, v2, v3, v4);
    }
    /**
     * 数组转为Vector4
     * @param arr
     * @returns
     */
    public static fromArrays(arr?: Partial<TVector4>[]): Vector4[] {
        return arr?.map((v) => Vector4.fromArray(v)) ?? [];
    }
    /**
     * 合并Vector2
     * @param v1
     * @param v2
     * @returns
     */
    public static mergeVector2(v1: Vector2, v2: Vector2): Vector4 {
        return new Vector4(v1.x, v1.y, v2.x, v2.y);
    }

    constructor(
        x?: Poly.resolveFunc<number>,
        y?: Poly.resolveFunc<number>,
        z?: Poly.resolveFunc<number>,
        w?: Poly.resolveFunc<number>,
    ) {
        super(x, y);
        this.reckSilendSetter(this.rz, z);
        this.reckSilendSetter(this.rw, w);
    }

    public readonly rz: ResponseAttribute<number> = new ResponseAttribute(
        0,
        this.safety.bind(this),
    ).bindCallback(this.trigger.bind(this));
    public readonly rw: ResponseAttribute<number> = new ResponseAttribute(
        0,
        this.safety.bind(this),
    ).bindCallback(this.trigger.bind(this));

    public get z(): number {
        return this.rz.value;
    }
    public set z(v: number) {
        this.rz.setter(v);
    }
    public get w(): number {
        return this.rw.value;
    }
    public set w(v: number) {
        this.rw.setter(v);
    }

    public get v3(): number {
        return this.z;
    }
    public set v3(v: number) {
        this.z = v;
    }
    public get v4(): number {
        return this.w;
    }
    public set v4(v: number) {
        this.w = v;
    }

    public get width(): number {
        return this.z;
    }
    public set width(v: number) {
        this.z = v;
    }
    public get height(): number {
        return this.w;
    }
    public set height(v: number) {
        this.w = v;
    }

    public get x1(): number {
        return this.z;
    }
    public set x1(v: number) {
        this.z = v;
    }
    public get y1(): number {
        return this.w;
    }
    public set y1(v: number) {
        this.w = v;
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
    public get a(): number {
        return this.w;
    }
    public set a(v: number) {
        this.w = v;
    }

    public get fov(): number {
        return this.x;
    }
    public set fov(v: number) {
        this.x = v;
    }
    public get aspect(): number {
        return this.y;
    }
    public set aspect(v: number) {
        this.y = v;
    }
    public get near(): number {
        return this.z;
    }
    public set near(v: number) {
        this.z = v;
    }
    public get far(): number {
        return this.w;
    }
    public set far(v: number) {
        this.w = v;
    }

    public get top(): number {
        return this.x;
    }
    public set top(v: number) {
        this.x = v;
    }
    public get right(): number {
        return this.y;
    }
    public set right(v: number) {
        this.y = v;
    }
    public get bottom(): number {
        return this.z;
    }
    public set bottom(v: number) {
        this.z = v;
    }
    public get left(): number {
        return this.w;
    }
    public set left(v: number) {
        this.w = v;
    }

    public get same(): boolean {
        return this.rx.same && this.ry.same && this.rz.same && this.rw.same;
    }

    /**
     * 长度
     */
    public get length(): number {
        return Math.sqrt(this.lengthSquared);
    }
    /**
     * 长度平方
     */
    public get lengthSquared(): number {
        return this.x ** 2 + this.y ** 2 + this.z ** 2 + this.w ** 2;
    }
    /**
     * 获取头部Vector2
     */
    public get ahead(): Vector2 {
        return Vector2.fromArray([this.x, this.y]);
    }
    /**
     * 获取尾部Vector2
     */
    public get behind(): Vector2 {
        return Vector2.fromArray([this.z, this.w]);
    }
    /**
     * 获取分割
     */
    public get split(): Vector2[] {
        return [this.ahead, this.behind];
    }

    /**
     * 设置
     * @param x
     * @param y
     * @param z
     * @param w
     * @param silend
     * @returns
     */
    public set(
        x: number,
        y: number,
        z: number,
        w: number,
        silend?: boolean,
    ): this {
        return this.unifySetter(silend, x, y, z, w);
    }
    /**
     * 设置为相加结果
     * @param v1
     * @param v2
     * @returns
     */
    public addVectors(v1: Vector4, v2: Vector4): this {
        return this.set(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z, v1.w + v2.w);
    }
    /**
     * 相加
     * @param v
     * @returns
     */
    public add(v: Vector4): this {
        return this.addVectors(this, v);
    }
    /**
     * 相加标量
     * @param n
     * @returns
     */
    public addScalar(n: number): this {
        return this.addVectors(this, new Vector4(n, n, n, n));
    }
    /**
     * 设置为相减结果
     * @param v1
     * @param v2
     * @returns
     */
    public subVectors(v1: Vector4, v2: Vector4): this {
        return this.set(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z, v1.w - v2.w);
    }
    /**
     * 相减
     * @param v
     * @returns
     */
    public sub(v: Vector4): this {
        return this.subVectors(this, v);
    }
    /**
     * 相减标量
     * @param n
     * @returns
     */
    public subScalar(n: number): this {
        return this.subVectors(this, new Vector4(n, n, n, n));
    }
    /**
     * 设置为相乘结果
     * @param v1
     * @param v2
     * @returns
     */
    public multiplyVectors(v1: Vector4, v2: Vector4): this {
        return this.set(v1.x * v2.x, v1.y * v2.y, v1.z * v2.z, v1.w * v2.w);
    }
    /**
     * 相乘
     * @param v
     * @returns
     */
    public multiply(v: Vector4): this {
        return this.multiplyVectors(this, v);
    }
    /**
     * 相乘标量
     * @param n
     * @returns
     */
    public multiplyScalar(n: number): this {
        return this.multiplyVectors(this, new Vector4(n, n, n, n));
    }
    /**
     * 设置为除以结果
     * @param v1
     * @param v2
     * @returns
     */
    public divideVectors(v1: Vector4, v2: Vector4): this {
        return this.set(v1.x / v2.x, v1.y / v2.y, v1.z / v2.z, v1.w / v2.w);
    }
    /**
     * 除以
     * @param v
     * @returns
     */
    public divide(v: Vector4): this {
        return this.divideVectors(this, v);
    }
    /**
     * 除以标量
     * @param n
     * @returns
     */
    public divideScalar(n: number): this {
        return this.divideVectors(this, new Vector4(n, n, n, n));
    }
    /**
     * 距离
     * @param v
     * @returns
     */
    public distanceToSquared(v: Vector4): number {
        const dx = this.x - v.x,
            dy = this.y - v.y,
            dz = this.z - v.z,
            dw = this.w - v.w;
        return dx ** 2 + dy ** 2 + dz ** 2 + dw ** 2;
    }
    /**
     * 距离
     * @param v
     * @returns
     */
    public distanceTo(v: Vector4): number {
        return Math.sqrt(this.distanceToSquared(v));
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
    public equals(v: Vector4): boolean {
        return (
            this.x === v.x && this.y === v.y && this.z === v.z && this.w === v.w
        );
    }
    /**
     * 转为Vector3
     * @param vectors
     * @returns
     */
    public toVector3(names: TSelect = ["x", "y", "z"]): Vector3 {
        const [n1, n2, n3] = names;
        return new Vector3(this[n1], this[n2], this[n3]);
    }

    protected unifySilendSetter(...array: unknown[]): this {
        const [x, y, z, w] = array;
        typeof z === "number" && this.rz.silentSetter(z);
        typeof w === "number" && this.rw.silentSetter(w);
        return super.unifySilendSetter(x, y);
    }

    public toArray(): TVector4 {
        return [this.x, this.y, this.z, this.w];
    }

    public identity(): this {
        return this.set(0, 0, 0, 0);
    }
}

type TVector4 = [number, number, number, number];
type TSelect<T = "x" | "y" | "z" | "w"> = [T, T, T];
