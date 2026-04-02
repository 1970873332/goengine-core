import { Vector2, Vector3, Vector4 } from "../objects/math/Index";
import { MathUtils } from "./Math";
/**
 * 字符工具类
 */
export abstract class CharUtils {
    /**
     * 获取随机颜色
     * @returns
     */
    public static get rnColor(): number {
        return Math.floor(Math.random() * 0xffffff);
    }
    /**
     * 获取函数名
     * @param fun
     * @returns
     */
    public static getFunName(fun: Function): string {
        return fun.name.replace("bound ", "");
    }
    /**
     * 16进制转rgba
     * @param hex
     * @param alpha
     * @returns
     */
    public static hexToRGBA(hex?: number, alpha: number = 255): Vector4 {
        if (typeof hex !== "number") return new Vector4();
        return new Vector3(
            (hex >> 16) & 0xff,
            (hex >> 8) & 0xff,
            hex & 0xff,
        ).toVector4(MathUtils.clamp(Math.floor(alpha), 0, 255));
    }
    /**
     * rgba转16进制
     * @param r
     * @param g
     * @param b
     * @param a
     */
    public static hexFromRGBA(
        r?: number,
        g?: number,
        b?: number,
        a?: number,
    ): Vector2 {
        const v: Vector4 = new Vector4(r, g, b, a).map((v) =>
            MathUtils.clamp(Math.floor(v), 0, 255),
        );
        return new Vector2((v.r << 16) | (v.g << 8) | v.b, v.a);
    }
    /**
     * 可以解析为json字符串
     * @param value
     * @returns
     */
    public static canParseJSON(value: string): boolean {
        try {
            JSON.parse(value);
            return true;
        } catch {
            return false;
        }
    }
    /**
     * 归一化样式名称
     * @param name
     * @returns
     */
    public static normalStyledName(name: string): string {
        return `&.${name.replace(/(base--)|(Mui-)/g, "")}`;
    }
    /**
     * 字符串转布尔值
     * @param value
     */
    public static transStringToBoolean(
        value: string,
        custom?: string[],
    ): boolean {
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
}
