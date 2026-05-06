import { CharUtils } from "./Char";

/**
 * Buffer工具
 */
export abstract class BufferUtils {
    /**
     * 文本编码
     */
    private static readonly textEncoder: TextEncoder = new TextEncoder();

    /**
     * 转换为Buffer
     * @param data
     * @returns
     */
    public static toBuffer(data?: string | Record<string, unknown>): ArrayBuffer {
        if (!data) return new ArrayBuffer(0);
        const text: string =
            typeof data === "object" ? JSON.stringify(data) : String(data);
        return this.textEncoder.encode(text).buffer;
    }
    /**
     * 转换为JSON字符串
     * @param data
     * @returns
     */
    public static async toJSON(
        data: ArrayBuffer | Blob,
    ): Promise<string | Record<string, unknown>> {
        const blob: Blob = data instanceof Blob ? data : new Blob([data]);
        const text: string = await blob.text();
        return CharUtils.canParseJSON(text) ? JSON.parse(text) : text;
    }
}
