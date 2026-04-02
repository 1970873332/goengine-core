import { Vector4 } from "../../math/Index";
import BaseNode from "../Base";

/**
 * 基础ctx节点
 */
export default abstract class BaseCTXNode<
    S extends IStyle = IStyle,
> extends BaseNode {
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

    public add(...nodes: BaseCTXNode[]): this {
        return super.add(...nodes);
    }

    public remove(node: BaseNode, destory?: boolean): this {
        return super.remove(node, destory);
    }
}

interface IStyle {}

export { IStyle as BaseCTXNodeStyle };
