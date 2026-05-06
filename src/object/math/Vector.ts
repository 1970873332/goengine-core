import DuplicatableComponent from "@core/component/fussy/Duplicatable";
import { PolyUtils } from "@core/util/Poly";
import Value from "../attribute/Value";

/**
 * 向量
 */
export default abstract class Vector<
    T extends any[],
    E extends {},
    B
> extends DuplicatableComponent<Func.CallBack<B>, E> {
    /**
     * 是否是向量
     */
    public readonly isVertor: boolean = true;

    constructor(x?: Poly.resolveFunc<number>, y?: Poly.resolveFunc<number>) {
        super();
        this.reckSilendSetter(this.rx, x);
        this.reckSilendSetter(this.ry, y);
    }

    public readonly rx = new Value<number>(
        0,
        {
            set: (nv) => this.safety(nv)
        }
    ).bindCallback(this.trigger.bind(this));

    public readonly ry = new Value<number>(
        0,
        {
            set: (nv) => this.safety(nv)
        }
    ).bindCallback(this.trigger.bind(this));

    public get x(): number {
        return this.rx.value;
    }
    public set x(v: number) {
        this.rx.value = v;
    }
    public get y(): number {
        return this.ry.value;
    }
    public set y(v: number) {
        this.ry.value = v;
    }

    public get v1(): number {
        return this.x;
    }
    public set v1(v: number) {
        this.x = v;
    }
    public get v2(): number {
        return this.y;
    }
    public set v2(v: number) {
        this.y = v;
    }

    /**
     * 是否相同
     */
    public get same(): boolean {
        return this.rx.same && this.ry.same;
    }

    /**
     * 设置X
     * @param v 
     * @returns 
     */
    public setX(v: number): void {
        this.x = v;
    }
    /**
     * 设置Y
     * @param v 
     * @returns 
     */
    public setY(v: number): void {
        this.y = v;
    }
    /**
     * 安全值
     * @param v
     * @returns
     */
    protected safety(v: number): number {
        return Math.abs(v) === Infinity ? 0 : v;
    }
    /**
     * 映射
     * @param formatter
     * @param silend
     * @returns
     */
    public map(...formatters: Array<(v: T[number]) => T[number]>): this {
        formatters.forEach((formatter) =>
            this.unifySilendSetter(...this.toArray().map(formatter)),
        );
        return this;
    }
    /**
     * 整合静默设置
     * @param array
     * @returns
     */
    protected unifySilendSetter(...array: unknown[]): this {
        const [v1, v2] = array;
        typeof v1 === "number" && this.rx.setter(v1);
        typeof v2 === "number" && this.ry.setter(v2);
        return this;
    }
    /**
     * 整合设置
     * @param array
     */
    protected unifySetter(silend?: boolean, ...array: unknown[]): this {
        this.unifySilendSetter(...array);
        !silend && !this.same && this.trigger();
        return this;
    }
    /**
     * 值或结果静默设置
     * @param target
     * @param v
     */
    protected reckSilendSetter<T>(
        target: Value<T>,
        v?: Poly.resolveFunc<T>,
    ): this {
        v && target.setter(PolyUtils.func(v));
        return this;
    }
    /**
     * 转为数组
     * @returns
     */
    public toArray(): T {
        throw new Error("未实现toArray");
    }

    protected execute(callback: Func.CallBack<B>): void {
        callback(this as unknown as B);
    }

    public clone(): this {
        return new (this.constructor as any)().copy(this);
    }

    public copy(target: this, silend?: boolean): this {
        this.unifySetter(silend, ...target.toArray());
        return this;
    }
}
