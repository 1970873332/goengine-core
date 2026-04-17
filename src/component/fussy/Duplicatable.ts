import CallBackComponent from "../CallBack";

/**
 * 复制组件
 */
export default abstract class DuplicatableComponent<
    T extends Function,
    E extends Record<any, any>,
> extends CallBackComponent<T, E> {
    /**
     * 克隆
     * @returns
     */
    public clone(): this {
        throw new Error("未实现clone");
    }
    /**
     * 复制
     * @param target
     * @param silend
     */
    public copy(target: this): this {
        throw new Error("未实现copy");
    }
    /**
     * 转换为JSON
     * @returns
     */
    public toJSON(): ISaveJSON {
        return {
            uuid: this.uuid,
            type: this.constructor.name,
        }
    }
    /**
     * 转换为字符串
     */
    public toString(): string {
        throw new Error("未实现toString");
    }
}

interface ISaveJSON extends Partial<Pick<DuplicatableComponent<any, any>, "uuid">> {
    /**
     * 类型
     */
    type: string;
}

export { ISaveJSON as DuplicatableSaveJSON }