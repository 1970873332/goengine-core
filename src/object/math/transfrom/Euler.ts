import Value from "@goengine/core/src/object/attribute/Value";
import { MathUtils } from "@goengine/core/src/util/Math";
import Vector from "../Vector";
import Matrix4 from "../matrix/Matrix4";
import Vector2 from "../vector/Vector2";
import Vector3 from "../vector/Vector3";
import Quaternion from "./Quaternion";

/**
 * 欧拉角
 */
export default class Euler extends Vector<TEuler, Euler> {
    /**
     * 数组转为Euler
     * @param arr
     * @returns
     */
    public static fromArray(arr?: Partial<TEuler>): Euler {
        const [x, y, z, o] = arr ?? [];
        return new Euler(x, y, z, o);
    }
    /**
     * 数组转为Euler
     * @param arr
     * @returns
     */
    public static fromArrays(arr?: Partial<TEuler>[]): Euler[] {
        return arr?.map((v) => Euler.fromArray(v)) ?? [];
    }
    /**
     * 创建一个零欧拉角
     * @param order
     * @returns
     */
    public static zero(order?: Poly.resolveFunc<TOrder>): Euler {
        return new Euler(0, 0, 0, order);
    }
    /**
     * 创建一个X向量
     * @param v
     * @param order
     * @returns
     */
    public static fromX(v?: number, order?: Poly.resolveFunc<TOrder>): Euler {
        return new Euler(v, 0, 0, order);
    }
    /**
     * 创建一个Y向量
     * @param v
     * @param order
     * @returns
     */
    public static fromY(v?: number, order?: Poly.resolveFunc<TOrder>): Euler {
        return new Euler(0, v, 0, order);
    }
    /**
     * 创建一个Z向量
     * @param v
     * @param order
     * @returns
     */
    public static fromZ(v?: number, order?: Poly.resolveFunc<TOrder>): Euler {
        return new Euler(0, 0, v, order);
    }

    constructor(
        x?: Poly.resolveFunc<number>,
        y?: Poly.resolveFunc<number>,
        z?: Poly.resolveFunc<number>,
        order?: Poly.resolveFunc<TOrder>,
    ) {
        super(x, y);
        this.reckSilendSetter(this.rz, z);
        this.reckSilendSetter(this.rorder, order);
    }

    public readonly rz = new Value<number>(0, {
        set: (nv) => this.safety(nv),
    }).bindCallback(this.trigger.bind(this));

    public readonly rorder = new Value<TOrder>("XYZ").bindCallback(
        this.trigger.bind(this),
    );

    public get z(): number {
        return this.rz.value;
    }
    public set z(v: number) {
        this.rz.value = v;
    }
    public get order(): TOrder {
        return this.rorder.value;
    }
    public set order(v: TOrder) {
        this.rorder.value = v;
    }

    public get v3(): number {
        return this.z;
    }

    public get same(): boolean {
        return this.rx.same && this.ry.same && this.rz.same && this.rorder.same;
    }

