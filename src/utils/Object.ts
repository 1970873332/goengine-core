/**
 * 对象工具
 */
export abstract class ObjectUtils {
    /**
     * 检查是否为普通对象
     * @param obj
     * @returns
     */
    public static isObject(obj: unknown): obj is Record<any, any> {
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
        obj?: Record<any, any>,
    ): Record<any, string> {
        if (!obj) return {};
        return Object.fromEntries(
            Object.entries(obj).map(([key, value]) => [key, String(value)]),
        );
    }
}
