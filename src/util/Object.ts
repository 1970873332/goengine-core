/**
 * 对象工具类
 */
export abstract class ObjectUtils {
    /**
     * 检查是否为普通对象
     * @param obj
     * @returns
     */
    public static isObject(obj: unknown): obj is Record<string, unknown> {
        return (
            typeof obj === "object" &&
            obj !== null &&
            obj.constructor === Object &&
            Object.prototype.toString.call(obj) === "[object Object]"
        );
    }
    /**
     * 转换为字符串值
     */
    public static transStringValue(
        obj?: Record<string, unknown>,
    ): Record<any, string> {
        if (!obj) return {};
        return Object.fromEntries(
            Object.entries(obj).map(([key, value]) => [key, String(value)]),
        );
    }
    /**
     * 检查是否在对象中
     * @param object 
     * @param key 
     * @returns 
     */
    public static in<T extends {}, K extends keyof T>(object: T, key: K): boolean {
        return key in object;
    }
}
