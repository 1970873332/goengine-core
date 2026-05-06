import Value from "@core/object/attribute/Value";
import { Euler, Matrix4 } from "../Index";
import Vector from "../Vector";

/**
 * 四元数
 */
export default class Quaternion extends Vector<TQuaternion, {}, Quaternion> {
    /**
     * 是否是四元数
     */
    public readonly isQuaternion: boolean = true;

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
    /**
     * 创建一个单位四元数
     * @returns 
     */
    public static identity(): Quaternion {
        return new Quaternion(0, 0, 0, 1);
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

    public readonly rz = new Value<number>(
        0,
        {
            set: (nv) => this.safety(nv)
        }
    ).bindCallback(this.trigger.bind(this));

    public readonly rw = new Value<number>(
        1,
        {
            set: (nv) => this.safety(nv)
        }
    ).bindCallback(this.trigger.bind(this));

    public get z(): number {
        return this.rz.value;
    }
    public set z(v: number) {
        this.rz.value = v;
    }
    public get w(): number {
        return this.rw.value;
    }
    public set w(v: number) {
        this.rw.value = v;
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
     * Matrix转为Quaternion
     * @param m
     * @param silend
     * @returns
     */
    public fromMatrix(m: Matrix4, silend?: boolean): this {
        const
            trace = m.trace(3),
            {
                x1, y1, z1,
                x2, y2, z2,
                x3, y3, z3
            } = m;

        if (trace > 0) {
            const s = 0.5 / Math.sqrt(trace + 1.0);
            return this.set(
                (y2 - z3) * s,
                (z1 - x3) * s,
                (x2 - y1) * s,
                0.25 / s,
                silend,
            );
        } else if (x1 > y2 && x1 > z3) {
            const s = 2.0 * Math.sqrt(1.0 + x1 - y2 - z3);
            return this.set(
                0.25 * s,
                (x2 + y1) / s,
                (z1 + x3) / s,
                (y2 - z3) / s,
                silend,
            );
        } else if (y2 > z3) {
            const s = 2.0 * Math.sqrt(1.0 + y2 - x1 - z3);
            return this.set(
                (x2 + y1) / s,
                0.25 * s,
                (y3 + z2) / s,
                (z1 - x3) / s,
                silend,
            );
        } else {
            const s = 2.0 * Math.sqrt(1.0 + z3 - x1 - y2);
            return this.set(
                (z1 + x3) / s,
                (y3 + z2) / s,
                0.25 * s,
                (x2 - y1) / s,
                silend,
            );
        }
    }
    /**
     * 乘法
     * @param q 
     * @returns 
     */
    public multiply(q: Quaternion): this {
        const
            {
                x, y, z, w
            } = this,
            {
                x: x1, y: y1, z: z1, w: w1
            } = q;

        return this.set(
            w * x1 + x * w1 + y * z1 - z * y1,
            w * y1 - x * z1 + y * w1 + z * x1,
            w * z1 + x * y1 - y * x1 + z * w1,
            w * w1 - x * x1 - y * y1 - z * z1
        );

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
    /**
     * 单位四元数
     * @returns 
     */
    public identity(): this {
        return this.set(0, 0, 0, 1);
    }
    protected unifySilendSetter(...array: unknown[]): this {
        const [x, y, z, w] = array;
        typeof z === "number" && this.rz.setter(z);
        typeof w === "number" && this.rw.setter(w);
        return super.unifySilendSetter(x, y);
    }

    public toArray(): TQuaternion {
        return [this.x, this.y, this.z, this.w];
    }
}

type TQuaternion = [number, number, number, number];
