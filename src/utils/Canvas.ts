import { Vector2, Vector4 } from "../objects/math/Index";
import { DocumentUtils } from "./Document";

/**
 * 画布工具类
 */
export abstract class CanvasUtils {
    /**
     * 同步绘制尺寸
     * @param canvas
     */
    public static syncCanvasSize(canvas: HTMLCanvasElement): void {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
    }
    /**
     * 画布数据转URL
     * @param imageData
     * @returns
     */
    public static imageDataToURL(imageData: ImageData): string {
        const { width, height } = imageData,
            canvas: HTMLCanvasElement = DocumentUtils.textureCanvas({
                width,
                height,
            }),
            context = canvas.getContext("2d");
        context?.putImageData(imageData, 0, 0);
        return canvas.toDataURL();
    }
    /**
     * 线段转顶点
     * @param segments
     * @param closure
     * @returns
     */
    public static segmentsToVertices(
        segments: Vector4[],
        closure?: boolean,
    ): Vector2[] {
        if (!segments.length) return [];
        const vertices: Vector2[] = segments.map((segment) => segment.ahead);
        closure && vertices.push(segments[segments.length - 1].behind);
        return vertices;
    }
    /**
     * 顶点转线段
     * @param vertices
     * @returns
     */
    public static verticesToSegments(
        vertices: Vector2[],
        closure?: boolean,
    ): Vector4[] {
        if (vertices.length < 2) return [];
        const segments: Vector4[] = vertices
            .slice(0, -1)
            .map((vertex: Vector2, index: number) =>
                Vector4.mergeVector2(vertex, vertices[index + 1]),
            );
        closure &&
            segments.push(
                Vector4.mergeVector2(
                    vertices[vertices.length - 1],
                    vertices[0],
                ),
            );
        return segments;
    }
}
