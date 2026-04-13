import { Vector2, Vector4 } from "@core/object/math/Index";
import BaseCTXNode, { BaseCTXNodeConfig, BaseCTXNodeEvent, BaseCTXNodeStyle } from "../Base";

/**
 * 圆弧
 */
export default class Arc<C extends IConfig, E extends IEvent> extends BaseCTXNode<IStyle, C, E> {
    /**
     * 是否是圆弧
     */
    public readonly isArc: boolean = true;

    /**
     * 半径
     */
    public radius: number = 0;
    /**
     * 角度
     */
    public angle = new Vector2(0, Math.PI * 2);

    public get boundingBox(): Vector4[] {
        const position: Vector2 = this.worldPosition.toVector2();
        return [
            Vector4.fromArray([
                position.x - this.radius,
                position.y - this.radius,
                position.x + this.radius,
                position.y + this.radius,
            ]),
            Vector4.fromArray([
                position.x + this.radius,
                position.y - this.radius,
                position.x + this.radius,
                position.y + this.radius,
            ]),
            Vector4.fromArray([
                position.x - this.radius,
                position.y + this.radius,
                position.x + this.radius,
                position.y + this.radius,
            ]),
            Vector4.fromArray([
                position.x - this.radius,
                position.y - this.radius,
                position.x - this.radius,
                position.y + this.radius,
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
     * 描边颜色
     */
    strokeStyle?: string | CanvasGradient | CanvasPattern;
    /**
     * 线宽
     */
    lineWidth?: number;
    /**
     * 起始角度
     */
    startAngle?: number;
    /**
     * 结束角度
     */
    endAngle?: number;
    /**
     * 顺时针
     */
    clockwise?: boolean;
}

interface IConfig extends BaseCTXNodeConfig { }

interface IEvent extends BaseCTXNodeEvent { }

export { IConfig as ArcConfig, IEvent as ArcEvent, IStyle as ArcStyle };

