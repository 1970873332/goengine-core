/**
 * 检测工具类
 */
export abstract class DetectionUtils {
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
        ctx: Canvas.Context2D,
        options: VectorAttr.Vector4,
    ): number {
        const { x = 0, y = 0, width = 0, height = 0 } = options,
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
        ctx: Canvas.Context2D,
        options: VectorAttr.Vector4 & IDirection,
    ): VectorAttr.Vector4 {
        const { direction } = options,
            box = {
                x: options.x ?? 0,
                y: options.y ?? 0,
                width: options.width ?? 0,
                height: options.height ?? 0,
            },
            sum: number = DetectionUtils.sumRGBA(ctx, options),
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
        return box;
    }
    /**
     * 四向探测
     * @param ctx
     * @param options
     * @returns
     */
    public static getFourDirections(
        ctx: Canvas.Context2D,
        options: VectorAttr.Vector2,
    ): VectorAttr.Vector4 {
        // 四向探测
        const left: VectorAttr.Vector4 = DetectionUtils.boxSelection(
                ctx,
                Object.assign(
                    { x: options.x, y: options.y, width: 1, height: 1 },
                    {
                        direction: "left",
                    } satisfies IDirection,
                ),
            ),
            right: VectorAttr.Vector4 = DetectionUtils.boxSelection(
                ctx,
                Object.assign(
                    { x: options.x, y: options.y, width: 1, height: 1 },
                    {
                        direction: "right",
                    } satisfies IDirection,
                ),
            ),
            top: VectorAttr.Vector4 = DetectionUtils.boxSelection(
                ctx,
                Object.assign(
                    { x: options.x, y: options.y, width: 1, height: 1 },
                    {
                        direction: "top",
                    } satisfies IDirection,
                ),
            ),
            bottom: VectorAttr.Vector4 = DetectionUtils.boxSelection(
                ctx,
                Object.assign(
                    { x: options.x, y: options.y, width: 1, height: 1 },
                    {
                        direction: "bottom",
                    } satisfies IDirection,
                ),
            ),
            // 合并
            boxs: VectorAttr.Vector4[] = [left, right, top, bottom],
            // 提取及数
            minX: number = Math.min(
                ...boxs.map((box: VectorAttr.Vector4) => box.x ?? 0),
            ),
            maxX: number = Math.max(
                ...boxs.map((box: VectorAttr.Vector4) => box.x ?? 0),
            ),
            minY: number = Math.min(
                ...boxs.map((box: VectorAttr.Vector4) => box.y ?? 0),
            ),
            maxY: number = Math.max(
                ...boxs.map((box: VectorAttr.Vector4) => box.y ?? 0),
            ),
            // 四向延申
            leftExtension: VectorAttr.Vector4 = DetectionUtils.boxSelection(
                ctx,
                Object.assign(
                    { x: minX, y: minY, width: 1, height: maxY - minY },
                    {
                        direction: "left",
                    } satisfies IDirection,
                ),
            ),
            rightExtension: VectorAttr.Vector4 = DetectionUtils.boxSelection(
                ctx,
                Object.assign(
                    { x: maxX, y: minY, width: 1, height: maxY - minY },
                    {
                        direction: "right",
                    } satisfies IDirection,
                ),
            ),
            topExtension: VectorAttr.Vector4 = DetectionUtils.boxSelection(
                ctx,
                Object.assign(
                    { x: minX, y: minY, width: maxX - minX, height: 1 },
                    {
                        direction: "top",
                    } satisfies IDirection,
                ),
            ),
            bottomExtension: VectorAttr.Vector4 = DetectionUtils.boxSelection(
                ctx,
                Object.assign(
                    { x: minX, y: maxY, width: maxX - minX, height: 1 },
                    {
                        direction: "bottom",
                    } satisfies IDirection,
                ),
            ),
            // 合并
            boxExtensions: VectorAttr.Vector4[] = [
                leftExtension,
                rightExtension,
                topExtension,
                bottomExtension,
            ],
            // 提取及数
            minXExtension: number = Math.min(
                ...boxExtensions.map((box: VectorAttr.Vector4) => box.x ?? 0),
            ),
            maxXExtension: number = Math.max(
                ...boxExtensions.map((box: VectorAttr.Vector4) => box.x ?? 0),
            ),
            minYExtension: number = Math.min(
                ...boxExtensions.map((box: VectorAttr.Vector4) => box.y ?? 0),
            ),
            maxYExtension: number = Math.max(
                ...boxExtensions.map((box: VectorAttr.Vector4) => box.y ?? 0),
            );

        return {
            x: minXExtension,
            y: minYExtension,
            width: maxXExtension - minXExtension,
            height: maxYExtension - minYExtension,
        };
    }
}

type TDirection = "left" | "right" | "top" | "bottom";

interface IDirection {
    /**
     * 探测方向
     */
    direction: TDirection;
}
