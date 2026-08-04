/**
 * 字符串工具类
 */
export abstract class StringUtils {
    /**
     * 获取函数名
     * @param fun
     * @returns
     */
    public static obtainFunName(fun: Function): string {
        return fun.name.replace("bound ", "");
    }
    /**
     * 转换为布尔值
     * @param value
     * @param custom
     * @returns
     */
    public static toBoolean(value: string, custom?: string[]): boolean {
        switch (value.toLowerCase()) {
            case "1":
            case "true":
            case "yes":
            case "on":
            case "enabled":
            case custom?.[0]:
                return true;
            case "0":
            case "false":
            case "no":
            case "off":
            case "disabled":
            case custom?.[1]:
                return false;
            default:
                return Boolean(value);
        }
    }
    /**
     * 生成uuid
     * @returns
     */
    public static generateUUID(): string {
        return crypto.randomUUID
            ? crypto.randomUUID()
            : "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
                  const r = (Math.random() * 16) | 0;
                  const v = c === "x" ? r : (r & 0x3) | 0x8;
                  return v.toString(16);
              });
    }
}
