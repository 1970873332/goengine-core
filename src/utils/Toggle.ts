/**
 * 切换工具
 */
export abstract class ToggleUtils {
    /**
     * 懒加载
     * @param target
     * @returns
     */
    public static lazy<T>(target: Poly.resolveFunc<T>): T {
        return typeof target === "function" ? (target as () => T)() : target;
    }
}
