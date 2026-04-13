import { Vector2, Vector4 } from "@core/object/math/Index";
import BaseCTXNode, { BaseCTXNodeConfig, BaseCTXNodeEvent, BaseCTXNodeStyle } from "../Base";
/**
 * 矩形
 */
export default class Rect<C extends IConfig, E extends IEvent> extends BaseCTXNode<IStyle, C, E> {
    /**
     * 是否是矩形
     */
    public readonly isRect: boolean = true;

    /**
     * 尺寸
     */
    public size = new Vector2();

    public get boundingBox(): Vector4[] {
        const { width, height } = this.size,
            position: Vector2 = this.worldPosition.toVector2();
        return [
            Vector4.fromArray([
                position.x,
                position.y,
                position.x + width,
                position.y,
            ]),
            Vector4.fromArray([
                position.x + width,
                position.y,
                position.x + width,
                position.y + height,
            ]),
            Vector4.fromArray([
                position.x,
                position.y + height,
                position.x + width,
                position.y + height,
            ]),
            Vector4.fromArray([
                position.x,
                position.y,
                position.x,
                position.y + height,
            ]),
        ];
    }
}

interface IStyle extends BaseCTXNodeStyle {
    /**
     * 填充颜色
     */
    fillStyle?: string | CanvasGradient | CanvasPattern;
    /**
     * 填充颜色
     */
    strokeStyle?: string | CanvasGradient | CanvasPattern;
    /**
     * 线宽
     */
    lineWidth?: number;
}

interface IConfig extends BaseCTXNodeConfig { }

interface IEvent extends BaseCTXNodeEvent { }

export { IConfig as RectConfig, IEvent as RectEvent, IStyle as RectStyle };