    /**
     * 设置Euler
     * @param x
     * @param y
     * @param z
     * @param order
     * @param silence 静默
     * @returns
     */
    public set(
        x?: number,
        y?: number,
        z?: number,
        order?: TOrder,
        silence?: boolean,
    ): this {
        return this.unifySetter(silence, x, y, z, order);
    }
    /**
     * 设置Z
     * @param v
     */
    public setZ(v: number): void {
        this.z = v;
    }
    /**
     * Matrix转为Euler
     * @param m
     * @param order
     * @param silence 静默
     * @returns
     */
    public fromMatrix(
        m: Matrix4,
        order: TOrder = this.order,
        silence?: boolean,
    ): this {
        const v: Vector2 = Vector2.zero(),
            { x1, x2, x3, y1, y2, y3, z1, z2, z3 } = m;
        switch (order) {
            case "XYZ":
                if (Math.abs(z2) < 0.9999999) {
                    v.set(Math.atan2(-z3, z2), Math.atan2(-y1, x1));
                    // 当 z2 接近 0 时，atan2(-z3, z2) 不稳定
                    if (Math.abs(z2) < 1e-6) v.v1 = 0;
                } else {
                    v.set(Math.atan2(z1, y1), 0);
                }
                return this.set(
                    v.v1,
                    Math.asin(MathUtils.clamp(z2, -1, 1)),
                    v.v2,
                    order,
                    silence,
                );
            case "YXZ":
                if (Math.abs(y3) < 0.9999999) {
                    v.set(Math.atan2(x3, z3), Math.atan2(y2, y1));
                    // 当 y3 接近 0 时修正
                    if (Math.abs(y3) < 1e-6) v.v1 = 0;
                } else {
                    v.set(Math.atan2(-x1, z1), 0);
                }
                return this.set(
                    Math.asin(-MathUtils.clamp(y3, -1, 1)),
                    v.v1,
                    v.v2,
                    order,
                    silence,
                );
            case "ZXY":
                if (Math.abs(x2) < 0.9999999) {
                    v.set(Math.atan2(-x3, x1), Math.atan2(-y2, z2));
                    // 当 x2 接近 0 时修正
                    if (Math.abs(x2) < 1e-6) v.v1 = 0;
                } else {
                    v.set(0, Math.atan2(y3, y1));
                }
                return this.set(
                    Math.asin(MathUtils.clamp(x2, -1, 1)),
                    v.v1,
                    v.v2,
                    order,
                    silence,
                );
            case "ZYX":
                if (Math.abs(z1) < 0.9999999) {
                    v.set(Math.atan2(z3, z2), Math.atan2(x1, y1));
                    // 当 z1 接近 0 时修正
                    if (Math.abs(z1) < 1e-6) v.v1 = 0;
                } else {
                    v.set(0, Math.atan2(-x1, y2));
                }
                return this.set(
                    v.v1,
                    Math.asin(-MathUtils.clamp(z1, -1, 1)),
                    v.v2,
                    order,
                    silence,
                );
            case "YZX":
                if (Math.abs(y2) < 0.9999999) {
                    v.set(Math.atan2(-y1, y3), Math.atan2(-x2, z2));
                    // 当 y2 接近 0 时修正
                    if (Math.abs(y2) < 1e-6) v.v1 = 0;
                } else {
                    v.set(0, Math.atan2(z3, z1));
                }
                return this.set(
                    v.v1,
                    v.v2,
                    Math.asin(MathUtils.clamp(y2, -1, 1)),
                    order,
                    silence,
                );
            case "XZY":
                if (Math.abs(x1) < 0.9999999) {
                    v.set(Math.atan2(y3, z3), Math.atan2(x3, x1));
                    // 当 x1 接近 0 时修正
                    if (Math.abs(x1) < 1e-6) v.v1 = 0;
                } else {
                    v.set(Math.atan2(-y3, z3), 0);
                }
                return this.set(
                    v.v1,
                    v.v2,
                    Math.asin(-MathUtils.clamp(x1, -1, 1)),
                    order,
                    silence,
                );
            default:
                return this;
        }
    }
    /**
     * Quaternion转为Euler
     * @param q
     * @param order
     * @param silence 静默
     * @returns
     */
    public fromQuaternion(
        q: Quaternion,
        order: TOrder = this.order,
        silence?: boolean,
    ): this {
        return this.fromMatrix(new Matrix4().quaternion(q), order, silence);
    }
    /**
     * Vector3转为Euler
     * @param v
     * @param order
     * @param silence 静默
     * @returns
     */
    public fromVector3(
        v: Vector3,
        order: TOrder = this.order,
        silence?: boolean,
    ): this {
        return this.set(v.x, v.y, v.z, order, silence);
    }
    /**
     * 判断是否相等
     * @param euler
     * @returns
     */
    public equals(euler: Euler): boolean {
        return (
            this.x === euler.x &&
            this.y === euler.y &&
            this.z === euler.z &&
            this.order === euler.order
        );
    }
    /**
     * 设置为零欧拉角
     * @param order
     * @returns
     */
    public zero(order?: TOrder): this {
        return this.set(0, 0, 0, order);
    }

    protected unifySilendSetter(...array: unknown[]): this {
        const [x, y, z, o] = array;
        typeof z === "number" && this.rz.setter(z);
        typeof o === "string" && this.rorder.setter(o as TOrder);

        return super.unifySilendSetter(x, y);
    }

    public toArray(): TEuler {
        return [this.x, this.y, this.z, this.order];
    }
}

type TEuler = [number, number, number, Infer.Unite<TOrder>];

type TOrder = "XYZ" | "YXZ" | "ZXY" | "ZYX" | "YZX" | "XZY";

export { TOrder as EulerOrder };
