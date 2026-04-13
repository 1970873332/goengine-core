import ResponseAttribute from "@core/object/attribute/Response";
import { MathUtils } from "@core/util/Math";
import { Matrix4, Quaternion, Vector2, Vector3 } from "../Index";
import Vector from "../Vector";

/**
 * 欧拉角
 */
export default class Euler extends Vector<TEuler, Record<any, any>> {
    /**
     * 是否是欧拉角
     */
    public readonly isEuler: boolean = true;

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

    public readonly rz = new ResponseAttribute(
        0,
    ).bindCallback(this.trigger.bind(this));

    public readonly rorder = new ResponseAttribute<TOrder>(
        "XYZ",
    ).bindCallback(this.trigger.bind(this));

    public get z(): number {
        return this.rz.value;
    }
    public set z(v: number) {
        this.rz.setter(v);
    }
    public get order(): TOrder {
        return this.rorder.value;
    }
    public set order(v: TOrder) {
        this.rorder.setter(v);
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
     * @param silend
     * @returns
     */
    public set(
        x: number,
        y: number,
        z: number,
        order?: TOrder,
        silend?: boolean,
    ): this {
        return this.unifySetter(silend, x, y, z, order);
    }
    /**
     * Matrix转为Euler
     * @param m
     * @param order
     * @param silend
     * @returns
     */
    public fromMatrix(
        m: Matrix4,
        order: TOrder = this.order,
        silend?: boolean,
    ): this {
        const v: Vector2 = new Vector2();
        switch (order) {
            case "XYZ":
                Math.abs(m.z1) < 0.9999999
                    ? v.set(Math.atan2(-m.z2, m.z3), Math.atan2(-m.y1, m.x1))
                    : v.set(Math.atan2(m.y3, m.y2), 0);
                return this.set(
                    v.v1,
                    Math.asin(MathUtils.clamp(m.z1, -1, 1)),
                    v.v2,
                    order,
                    silend,
                );
            case "YXZ":
                Math.abs(m.y3) < 0.9999999
                    ? v.set(Math.atan2(m.x3, m.z3), Math.atan2(m.y1, m.y1))
                    : v.set(Math.atan2(-m.z1, m.x1), 0);
                return this.set(
                    Math.asin(-MathUtils.clamp(m.y3, -1, 1)),
                    v.v1,
                    v.v2,
                    order,
                    silend,
                );
            case "ZXY":
                Math.abs(m.z2) < 0.9999999
                    ? v.set(Math.atan2(-m.z1, m.z3), Math.atan2(-m.x2, m.y2))
                    : v.set(0, Math.atan2(m.y1, m.x1));
                return this.set(
                    Math.asin(MathUtils.clamp(m.z2, -1, 1)),
                    v.v1,
                    v.v2,
                    order,
                    silend,
                );
            case "ZYX":
                Math.abs(m.z1) < 0.9999999
                    ? v.set(Math.atan2(m.z2, m.z3), Math.atan2(m.y1, m.x1))
                    : v.set(0, Math.atan2(-m.x1, m.y2));
                return this.set(
                    v.v1,
                    Math.asin(-MathUtils.clamp(m.z1, -1, 1)),
                    v.v2,
                    order,
                    silend,
                );
            case "YZX":
                Math.abs(m.y1) < 0.9999999
                    ? v.set(Math.atan2(-m.y3, m.y2), Math.atan2(-m.z1, m.x1))
                    : v.set(0, Math.atan2(m.x3, m.z2));
                return this.set(
                    v.v1,
                    v.v2,
                    Math.asin(MathUtils.clamp(m.y1, -1, 1)),
                    order,
                    silend,
                );
            case "XZY":
                Math.abs(m.x2) < 0.9999999
                    ? v.set(Math.atan2(m.z2, m.y2), Math.atan2(m.x3, m.x1))
                    : v.set(Math.atan2(-m.y3, m.z3), 0);
                return this.set(
                    v.v1,
                    v.v2,
                    Math.asin(-MathUtils.clamp(m.x2, -1, 1)),
                    order,
                    silend,
                );
            default:
                return this;
        }
    }
    /**
     * Quaternion转为Euler
     * @param q
     * @param order
     * @param silend
     * @returns
     */
    public fromQuaternion(
        q: Quaternion,
        order: TOrder = this.order,
        silend?: boolean,
    ): this {
        return this.fromMatrix(new Matrix4().applyQuaternion(q), order, silend);
    }
    /**
     * Vector3转为Euler
     * @param v
     * @param order
     * @param silend
     * @returns
     */
    public fromVector3(
        v: Vector3,
        order: TOrder = this.order,
        silend?: boolean,
    ): this {
        return this.set(v.x, v.y, v.z, order, silend);
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

    protected unifySilendSetter(...array: unknown[]): this {
        const [x, y, z, o] = array;
        typeof z === "number" && this.rz.silentSetter(z);
        typeof o === "string" && this.rorder.silentSetter(o as TOrder);
        return super.unifySilendSetter(x, y);
    }

    public toArray(): TEuler {
        return [this.x, this.y, this.z, this.order];
    }

    public identity(): this {
        return this.set(0, 0, 0);
    }
}

type TEuler = [number, number, number, Infer.Unite<TOrder>];
type TOrder = "XYZ" | "YXZ" | "ZXY" | "ZYX" | "YZX" | "XZY";

export { TOrder as EulerOrder, TEuler as EulerType };

