import DuplicatableComponent from "@goengine/core/src/component/fussy/Duplicatable";

/**
 * 矩阵
 */
export default abstract class Matrix<
    T extends number[],
    B extends Matrix<T, B>,
> extends DuplicatableComponent<Func.CallBack<B>, {}> {
    /**
     * 矩阵
     */
    declare public m: T;

    /**
     * 设置
     * @param array
     * @param silence 静默
     * @returns
     */
    public set(array: T, silence?: boolean): this {
        const same: boolean = array.toString() === this.m.toString();
        this.m = array;
        !silence && !same && this.trigger();
        return this;
    }
    /**
     * 数组转为矩阵
     * @returns
     */
    public toArray(): T {
        return [...this.m] as T;
    }
    /**
     * 重置为单位矩阵
     * @returns
     */
    public identity(): this {
        throw new Error("未实现identity");
    }

    protected execute(callback: Func.CallBack<B>): void {
        callback(this as unknown as B);
    }

    public copy(target: this, silence?: boolean): this {
        this.set(target.toArray(), true);

        return super.copy(target, silence);
    }
}
