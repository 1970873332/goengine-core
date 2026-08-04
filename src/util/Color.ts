import { MathUtils } from "./Math";

/**
 * 颜色工具类
 */
export abstract class ColorUtils {
    /**
     * 获取随机颜色
     * @returns
     */
    public static rn(): number {
        return Math.floor(Math.random() * 0xffffff);
    }
    /**
     * 16进制转rgba
     * @param hex
     * @param alpha 255
     * @returns
     */
    public static hexToRGBA(
        hex?: number,
        alpha: number = 255,
    ): [number, number, number, number] {
        if (typeof hex !== "number") return [0, 0, 0, 0];

        return [
            (hex >> 16) & 0xff,
            (hex >> 8) & 0xff,
            hex & 0xff,
            MathUtils.clamp(Math.floor(alpha), 0, 255),
        ];
    }
    /**
     * rgba转16进制
     * @param r
     * @param g
     * @param b
     * @param a
     * @returns
     */
    public static hexFromRGBA(
        r?: number,
        g?: number,
        b?: number,
        a?: number,
    ): [number, number] {
        const [red, green, blue, alpha] = [r, g, b, a].map((v) =>
            MathUtils.clamp(Math.floor(v ?? 0), 0, 255),
        );

        return [(red << 16) | (green << 8) | blue, alpha];
    }
    /**
     * rgba转字符串
     * @param a
     * @param b
     * @param c
     * @param d
     * @returns
     */
    public static toString(a: number, b: number, c: number, d: number): string {
        return `rgba(${a}, ${b}, ${c}, ${d})`;
    }
}
