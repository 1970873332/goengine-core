/**
 * 多态工具类
 */
export abstract class PolyUtils {
    /**
     * 函数
     * @param target
     * @returns
     */
    public static func<T>(target: Poly.resolveFunc<T>): T {
        return typeof target === "function" ? (target as () => T)() : target;
    }
}
