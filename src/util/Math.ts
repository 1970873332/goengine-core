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
     * 随机数
     * @param max 最大值
     * @param min 最小值 0
     * @returns
     */
    public static rn(max: number, min: number = 0): number {
        return Math.round(Math.random() * (max - min) + min);
    }
    /**
     * 脉动缩放
     * @param timeStamp 时间戳
     * @param max 最大值
     * @param min 最小值 0
     * @param speed 速度 0.001
     * @returns
     */
    public static pulsingScale(
        timeStamp: number,
        max: number,
        min: number = 0,
        speed: number = 0.001,
    ): number {
        return min + ((max - min) * (1 + Math.sin(timeStamp * speed))) / 2;
    }
}
