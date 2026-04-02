import ResponseAttribute from "../../attribute/Response";
import { Euler, Matrix4 } from "../Index";
import Vector from "../Vector";

/**
 * 四元数
 */
export default class Quaternion extends Vector<TQuaternion> {
    /**
     * 数组转为Quernion
     * @param arr
     * @returns
     */
    public static fromArray(arr?: Partial<TQuaternion>): Quaternion {
        const [x, y, z, w] = arr ?? [];
        return new Quaternion(x, y, z, w);
    }
    /**
     * 数组转为Quernion
     * @param arr
     * @returns
     */
    public static fromArrays(arr?: Partial<TQuaternion>[]): Quaternion[] {
        return arr?.map((v) => Quaternion.fromArray(v)) ?? [];
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
    ).bindCallback(this.trigger.bind(this));
    public readonly rw: ResponseAttribute<number> = new ResponseAttribute(
        1,
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

    public get same(): boolean {
        return this.rx.same && this.ry.same && this.rz.same && this.rw.same;
    }

    /**
     * 设置Quaternion
     * @param x
     * @param y
     * @param z
     * @param w
     * @param sliend
     * @returns
     */
    public set(
        x: number,
        y: number,
        z: number,
        w: number,
        sliend?: boolean,
    ): this {
        return this.unifySetter(sliend, x, y, z, w);
    }
    /**
     * Euler转为Quaternion
     * @param euler
     * @param silend
     * @returns
     */
    public fromEuler(euler: Euler, silend?: boolean): this {
        const cx = Math.cos(euler.x / 2);
        const cy = Math.cos(euler.y / 2);
        const cz = Math.cos(euler.z / 2);

        const sx = Math.sin(euler.x / 2);
        const sy = Math.sin(euler.y / 2);
        const sz = Math.sin(euler.z / 2);

        switch (euler.order) {
            case "XYZ":
                return this.set(
                    sx * cy * cz + cx * sy * sz,
                    cx * sy * cz - sx * cy * sz,
                    cx * cy * sz + sx * sy * cz,
                    cx * cy * cz - sx * sy * sz,
                    silend,
                );
            case "YXZ":
                return this.set(
                    sx * cy * cz + cx * sy * sz,
                    cx * sy * cz - sx * cy * sz,
                    cx * cy * sz - sx * sy * cz,
                    cx * cy * cz + sx * sy * sz,
                    silend,
                );
            case "ZXY":
                return this.set(
                    sx * cy * cz - cx * sy * sz,
                    cx * sy * cz + sx * cy * sz,
                    cx * cy * sz + sx * sy * cz,
                    cx * cy * cz - sx * sy * sz,
                    silend,
                );
            case "ZYX":
                return this.set(
                    sx * cy * cz - cx * sy * sz,
                    cx * sy * cz + sx * cy * sz,
                    cx * cy * sz - sx * sy * cz,
                    cx * cy * cz + sx * sy * sz,
                    silend,
                );
            case "YZX":
                return this.set(
                    sx * cy * cz + cx * sy * sz,
                    cx * sy * cz + sx * cy * sz,
                    cx * cy * sz - sx * sy * cz,
                    cx * cy * cz - sx * sy * sz,
                    silend,
                );
            case "XZY":
                return this.set(
                    1 * cy * cz - cx * sy * sz,
                    1 * sy * cz - sx * cy * sz,
                    1 * cy * sz + sx * sy * cz,
                    1 * cy * cz + sx * sy * sz,
                    silend,
                );
            default:
                return this;
        }
    }
    /**
     * 根据矩阵设置Quaternion
     * @param m
     * @param silend
     * @returns
     */
    public fromMatrix(m: Matrix4, silend?: boolean): this {
        const trace = m.trace(3);
        if (trace > 0) {
            const s = 0.5 / Math.sqrt(trace + 1.0);
            return this.set(
                (m.y3 - m.z2) * s,
                (m.z1 - m.x3) * s,
                (m.x2 - m.y1) * s,
                0.25 / s,
                silend,
            );
        } else if (m.x1 > m.y2 && m.x1 > m.z3) {
            const s = 2.0 * Math.sqrt(1.0 + m.x1 - m.y2 - m.z3);
            return this.set(
                0.25 * s,
                (m.y1 + m.x2) / s,
                (m.z1 + m.x3) / s,
                (m.y3 - m.z2) / s,
                silend,
            );
        } else if (m.y2 > m.z3) {
            const s = 2.0 * Math.sqrt(1.0 + m.y2 - m.x1 - m.z3);
            return this.set(
                (m.y1 + m.x2) / s,
                0.25 * s,
                (m.z2 + m.y3) / s,
                (m.z1 - m.x3) / s,
                silend,
            );
        } else {
            const s = 2.0 * Math.sqrt(1.0 + m.z3 - m.x1 - m.y2);
            return this.set(
                (m.x2 - m.y1) / s,
                (m.z1 + m.x3) / s,
                (m.z2 + m.y3) / s,
                0.25 * s,
                silend,
            );
        }
    }
    /**
     * 判断是否相等
     * @param q
     * @returns
     */
    public equals(q: Quaternion): boolean {
        return (
            this.x === q.x && this.y === q.y && this.z === q.z && this.w === q.w
        );
    }

    protected unifySilendSetter(...array: unknown[]): this {
        const [x, y, z, w] = array;
        typeof z === "number" && this.rz.silentSetter(z);
        typeof w === "number" && this.rw.silentSetter(w);
        return super.unifySilendSetter(x, y);
    }

    public toArray(): TQuaternion {
        return [this.x, this.y, this.z, this.w];
    }

    public identity(): this {
        return this.set(0, 0, 0, 1);
    }
}

type TQuaternion = [number, number, number, number];
