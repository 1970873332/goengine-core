/**
 * 对象工具类
 */
export abstract class ObjectUtils {
    /**
     * 检查是否为普通对象
     * @param obj
     * @returns
     */
    public static isObject(obj: unknown): obj is Record<Iteration, unknown> {
        return (
            typeof obj === "object" &&
            obj !== null &&
            obj.constructor === Object &&
            Object.prototype.toString.call(obj) === "[object Object]"
        );
    }
    /**
     * 检查是否在对象中
     * @param object
     * @param key
     * @returns
     */
    public static in<T extends Record<Iteration, unknown>, K extends keyof T>(
        object: T,
        key: K,
    ): boolean {
        return key in object;
    }
}
