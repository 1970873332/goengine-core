import { md5 } from "js-md5";
import { EventTarget } from "../supplements/Event";

/**
 * 状态组件
 */
export default class IdentityComponent<
    E extends Record<any, any> = Record<any, any>,
> extends EventTarget<E> {
    constructor(char?: string, unverifiedID?: string) {
        super();
        typeof char === "string" && (this.char = char);
        this.updateID(unverifiedID);
    }

    /**
     * id
     */
    declare public id: string;
    /**
     * 原始字符
     */
    public char: string = this.constructor.name;
    /**
     * 是否过期
     */
    public expire: boolean = false;

    /**
     * 哈希计算
     * @param str
     */
    protected hash(): void {
        this.id = md5(this.char);
        this.expire = false;
    }
    /**
     * 更新id
     * @param id
     * @returns
     */
    public updateID(id?: string): this {
        if (typeof id === "string") {
            this.id = id;
            this.expire = true;
        } else this.hash();
        return this;
    }
    /**
     * 更新字符
     * @param v
     * @returns
     */
    public updateChar(char: string): this {
        this.char = char;
        this.hash();
        return this;
    }
    /**
     * 信任
     */
    public trust(): this {
        this.expire = false;
        return this;
    }
}
