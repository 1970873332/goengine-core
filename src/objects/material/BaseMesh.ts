import { Texture } from "three";
import BaseMaterial, { BaseMaterialSaveJSON, MaterialConfig } from "./Base";

/**
 * 基础网格材质
 */
export default class BaseMeshMaterial extends BaseMaterial<IConfig> {
    constructor(config?: IConfig) {
        super();
        config && this.setConfig(config);
    }

    /**
     * 纹理贴图
     */
    public texture?: Texture;
    /**
     * 纹理透明度
     */
    public textureAlpha: number = 1;

    public toJSON(): ISaveJSON {
        return {
            ...super.toJSON(),
            textureAlpha: this.textureAlpha,
        };
    }
}

interface IConfig
    extends
        MaterialConfig,
        Partial<Pick<BaseMeshMaterial, "texture" | "textureAlpha">> {}

interface ISaveJSON
    extends BaseMaterialSaveJSON, Pick<BaseMeshMaterial, "textureAlpha"> {}

export {
    IConfig as BaseMeshMaterialConfig,
    ISaveJSON as BaseMeshMaterialSaveJSON,
};
