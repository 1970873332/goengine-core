import { Vector4 } from "@core/object/math/Index";
import BaseNode, { BaseNodeConfig, BaseNodeEvent } from "../Base";

/**
 * 基础ctx节点
 */
export default abstract class BaseCTXNode<
    S extends IStyle,
    C extends IConfig,
    E extends IEvent,
> extends BaseNode<C, E> {
    /**
     * 是否是ctx节点
     */
    public readonly isCTXNode: boolean = true;

    /**
     * 样式
     */
    public style: S = {} as S;

    /**
     * 获取包围盒
     * @returns
     */
    public get boundingBox(): Vector4[] {
        throw new Error("未实现boundingBox");
    }

    /**
     * 设置样式
     */
    public setStyle(style: S): this {
        Object.assign(this.style, style);
        return this;
    }

    public add(...nodes: BaseCTXNode<any, any, any>[]): this {
        return super.add(...nodes);
    }

    public remove(node: BaseNode<any, any>, destory?: boolean): this {
        return super.remove(node, destory);
    }
}

interface IStyle { }

interface IConfig extends BaseNodeConfig { }

interface IEvent extends BaseNodeEvent { }

export { IStyle as BaseCTXNodeStyle, IConfig as BaseCTXNodeConfig, IEvent as BaseCTXNodeEvent };

