/**
 * 标记工具类
 */
export abstract class FlagUtils {
    /**
     * 布尔值转标记(1|-1)
     * @param bool 布尔值
     * @param invert 是否反转
     * @returns
     */
    public static polarity(bool?: boolean, invert?: boolean): number {
        return (~~(invert ? !bool : !!bool) << 1) - 1;
    }
}
