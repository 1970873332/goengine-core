import { Vector2, Vector4 } from "../../../math/Index";
import BaseCTXNode, { BaseCTXNodeStyle } from "../Base";

/**
 * 圆弧
 */
export default class Arc extends BaseCTXNode<IStyle> {
    /**
     * 半径
     */
    public radius: number = 0;
    /**
     * 角度
     */
    public angle: Vector2 = new Vector2(0, Math.PI * 2);

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
