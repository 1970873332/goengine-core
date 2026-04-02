import { CanvasUtils } from "../../../../utils/Canvas";
import { Vector2, Vector4 } from "../../../math/Index";
import BaseCTXNode, { BaseCTXNodeStyle } from "../Base";

/**
 * 多边形
 */
export default class Polygon<S extends IStyle = IStyle> extends BaseCTXNode<S> {
    /**
     * 路径
     */
    public paths: Vector2[] = [];

    /**
     * 绑定路径
     * @param paths
     */
    public bindPaths(paths: Array<Vector2 | Vector4>): void {
        this.paths = paths
            .map((path) => (path instanceof Vector4 ? path.split : path))
            .flat()
            .reduce((a: Vector2[], b: Vector2) => {
                if (!a[a.length - 1]?.equals(b)) return a.concat(b);
                return a;
            }, []);
    }

    public get boundingBox(): Vector4[] {
        const segments: Vector4[] = CanvasUtils.verticesToSegments(
            this.paths,
        ).map(
            (path) => path.add(this.worldPosition.toVector4()),
            this.style.closePath,
        );
        return segments;
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
    /**
     * 闭合路径
     */
    closePath?: boolean;
}
