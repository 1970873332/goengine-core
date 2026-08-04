/**
 * 网格工具类
 */
export abstract class GridUtils {
    /**
     * 构建正方形网格
     * @param count 网格数量
     * @param size 网格大小
     * @param callback 回调
     * @returns
     */
    public static buildSqrt<T>(
        count: number,
        size: VectorObject.Vector2Size,
        callback: (index: number, position: VectorObject.Vector2) => T,
    ): VectorObject.Vector2Size {
        const { width, height } = size,
            col: number = Math.floor(Math.sqrt(count));

        for (let i = 0; i < count; i++) {
            const x: number = (i % col) * width,
                y: number = Math.floor(i / col) * height;

            callback(i, { x, y });
        }

        return { width: col * width, height: Math.ceil(count / col) * height };
    }
}
