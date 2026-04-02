import { Vector2, Vector4 } from "../../../math/Index";
import BaseCTXNode, { BaseCTXNodeStyle } from "../Base";
/**
 * 矩形
 */
export default class Rect extends BaseCTXNode<IStyle> {
    /**
     * 尺寸
     */
    public size: Vector2 = new Vector2();

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
