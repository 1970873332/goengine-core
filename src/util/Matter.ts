import { Bodies, Body, Svg, Vector } from "matter-js";
/**
 * Matter2D物理引擎工具
 */
export abstract class MatterUtils {
    /**
     * 创建SVG形状
     * @returns
     */
    public static async createSvg(url: string): Promise<Body> {
        return fetch(url)
            .then((response) => response.text())
            .then((text: string) => {
                const doc: Document = new DOMParser().parseFromString(
                    text,
                    "image/svg+xml",
                );
                const paths: SVGPathElement[] = Array.prototype.slice.call(
                    doc.querySelectorAll("path"),
                );
                const vertexSets: Vector[][] = paths.map(
                    (path: SVGPathElement) => Svg.pathToVertices(path, 30),
                );
                const terrain = Bodies.fromVertices(
                    -300,
                    500,
                    vertexSets,
                    {
                        isStatic: true,
                        render: { fillStyle: "red", lineWidth: 1 },
                    },
                    true,
                );
                return terrain;
            });
    }

    /**
     * 判断是否为物理引擎body
     * @param object
     * @returns
     */
    public static isMatterBody(object: { type?: string }): boolean {
        return object["type"] === "body";
    }
}
