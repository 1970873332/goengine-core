enum ECode {
    /**
     * 中文（简体）
     */
    ZH_CN = "zh_CN",
    /**
     * 英语（美国）
     */
    EN_US = "en_US",
    /**
     * 俄语
     */
    RU_RU = "ru_RU",
}

/**
 * 语言组件
 */
export default class LanguageComponent<T extends IJSON = IJSON> {
    /**
     * @param config 语言配置
     */
    constructor(public config: T) {}

    /**
     * 获取语言
     * @param key
     * @param code
     * @returns
     */
    public g<U extends keyof T>(key: U, code?: ECode): string {
        const keyCode = key as string;
        return (
            (code
                ? this.config[keyCode][code]
                : this.config[keyCode].default) ?? keyCode
        );
    }
}

interface IJSON extends Record<
    any,
    Partial<{ [code in ECode | "default"]: string }>
> {}

export { ECode as LanguageComponentCode };
