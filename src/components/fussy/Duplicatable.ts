import CallBackComponent from "../CallBack";

/**
 * 复制组件
 */
export default abstract class DuplicatableComponent<
    E extends Record<any, any>,
    B extends Function,
> extends CallBackComponent<E, B> {
    /**
     * 克隆
     * @returns
     */
    public clone(): this {
        return (new (this.constructor as any)() as this).copy(this, true);
    }
    /**
     * 复制
     * @param target
     * @param silend
     */
    public copy(target: this, silend?: boolean): this {
        throw new Error("未实现copy");
    }
    /**
     * 转换为JSON
     * @returns
     */
    public toJSON(): Record<any, any> {
        return {};
    }
}
