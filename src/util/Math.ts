/**
 * 数学工具类
 */
export abstract class MathUtils {
    /**
     * 限制
     * @param value
     * @param min
     * @param max
     * @returns
     */
    public static clamp(value: number, min: number, max: number): number {
        return Math.max(Math.min(value, max), min);
    }
    /**
     * 布尔值转标记(1|-1)
     * @param value
     * @param invert
     * @returns
     */
    public static boolToFlag(value?: boolean, invert?: boolean): number {
        return (~~(invert ? !value : !!value) << 1) - 1;
    }
    /**
     * 随机数
     * @param min
     * @param max
     * @returns
     */
    public static rn(max: number, min: number = 0): number {
        return Math.round(Math.random() * (max - min) + min);
    }
}
