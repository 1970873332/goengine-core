/**
 * JSON工具类
 */
export abstract class JSONUtils {
    /**
     * 是否可解析为JSON
     * @param value
     * @returns
     */
    public static canParse(value: string): boolean {
        try {
            JSON.parse(value);
            return true;
        } catch {
            return false;
        }
    }
}
