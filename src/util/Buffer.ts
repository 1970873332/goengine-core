/**
 * 文本编码
 */
export const TEXT_ENCODER: TextEncoder = new TextEncoder();
/**
 * Buffer工具类
 */
export abstract class BufferUtils {
    /**
     * 转换为Buffer
     * @param data
     * @returns
     */
    public static toBuffer(
        data?: string | Record<Iteration, unknown>,
    ): ArrayBuffer {
        if (!data) return new ArrayBuffer(0);
        const text: string =
            typeof data === "object" ? JSON.stringify(data) : String(data);
        return TEXT_ENCODER.encode(text).buffer;
    }
}
