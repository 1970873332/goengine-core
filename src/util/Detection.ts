import { Vector2, Vector4 } from "../object/math/Index";

/**
 * 检测工具类
 */
export default abstract class DetectionUtils {
    /**
     * 计算RGBA
     * @param x
     * @param y
     * @param w
     * @param h
     * @param ctx
     * @returns
     */
    public static sumRGBA(
        ctx: CanvasRenderingContext2D,
        options: Vector4,
    ): number {
        const { x, y, width, height } = options,
            imageData: ImageData = ctx.getImageData(x, y, width, height),
            sum: number = Array.from(imageData.data).reduce((a, b) => a + b, 0);
        return sum;
    }
    /**
     * 单向探测
     * @param ctx
     * @param options
     * @returns
     */
    public static boxSelection(
        ctx: CanvasRenderingContext2D,
        options: Vector4 & IDirection,
    ): Vector4 {
        const { direction } = options,
            box: Vector4 = options.clone(),
            sum: number = DetectionUtils.sumRGBA(ctx, box),
            offsetNumber: number = 0.1;
        if (sum > 0) {
            switch (direction) {
                case "left":
                    box.x -= offsetNumber;
                    break;
                case "right":
                    box.x += offsetNumber;
                    break;
                case "top":
                    box.y -= offsetNumber;
                    break;
                case "bottom":
                    box.y += offsetNumber;
                    break;
            }
            return DetectionUtils.boxSelection(
                ctx,
                Object.assign(box, { direction }),
            );
        }
        return new Vector4(box.x, box.y, box.width, box.height);
    }
    /**
     * 四向探测
     * @param ctx
     * @param options
     * @returns
     */
    public static getFourDirections(
        ctx: CanvasRenderingContext2D,
        options: Vector2,
    ): Vector4 {
        // 四向探测
        const left: Vector4 = DetectionUtils.boxSelection(
            ctx,
            Object.assign(new Vector4(options.x, options.y, 1, 1), {
                direction: "left",
            } satisfies IDirection),
        ),
            right: Vector4 = DetectionUtils.boxSelection(
                ctx,
                Object.assign(new Vector4(options.x, options.y, 1, 1), {
                    direction: "right",
                } satisfies IDirection),
            ),
            top: Vector4 = DetectionUtils.boxSelection(
                ctx,
                Object.assign(new Vector4(options.x, options.y, 1, 1), {
                    direction: "top",
                } satisfies IDirection),
            ),
            bottom: Vector4 = DetectionUtils.boxSelection(
                ctx,
                Object.assign(new Vector4(options.x, options.y, 1, 1), {
                    direction: "bottom",
                } satisfies IDirection),
            ),
            // 合并
            boxs: Vector4[] = [left, right, top, bottom],
            // 提取及数
            minX: number = Math.min(...boxs.map((box: Vector4) => box.x)),
            maxX: number = Math.max(...boxs.map((box: Vector4) => box.x)),
            minY: number = Math.min(...boxs.map((box: Vector4) => box.y)),
            maxY: number = Math.max(...boxs.map((box: Vector4) => box.y)),
            // 四向延申
            leftExtension: Vector4 = DetectionUtils.boxSelection(
                ctx,
                Object.assign(new Vector4(minX, minY, 1, maxY - minY), {
                    direction: "left",
                } satisfies IDirection),
            ),
            rightExtension: Vector4 = DetectionUtils.boxSelection(
                ctx,
                Object.assign(new Vector4(maxX, minY, 1, maxY - minY), {
                    direction: "right",
                } satisfies IDirection),
            ),
            topExtension: Vector4 = DetectionUtils.boxSelection(
                ctx,
                Object.assign(new Vector4(minX, minY, maxX - minX, 1), {
                    direction: "top",
                } satisfies IDirection),
            ),
            bottomExtension: Vector4 = DetectionUtils.boxSelection(
                ctx,
                Object.assign(new Vector4(minX, maxY, maxX - minX, 1), {
                    direction: "bottom",
                } satisfies IDirection),
            ),
            // 合并
            boxExtensions: Vector4[] = [
                leftExtension,
                rightExtension,
                topExtension,
                bottomExtension,
            ],
            // 提取及数
            minXExtension: number = Math.min(
                ...boxExtensions.map((box: Vector4) => box.x),
            ),
            maxXExtension: number = Math.max(
                ...boxExtensions.map((box: Vector4) => box.x),
            ),
            minYExtension: number = Math.min(
                ...boxExtensions.map((box: Vector4) => box.y),
            ),
            maxYExtension: number = Math.max(
                ...boxExtensions.map((box: Vector4) => box.y),
            );
        return new Vector4(
            minXExtension,
            minYExtension,
            maxXExtension - minXExtension,
            maxYExtension - minYExtension,
        );
    }
}

type TDirection = "left" | "right" | "top" | "bottom";

interface IDirection {
    direction: TDirection;
}
