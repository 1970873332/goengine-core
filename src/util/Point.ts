/**
 * 点工具类
 */
export abstract class PointUtils {
    /**
     * 判断点是否在矩形内
     * @param point
     * @param rect
     * @returns
     */
    public static inRect(
        point: VectorObject.Vector2,
        rect: VectorObject.Vector2 & VectorObject.Vector2Size,
    ): boolean {
        const { x: px, y: py } = point,
            { x, y, width, height } = rect;

        return px >= x && px <= x + width && py >= y && py <= y + height;
    }
}
